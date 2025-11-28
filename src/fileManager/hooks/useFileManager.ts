import { useCallback, useEffect, useRef, useState } from "react";
import type { ClipboardEvent as ReactClipboardEvent } from "react";
import { useFileManagerStore } from "@/fileManager/store/fileManagerStore";
import { useCloudinaryUploadMutation } from "@/fileManager/hooks/mutations/useCloudinaryUploadMutation";
import { useDropzone } from "react-dropzone";
import type { Accept, FileRejection } from "react-dropzone";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
const ACCEPTED_IMAGE_TYPE_SET = new Set<string>(ACCEPTED_IMAGE_TYPES);
const DROPZONE_ACCEPT: Accept = {
  "image/jpeg": [],
  "image/jpg": [],
  "image/png": [],
  "image/gif": [],
  "image/webp": [],
};
type ClipboardEventLike = ClipboardEvent | ReactClipboardEvent<HTMLElement>;

export function useFileManager() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const files = useFileManagerStore((state) => state.files);
  const appendFiles = useFileManagerStore((state) => state.appendFiles);
  const clearFiles = useFileManagerStore((state) => state.clearFiles);

  const uploadMutation = useCloudinaryUploadMutation();
  const pasteHandlerRef = useRef<((event: ClipboardEventLike) => void) | null>(
    null
  );

  const [rejectionMessages, setRejectionMessages] = useState<string[]>([]);

  // Derived UI state
  const totalFiles = files.length;
  const filesInProgress = files.filter(
    (file) => file.uploadStatus === "idle" || file.uploadStatus === "pending"
  );
  const overallProgress =
    totalFiles === 0
      ? 0
      : files.reduce((sum, file) => {
          if (file.uploadStatus === "success") {
            return sum + 100;
          }
          return sum + (file.uploadProgress ?? 0);
        }, 0) / totalFiles;
  const shouldShowOverallProgress = filesInProgress.length > 0;
  const shouldShowClearAll =
    totalFiles > 0 && files.every((file) => file.uploadStatus === "success");

  // Store actions
  const handleClearAll = useCallback(() => {
    clearFiles();
  }, [clearFiles]);

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

  // Clipboard uploads (paste)
  const handlePaste = useCallback(
    (event: ClipboardEventLike) => {
      const clipboardItems = event.clipboardData?.items;
      if (!clipboardItems || clipboardItems.length === 0) return;

      const acceptedFiles: File[] = [];
      const rejectedFiles: FileRejection[] = [];

      Array.from(clipboardItems).forEach((item) => {
        if (item.kind !== "file") return;
        const file = item.getAsFile();
        if (!file) return;

        if (!ACCEPTED_IMAGE_TYPE_SET.has(file.type)) {
          rejectedFiles.push({
            file,
            errors: [
              {
                code: "file-invalid-type",
                message: "Only JPEG, PNG, GIF or WEBP images are allowed",
              },
            ],
          });
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          rejectedFiles.push({
            file,
            errors: [
              {
                code: "file-too-large",
                message: "Clipboard image exceeds the 5MB limit",
              },
            ],
          });
          return;
        }

        acceptedFiles.push(file);
      });

      if (rejectedFiles.length > 0) {
        onDropRejected(rejectedFiles);
      }

      if (acceptedFiles.length > 0) {
        event.preventDefault();
        handleFileDrop(acceptedFiles);
      }
    },
    [handleFileDrop, onDropRejected]
  );

  // Dropzone configuration
  const dropzone = useDropzone({
    accept: DROPZONE_ACCEPT,
    onDrop: handleFileDrop,
    onDropRejected,
    maxFiles: 500,
    maxSize: MAX_FILE_SIZE,
  });

  useEffect(() => {
    // Keep latest paste handler in a ref so the window listener stays stable
    pasteHandlerRef.current = handlePaste;
  }, [handlePaste]);

  // Automatically upload any files that enter the "idle" state.
  // We only start a new batch when no other upload is currently in progress.
  useEffect(() => {
    const idleFiles = files.filter((f) => f.uploadStatus === "idle");
    if (idleFiles.length === 0) return;
    if (uploadMutation.isPending) return;

    uploadMutation.mutate(idleFiles);
  }, [files, uploadMutation]);

  // Global paste listener (captures paste even when drop area isn't focused)
  useEffect(() => {
    const handleWindowPaste = (event: ClipboardEvent) => {
      if (pasteHandlerRef.current) {
        pasteHandlerRef.current(event);
      }
    };

    window.addEventListener("paste", handleWindowPaste);
    return () => {
      window.removeEventListener("paste", handleWindowPaste);
    };
  }, []);

  return {
    // State
    files,
    rejectionMessages,
    isUploading: uploadMutation.isPending,
    maxFileSize: MAX_FILE_SIZE,
    overallProgress,
    shouldShowOverallProgress,
    shouldShowClearAll,
    isMobile,
    isDarkMode,
    handlePaste,
    dropzone,

    // Handlers
    handleFileDrop,
    onDropRejected,
    clearRejectionMessage,
    handleClearAll,
  };
}
