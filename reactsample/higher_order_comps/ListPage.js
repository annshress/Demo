import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import ListTable from "../commons/utils/ListTable";
import Divider from "../commons/divider";
import TableNavigation from "../commons/utils/TableNavigation";

function WrappedListPage({
  headers,
  getResults,
  FilterRow,
  company_id,
  ...attrs
}) {
  let [results, setResults] = useState({
    results: [],
    count: 0
  });

  let [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: attrs.pageSize || 10,
    last: 1
  });

////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////

  const deletionHandler = async (e,instance_id) => {
    if (attrs.deletionHandler) {
      // if deletion handler is defined in props.attrs
      const ok = await attrs.deletionHandler(e,instance_id);
      if (ok) {
        setResults(state => {
          return {
            ...state,
            results: state.results.filter(each => each.id !== instance_id)
          };
        });
      }
    }
  };

  useEffect(
    () => {
      async function temp() {
        const result = await getResults({
          pageSize: pagination.pageSize,
          page: pagination.current,
          ...urlParams
        });
        if (result.ok) {
          setResults({
            results: standardizeResult(result.result.results),
            count: result.result.count
          });
          setPagination(p => {
            return {
              ...p,
              total: p.total - 1
            };
          });
        }
      }
      temp();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.pageSize, urlParams, pagination.current]
    // () => (results.count > pagination.pageSize ? [] : [pagination.pageSize])
  );

  // when results changes, we call this hook to reset pagination attributes
  useEffect(() => {
////////////////////////////
//                        //
//      TRUNCATED         //
//                        //
////////////////////////////


  return (
    <React.Fragment>
      <FilterRow onSearch={onSearch} company_id={company_id} />
      <ListTable
        headers={headers}
        results={results.results}
        deletionHandler={deletionHandler}
        // eslint-disable-next-line no-template-curly-in-string
        editLink={attrs.editLink}
      />
      <Divider type="blank" />
      <TableNavigation
        pagination={pagination}
        selectPage={selectPage}
        selectPageSize={selectPageSize}
      />
    </React.Fragment>
  );
}

WrappedListPage.propTypes = {
  headers: PropTypes.array,
  getResults: PropTypes.func.isRequired,
  company_id: PropTypes.string
};

export default WrappedListPage;
