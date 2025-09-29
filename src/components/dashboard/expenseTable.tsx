import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, SizeColumnsToFitGridStrategy } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const ExpenseTable = () => {
  // WILL BE REPLACED BY SUPABASE DATA
  const [rowData, setRowData] = useState([
    {
      name: "Apartment Rent",
      date: "2025-09-19",
      value: 64950,
      update: "Update",
      delete: "Delete",
    },
    {
      name: "Office Supplies",
      date: "2024-07-12",
      value: 320,
      update: "Update",
      delete: "Delete",
    },
    {
      name: "Client Dinner",
      date: "2024-08-03",
      value: 185.5,
      update: "Update",
      delete: "Delete",
    },
    {
      name: "Software Subscription",
      date: "2024-09-01",
      value: 1299,
      update: "Update",
      delete: "Delete",
    },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    {
      field: "name",
      filter: "agTextColumnFilter",
      filterParams: { filterOptions: ["contains"], maxNumConditions: 1 },
    },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        filterOptions: ["equals", "inRange"],
        maxNumConditions: 1,
      },
    },
    {
      field: "value",
      filter: "agNumberColumnFilter",
      filterParams: {
        filterOptions: ["equals", "inRange"],
        maxNumConditions: 1,
      },
      valueFormatter: (params) => {
        return `$${params.value}`;
      },
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
        rowData={rowData}
        columnDefs={colDefs}
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  );
};
