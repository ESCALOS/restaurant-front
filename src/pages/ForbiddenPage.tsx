import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  return (
    <div style={{ textAlign: "center", verticalAlign: "center" }}>
      <h1>403 - Acceso Prohibido</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <Link to="/login">
        <Button variant="contained">Ir a la página de inicio</Button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
