import { FileThumbnail } from "./FileThumbnail";
import { ProgressIndicatorIcon } from "./ProgressIndicatorIcon";
import type { ExtendedFile } from "@/fileManager/models/ExtendedFile";
import { convertByteToMegabyte } from "@/shared/utils/convertByteToMegabyte";
import { useUploadProgressCard } from "@/fileManager/hooks/useUploadProgressCard";
import {
    Card,
    CardHeader,
    Typography,
} from "@mui/material";

import { Box, LinearProgress } from "@mui/material";

export function UploadProgressCard(extendedFile: ExtendedFile) {
    const {
        uploadProgress,
        statusColor,
        showSuccessCheckmark,
        isVisible,
        statusMessage,
        onRemoveClick,
        onRetryClick,
    } = useUploadProgressCard(extendedFile);

    // Don't render if not visible (e.g., idle state)
    if (!isVisible) {
        return <></>;
    }

    return (
        <Card
            sx={{ textAlign: "left" }}
            component="div"
            onClick={(e) => e.stopPropagation()}
        >
            <CardHeader
                sx={{ alignItems: "center" }}
                action={
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <ProgressIndicatorIcon
                            uploadStatus={extendedFile.uploadStatus}
                            uploadProgress={uploadProgress}
                            showSuccessCheckmark={showSuccessCheckmark}
                            onRemoveClick={onRemoveClick}
                            onRetryClick={onRetryClick}
                        />
                    </Box>
                }
                avatar={
                    <FileThumbnail
                        name={extendedFile.file.name}
                        file={extendedFile.file}
                    />
                }
                title={extendedFile.file.name}
                subheader={
                    <Box>
                        <Typography sx={{ marginBottom: 0.5 }} variant="caption">
                            {convertByteToMegabyte(extendedFile.file.size)}
                        </Typography>

                        {/* statusMessage on its own line */}
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                            {statusMessage}
                        </Typography>

                        {(extendedFile.uploadStatus === "pending" || extendedFile.uploadStatus === "error") && (
                            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                                <Box sx={{ width: "100%", mr: 1 }}>
                                    <LinearProgress
                                        sx={(theme) => ({
                                            height: theme.spacing(1),
                                            borderRadius: theme.shape.borderRadius,
                                            "& .MuiLinearProgress-bar": {
                                                borderRadius: theme.shape.borderRadius,
                                            },
                                        })}
                                        variant="determinate"
                                        color={statusColor}
                                        value={uploadProgress}
                                        aria-label={`Progress: ${uploadProgress ?? 0}%`}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {`${Math.round(uploadProgress ?? 0)}%`}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                }
                disableTypography
            />
        </Card>
    );
}
