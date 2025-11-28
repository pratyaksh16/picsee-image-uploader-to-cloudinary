import { create } from "zustand";
import type { ExtendedFile } from "@/fileManager/models/ExtendedFile";

interface FileManagerState {
  files: ExtendedFile[];

  // Actions (mutations)
  appendFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  updateUploadProgress: (fileId: string, progress: number) => void;
  updateUploadStatus: (
    fileId: string,
    uploadStatus: ExtendedFile["uploadStatus"]
  ) => void;
}

const createFileId = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

export const useFileManagerStore = create<FileManagerState>((set) => ({
  files: [],

  appendFiles: (acceptedFiles) =>
    set((state) => {
      // Deduplicate only within the new batch (not against existing files),
      // so users can re-upload the same image again later.
      const seenInBatch = new Set<string>();

      const newFiles: ExtendedFile[] = acceptedFiles
        .filter((file) => {
          const key = `${file.name}-${file.size}-${file.lastModified}`;
          if (seenInBatch.has(key)) return false;
          seenInBatch.add(key);
          return true;
        })
        .map((file) => ({
          file,
          id: createFileId(file),
          uploadStatus: "idle",
          uploadProgress: 0,
        }));

      return {
        // Prepend new files so the most recently added ones appear first
        files: [...newFiles, ...state.files],
      };
    }),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),

  clearFiles: () =>
    set(() => ({
      files: [],
    })),

  updateUploadProgress: (id, uploadProgress) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadProgress } : file
      ),
    })),

  updateUploadStatus: (id, uploadStatus) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadStatus } : file
      ),
    })),
}));
