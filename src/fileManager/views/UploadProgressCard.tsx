import { FileThumbnail } from "./FileThumbnail";
import { ProgressIndicatorIcon } from "./ProgressIndicatorIcon";
import type { ExtendedFile } from "@/fileManager/models/types/ExtendedFile";
import { convertByteToMegabyte } from "@/shared/utils/convertByteToMegabyte";
import { useUploadProgressCard } from "@/fileManager/hooks/useUploadProgressCard";
import { Card, Typography } from "@mui/material";
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
                textAlign: "left",
                overflow: "hidden",
                position: "relative",
                boxShadow: "none",
                minWidth: 0,
            })}
            component="div"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Image / preview area */}
            <Box
                sx={(theme) => ({
                    position: "relative",
                    borderRadius: `${theme.shape.borderRadius}px`,
                    overflow: "hidden",
                })}
            >
                <FileThumbnail
                    name={extendedFile.file.name}
                    file={extendedFile.file}
                    variant="card"
                />

                {/* Overlay while uploading / error */}
                {extendedFile.uploadStatus !== "success" && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.35)",
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Status / action icon pinned to top-right of the card */}
                <Box
                    sx={(theme) => ({
                        position: "absolute",
                        top: theme.spacing(1),
                        right: theme.spacing(1),
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: theme.spacing(0.5),
                        borderRadius: 999,
                        backgroundColor: alpha(theme.palette.common.black, 0.6),
                        backdropFilter: "blur(8px)",
                    })}
                >
                    <ProgressIndicatorIcon
                        uploadStatus={extendedFile.uploadStatus}
                        uploadProgress={uploadProgress}
                        showSuccessCheckmark={showSuccessCheckmark}
                        onRemoveClick={onRemoveClick}
                        onRetryClick={onRetryClick}
                    />
                </Box>
            </Box>

            {/* Metadata + status */}
            <Box
                sx={(theme) => ({
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    backgroundColor: alpha(theme.palette.background.paper, 0.02),
                })}
            >
                <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                    title={displayName}
                >
                    {displayName}
                </Typography>

                <Typography variant="caption" sx={{ marginBottom: 0.5 }}>
                    {convertByteToMegabyte(extendedFile.file.size)}
                </Typography>

                {/* statusMessage on its own line */}
                <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block" }}
                >
                    {statusMessage}
                </Typography>

                {(extendedFile.uploadStatus === "pending" || extendedFile.uploadStatus === "error") && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
        </Card>
    );
}
