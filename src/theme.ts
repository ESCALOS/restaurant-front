import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#1D1A19", // Fondo principal
      paper: "#2B2725", // Fondo de los cards
    },
    primary: {
      main: "#D2C087", // Color para el botón y texto secundario
      contrastText: "#FFFFFF", // Color de contraste del texto
    },
    secondary: {
      main: "#6C94B5", // Color secundario (azul suave)
      contrastText: "#FFFFFF", // Color de contraste del texto
    },
    text: {
      primary: "#D2C087", // Texto blanco
      secondary: "#575451", // Color del nombre del local
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#2B2725", // Fondo de las cards
          color: "#FFFFFF", // Texto blanco en las cards
          borderRadius: 8,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingBottom: "16px",
          "&:last-child": {
            paddingBottom: "16px", // Ajuste de padding inferior en la última sección de CardContent
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#D2C087", // Fondo de los botones en las cards
          padding: "8px 16px",
        },
      },
    },
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
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: "#2B2725",
        },
      },
    },
    MuiMenuItem: {
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
