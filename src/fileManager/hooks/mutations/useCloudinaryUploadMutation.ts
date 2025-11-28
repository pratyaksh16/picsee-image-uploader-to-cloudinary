import { useFileManagerStore } from "@/fileManager/store/fileManagerStore";
import type { ExtendedFile } from "@/fileManager/models/ExtendedFile";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/shared/services/httpClient";

export function useCloudinaryUploadMutation() {
  const updateUploadProgress = useFileManagerStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileManagerStore(
    (state) => state.updateUploadStatus
  );

  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary cloud name or upload preset not configured"
        );
      }

      const uploadPromises = files.map(async (file) => {
        if (file.uploadStatus === "idle") {
          updateUploadStatus(file.id, "pending");

          const formData = new FormData();
          formData.append("file", file.file);
          formData.append("upload_preset", uploadPreset);
          formData.append("tags", "picsee_tag");

          try {
            await httpClient.post(`/${cloudName}/image/upload`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (event) => {
                if (event.lengthComputable && event.total) {
                  const percentComplete = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  updateUploadProgress(file.id, percentComplete);
                }
              },
            });

            updateUploadStatus(file.id, "success");
          } catch (err) {
            updateUploadStatus(file.id, "error");
            throw err;
          }
        }

        return Promise.resolve();
      });

      await Promise.all(uploadPromises);
    },
    // onSuccess: async () => {
    //   await queryClient.invalidateQueries({ queryKey: ["files"] });
    // },
  });
}
