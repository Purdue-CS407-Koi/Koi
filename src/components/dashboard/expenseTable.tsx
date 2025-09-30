import useExpenses from "@/hooks/useExpenses";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, SizeColumnsToFitGridStrategy } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

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
    },
    {
      field: "description",
    },
    { field: "update" },
    { field: "delete" },
  ];

  const autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 100,
    columnLimits: [
      { colId: "update", maxWidth: 50 },
      { colId: "delete", maxWidth: 50 },
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
