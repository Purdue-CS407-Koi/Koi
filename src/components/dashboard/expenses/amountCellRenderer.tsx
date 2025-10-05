import type { CustomCellRendererProps } from "ag-grid-react";

export const AmountCellRenderer = (props: CustomCellRendererProps) => {
  return (
    <div className={props.value > 0 ? "text-blue-500" : "text-green-600"}>
      ${props.value}
    </div>
  );
};
