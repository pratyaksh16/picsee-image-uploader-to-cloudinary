import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";

type FileThumbnailProps = {
    name: string;
    file?: File;
};

function isImageExtension(extension?: string) {
    if (!extension) return false;
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
            return true;
        default:
            return false;
    }
}

export function FileThumbnail({ name, file }: FileThumbnailProps) {
    const extension = name.split(".").pop()?.toLowerCase();
    const isImage = isImageExtension(extension);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (isImage && file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            return () => {
                // cleanup blob URL if needed
            };
        }
    }, [isImage, file]);

    if (isImage && preview) {
        return (
            <Avatar
                src={preview}
                sx={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                }}
            />
        );
    }

    if (isImage) {
        return <InsertPhotoRoundedIcon fontSize="large" color="primary" />;
    }

    return <InsertDriveFileRoundedIcon fontSize="large" color="primary" />;
}
