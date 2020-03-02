import React, { useState, useEffect } from "react";
import { handleGetWidgetContent } from "../../../../remote_access/appointment/dashboard";
import LoadingOverlayWithSpinner from "../../../layouts/LoadingOverlayWithSpinner";

function LiveInsight(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    appointment_bookings: 0,
    open_opportunities: 0
  });

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

  return (
    <div className={"col-" + props.colSize}>
      <LoadingOverlayWithSpinner loading={loading}>
        <div className="db_widget live_insight">
          <div className="widget_title clearfix">
            <h3>Live Insight</h3>
          </div>

          <div className="widget_content">
            <ul>
              <li className="clearfix">
                <div className="li_number">
                  {" "}
                  {data.appointment_bookings ? data.appointment_bookings : 0}
                </div>
                <div className="li_text">New Bookings</div>
              </li>
              <li className="clearfix">
                <div className="li_number">
                  {" "}
                  {data.open_opportunities ? data.open_opportunities : 0}
                </div>
                <div className="li_text">Open Opportunities</div>
              </li>
            </ul>
          </div>
        </div>
      </LoadingOverlayWithSpinner>
    </div>
  );
}

LiveInsight.defaultProps = {
  colSize: 4
};

export default LiveInsight;
