import FilterRow from "./filterRow";

import { handleGetCRMAccounts } from "../../../../remote_access/crm/accounts";

import WrappedListPage from "../../../../higher_order_comps/ListPage";

const ManageCRMAccountsContent = props => {
  const { company_id, deletionHandler } = props;

  const headers = [
    {
      title: "Name",
      width: "20",
      key: "name"
    },
    {
      title: "Created By",
      width: "15",
      type: "image",
      circular: true,
      img_size: 75,
      key: "created_by.avatar"
    },
    {
      title: "Billing Address",
      width: "30",
      key: "billing_address"
    },
    {
      title: "Tags",
      width: "15",
      key: "account_tags"
    },
    {
      title: "",
      width: "20",
      type: "edit-delete"
    }
  ];

  // eslint-disable-next-line no-template-curly-in-string
  const editLink = "/" + company_id + "/crm/accounts/${id}/";

  const getCRMAccounts = async ({ pageSize, page, ...urlParams }) => {
    const result = await handleGetCRMAccounts({
      company_id: props.company_id,
      pageSize: pageSize,
      page: page,
      ...urlParams
    });
    return result;
  };

  return WrappedListPage({
    headers,
    getResults: getCRMAccounts,
    deletionHandler,
    FilterRow,
    editLink,
    company_id
  });
};

export default ManageCRMAccountsContent;
