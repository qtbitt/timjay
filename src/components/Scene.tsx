import React from "react";
import { SceneContext } from "../lib/sceneContext";

interface SceneProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  background?: string;
  showGrid?: boolean;
  style?: React.CSSProperties;
}

export function Scene({
  children,
  width = "100vw",
  height = "100vh",
  background = "#1a1a2e",
  showGrid = false,
  style,
}: SceneProps) {
  const baseStyle: React.CSSProperties = {
    display: "block",
    position: "fixed",
    inset: 0,
  };

  return (
    <SceneContext.Provider value={{ showGrid }}>
      <svg
        width={width}
        height={height}
        style={{
          ...baseStyle,
          ...style,
          width,
          height,
          background,
        }}
      >
        {children}
      </svg>
    </SceneContext.Provider>
  );
}
