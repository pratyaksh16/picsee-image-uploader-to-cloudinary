import { create } from "zustand";
import type { ExtendedFile } from "@/fileManager/models/ExtendedFile";

interface FileManagerState {
  files: ExtendedFile[];

  // Actions (mutations)
  appendFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  updateUploadProgress: (fileId: string, progress: number) => void;
  updateUploadStatus: (
    fileId: string,
    uploadStatus: ExtendedFile["uploadStatus"]
  ) => void;
}

export const useFileManagerStore = create<FileManagerState>((set) => ({
  files: [],

  appendFiles: (acceptedFiles) =>
    set((state) => {
      const notDuplicatedNewFiles: ExtendedFile[] = acceptedFiles
        .filter((file) => {
          const isDuplicate = state.files.some(
            (subItem) => subItem.id === `${file.name}${file.size}`
          );
          return !isDuplicate;
        })
        .map((file) => ({
          file,
          id: `${file.name}${file.size}`,
          uploadStatus: "idle",
          uploadProgress: 0,
        }));

      return {
        files: [...state.files, ...notDuplicatedNewFiles],
      };
    }),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
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
