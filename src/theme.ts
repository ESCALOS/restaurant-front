import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#1D1A19", // Fondo principal
    },
    primary: {
      main: "#D2C087", // Color para el botón y texto secundario
    },
    text: {
      primary: "#FFFFFF", // Texto blanco
      secondary: "#D2C087", // Color del nombre del local
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#CECDCC", // Fondo de los inputs
          borderRadius: 4,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#2B2725", // Color de texto en los inputs
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#2B2725", // Color para el label
          "&.Mui-focused": {
            color: "#2B2725", // Mantener el label al enfocar
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#1D1A19",
          textTransform: "none",
        },
      },
    },
    // Añadir estilos para el Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#2B2725",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#D2C087",
            color: "#1D1A19",
          },
        },
      },
    },
  },
});

export default theme;
