import React, { useState } from "react";
import downArrow from "../assets/down.svg";

function Card({ x, y, item }) {
  const [text, setText] = useState("Write you thoughts here");
  const [heading, setHeading] = useState("Heading");
  const [open, setOpen] = useState(false);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("application/json", JSON.stringify({ item }));
  };
  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        top: y + "px",
        left: x + "px",
      }}
      className={`z-10 absolute cursor-grab min-w-[150px] p-2 flex flex-col gap-1 test bg-dark rounded-md`}
    >
      <div
        className="flex gap-1 items-center test cursor-pointer rounded-md px-1 bg-pri justify-between"
        onClick={handleToggle}
      >
        <input
          className="w-full h-full bg-transparent outline-none"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
        />
        <span
          className={`h-[10px] w-[10px] ${open ? "rotate-180" : "rotate-0"}`}
        >
          <img src={downArrow} alt="arrow" />
        </span>
      </div>
      {open && (
        <textarea
          className="test rounded-sm px-1 bg-pri"
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
      )}
    </div>
  );
}

export default Card;
