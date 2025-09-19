import type { ReactNode, PropsWithChildren } from "react";
import React from "react";
import { Link } from "@tanstack/react-router";
import logo from "../assets/logo.png";

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
  
  // todo add tailwind styles and fix layout
  return (
    <div style={{display: 'flex', width: '100vw', height: '100vh', gap: '10px', padding: '10px', boxSizing: 'border-box'}}>
      <div style={{flex: 8}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', fontSize: '20px', fontWeight: 'bold', justifyContent: 'center' }}>
          <div style={{alignItems: 'center', display: 'flex', gap: '10px', flex: 4}}>
            <img src={logo} alt="Koi Logo" className="inline h-6 w-6" />
            <text style={{ fontSize: '45px', fontWeight: 'bold', verticalAlign: 'middle' }}>
              Koi
            </text>
          </div>
          <div style={{display: 'flex', flex: 6, gap: '3vw', justifyContent: 'center'}}>
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
        </div>
        <div style={{backgroundColor: 'white', margin: '10px'}}>{content}</div>
      </div>
      <div style={{backgroundColor: 'white', flex: 2}}>{sidebar}</div>
    </div>
  );
}