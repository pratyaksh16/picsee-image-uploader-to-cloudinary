import { FileManager } from "@/fileManager/views/FileManager";
import { Container } from "@mui/material";
import { theme } from "@/shared/ui/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ paddingY: 5 }}>
        <ErrorBoundary>
          <FileManager />
        </ErrorBoundary>
      </Container>
    </ThemeProvider>
  );
}
