import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "../store/utils";

// reference: https://tylermcginnis.com/react-router-protected-routes-authentication/
export default function AuthenticationProtectedRoute({
  component: Component,
  ...rest
}) {
  // You must be authenticated to be in this route
  return (
    <Route
      {...rest}
      render={props => {
        // console.log(props.location);
        return isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/account/login",
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
}
