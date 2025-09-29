import type { ReactNode, PropsWithChildren } from "react";
import React from "react";
import { Link } from "@tanstack/react-router";
import logo from "../assets/logo.png";
import {
  MAIN_CONTENT_BACKGROUND,
  SIDE_PANEL_BACKGROUND,
} from "../config/colors";
import "./template.css";

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
        <div className="flex items-center font-bold justify-center gap-4 p-4 text-lg">
          <div className="flex-4">
            <Link to="/" className="[&.active]:font-bold">
              <div className="items-center flex gap-4">
                <img src={logo} alt="Koi Logo" className="inline h-11 w-11" />
                <text className="font-bold align-middle text-black text-5xl">
                  Koi
                </text>
              </div>
            </Link>
          </div>
          <div className="flex flex-6 justify-center gap-12">
            <Link to="/" className="[&.active]:font-bold link" activeProps={{className: "selected"}}>
              Dashboard
            </Link>
            <Link to="/groups" className="[&.active]:font-bold link" activeProps={{className: "selected"}}>
              Groups
            </Link>
            <Link to="/challenges" className="[&.active]:font-bold link" activeProps={{className: "selected"}}>
              Challenges
            </Link>
            <Link to="/forum" className="[&.active]:font-bold link" activeProps={{className: "selected"}}>
              Forum
            </Link>
          </div>
        </div>
        <div>{content}</div>
      </div>
      <div className="flex-2" style={{ backgroundColor: SIDE_PANEL_BACKGROUND }}>
        {sidebar}
      </div>
    </div>
  );
}
