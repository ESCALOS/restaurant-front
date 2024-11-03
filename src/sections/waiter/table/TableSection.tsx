import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../../services/TableService";
import TableCard from "./TableCard";

function TableSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const tables = data?.data ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      {isLoading
        ? "Cargando..."
        : tables.map((table) => <TableCard table={table} key={table.id} />)}
    </div>
  );
}

export default TableSection;
