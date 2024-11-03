import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { TableBar, TableChart } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TableSection from "../../sections/waiter/table/TableSection";
import OrderSection from "../../sections/waiter/order/OrderSection";

export default function TablePage() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <>
      {value === 0 && <TableSection />}
      {value === 1 && <OrderSection />}
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
