# timjay engine

A lightweight 2D game engine built on React + TypeScript, rendering to SVG.

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

### Time scale

```ts
import { setTimeScale } from "./lib/timeScale";
setTimeScale(0.5); // half speed
setTimeScale(0); // pause
```

---

## TODO

- **Collision detection** — `onCollide` exists but nothing calls it yet
- **Audio** — no sound support
- **Scene management** — no way to switch between scenes

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
