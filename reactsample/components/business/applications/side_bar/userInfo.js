import React from "react";
import {connect} from "react-redux";

function UserInfo(props) {
  const { user } = props;

  return (
    <div className="content_list">
      <div className="user_avatar">
        <img src={user.avatar} alt="" />
      </div>
      {user.first_name} {user.last_name}
      <br />
      UserID: {user.username}
    </div>
  );
}

const stateToProps=(state)=>{
  return{
    user: state.account
  }
};

export default connect(stateToProps,null)(UserInfo)
