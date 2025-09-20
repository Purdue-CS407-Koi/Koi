import type { ReactNode, PropsWithChildren } from "react";
import React from "react";
import { Link } from "@tanstack/react-router";
import logo from "../assets/logo.png";
import {
  MAIN_CONTENT_BACKGROUND,
  SIDE_PANEL_BACKGROUND,
  TEXT_COLOR,
} from "../config/colors";
import { useLinkStore  } from "../stores/useLinkStore";
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

  // get current link from store
  const currentLink = useLinkStore((state) => state.currentLink);
  const setCurrentLink = useLinkStore((state) => state.setCurrentLink);

  // todo add tailwind styles and fix layout
  return (
    <div
      style={{
        backgroundColor: MAIN_CONTENT_BACKGROUND,
        display: "flex",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 5 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            justifyContent: "center",
          }}
        >
          <div
            style={{

              flex: 4,
            }}
          >
            <Link to="/" className="[&.active]:font-bold" onClick={() => setCurrentLink(0)}>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <img src={logo} alt="Koi Logo" className="inline h-6 w-6" />
                <text
                  style={{
                    fontSize: "45px",
                    fontWeight: "bold",
                    verticalAlign: "middle",
                    color: TEXT_COLOR,
                  }}
                >
                  Koi
                </text>
              </div>
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flex: 6,
              gap: "3vw",
              justifyContent: "center",
            }}
          >
            <Link to="/" className={"[&.active]:font-bold link " + (currentLink != 0 || "selected")} onClick={() => setCurrentLink(0)}>
              Dashboard
            </Link>{" "}
            <Link to="/groups" className={"[&.active]:font-bold link " + (currentLink != 1 || "selected")} onClick={() => setCurrentLink(1)}>
              Groups
            </Link>{" "}
            <Link to="/challenges" className={"[&.active]:font-bold link " + (currentLink != 2 || "selected")} onClick={() => setCurrentLink(2)}>
              Challenges
            </Link>{" "}
            <Link to="/forum" className={"[&.active]:font-bold link " + (currentLink != 3 || "selected")} onClick={() => setCurrentLink(3)}>
              Forum
            </Link>
          </div>
        </div>
        <div>{content}</div>
      </div>
      <div style={{ backgroundColor: SIDE_PANEL_BACKGROUND, flex: 2 }}>
        {sidebar}
      </div>
    </div>
  );
}
