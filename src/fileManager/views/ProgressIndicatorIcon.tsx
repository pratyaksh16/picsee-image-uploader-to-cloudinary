import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

type UploadStatus = "idle" | "pending" | "error" | "success";

interface ProgressIndicatorIconProps {
    uploadStatus: UploadStatus;
    uploadProgress: number;
    showSuccessCheckmark: boolean;
    onRemoveClick: () => void;
    onRetryClick: () => void;
}

export function ProgressIndicatorIcon({
    uploadStatus,
    uploadProgress,
    showSuccessCheckmark,
    onRemoveClick,
    onRetryClick,
}: ProgressIndicatorIconProps) {
    switch (uploadStatus) {
        case "success":
            return (
                <Box position="relative" display="inline-flex">
                    {showSuccessCheckmark ? (
                        <CheckCircleRoundedIcon
                            sx={{ fontSize: 40, color: "success.main" }}
                        />
                    ) : (
                        <Box position="relative" display="inline-flex">
                            <CircularProgress
                                variant="determinate"
                                color="inherit"
                                value={100}
                                size={40}
                                thickness={4}
                                sx={{ color: "success.main" }}
                            />
                            <Stack
                                sx={{
                                    inset: 0,
                                    position: "absolute",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <IconButton onClick={onRemoveClick} size="small">
                                    <CloseRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                                </IconButton>
                            </Stack>
                        </Box>
                    )}
                </Box>
            );

        case "pending":
            return (
                <Box position="relative" display="inline-flex">
                    <CircularProgress
                        variant="determinate"
                        color="inherit"
                        value={uploadProgress}
                        size={40}
                        thickness={4}
                    />
                    <Stack
                        sx={{
                            inset: 0,
                            position: "absolute",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconButton onClick={onRemoveClick} size="small">
                            <CloseRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                </Box>
            );

        case "error":
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <IconButton onClick={onRetryClick} size="small">
                        <RefreshRoundedIcon sx={{ fontSize: 18, color: "error.main" }} />
                    </IconButton>
                </Stack>
            );

        default:
            return <></>;
    }
}
