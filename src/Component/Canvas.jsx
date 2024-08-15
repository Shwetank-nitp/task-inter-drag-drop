import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";

class Rect {
  constructor(context, x = 0, y = 0, h = 0, w = 0) {
    this.h = h;
    this.w = w;
    this.x = x;
    this.y = y;
    this.context = context;
  }
  draw() {
    this.context.strokeStyle = "black";
    this.context.lineWidth = 1;
    this.context.strokeRect(this.x, this.y, this.w, this.h);
  }
  update() {
    this.draw();
  }
}

function Canvas() {
  const canvasRef = useRef(null);
  const rect = new Rect();
  const indexRef = useRef(null);
  let animationFrameId = useRef(null);
  const [card, setCards] = useState([]);

  function handleDraw(e) {
    const canvas = canvasRef.current;
    const rectBounds = canvas.getBoundingClientRect();

    // Calculate the mouse position relative to the canvas
    rect.x = e.clientX - rectBounds.left;
    rect.y = e.clientY - rectBounds.top;

    rect.h = 30;
    rect.w = 50;
  }

  function handleDrop(e) {
    e.preventDefault();
    const { item } = JSON.parse(e.dataTransfer.getData("application/json"));
    const canvas = canvasRef.current;
    const rectBounds = canvas.getBoundingClientRect();
    const x = e.clientX - rectBounds.left;
    const y = e.clientY - rectBounds.top;

    setCards((prev) => {
      prev[item] = {
        x,
        y,
      };
      return [...prev];
    });
  }

  function handleDropOver(e) {
    e.preventDefault();
  }

  function handleCreateCard(e) {
    const canvas = canvasRef.current;
    const rectBounds = canvas.getBoundingClientRect();
    const x = e.clientX - rectBounds.left;
    const y = e.clientY - rectBounds.top;

    setCards((prev) => [...prev, { x, y }]);
  }

  const frame = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    animationFrameId.current = requestAnimationFrame(frame);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(128, 128, 128)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    rect.update();
  };

  const enterHandler = (e) => {
    frame();
    handleDraw(e);
  };

  const exitHandler = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "rgb(128, 128, 128)";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(frame);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 5000;
    canvas.height = 5000;
    rect.context = context;

    context.fillStyle = "rgb(128, 128, 128)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    indexRef.current.addEventListener("mousemove", enterHandler);

    indexRef.current.addEventListener("mouseleave", exitHandler);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      indexRef.current.removeEventListener("mousemove", enterHandler);
      indexRef.current.removeEventListener("mouseleave", exitHandler);
    };
  }, []);

  return (
    <div
      ref={indexRef}
      className="relative m-4 cursor-crosshair w-[90vw] h-[85vh]  test overflow-auto"
    >
      <canvas
        id="canvas"
        onDrop={handleDrop}
        onDragOver={handleDropOver}
        ref={canvasRef}
        onClick={handleCreateCard}
        className="absolute"
      />
      {card.map((item, index) => (
        <Card x={item.x} y={item.y} item={index} key={index} />
      ))}
    </div>
  );
}

export default Canvas;
