import { createContext, useContext } from "react";

interface SceneContextValue {
  showGrid: boolean;
}

export const SceneContext = createContext<SceneContextValue>({
  showGrid: false,
});

export const useScene = () => useContext(SceneContext);
