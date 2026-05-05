// example component: remove it :p

import type { GameObjectProps, GameObjectState } from "../../lib/types";

import { GameObject } from "../GameObject";
import React from "react";

interface PlayerState extends GameObjectState {
  facingRight: boolean;
}

export class ExamplePlayer extends GameObject<GameObjectProps, PlayerState> {
  state: PlayerState = {
    visible: true,
    active: true,
    position: this.props.position,
    facingRight: false,
  };

  onKeyHold(keys: Set<string>, dt: number): void {
    const speed = 200;
    const { x, y } = this.getPosition();
    let dx = 0;
    let dy = 0;
    if (keys.has("ArrowUp")) dy -= speed * dt;
    if (keys.has("ArrowDown")) dy += speed * dt;
    if (keys.has("ArrowLeft")) dx -= speed * dt;
    if (keys.has("ArrowRight")) dx += speed * dt;
    if (dx > 0)
      this.setState({ facingRight: true } as Pick<PlayerState, "facingRight">);
    else if (dx < 0)
      this.setState({ facingRight: false } as Pick<PlayerState, "facingRight">);
    if (dx !== 0 || dy !== 0) this.setPosition({ x: x + dx, y: y + dy });
  }

  renderObject(): React.ReactNode {
    const flip = this.state.facingRight
      ? "scale(-1, 1) translate(-128, 0)"
      : undefined;
    return (
      <image
        href={`${import.meta.env.BASE_URL}player.png`}
        width={128}
        height={128}
        x={-20}
        y={-20}
        transform={flip}
      />
    );
  }
}
