import React from "react";
import IosPaperPlane from "react-ionicons/lib/IosPaperPlane";

import './style.scss';
import imgOverview from "../../../assets/img/overview.png";

function AccountLayout(props) {
  return (
    <div className={'container-fluid container-auth'}>
      <div className="row">
        <div className="offset-3 col-3">
          {props.children}
        </div>
        <div className="col-6 col-tour">
          <div className="row">
            <div className="col-6">
              <h2>WORKPLACE GUIDED TOUR</h2>
              <h3>Want boundless growth? See how with a guided tour.</h3>
              <p>Your guided tour to epic sales productivity starts now. Drill down, clarify, close. Then hit repeat.</p>
              <a href="/" title="" className="btn btn-warning btn-tour">
                Take The Tour
                <IosPaperPlane className={'icon-tour icon-right'}/>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <img src={imgOverview} alt="" className={'img-tour'}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountLayout;
