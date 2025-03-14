import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="dot" id="left-dot"></div>
        <div className="dot" id="middle-dot"></div>
        <div className="dot" id="right-dot"></div>
      </div>
      <div className="loader-text">Powered By <span style={{color:"#FE7235"}}>MPASAT COMP</span> <span style={{color:"#0061FD"}}>TECH DEPT...</span></div>
    </div>
  );
};

export default Loader;