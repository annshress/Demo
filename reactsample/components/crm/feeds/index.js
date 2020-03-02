/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import Feeds from "../../../commons/feeds";

function CRMFeeds(props) {
  const { company } = props.match.params;
  const APP_LABEL = "crm";

  return <Feeds company={company} app_label={APP_LABEL} />;
}

export default CRMFeeds;
