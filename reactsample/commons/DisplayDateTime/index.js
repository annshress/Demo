import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import {InputGroup} from "react-bootstrap";
import IosCalendarOutline from 'react-ionicons/lib/IosCalendarOutline';
import IosTimeOutline from 'react-ionicons/lib/IosTimeOutline';

import "./style.scss";

function DisplayDateTime(props) {
  let classNames= "";

  if (props.hAlignment==="start"){
    classNames = "justify-content-start";
  }
  if (props.hAlignment==="center"){
    classNames = "justify-content-center";
  }
  if (props.hAlignment==="end"){
    classNames = "justify-content-end";
  }

  return(
    <div className={'wuwp-display-date-time'}>
      <InputGroup size="sm" className={classNames}>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <IosCalendarOutline className={'icon-secondary icon-left'}/>
            {moment(props.date).format('MM-DD-YYYY')}
          </InputGroup.Text>
        </InputGroup.Prepend>
        <InputGroup.Append>
          <InputGroup.Text>
            <IosTimeOutline className={'icon-secondary icon-left'}/>
            {moment(props.date).format('hh:mm A')}
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </div>
  )
}

DisplayDateTime.propTypes={
  date: PropTypes.string,
  hAlignment: PropTypes.string
};

DisplayDateTime.defaultProps ={
  date: new Date(),
  hAlignment: "justify-content-start"
};

export default DisplayDateTime;
