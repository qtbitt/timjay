import { GameObject } from "../GameObject";
import type { GameObjectProps } from "../../lib/types";
import React from "react";

interface BodyProps extends GameObjectProps {
  radius: number;
  color: string;
}

export class Body extends GameObject<BodyProps> {
  renderObject(): React.ReactNode {
    const { radius, color } = this.props;
    return <circle r={radius} fill={color} />;
  }
}
