import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Divider from "../../../commons/divider";
import {ACCOUNT_LOGOUT} from "../../../store/actionTypes";

function HomePage(props) {
  const { company_id, user } = props;

  if (props.user && props.user.company_id){
    props.history.push("/" + props.user.company_id + "/business/applications");
  } else{
    props.history.push("/account/login");
  }

  const HandleLogout = () => {
    props.logout();
    props.history.push("/account/login");
  };

  return (
    <div>
      <Divider type="blank" />
      <button className={'btn btn-primary'} onClick={() => HandleLogout()}>Logout</button>
      <Divider type="blank" />
      This is Home Page
      <Divider />
      Hello, {user}
      <Divider type="blank" />
      {company_id ? (
        <React.Fragment>
          Go to your{" "}
          <Link to={`/${company_id}/business/applications/`}>
            <button className={'btn btn-primary'}>Company</button>
          </Link>{" "}
          Page. Or browse like a normal user.
          <br/>
          <br/>
          {/*<Link to={`/company/register/subscribe/`}>*/}
          {/*  <button className={'btn btn-primary'}>Payplan subscription</button>*/}
          {/*</Link>*/}
          {/*<br/>*/}
          {/*<br/>*/}
          {/*<Link to={`/company/register/payplan/`}>*/}
          {/*  <button className={'btn btn-primary'}>Payplan Register</button>*/}
          {/*</Link>*/}
          {/*<br/>*/}
          {/*<br/>*/}
          {/*<Link to={`/company/register/payplan/stripe/?scope=read_write&code=ac_Fp2276mDFM7DsfQEuax7Y6zRlHDtqqCB`}>*/}
          {/*  <button className={'btn btn-primary'}>Testing stripe</button>*/}
          {/*</Link>*/}
        </React.Fragment>
      ) : (
        <React.Fragment>
          Hey normal user: If you own a business, you can register your company
          by clicking{" "}
          <Link to="/company/register">
            <button className={'btn btn-primary'}>here</button>
          </Link>{" "}
          . It's absolutely Free!
          <Divider type="blank" />
          Or browse other's company's services.
        </React.Fragment>
      )}
      <Divider />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    company_id: state.account.company_id,
    user: state.account.user
  };
}

const mapDispatchToProps = (dispatch) =>{
  return {
    logout : () => dispatch({type:ACCOUNT_LOGOUT})
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
