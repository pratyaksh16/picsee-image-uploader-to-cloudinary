// Files list UI removed — this project now only supports uploads
import { UploadProgressCard } from "./UploadProgressCard";
import { useFileManager } from "@/fileManager/hooks/useFileManager";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import {
    LinearProgress,
    alpha,
    Box,
    Button,
    ButtonBase,
    colors,
    Stack,
    Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import Alert from "@mui/material/Alert";

export function FileManager() {
    const {
        files,
        rejectionMessages,
        maxFileSize,
        handleFileDrop,
        onDropRejected,
        clearRejectionMessage,
        overallProgress,
        shouldShowOverallProgress,
        shouldShowClearAll,
        handleClearAll,
    } = useFileManager();

    const [autoAnimateRef] = useAutoAnimate();

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/jpg": [],
            "image/png": [],
            "image/gif": [],
            "image/webp": [],
        },
        onDrop: handleFileDrop,
        onDropRejected,
        maxFiles: 15,
        maxSize: maxFileSize,
    });

    return (
        <>
            <ButtonBase
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
                        gap: 2,
                        marginBottom: 3,
                        border: isDragActive ? `2px dashed ${borderColor}` : `2px dashed transparent`,
                        boxShadow: isDragActive
                            ? `0 0 0 6px ${alpha(borderColor, 0.08)}`
                            : undefined,
                        transition: "box-shadow 150ms, background-color 150ms, border 150ms",
                    };
                }}
                disableRipple
                {...getRootProps()}
            >
                <Box component="input" {...getInputProps()} />

                <FileUploadRoundedIcon
                    fontSize="large"
                    sx={{ color: isDragActive ? (isDragReject ? "error.main" : "primary.main") : "inherit" }}
                />

                <Stack sx={{ alignItems: "center", gap: 1 }}>
                    <Typography>
                        {isDragActive
                            ? isDragReject
                                ? "Some files will be rejected — only images under 5MB are allowed"
                                : "Drop files to upload"
                            : "Click to upload or drag and drop"}
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
            </ButtonBase>

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
