import { SceneProvider } from "./SceneContext";

export default function Scene({ children }: React.PropsWithChildren<unknown>) {
  return <SceneProvider>{children}</SceneProvider>;
}
