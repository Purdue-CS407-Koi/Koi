import type { ReactNode, PropsWithChildren } from "react";
import React from "react";

export function Content({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Sidebar({ children }: PropsWithChildren) {
  return <>{children}</>;
}

type LayoutProps = {
  children: ReactNode;
};

export default function Template ({ children }: LayoutProps) {
  const childArray = React.Children.toArray(children);

  const content = childArray.find(
      (child: any) => (child as any).type === Content
  );
  
  const sidebar = childArray.find(
      (child: any) => (child as any).type === Sidebar
  );
  
  return <div>
    <main>{content}</main>
    <aside>{sidebar}</aside>
  </div>;
}