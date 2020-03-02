import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import LoadingOverlayWithSpinner from "../../../layouts/LoadingOverlayWithSpinner";

function Chart(props) {
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
      text: "Insight"
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? "Click and drag in the plot area to zoom in"
          : "Pinch the chart to zoom in"
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      title: {
        text: "Amount"
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.Color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba")
            ]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: [
      {
        type: "area",
        name: "USD",
        data: data.data
      }
    ]
  };

  useEffect(() => {
    chartRef.current.chart.reflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.colSize]);

  // response.result.forEach(element => {
  //   let dataoftime = new Date(element.created_at).getTime();
  //   newdata.push([dataoftime, parseFloat(element.price)]);
  // });

  const chartRef = React.createRef();

  return (
    <div className={"col-" + props.colSize}>
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

Chart.defaultProps = {
  colSize: 8
};

Chart.propTypes = {};

export default Chart;
