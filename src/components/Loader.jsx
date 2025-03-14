import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="dot" id="left-dot"></div>
      <div className="dot" id="middle-dot"></div>
      <div className="dot" id="right-dot"></div>
    </div>
  );
};

export default Loader;