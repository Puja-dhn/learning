import React from "react";

function LoadingApp() {
  return (
    <div className="flex items-center justify-center w-screen h-screen loader-main">
      <div className="flex flex-col items-center justify-center">
        <div className="loader">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <p className="header">
          Welcome to <span>InSHE</span>
        </p>
        <p className="loader-text">Loading Assets. Please Wait....!</p>
      </div>
    </div>
  );
}

export default LoadingApp;
