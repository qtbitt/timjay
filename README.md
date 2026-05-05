# timjay engine

funny lightweight 2D game engine built on React + TypeScript with rendering to SVG.

## Core Concepts

### Scene

Wraps everything in a full-screen SVG canvas.

```tsx
<Scene showGrid={true}>...</Scene>
```

### Camera

Handles pan, zoom, and rotation. All children are in world space.

```tsx
<Camera x={0} y={0} zoom={1} rotation={0}>
  ...
</Camera>
```

### GameObject

Base class for all game objects. Extend it and implement `renderObject()`.

```ts
class MyObject extends GameObject<MyProps, MyState> {
  state: MyState = { visible: true, active: true, position: this.props.position };

  renderObject(): React.ReactNode {
    return <circle r={20} fill="red" />;
  }
}
```

Place it in the scene:

```tsx
<MyObject id="thing" position={{ x: 0, y: 0 }} />
```

### Lifecycle hooks

Override any of these in your `GameObject` subclass:

| Hook                    | When it fires                                                     |
| ----------------------- | ----------------------------------------------------------------- |
| `onStart()`             | Once on mount                                                     |
| `onUpdate(dt)`          | Every frame (`dt` is delta time in seconds, scaled by time scale) |
| `onKeyPress(e)`         | Key first pressed down                                            |
| `onKeyHold(keys, dt)`   | Every frame while keys are held — use `keys.has("w")` etc.        |
| `onKeyRelease(e)`       | Key released                                                      |
| `onClick(e)`            | Click on this object                                              |
| `onMouseDown/Up(e)`     | Mouse button on this object                                       |
| `onMouseMove(e)`        | Mouse moves over this object                                      |
| `onMouseDrag(e)`        | Mouse moved while button held on this object                      |
| `onMouseEnter/Leave(e)` | Hover enter/leave                                                 |
| `onDestroy()`           | On unmount                                                        |
| `onCollide(other)`      | _(todo)_                                                          |

> **Pointer cursor** — if you override `onClick`, `onMouseDown`, or `onMouseDrag`, the object automatically shows a pointer cursor on hover. No extra setup needed.

### Shared API

```ts
this.getPosition(); // current position from state
this.setPosition({ x, y }); // update position
this.getId(); // object id from props
this.hide() / this.show();
this.activate() / this.deactivate();
this.isActive();
```

### Custom state

Extend `GameObjectState` and pass it as the second type parameter:

```ts
interface MyState extends GameObjectState {
  health: number;
}
class MyObject extends GameObject<MyProps, MyState> {
  state: MyState = {
    visible: true,
    active: true,
    position: this.props.position,
    health: 100,
  };
}
```

### Audio

Play a sound from anywhere in a `GameObject`:

```ts
// global (heard at full volume regardless of position)
this.playSound(`${import.meta.env.BASE_URL}boom.wav`);
this.playSound(`${import.meta.env.BASE_URL}music.mp3`, { volume: 0.5 });

// spatial (fades with distance from the listener)
this.playSound(`${import.meta.env.BASE_URL}footstep.wav`, { radius: 300 });
this.playSound(`${import.meta.env.BASE_URL}explosion.wav`, {
  radius: 600,
  volume: 0.8,
});
```

Or from outside a `GameObject`:

```ts
import { playSound } from "./lib/audio";
playSound("/boom.wav");
playSound("/boom.wav", { position: { x: 100, y: 200 }, radius: 400 });
```

### AudioListener

Optional component that acts as the listener in the world. Wrap your `Camera` with it to enable spatial audio and master volume control:

```tsx
<AudioListener x={cam.x} y={cam.y} volume={0.8} muted={false}>
  <Camera x={cam.x} y={cam.y} zoom={cam.zoom} rotation={cam.rotation}>
    ...
  </Camera>
</AudioListener>
```

All props are optional. Without `AudioListener`, audio still works — spatial sounds just use the origin as the listener position.

```ts
// control master volume/mute imperatively
import { setMasterVolume, setMasterMute } from "./components/AudioListener";
setMasterVolume(0.5);
setMasterMute(true);
```

### Time scale

```ts
import { setTimeScale } from "./lib/timeScale";
setTimeScale(0.5); // half speed
setTimeScale(0); // pause
```

---

## TODO

- **Collision detection** — `onCollide` exists but nothing calls it yet
- **Scene management** — no way to switch between scenes
