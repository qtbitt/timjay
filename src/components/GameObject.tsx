import type { GameObjectProps, GameObjectState, Position } from "../lib/types";

import React from "react";
import { playSound } from "../lib/audio";
import { timeScale } from "../lib/timeScale";

export abstract class GameObject<
  P extends GameObjectProps = GameObjectProps,
  S extends GameObjectState = GameObjectState,
> extends React.Component<P, S> {
  state: S = {
    visible: true,
    active: true,
    position: this.props.position,
  } as S;

  private _rafId: number | null = null;
  private _lastTime: number | null = null;
  private _isDragging = false;
  private _heldKeys = new Set<string>();

  abstract renderObject(): React.ReactNode;

  // lifecycle
  onStart(): void {}
  onUpdate(_deltaTime: number): void {}
  onKeyPress(_event: KeyboardEvent): void {}
  onKeyRelease(_event: KeyboardEvent): void {}
  onKeyHold(_keys: Set<string>, _dt: number): void {}
  onClick(_event: MouseEvent): void {}
  onMouseDown(_event: MouseEvent): void {}
  onMouseUp(_event: MouseEvent): void {}
  onMouseMove(_event: MouseEvent): void {}
  onMouseDrag(_event: MouseEvent): void {}
  onMouseEnter(_event: MouseEvent): void {}
  onMouseLeave(_event: MouseEvent): void {}
  onDestroy(): void {}
  onCollide(_other: GameObject): void {}

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!this.state.active) return;
    if (!e.repeat) {
      this._heldKeys.add(e.key);
      this.onKeyPress(e);
    }
  };
  private _onKeyUp = (e: KeyboardEvent) => {
    this._heldKeys.delete(e.key);
    if (!this.state.active) return;
    this.onKeyRelease(e);
  };
  private _onWindowMouseMove = (e: MouseEvent) => {
    if (this._isDragging) this.onMouseDrag(e);
  };
  private _onWindowMouseUp = (e: MouseEvent) => {
    if (this._isDragging) {
      this._isDragging = false;
      this.onMouseUp(e);
      window.removeEventListener("mousemove", this._onWindowMouseMove);
      window.removeEventListener("mouseup", this._onWindowMouseUp);
    }
  };

  componentDidMount(): void {
    this.onStart();
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    const loop = (time: number) => {
      const dt = this._lastTime !== null ? (time - this._lastTime) / 1000 : 0;
      this._lastTime = time;
      if (this.state.active) {
        const scaledDt = dt * timeScale;
        if (this._heldKeys.size > 0) this.onKeyHold(this._heldKeys, scaledDt);
        this.onUpdate(scaledDt);
      }
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  componentWillUnmount(): void {
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    window.removeEventListener("mousemove", this._onWindowMouseMove);
    window.removeEventListener("mouseup", this._onWindowMouseUp);
    this.onDestroy();
  }

  // shared api
  getPosition(): Position {
    return this.state.position;
  }
  setPosition(position: Position): void {
    this.setState({ position } as unknown as Pick<S, keyof S>);
  }
  getId(): string {
    return this.props.id;
  }

  hide(): void {
    this.setState({ visible: false } as unknown as Pick<S, keyof S>);
  }
  show(): void {
    this.setState({ visible: true } as unknown as Pick<S, keyof S>);
  }
  deactivate(): void {
    this.setState({ active: false } as unknown as Pick<S, keyof S>);
  }
  activate(): void {
    this.setState({ active: true } as unknown as Pick<S, keyof S>);
  }

  isActive(): boolean {
    return this.state.active;
  }

  // plays sound globally, or spatially at this object's position if radius is given
  playSound(src: string, options?: { volume?: number; radius?: number }): void {
    const pos = options?.radius != null ? this.getPosition() : undefined;
    playSound(src, {
      volume: options?.volume,
      radius: options?.radius,
      position: pos,
    });
  }

  // template
  render(): React.ReactNode {
    if (!this.state.visible) return null;
    const { x, y } = this.getPosition();
    const proto = GameObject.prototype;
    const isInteractable =
      this.onClick !== proto.onClick ||
      this.onMouseDown !== proto.onMouseDown ||
      this.onMouseDrag !== proto.onMouseDrag;
    return (
      <g
        transform={`translate(${x}, ${y})`}
        data-id={this.getId()}
        style={isInteractable ? { cursor: "pointer" } : undefined}
        onClick={(e) => this.onClick(e.nativeEvent)}
        onMouseDown={(e) => {
          this._isDragging = true;
          this.onMouseDown(e.nativeEvent);
          window.addEventListener("mousemove", this._onWindowMouseMove);
          window.addEventListener("mouseup", this._onWindowMouseUp);
        }}
        onMouseMove={(e) => this.onMouseMove(e.nativeEvent)}
        onMouseEnter={(e) => this.onMouseEnter(e.nativeEvent)}
        onMouseLeave={(e) => this.onMouseLeave(e.nativeEvent)}
      >
        {this.renderObject()}
      </g>
    );
  }
}
