import type { ReactNode, PropsWithChildren } from "react";
import React from "react";

import {
  MAIN_CONTENT_BACKGROUND,
  SIDE_PANEL_BACKGROUND,
} from "@/config/colors";
import Navbar from "@/components/template/Navbar";

export function Content({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Sidebar({ children }: PropsWithChildren) {
  return <>{children}</>;
}

type LayoutProps = {
  children: ReactNode;
};

export default function Template({ children }: LayoutProps) {
  const childArray = React.Children.toArray(children);

  const content = childArray.find(
    (child: any) => (child as any).type === Content
  );

  const sidebar = childArray.find(
    (child: any) => (child as any).type === Sidebar
  );

  // todo add tailwind styles and fix layout
  return (
    <div
      className="flex w-full h-full box-border"
      style={{
        backgroundColor: MAIN_CONTENT_BACKGROUND,
      }}
    >
      <div className="flex-5">
        <Navbar />
        <div>{content}</div>
      </div>
      <div
        className="flex-2 p-8"
        style={{ backgroundColor: SIDE_PANEL_BACKGROUND }}
      >
        {sidebar}
      </div>
    </div>
  );
}
