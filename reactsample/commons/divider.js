import React from "react";

function Divider({ type, size }) {
  return <div className={"wuwy-divider " + type + " " + size} />;
}

Divider.defaultProps = {
  type: "with_border",
  size: "xl"
};

export default Divider;
