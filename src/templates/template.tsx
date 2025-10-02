import type { ReactNode, PropsWithChildren } from "react";
import React from "react";

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
    (child: React.ReactNode) =>
      React.isValidElement(child) && child.type === Content
  );

  const sidebar = childArray.find(
    (child: React.ReactNode) =>
      React.isValidElement(child) && child.type === Sidebar
  );

  return (
    <div
      className="flex w-full h-screen box-border bg-content-background"
    >
      <div className="flex-5">
        <Navbar />
        <div>{content}</div>
      </div>
      <div className="flex-2 p-8 bg-side-panel-background">
        {sidebar}
      </div>
    </div>
  );
}
