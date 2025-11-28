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
import { Box, LinearProgress, alpha } from "@mui/material";

export function UploadProgressCard(extendedFile: ExtendedFile) {
    const {
        uploadProgress,
        statusColor,
        showSuccessCheckmark,
        isVisible,
        statusMessage,
        onRemoveClick,
        onRetryClick,
        displayName,
    } = useUploadProgressCard(extendedFile);

    // Don't render if not visible (e.g., idle state)
    if (!isVisible) {
        return <></>;
    }

    return (
        <Card
            sx={(theme) => ({
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
                borderRadius: `${theme.shape.borderRadius}px`,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                textAlign: "left"
            })}
            component="div"
            onClick={(e) => e.stopPropagation()}
        >
            <CardHeader
                sx={{ display: "flex", alignItems: "center" }}
                action={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 1 }}>
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
                title={
                    <Typography variant="body2">
                        {displayName}
                    </Typography>
                }
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
            // disableTypography
            />
        </Card>
    );
}
