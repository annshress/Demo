import React from "react";
import {Alert} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import {connect} from "react-redux";

import { queryStringToObj } from "../../../../utils";
import { handleCreateStripeConnection } from "../../../../remote_access/company/company";
import AccountLayout from "../../../layouts/account";
import UnifiedWorkplaceLogo from "../../../../assets/img/unified_workplace.png";
import Divider from "../../../../commons/divider";


function StripeResult(props) {
  const [state, setState] = React.useState({
    success: undefined,
    reason: ""
  });
  const queryParams = queryStringToObj(props.location.search.substring(1));
  const { scope, code } = queryParams;

  React.useEffect(() => {
    const createConnection = async () => {
      const response = await handleCreateStripeConnection({
        scope: scope,
        code: code
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  const redirectTo = (e) =>{
    e.preventDefault();
    props.history.push("/" + props.company_id + "/business/applications")
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <AccountLayout>
          <div className="row row-logo">
            <div className="col-12">
              <img src={UnifiedWorkplaceLogo} alt="" />
            </div>
          </div>
          <div className="row">
            <Divider type={'blank'}/>
          </div>
          <div className="row">
            <div className="col-12">
              <h2>Payment Gateway</h2>
              <p>
                Stripe connect
              </p>
              {state.success === true && (
                <Alert variant="success">
                  Your stripe has been successfully connected to WhyUnified's account!
                  <hr/>
                  <a href={'/'} onClick={redirectTo} className={'wuwp-link primary'}>
                    <strong>Go to Business Application Dashboard</strong>
                  </a>
                </Alert>
              )}
              {state.success === false && (
                <Alert variant="danger">
                  Your stripe connection failed due to following reason(s): <br />
                  {state.reason}
                  <hr/>
                  <a href={'/'} onClick={redirectTo} className={'wuwp-link primary'}>
                    <strong>Go to Business Application Dashboard</strong>
                  </a>
                </Alert>
              )}
            </div>
          </div>
        </AccountLayout>
      </React.Fragment>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    company_id: state.account.company_id
  };
}

export default withRouter(connect(mapStateToProps,null)(StripeResult));

