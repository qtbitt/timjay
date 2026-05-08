import { useEffect, useMemo } from "react";
import { useSceneContext } from "../SceneContext";

function useMoveableSceneObject() {
  return useMemo(() => {
    return { setPosition() {} };
  }, []);
}

export default function Player() {
  const s = useSceneContext();
  const obj = useMoveableSceneObject();
  useEffect(() => {
    return s.subscribe(obj);
  }, [obj, s]);
  return <circle radius={5} color="#fff" />;
}
