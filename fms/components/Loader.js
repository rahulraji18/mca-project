import React from "react";

export default function LoadingSpinner() {
  return (
    <>
    <style jsx>{
    `
    .loading {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 103px;
  }

  .loading__dot {
    animation: dot ease-in-out 1s infinite;
    background-color: grey;
    display: inline-block;
    height: 10px;
    margin: 10px;
    width: 10px;
  }

  .loading__dot:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  .loading__dot:nth-of-type(3) {
    animation-delay: 0.3s;
  }

  @keyframes dot {
    0% { background-color: grey; transform: scale(1); }
    50% { background-color: #3014bc; transform: scale(1.3); }
    100% { background-color: grey; transform: scale(1); }
  }
    `
    }
    </style>

    <div className="loading">
    <span className="loading__dot"></span>
    <span className="loading__dot"></span>
    <span className="loading__dot"></span>
  </div>
    </>
  );
}
