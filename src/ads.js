import React from "react";

const AdWrapper = ({ children, margin = "0 auto 35px", isCenter = true }) => {
  return (
    <div
      style={{
        display: "block",
        textAlign: isCenter ? "center" : "left",
        margin
      }}
    >
      {children}
    </div>
  );
};

export default AdWrapper;
