import React from 'react';
import {connect} from 'react-redux';

import AccountLayout from "../layouts/account";
import UnifiedWorkplaceLogo from "../../assets/img/unified_workplace.png";
import Divider from "../../commons/divider";
import {Alert} from "react-bootstrap";

function NotFound(props) {
  console.log('In not found');

  const goto = (e) =>{
    e.preventDefault();

    if (props.user && props.user.company_id){
      props.history.push("/" + props.user.company_id + "/business/applications");
    } else{
      props.history.push("/account/login");
    }
  };

  return(
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
          <Alert variant="primary">
            <Alert.Heading>Page Not Found</Alert.Heading>
            <p>The page you are searching, is not found!!!</p>
            <a href={'/'} onClick={goto}>
              Goto Home
            </a>
          </Alert>
        </div>
      </div>
    </AccountLayout>
  )
}

const mapStateToProps = (state) =>{
  return{
    user: state.account
  }
};

export default connect(mapStateToProps, null)(NotFound);
