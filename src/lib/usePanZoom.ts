import { useEffect, useRef, useState } from "react";

interface PanZoomState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

function rotateVector(x: number, y: number, degrees: number) {
  const r = (degrees * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

export function usePanZoom(initial: Partial<PanZoomState> = {}) {
  const [cam, setCam] = useState<PanZoomState>({
    x: initial.x ?? 0,
    y: initial.y ?? 0,
    zoom: initial.zoom ?? 1,
    rotation: initial.rotation ?? 0,
  });

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      setCam((c) => {
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const newZoom = Math.min(10, Math.max(0.1, c.zoom * factor));
        const cx = e.clientX - window.innerWidth / 2;
        const cy = e.clientY - window.innerHeight / 2;
        const localDelta = rotateVector(
          cx / c.zoom - cx / newZoom,
          cy / c.zoom - cy / newZoom,
          c.rotation,
        );
        return {
          ...c,
          x: c.x + localDelta.x,
          y: c.y + localDelta.y,
          zoom: newZoom,
        };
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (!(e.target instanceof SVGElement)) return;
      // don't pan if clicking on a GameObject
      if ((e.target as Element).closest("[data-id]")) return;
      dragging.current = true;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setCam((c) => {
        const worldDelta = rotateVector(dx / c.zoom, dy / c.zoom, c.rotation);
        return {
          ...c,
          x: c.x - worldDelta.x,
          y: c.y - worldDelta.y,
        };
      });
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  return { ...cam, setCam };
}
