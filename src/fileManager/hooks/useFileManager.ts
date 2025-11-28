import { useCallback, useEffect, useRef, useState } from "react";
import { useFileManagerStore } from "@/fileManager/store/fileManagerStore";
import { useCloudinaryUploadMutation } from "@/fileManager/hooks/mutations/useCloudinaryUploadMutation";
import type { FileRejection } from "react-dropzone";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * useFileManager - Main business logic hook for FileManager component
 * Combines:
 * - File drop handling (from useFileManagerController)
 * - Rejection message management
 * - Auto-retry upload logic (Solution 3)
 */
export function useFileManager() {
  const files = useFileManagerStore((state) => state.files);
  const appendFiles = useFileManagerStore((state) => state.appendFiles);

  const uploadMutation = useCloudinaryUploadMutation();
  const lastIdleFilesRef = useRef<Set<string>>(new Set());

  const [rejectionMessages, setRejectionMessages] = useState<string[]>([]);

  /**
   * Handle file drop from dropzone
   */
  const handleFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      appendFiles(acceptedFiles);
    },
    [appendFiles]
  );

  /**
   * Handle rejected files and show error messages
   */
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const messages = fileRejections.flatMap((fr) =>
      fr.errors.map((err) => {
        if (err.code === "file-too-large") {
          return `${fr.file.name} is too large (max ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB)`;
        }
        if (err.code === "file-invalid-type") {
          return `${fr.file.name} has an invalid file type`;
        }
        return `${fr.file.name}: ${err.message}`;
      })
    );

    setRejectionMessages(messages);

    // Auto-clear rejection messages after 5 seconds
    const timeoutId = setTimeout(() => setRejectionMessages([]), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  /**
   * Clear a specific rejection message
   */
  const clearRejectionMessage = useCallback((index: number) => {
    setRejectionMessages((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  /**
   * Auto-retry: Trigger upload when new idle files are added
   * This is the SINGLE POINT where auto-retry logic lives (Solution 3)
   */
  useEffect(() => {
    const idleFiles = files.filter((f) => f.uploadStatus === "idle");
    const currentIdleIds = new Set(idleFiles.map((f) => f.id));

    // Only trigger if NEW idle files appear (avoid infinite loop)
    const hasNewIdleFiles = idleFiles.some(
      (f) => !lastIdleFilesRef.current.has(f.id)
    );

    if (hasNewIdleFiles && idleFiles.length > 0) {
      uploadMutation.mutate(idleFiles);
      lastIdleFilesRef.current = currentIdleIds;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]); // Only depend on files, not uploadMutation (it's stable from useMutation)

  return {
    // State
    files,
    rejectionMessages,
    isUploading: uploadMutation.isPending,
    maxFileSize: MAX_FILE_SIZE,

    // Handlers
    handleFileDrop,
    onDropRejected,
    clearRejectionMessage,
  };
}
