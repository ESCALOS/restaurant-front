import {
  TableRestaurant,
  Home,
  People,
  Inventory2,
  RestaurantMenu,
  Category,
  LineAxis,
} from "@mui/icons-material";

export const adminLinkRoutes = [
  {
    path: "/",
    title: "Panel",
    icon: Home,
  },
  {
    path: "/usuarios",
    title: "Usuarios",
    icon: People,
  },
  {
    path: "/mesas",
    title: "Mesas",
    icon: TableRestaurant,
  },
  {
    path: "/categorias",
    title: "Categorías",
    icon: Category,
  },
  {
    path: "/productos",
    title: "Productos",
    icon: Inventory2,
  },
  {
    path: "/platos",
    title: "Platos",
    icon: RestaurantMenu,
  },
  {
    path: "/reportes",
    title: "Reportes",
    icon: LineAxis,
  },
];
