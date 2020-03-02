import React,{useState,useEffect} from 'react';
import FeedCard from "../../../commons/dashboard/feedCard";
import {handleGetWidgetContent} from "../../../remote_access/appointment/dashboard";
import LoadingOverlayWithSpinner from "../../layouts/LoadingOverlayWithSpinner";

function AppointmentFeeds(props) {
  const [loading, setLoading] = useState(false);
  const [data,setData] =useState([]);

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
    <div className="col-6">
      <LoadingOverlayWithSpinner loading={loading}>
        <div className="db_widget widget_feeds">
          <div className="widget_title clearfix">
            <h3>Feeds</h3>
          </div>
          <div className="widget_content">
            <ul className="clearfix">
              {data.map(each => (
                <FeedCard content={each} key={each.published} />
              ))}
            </ul>
          </div>
        </div>
      </LoadingOverlayWithSpinner>
    </div>
  )
}

export default AppointmentFeeds;
