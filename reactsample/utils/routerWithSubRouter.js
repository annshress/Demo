import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

function RouterWithSubRouter(props) {
  const { route } = props;

  // if (route.routes) { // todo handle nested routes
  //   route.routes.map(each => {
  //     each.path = route.path + each.path;
  //     return <RouterWithSubRouter route={each} />;
  //   });
  // }
  return (
    <Route
      path={`/:company_id${route.path}`}
      exact
      component={route.component}
    />
  );
}

RouterWithSubRouter.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool
  })
};

export default RouterWithSubRouter;
