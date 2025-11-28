import { useCallback, useEffect, useState } from "react";
import type { ExtendedFile } from "@/fileManager/models/ExtendedFile";
import { useFileManagerStore } from "@/fileManager/store/fileManagerStore";

export interface UploadProgressCardState {
  uploadProgress: number;
  statusColor: "success" | "error" | "info" | "inherit";
  showSuccessCheckmark: boolean;
  isVisible: boolean;
  displayName: string;
  statusMessage: string;
  onRemoveClick: () => void;
  onRetryClick: () => void;
}

export function useUploadProgressCard(
  extendedFile: ExtendedFile
): UploadProgressCardState {
  const [showSuccessCheckmark, setShowSuccessCheckmark] = useState(false);

  const removeFile = useFileManagerStore((state) => state.removeFile);
  const updateUploadStatus = useFileManagerStore(
    (state) => state.updateUploadStatus
  );

  // Subscribe to uploadProgress from zustand store
  const uploadProgress = useFileManagerStore((state) => {
    const fileInStore = state.files.find((f) => f.id === extendedFile.id);
    return fileInStore?.uploadProgress ?? 0;
  });

  // Auto-hide success checkmark after 3 seconds
  useEffect(() => {
    if (extendedFile.uploadStatus === "success") {
      // Schedule state update asynchronously to avoid cascading renders
      queueMicrotask(() => {
        setShowSuccessCheckmark(true);
      });

      // Auto-hide after 3 seconds
      const hideTimer = setTimeout(() => {
        setShowSuccessCheckmark(false);
      }, 3000);

      return () => {
        clearTimeout(hideTimer);
      };
    } else {
      // Reset checkmark when status changes away from success
      // Schedule asynchronously to avoid cascading renders
      queueMicrotask(() => {
        setShowSuccessCheckmark(false);
      });
    }
  }, [extendedFile.uploadStatus]);

  // Determine UI visibility based on upload status
  const isVisible = useCallback(() => {
    // Hide "idle" state files unless they're retrying from error
    // (when status was error but we still want to show it transitioning to pending)
    if (extendedFile.uploadStatus === "idle") {
      return false;
    }
    // Show all other states: pending, success, error
    return true;
  }, [extendedFile.uploadStatus]);

  // Determine status color for progress bar
  const getStatusColor = useCallback(() => {
    switch (extendedFile.uploadStatus) {
      case "error":
        return "error" as const;
      case "pending":
        return "info" as const;
      default:
        return "inherit" as const;
    }
  }, [extendedFile.uploadStatus]);

  // Get contextual status message
  const getStatusMessage = useCallback(() => {
    switch (extendedFile.uploadStatus) {
      case "success":
        return "Upload successful!";
      case "error":
        return "Upload failed. Click retry to upload again.";
      case "pending":
        return `Uploading... `;
      case "idle":
        return "Preparing to upload...";
      default:
        return "";
    }
  }, [extendedFile.uploadStatus]);

  // Handle remove file
  const handleRemoveClick = useCallback(() => {
    removeFile(extendedFile.id);
  }, [extendedFile.id, removeFile]);

  // Handle retry upload - reset status to idle
  const handleRetryClick = useCallback(() => {
    updateUploadStatus(extendedFile.id, "idle");
  }, [extendedFile.id, updateUploadStatus]);

  const truncateFileName = useCallback(
    (name: string, maxLength = 50): string => {
      if (name.length <= maxLength) {
        return name;
      }
      return `${name.slice(0, maxLength)}...`;
    },
    []
  );

  return {
    uploadProgress: uploadProgress ?? 0,
    statusColor: getStatusColor(),
    showSuccessCheckmark,
    isVisible: isVisible(),
    displayName: truncateFileName(extendedFile.file.name, 30),
    statusMessage: getStatusMessage(),
    onRemoveClick: handleRemoveClick,
    onRetryClick: handleRetryClick,
  };
}
