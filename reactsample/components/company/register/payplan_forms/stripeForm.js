import React from "react";
import {Button} from "react-bootstrap";
import IosArrowRoundForward from 'react-ionicons/lib/IosArrowRoundForward';

import { handleFetchStripeConfiguration } from "../../../../remote_access/company/company";
import Divider from "../../../../commons/divider";

function ConnectStripeForm(props) {
  const [state, setState] = React.useState({
    client_id: ""
  });

  React.useEffect(() => {
    const getStripeConf = async () => {
      const response = await handleFetchStripeConfiguration();
      if (response.ok) {
        setState(old => {
          return {
            ...old,
            client_id: response.result.client_id
          };
        });
      } else {
        console.log(response.errors);
        // alert(response.errors);
      }
    };
    getStripeConf();
  }, []);

  return (
    <React.Fragment>
      <div className="row">
        <Divider type="blank" />
      </div>
      <div className="row">
        <div className="col-12">
          <Button disabled={!state.client_id} className={state.client_id ? "btn btn-block btn-primary" : "btn btn-secondary block"} href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${state.client_id}&scope=read_write`}>
            Connect with WhyUnified via Stripe!
            <IosArrowRoundForward className={'icon-right icon-lg icon-default'}/>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ConnectStripeForm;
