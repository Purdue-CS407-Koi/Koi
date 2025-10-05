import useExpenses from "@/hooks/useExpenses";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, SizeColumnsToFitGridStrategy } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AmountCellRenderer } from "./amountCellRenderer";
import { ActionsCellRenderer } from "./actionsCellRenderer";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const ExpenseTable = () => {
  const { expenseData } = useExpenses();

  const colDefs: ColDef[] = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { filterOptions: ["contains"], maxNumConditions: 1 },
    },
    {
      field: "created_at",
      headerName: "Date",
      filter: "agDateColumnFilter",
      filterParams: {
        filterOptions: ["equals", "inRange"],
        maxNumConditions: 1,
      },
    },
    {
      field: "amount",
      filter: "agNumberColumnFilter",
      filterParams: {
        filterOptions: ["equals", "inRange"],
        maxNumConditions: 1,
      },
      valueFormatter: (params) => {
        return `$${params.value}`;
      },
      cellRenderer: AmountCellRenderer,
    },
    {
      field: "description",
    },
    { field: "actions", cellRenderer: ActionsCellRenderer },
  ];

  const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 100,
    columnLimits: [{ colId: "actions", maxWidth: 80 }],
  };

  return (
    <div className="h-96">
      <AgGridReact
        rowData={expenseData}
        columnDefs={colDefs}
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  );
};
