import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", verticalAlign: "center" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link to="/login">
        <Button variant="contained">Ir a la página de inicio</Button>
      </Link>
    </div>
  );
}
