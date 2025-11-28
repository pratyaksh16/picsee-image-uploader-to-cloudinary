import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";

type FileThumbnailProps = {
    name: string;
    file?: File;
    variant?: "avatar" | "card";
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

const CARD_PREVIEW_HEIGHT = 180;

export function FileThumbnail({ name, file, variant = "avatar" }: FileThumbnailProps) {
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
        if (variant === "card") {
            return (
                <Box
                    component="img"
                    src={preview}
                    alt={name}
                    sx={{
                        width: 1,
                        height: CARD_PREVIEW_HEIGHT,
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            );
        }

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
        const icon = <InsertPhotoRoundedIcon fontSize="large" color="primary" />;

        if (variant === "card") {
            return (
                <Box
                    sx={{
                        width: 1,
                        height: CARD_PREVIEW_HEIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                    }}
                >
                    {icon}
                </Box>
            );
        }

        return icon;
    }

    const fileIcon = <InsertDriveFileRoundedIcon fontSize="large" color="primary" />;

    if (variant === "card") {
        return (
            <Box
                sx={{
                    width: 1,
                    height: CARD_PREVIEW_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                }}
            >
                {fileIcon}
            </Box>
        );
    }

    return fileIcon;
}
