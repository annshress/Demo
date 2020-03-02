import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { handleBookingList } from "../../../remote_access/appointment/bookings";
import LoadingOverlayWithSpinner from "../../layouts/LoadingOverlayWithSpinner";

function MyStockChart(props) {
  const [data, setData] = useState({
    data: [
      [1167609600000, 0.7537],
      [1167696000000, 0.7537],
      [1167782400000, 0.7559]
    ]
  });

  const [loading, setLoading] = useState(false);

  const options = {
    chart: {
      zoomType: "x"
    },
    title: {
      text: "Bookings Insight"
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? "Click and drag in the plot area to zoom in"
          : "Pinch the chart to zoom in"
    },
    xAxis: {////////////////////////////
      //                        //
      //      TRUNCATED         //
      //                        //
      ////////////////////////////
      
  };

  useEffect(()=>{
    chartRef.current.chart.reflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.col]);

  useEffect(() => {
    const getUser = async () => {
      const response = await handleBookingList({
        company_id: props.company
      });
      if (response.ok) {
        let newdata = [];
        response.result.forEach(element => {
          let dataoftime = new Date(element.created_at).getTime();
          newdata.push([dataoftime, parseFloat(element.price)]);
        });
        setData({ data: newdata });
      } else {
        console.log(response);
      }

      setLoading(false);
    };

    setLoading(true);
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartRef = React.createRef();

  return (
    <div className={"col-" + props.col}>
      <div className="db_widget graph_box p-0">
        <LoadingOverlayWithSpinner loading={loading}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </LoadingOverlayWithSpinner>
      </div>
    </div>
  );
}

MyStockChart.propTypes = {};
export default MyStockChart;
