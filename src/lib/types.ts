export interface Position {
  x: number;
  y: number;
}

export interface GameObjectProps {
  position: Position;
  id: string;
}

export interface GameObjectState {
  visible: boolean;
  active: boolean;
  position: Position;
}
