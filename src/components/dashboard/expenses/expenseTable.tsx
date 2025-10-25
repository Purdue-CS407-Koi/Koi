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
      sortable: false,
    },
    { field: "actions", cellRenderer: ActionsCellRenderer, sortable: false },
  ];

  const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 100,
    columnLimits: [
      { colId: "actions", maxWidth: 120 },
      { colId: "created_at", maxWidth: 120, minWidth: 120 },
      { colId: "amount", maxWidth: 120 },
      { colId: "name", maxWidth: 150 },
    ],
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
