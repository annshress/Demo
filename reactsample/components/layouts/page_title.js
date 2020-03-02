import React from "react";
import IosInformationCircleOutline from "react-ionicons/lib/IosInformationCircleOutline";

import "./page-title.scss";

function PageTitle({ title, info }) {
  return (
    <div className="page-title">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3>{title}</h3>
            <p>
              <IosInformationCircleOutline className={'icon-secondary icon-left icon-lg'}/>
              {info}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

PageTitle.defaultProps = {
  title: "Add Booking",
  info: "Use form below to Create booking details."
};

export default PageTitle;
