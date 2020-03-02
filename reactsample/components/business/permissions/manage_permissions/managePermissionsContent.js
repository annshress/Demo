import PropTypes from "prop-types";

import FilterRow from "./filterRow";

import WrappedListPage from "../../../../higher_order_comps/ListPage";

function ManagePermissionsContent(props) {
  const { getCompanyPermGroups, deletionHandler, company_id } = props;

  const headers = [
    { title: "Permission Name", width: "50", key: "name" },
    { title: "Count", width: "35", key: "permissions_count" },
    { title: "", width: "15", type: "edit-delete" }
  ];

  // eslint-disable-next-line no-template-curly-in-string
  const editLink = "/" + company_id + "/business/permission/${id}/";

  return WrappedListPage({
    headers,
    getResults: getCompanyPermGroups,
    deletionHandler,
    FilterRow,
    editLink,
    company_id,
    pageSize: 20
  });
}

ManagePermissionsContent.propTypes = {
  getCompanyPermGroups: PropTypes.func.isRequired
};

export default ManagePermissionsContent;
