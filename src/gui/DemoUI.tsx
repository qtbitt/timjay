import type { Dispatch, SetStateAction } from "react";

interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

interface DemoUIProps {
  cam: CameraState;
  setCam: Dispatch<SetStateAction<CameraState>>;
  scale: number;
  handleTimeScale: (v: number) => void;
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0" }}
    >
      <span
        style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  decimals,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <label style={{ color: "rgba(255,255,255,0.55)" }}>{label}</label>
        <span style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>
          {value.toFixed(decimals)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#c084ff", cursor: "pointer" }}
      />
    </div>
  );
}

export default function DemoUI({ cam, setCam, scale, handleTimeScale }: DemoUIProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "rgba(15, 13, 20, 0.82)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 18px",
        borderRadius: 12,
        color: "#fff",
        fontSize: 13,
        userSelect: "none",
        minWidth: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 24 }}>timjay engine</span>

      <Divider label="Camera" />
      <SliderRow
        label="X"
        value={cam.x}
        min={-2000}
        max={2000}
        step={1}
        decimals={0}
        onChange={(v) => setCam((c) => ({ ...c, x: v }))}
      />
      <SliderRow
        label="Y"
        value={cam.y}
        min={-2000}
        max={2000}
        step={1}
        decimals={0}
        onChange={(v) => setCam((c) => ({ ...c, y: v }))}
      />
      <SliderRow
        label="Zoom"
        value={cam.zoom}
        min={0.1}
        max={10}
        step={0.01}
        decimals={2}
        onChange={(v) => setCam((c) => ({ ...c, zoom: v }))}
      />
      <SliderRow
        label="Rotation"
        value={cam.rotation}
        min={-180}
        max={180}
        step={1}
        decimals={0}
        onChange={(v) => setCam((c) => ({ ...c, rotation: v }))}
      />

      <Divider label="Time" />
      <SliderRow
        label="Time Scale"
        value={scale}
        min={0}
        max={100}
        step={1}
        decimals={1}
        onChange={handleTimeScale}
      />
    </div>
  );
}
