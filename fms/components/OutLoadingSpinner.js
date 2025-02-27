import React from "react";

export default function InLoadingSpinner() {
  return (
    <>
      <style jsx>{
      `#cover-spin {
        position:absolute;
        width:100%;
        left:0;right:0;top:30px;bottom:0;
        background-color: rgba(255,255,255,0.7);
        z-index:9999;
        border-radius: 10px;
    }
    @-webkit-keyframes spin {
    	from {-webkit-transform:rotate(0deg);}
    	to {-webkit-transform:rotate(360deg);}
    }

    @keyframes spin {
    	from {transform:rotate(0deg);}
    	to {transform:rotate(360deg);}
    }

    #cover-spin::after {
        content:'';
        display:block;
        position:absolute;
        left:50%;top:40%;
        width:40px;height:40px;
        border-style:solid;
        border-color:#3014bc;
        border-top-color:transparent;
        border-width: 4px;
        border-radius:50%;
        -webkit-animation: spin .8s linear infinite;
        animation: spin .8s linear infinite;
    }
    `

    }</style>
      <div id="cover-spin"></div>
      </>
  );
}
