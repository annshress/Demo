/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "../../../assets/css/business_applications.css";
import NewBookings from "./widgets/appointmentScheduler";
import OpenOpportunities from "./widgets/CRM";
import LiveInsight from "./widgets/liveInsights";
import WidgetContent from "../../../commons/Widgets/WidgetContent";
import Chart from "./widgets/chart";

function DashboardContent(props) {
  const [allWidgets, _] = useState([
    [{ id: 17, component: LiveInsight, colSize: 4, reflow: false }],
    [
      { id: 15, component: NewBookings, colSize: 4, reflow: false },
      { id: 16, component: OpenOpportunities, colSize: 6, reflow: true }
    ]
  ]);

  const [visibleWidgets, setVisibleWidgets] = useState([]);

  const reflowColSize = row => {
    if (row.length <= 0) {
      return [];
    }
    const totalSize = row.reduce(
      (col, col2) => {
        return { colSize: col.colSize + col2.colSize };
      },
      { colSize: 0 }
    )["colSize"];
    let extra = 0;
    if (totalSize < 12) {
      extra = 12 - totalSize;
    }
    if (extra > 0) {
      const expandables = row.filter(col => col.reflow);
      const nonExpandables = row.filter(col => !col.reflow);
      if (expandables.length === 0) {
        return nonExpandables || [];
      }
      const addSize = Math.floor(extra / expandables.length);
      expandables.map(each => {
        return { ...each, colSize: each.colSize + addSize };
      });
      row = [...nonExpandables, ...expandables];
      const newTotal = row.reduce(
        (col, col2) => {
          return { colSize: col.colSize + col2.colSize };
        },
        { colSize: 0 }
      )["colSize"];
      if (newTotal < 12) {
        // if (row[row.length - 1].reflow) {
        row[row.length - 1].colSize += 12 - newTotal;
        // }
      }
    }
    return row;
  };

  useEffect(() => {
    if (!props.global_widgets) {
      return;
    }
    let visibleWidgetsIdsUrls = {};
    props.activated_global_widgets.map(
      visible => (visibleWidgetsIdsUrls[visible.widget] = visible.url)
    );
    let temp = allWidgets
      .map(eachRow =>
        eachRow.filter(
          widget =>
            Object.keys(visibleWidgetsIdsUrls).indexOf(String(widget.id)) >=
              0 && widget.component
        )
      )
      .map(eachRow =>
        eachRow.map(widget => {
          return {
            url: visibleWidgetsIdsUrls[widget.id],
            ...widget
          };
        })
      );
    // add chart widget here, which is static.
    const chart = {
      colSize: 8,
      component: Chart,
      url: "todo",
      reflow: true
    };
    temp[0] = [chart, ...temp[0]];
    //
    setVisibleWidgets(temp.map(row => reflowColSize(row)));
  }, [props.activated_global_widgets]);

  return (
    <React.Fragment>
      {visibleWidgets.map(row => (
        <div className="row">
          {row.map(each => (
            <each.component
              colSize={each.colSize}
              url={each.url}
              company_id={props.company_id}
            />
          ))}
        </div>
      ))}
      <div className="row">
        {/* <!----Add Widget-----> */}
        <div className="col-6">
          <WidgetContent type={"secondary"} appName={"business"} />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    global_widgets: state.widget.appointment_scheduler,
    activated_global_widgets: state.widget.activated_appointment_scheduler
  };
};

export default connect(
  mapStateToProps,
  null
)(DashboardContent);
