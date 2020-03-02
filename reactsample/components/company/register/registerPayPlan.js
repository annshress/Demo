import React from "react";
import {Button,ButtonGroup} from 'react-bootstrap';

import ConnectStripeForm from "./payplan_forms/stripeForm";
import ConnectAuthorizeNetForm from "./payplan_forms/authorizeNetForm";
import UnifiedWorkplaceLogo from "../../../assets/img/unified_workplace.png";
import Divider from "../../../commons/divider";
import AccountLayout from "../../layouts/account";
import ConnectPaypalForm from "./payplan_forms/paypalForm";


function RegisterPayPlan(props) {
  const [state, setState] = React.useState({
    gateway: null
  });
  const [active, setActive] = React.useState('');

  const onClick = (gateway) =>{
    setState(old => {
      return {
        ...old,
        gateway: gateway
      };
    });
    setActive(gateway);
  };

  return (
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
              What kind of gateway do you possess?
            </p>
          </div>
        </div>
        <div className="row">
          <Divider type="blank" />
        </div>
        <div className="row">
          <div className="col-12 d-flex flex-column">
            <ButtonGroup>
              <Button onClick={() => onClick('stripe')} className={'btn btn-info' + (active === 'stripe' ? ' active': '')}>
                Stripe
              </Button>
              <Button onClick={() => onClick('authorize')} className={'btn btn-info' + (active === 'authorize' ? ' active': '')}>
                Authorize.Net
              </Button>
              <Button onClick={() => onClick('paypal')} className={'btn btn-info' + (active === 'paypal' ? ' active': '')}>
                Paypal
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {state.gateway === "stripe" &&
              <ConnectStripeForm/>
            }
            {state.gateway === "authorize" &&
              <ConnectAuthorizeNetForm/>
            }
            {state.gateway === "paypal" && <ConnectPaypalForm/>}
          </div>
        </div>
      </AccountLayout>
    </React.Fragment>
  );
}

export default RegisterPayPlan;
