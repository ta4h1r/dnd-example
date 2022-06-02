// https://codesandbox.io/s/drag-anim-with-draggable-n48k2?file=/src/styles.css:0-134

import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import "./styles.css";

const connectPointStyle = {
  position: "absolute",
  width: 15,
  height: 15,
  borderRadius: "50%",
  background: "black"
};
const connectPointOffset = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" }
};

const ConnectPointsWrapper = ({ boxId, handler }) => {
  const ref1 = useRef();

  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);
  return (
    <React.Fragment>
      <div
        className="connectPoint"
        style={{
          ...connectPointStyle,
          ...connectPointOffset[handler],
          ...position
        }}
        draggable
        onMouseDown={e => e.stopPropagation()}
        onDragStart={e => {
          setBeingDragged(true);
          e.dataTransfer.setData("arrow", boxId);
        }}
        onDrag={e => {
          setPosition({
            position: "fixed",
            left: e.clientX,
            top: e.clientY,
            transform: "none",
            opacity: 0
          });
        }}
        ref={ref1}
        onDragEnd={e => {
          setPosition({});
          setBeingDragged(false);
        }}
      />
      {beingDragged ? <Xarrow start={boxId} end={ref1} /> : null}
    </React.Fragment>
  );
};

const boxStyle = {
  border: "1px solid black",
  position: "relative",
  padding: "20px 10px"
};

const Box = ({ text, handler, addArrow, setArrows, boxId }) => {
  return (
    <Draggable onDrag={() => setArrows(arrows => [...arrows])}>
      <div
        id={boxId}
        style={boxStyle}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          if (e.dataTransfer.getData("arrow") === boxId) {
            console.log(e.dataTransfer.getData("arrow"), boxId);
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
            addArrow(refs);
            console.log("droped!", refs);
          }
        }}
      >
        {text}
        <ConnectPointsWrapper {...{ boxId, handler }} />
      </div>
    </Draggable>
  );
};

export default function Arrows() {
  const [arrows, setArrows] = useState([]);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      {/* two boxes */}
      <Box
        text="drag my handler to second element"
        {...{ addArrow, setArrows, handler: "right", boxId: "box2_1" }}
      />
      <Box
        text="second element"
        {...{ addArrow, setArrows, handler: "left", boxId: "box2_2" }}
      />
      {arrows.map(ar => (
        <Xarrow
          start={ar.start}
          end={ar.end}
          key={ar.start + "-." + ar.start}
        />
      ))}
    </div>
  );
}
