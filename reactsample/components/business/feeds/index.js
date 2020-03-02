import React from "react";
import Feeds from "../../../commons/feeds";

function GlobalFeeds(props) {
  const { company } = props.match.params;

  return(
    <Feeds company={company} app_label={''} />
  )
}

export default GlobalFeeds;
