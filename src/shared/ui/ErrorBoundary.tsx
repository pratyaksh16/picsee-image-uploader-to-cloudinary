import type { ErrorInfo, ReactNode } from "react";
import React from "react";
import { Alert, AlertTitle, Box, Button, Stack, Typography } from "@mui/material";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = {
        hasError: false,
    };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Simple logging so we can see errors in the console during development
        console.error("ErrorBoundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Simple MUI-based default UI
            return (
                <Box sx={{ width: 1, mt: 2 }}>
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{ alignItems: "flex-start" }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => window.location.reload()}
                            >
                                Reload Window
                            </Button>
                        }
                    >
                        <AlertTitle>Something went wrong</AlertTitle>
                        <Stack spacing={0.5}>
                            <Typography variant="body2">
                                An unexpected error occurred while rendering this section.
                            </Typography>
                            <Typography variant="body2">
                                Please reload the page and try again.
                            </Typography>
                        </Stack>
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
}

