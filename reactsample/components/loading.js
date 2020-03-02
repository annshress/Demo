import React from "react";
import { connect } from "react-redux";

export function Loading(props) {
  return props.loading ? (
    <div className="loading">
      <strong>Loading!!!</strong>
    </div>
  ) : (
    <React.Fragment />
  );
}

function mapStateToProps(state) {
  return {
    loading: state.account.loading
  };
}

export default connect(mapStateToProps)(Loading);
