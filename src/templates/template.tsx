import type { ReactNode, PropsWithChildren } from "react";
import React from "react";
import { Link } from "@tanstack/react-router";

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
  
  return (
    <div>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Dashboard
        </Link>{" "}
        <Link to="/groups" className="[&.active]:font-bold">
          Groups
        </Link>{" "}
        <Link to="/challenges" className="[&.active]:font-bold">
          Challenges
        </Link>{" "}
        <Link to="/forum" className="[&.active]:font-bold">
          Forum
        </Link>
      </div>
      <main>{content}</main>
      <aside>{sidebar}</aside>
    </div>
  );
}