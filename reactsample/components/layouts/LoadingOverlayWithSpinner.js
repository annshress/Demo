import React from "react";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";

const LoadingOverlayWithSpinner = (props) =>{
  return(
    <LoadingOverlay
      active={props.loading}
      spinner={
        <Loader
          type="Oval"
          color="#d93d41"
          height="50"
          width="50"
        />
      }
    >
      {props.children}
    </LoadingOverlay>
  )
};

LoadingOverlayWithSpinner.defaultProps ={
  loading:false
};

export default LoadingOverlayWithSpinner;
