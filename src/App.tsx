import { FileManager } from "@/fileManager/views/FileManager";
import { Container } from "@mui/material";
import { theme } from "@/shared/ui/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ paddingY: 5 }}>
        <FileManager />
      </Container>
    </ThemeProvider>
  );
}
