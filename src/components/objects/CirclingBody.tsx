// example component: remove it :p

import type { GameObjectProps, GameObjectState } from "../../lib/types";

import { GameObject } from "../GameObject";
import React from "react";

interface CirclingBodyProps extends GameObjectProps {
  radius: number;
  color: string;
  orbitRadius: number;
  speed: number;
}

interface CirclingBodyState extends GameObjectState {
  angle: number;
}

export class CirclingBody extends GameObject<
  CirclingBodyProps,
  CirclingBodyState
> {
  state: CirclingBodyState = {
    visible: true,
    active: true,
    position: this.props.position,
    angle: 0,
  };

  onUpdate(dt: number): void {
    this.setState((s) => {
      const angle = s.angle + this.props.speed * dt;
      const rad = (angle * Math.PI) / 180;
      return {
        angle,
        position: {
          x: this.props.position.x + Math.cos(rad) * this.props.orbitRadius,
          y: this.props.position.y + Math.sin(rad) * this.props.orbitRadius,
        },
      };
    });
  }

  renderObject(): React.ReactNode {
    return <circle r={this.props.radius} fill={this.props.color} />;
  }
}
