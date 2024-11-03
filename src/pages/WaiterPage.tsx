import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { AccountCircle, TableBar, TableChart } from "@mui/icons-material";
import { useState } from "react";
import TableSection from "../sections/waiter/table/TableSection";
import OrderSection from "../sections/waiter/order/OrderSection";
import { useAuthStore } from "../store/authStore";

export default function WaiterPage() {
  const [value, setValue] = useState(0);

  const logout = useAuthStore((state) => state.logout);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            sx={{ mt: "35px" }}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Cambiar contraseña</MenuItem>
            <MenuItem onClick={logout}>Salir</MenuItem>
          </Menu>
        </div>
      </AppBar>
      <div style={{ padding: "1rem" }}>
        {value === 0 && <TableSection />}
        {value === 1 && <OrderSection />}
      </div>
      <div style={{ height: "56px" }}></div>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "56px" }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Mesas" icon={<TableBar />} />
          <BottomNavigationAction label="Órdenes" icon={<TableChart />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}
