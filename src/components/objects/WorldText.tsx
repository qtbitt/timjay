import { GameObject } from "../GameObject";
import type { GameObjectProps } from "../../lib/types";
import React from "react";

interface WorldTextProps extends GameObjectProps {
  text: string;
  color?: string;
  customStyle?: React.CSSProperties;
}

export class WorldText extends GameObject<WorldTextProps> {
  renderObject(): React.ReactNode {
    const { text, color, customStyle } = this.props;
    return (
      <text style={{ fill: color, userSelect: "none", ...customStyle }}>
        {text}
      </text>
    );
  }
}
