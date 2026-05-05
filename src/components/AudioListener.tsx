import {
  getMasterVolume,
  isMasterMuted,
  setListenerPosition,
  setMasterMute,
  setMasterVolume,
} from "../lib/audio";

import React from "react";
import { useEffect } from "react";

interface AudioListenerProps {
  // position of the listener in world space (pass camera x/y)
  x?: number;
  y?: number;
  volume?: number;
  muted?: boolean;
  children?: React.ReactNode;
}

export function AudioListener({
  x = 0,
  y = 0,
  volume,
  muted,
  children,
}: AudioListenerProps) {
  useEffect(() => {
    setListenerPosition(x, y);
  }, [x, y]);

  useEffect(() => {
    if (volume !== undefined) setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (muted !== undefined) setMasterMute(muted);
  }, [muted]);

  return <>{children}</>;
}

export { getMasterVolume, isMasterMuted, setMasterMute, setMasterVolume };
