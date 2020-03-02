import React from "react";

import './content.scss';
import Notification from "../notification";

function Content(props) {
  return (
    <React.Fragment>
      <Notification hasContainerFluid={false}/>
      <div className={'container main-content'+ (props.isBgWhite ? ' bg-white':'') }>
        {props.children}
      </div>
    </React.Fragment>
  );
}

Content.defaultProps = {
  isBgWhite: true
};

export default Content;
