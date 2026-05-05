import React, { createContext, useContext } from "react";

import { useScene } from "../lib/sceneContext";

interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

const CameraContext = createContext<CameraState>({
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
});
export const useCamera = () => useContext(CameraContext);

interface CameraProps {
  x?: number;
  y?: number;
  zoom?: number;
  rotation?: number;
  children?: React.ReactNode;
}

export function Camera({
  x = 0,
  y = 0,
  zoom = 1,
  rotation = 0,
  children,
}: CameraProps) {
  const { showGrid } = useScene();
  const r = (rotation * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);

  // screen = (W/2, H/2) + zoom * R(-rotation) * (world - cameraPosition)
  const hw = window.innerWidth / 2;
  const hh = window.innerHeight / 2;
  const a = zoom * cos;
  const b = -zoom * sin;
  const c = zoom * sin;
  const d = zoom * cos;
  const e = hw - (a * x + c * y);
  const f = hh - (b * x + d * y);

  return (
    <CameraContext.Provider value={{ x, y, zoom, rotation }}>
      <g transform={`matrix(${a} ${b} ${c} ${d} ${e} ${f})`}>
        {showGrid && (
          <>
            <defs>
              <pattern
                id="world-grid-minor"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.5"
                />
              </pattern>
              <pattern
                id="world-grid-major"
                width="250"
                height="250"
                patternUnits="userSpaceOnUse"
              >
                <rect width="250" height="250" fill="url(#world-grid-minor)" />
                <path
                  d="M 250 0 L 0 0 0 250"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x="-1000000"
              y="-1000000"
              width="2000000"
              height="2000000"
              fill="url(#world-grid-major)"
            />
          </>
        )}
        {children}
      </g>
    </CameraContext.Provider>
  );
}
