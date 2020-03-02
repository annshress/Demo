import React from "react";

function SideBarCard(props) {
  return (
    <div>
      <div
        style={{
          padding: "10px 10px",
          background: "#b84245"
        }}
      >
        {props.title}
      </div>
      {props.children}
    </div>
  );
}

export default SideBarCard;
