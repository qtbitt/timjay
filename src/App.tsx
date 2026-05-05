import { AudioListener } from "./components/AudioListener";
import { Body } from "./components/objects/Body";
import { Camera } from "./components/Camera";
import { CirclingBody } from "./components/objects/CirclingBody";
import DemoUI from "./gui/DemoUI";
import { ExamplePlayer } from "./components/objects/ExamplePlayer";
import { Scene } from "./components/Scene";
import { WorldText } from "./components/objects/WorldText";
import { setTimeScale } from "./lib/timeScale";
import { usePanZoom } from "./lib/usePanZoom";
import { useState } from "react";

function App() {
  const { setCam, ...cam } = usePanZoom();
  const [scale, setScale] = useState(1);

  function handleTimeScale(value: number) {
    setScale(value);
    setTimeScale(value);
  }

  return (
    <>
      <DemoUI
        cam={cam}
        setCam={setCam}
        scale={scale}
        handleTimeScale={handleTimeScale}
      />
      <Scene showGrid={true}>
        <AudioListener x={cam.x} y={cam.y} volume={1} muted={false}>
          <Camera x={cam.x} y={cam.y} zoom={cam.zoom} rotation={cam.rotation}>
            <ExamplePlayer id="player" position={{ x: 0, y: 0 }} />
            <Body
              id="ball-red"
              position={{ x: -200, y: -150 }}
              radius={50}
              color="red"
            />
            <Body
              id="ball-blue"
              position={{ x: 200, y: -50 }}
              radius={35}
              color="royalblue"
            />
            <CirclingBody
              id="ball-green"
              position={{ x: 0, y: 0 }}
              radius={60}
              color="mediumseagreen"
              orbitRadius={100}
              speed={90}
            />
            <Body
              id="ball-yellow"
              position={{ x: -150, y: 150 }}
              radius={25}
              color="gold"
            />
            <WorldText
              id="text-cords"
              position={{ x: 0, y: 0 }}
              text="im at (0, 0), move me around with arrow keys!"
              color="gold"
            />
            <WorldText
              id="text-hello"
              position={{ x: -300, y: 100 }}
              text="react is goated"
              color="white"
            />
            <WorldText
              id="text-help"
              position={{ x: 0, y: 200 }}
              text="(scroll to zoom, drag to pan)"
              color="white"
              customStyle={{ fontStyle: "italic" }}
            />
          </Camera>
        </AudioListener>
      </Scene>
    </>
  );
}

export default App;
