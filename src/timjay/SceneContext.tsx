import React, { useMemo, useState } from "react";
interface SceneObject {}
interface SceneContextValue {
  subscribe(obj: SceneObject): () => void;
}
const SceneContext = React.createContext<SceneContextValue | null>(null);

export function useSceneContext() {
  const c = React.useContext(SceneContext);
  if (!c) throw new Error(`No scene context in React tree`);

  return c;
}

export function SceneProvider({ children }: React.PropsWithChildren<unknown>) {
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const value = useMemo<SceneContextValue>(
    () => ({
      subscribe(obj) {
        setObjects((prev) => [...prev, obj]);
        return () => {
          setObjects((prev) => prev.filter((o) => o !== obj));
        };
      },
    }),
    [],
  );

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}
