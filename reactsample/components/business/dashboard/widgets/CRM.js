import React, { useEffect, useState } from "react";
import IosBodyOutline from "react-ionicons/lib/IosBodyOutline";
import { Table } from "react-bootstrap";
import { handleGetWidgetContent } from "../../../../remote_access/appointment/dashboard";
import LoadingOverlayWithSpinner from "../../../layouts/LoadingOverlayWithSpinner";

function OpenOpportunities(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await handleGetWidgetContent({
        company_id: props.company_id,
        url: props.url
      });
      if (response.ok) {
        setData(response.result);
      }
    }

    setLoading(true);
    getData();
    setLoading(false);
  }, [props.company_id, props.url]);

  const renderOpenOpportunitiesItems = item => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>
          {item.currency} {item.amount}
        </td>
        <td>{item.probability}</td>
        <td>{item.due_date}</td>
      </tr>
    );
  };

  return (
    <div className={"col-" + props.colSize}>
      <LoadingOverlayWithSpinner loading={loading}>
        <div className="db_widget widget_opportunities">
          <div className="widget_title">
            <h3>
              <IosBodyOutline className={"icon-primary icon-left"} />
              Open Opportunities
            </h3>
          </div>
          <Table striped size="sm" className="mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Probability</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map(each => renderOpenOpportunitiesItems(each))}
            </tbody>
          </Table>
        </div>
      </LoadingOverlayWithSpinner>
    </div>
  );
}

OpenOpportunities.defaultProps = {
  colSize: 6
};

export default OpenOpportunities;
