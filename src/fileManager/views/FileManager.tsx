// Files list UI removed — this project now only supports uploads
import { UploadProgressCard } from "./UploadProgressCard";
import { useFileManager } from "@/fileManager/hooks/useFileManager";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { LinearProgress, alpha, Box, Button, colors, Stack, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";

export function FileManager() {
    const {
        files,
        rejectionMessages,
        clearRejectionMessage,
        overallProgress,
        shouldShowOverallProgress,
        shouldShowClearAll,
        handleClearAll,
        handlePaste,
        dropzone,
        isMobile,
        isDarkMode,
    } = useFileManager();

    const [autoAnimateRef] = useAutoAnimate();

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = dropzone;

    return (
        <>
            <Box
                sx={(theme) => {
                    const borderColor = isDragAccept
                        ? theme.palette.success.main
                        : isDragReject
                            ? theme.palette.error.main
                            : theme.palette.primary.main;

                    return {
                        backgroundColor: alpha(colors.grey[500], isDragActive ? 0.14 : 0.1),
                        padding: 2,
                        width: 1,
                        borderRadius: `${theme.shape.borderRadius}px`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        marginBottom: 3,
                        border: isDragActive ? `2px dashed ${borderColor}` : `2px dashed transparent`,
                        boxShadow: isDragActive
                            ? `0 0 0 6px ${alpha(borderColor, 0.08)}`
                            : undefined,
                        transition: "box-shadow 150ms, background-color 150ms, border 150ms",
                        cursor: "pointer",
                    };
                }}
                {...getRootProps()}
                onPaste={handlePaste}
            >
                <Box component="input" {...getInputProps()} />

                {isMobile ? (
                    <Button
                        variant="contained"
                        startIcon={<FileUploadRoundedIcon />}
                        sx={(theme) => ({
                            pointerEvents: "none",
                            boxShadow: "none",
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor: isDarkMode
                                ? alpha(theme.palette.common.white, 0.04)
                                : alpha(colors.grey[200], 0.9),
                            color: isDarkMode
                                ? theme.palette.grey[50]
                                : theme.palette.text.primary,
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: isDarkMode
                                    ? alpha(theme.palette.common.white, 0.06)
                                    : alpha(colors.grey[300], 0.9),
                            },
                        })}
                    >
                        Upload from gallery
                    </Button>
                ) : (
                    <FileUploadRoundedIcon
                        fontSize="large"
                        sx={{ color: isDragActive ? (isDragReject ? "error.main" : "primary.main") : "inherit" }}
                    />
                )}

                <Stack sx={{ alignItems: "center", gap: 1 }}>
                    <Typography align="center">
                        {isDragActive
                            ? isDragReject
                                ? "Some files will be rejected — only images under 5MB are allowed"
                                : "Drop files to upload"
                            : "Click to upload, drag and drop, or paste from clipboard"}
                    </Typography>
                    <Typography>Max 5MB.</Typography>
                </Stack>
                {rejectionMessages.length > 0 && (
                    <Stack sx={{ gap: 1, width: 1 }} onClick={(e) => e.stopPropagation()}>
                        {rejectionMessages.map((msg, i) => (
                            <Alert
                                key={i}
                                severity="error"
                                onClose={() => clearRejectionMessage(i)}
                            >
                                {msg}
                            </Alert>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* Overall Progress Bar */}
            <Stack sx={{ gap: 2, width: 1 }} ref={autoAnimateRef}>
                {shouldShowOverallProgress && (
                    <Box
                        sx={(theme) => ({
                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                            borderRadius: `${theme.shape.borderRadius}px`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            p: 2,
                        })}
                    >
                        <Typography variant="subtitle2">Overall progress</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallProgress}
                                    aria-label={`Overall progress: ${Math.round(overallProgress)}%`}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {`${Math.round(overallProgress)}%`}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {shouldShowClearAll && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="outlined" color="primary" onClick={handleClearAll}>
                            Clear All
                        </Button>
                    </Box>
                )}

                {files.map((file) => (
                    <Stack key={file.id}>
                        <UploadProgressCard {...file} />
                    </Stack>
                ))}
            </Stack>
        </>
    );
}
