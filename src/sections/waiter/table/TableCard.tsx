import { Card, CardContent, Typography } from "@mui/material";
import { Table } from "../../../types";

function TableCard({ table }: { table: Table }) {
  return (
    <Card
      variant="outlined"
      sx={{ backgroundColor: !table.is_available ? "#D2C087" : "#2B2725" }}
    >
      <CardContent>
        <Typography variant="h6">Mesa #{table.number}</Typography>
      </CardContent>
    </Card>
  );
}

export default TableCard;
