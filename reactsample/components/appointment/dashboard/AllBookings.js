import React,{useState,useEffect} from 'react';
import LoadingOverlayWithSpinner from "../../layouts/LoadingOverlayWithSpinner";
import {handleGetWidgetContent} from "../../../remote_access/appointment/dashboard";

function AllBookings(props) {
  const [loading, setLoading] = useState(false);
  const [data,setData] =useState({
    count: 0,
    total: 0
  });

  useEffect(()=>{
    async function getData() {
      const response =await handleGetWidgetContent({company_id: props.company_id, url: props.url});
      if (response.ok){
        setData(response.result);
      }
    }

    setLoading(true);
    getData();
    setLoading(false);
  },[props.company_id,props.url]);

  return(
    <div className={'col-' + props.colSize}>
      <LoadingOverlayWithSpinner loading={loading}>
        <div className="db_widget widget_bookings">
          <div className="widget_title clearfix with_button">
            <h3>All Bookings</h3>
            <button className={"btn btn-sm btn-success"}>This Month</button>
          </div>
          <div className="widget_content">
            <ul className="clearfix">
              <li>
                <div className="li_number">
                  {" "}
                  {data.count}
                </div>
                <div className="li_text">bookings</div>
              </li>
              <li>
                <div className="li_number">
                  {" "}
                  {data.total} $
                </div>
                <div className="li_text">total amount</div>
              </li>
            </ul>
          </div>
        </div>
      </LoadingOverlayWithSpinner>
    </div>
  )
}

AllBookings.defaultProps = {
  colSize: 6
}

export default AllBookings;
