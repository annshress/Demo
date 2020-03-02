import React from "react";
import { Table } from "react-bootstrap";

import Divider from "../../../../commons/divider";
import imgUnified from "../../../../assets/img/unified.png";
import imgStripe from "../../../../assets/img/stripe_logo.jpeg";
import imgPaypal from "../../../../assets/img/paypal_logo.png";
import imgAuthorize from "../../../../assets/img/authorize_net_logo.svg";
import ModalPaymentGateway from "./ModalPaymentGateway";
import {
  handleFetchCompanyPayPlan,
  handleDisconnectPayplan
} from "../../../../remote_access/company/company";

function Payment(props) {
  const [gateway, setGateway] = React.useState("");
  const { user, company_id, redirectToSubscription, redirectToPayplan } = props;

  const gateways = [
    {name: "whyunified", free: true, img: imgUnified},
    {name: "stripe", free: false, img: imgStripe},
    {name: "authorize", free: false, img: imgAuthorize},
    {name: "paypal", free: false, img: imgPaypal},
  ];

  const isFree = (gw) => {
    return gateways.filter(x => x.name === gw)[0].free;
  }

  const disconnectGateway = async () => {
    const r = window.confirm(
      "Disconnecting? This company will not be able to accept payments through card."
    );
    if (!r) {
      return;
    }
    const response = await handleDisconnectPayplan({
      company: company_id
    });
    if (response.ok) {
      setGateway("");
    } else {
      alert(response);
    }
  };

  React.useEffect(() => {
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  return (
    <React.Fragment>
      <div className="wuwp-card">
        <div className="title with-border">
          <h3>Payment Gateways</h3>
        </div>
        <div className="content">
          <div className="row">
            <Divider type={"blank"} size={"sm"} />
          </div>
          <Table striped>
            <tbody>
              {gateways.map(payplan => (
                <tr>
                  <td className={"align-middle"}>
                    <img src={payplan.img} alt="" className={"logo"} />
                  </td>
                  <td className={"align-middle text-right"}>
                    <ModalPaymentGateway
                      user={user}
                      active={gateway === payplan.name}
                      onDisconnectHandler={disconnectGateway}
                      onSetupHandler={() => setNewPayplan(payplan.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Payment;
