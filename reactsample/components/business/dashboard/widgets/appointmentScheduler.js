import React, { useState, useEffect } from "react";
import { handleGetWidgetContent } from "../../../../remote_access/appointment/dashboard";
import LoadingOverlayWithSpinner from "../../../layouts/LoadingOverlayWithSpinner";

function NewBookings(props) {
  const [loading, setLoading] = useState(false);
  const [newBookings, setNew] = useState(0);

  useEffect(() => {
    async function getData() {
      const response = await handleGetWidgetContent({
        company_id: props.company_id,
        url: props.url
      });
      if (response.ok) {
        setNew(response.result);
      }
    }

    setLoading(true);
    getData();
    setLoading(false);
  }, [props.company_id, props.url]);

  return (
    <div className={"col-" + props.colSize}>
      <LoadingOverlayWithSpinner loading={loading}>
        <div className="db_widget live_insight">
          <div className="widget_title clearfix">
            <h3>New Appointments</h3>
          </div>

          <div className="widget_content">
            <ul>
              <li className="clearfix">
                <div className="li_number">{newBookings}</div>
                <div className="li_text">New Appointments</div>
              </li>
            </ul>
          </div>
        </div>
      </LoadingOverlayWithSpinner>
    </div>
  );
}

NewBookings.defaultProps = {
  colSize: 4
};

export default NewBookings;
