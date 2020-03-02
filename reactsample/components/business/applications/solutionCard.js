import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import IosAdd from "react-ionicons/lib/IosAdd";
import IosRemove from "react-ionicons/lib/IosRemove";
import IosArrowDropright from "react-ionicons/lib/IosArrowDropright";

import logoAppointmentScheduler from "../../../assets/img/app_logo_appointment.png";
import logoCrm from "../../../assets/img/app_logo_crm.png";
import logoShoppingCart from "../../../assets/img/app_logo_shopping.png";
import logoComputer from "../../../assets/img/app_logo_computer.png";
import logoBooking from "../../../assets/img/app_logo_booking.png";
import logoCatering from "../../../assets/img/app_logo_catering.png";
import logoTime from "../../../assets/img/app_logo_time.png";
import logoCloudPhone from "../../../assets/img/app_logo_cloud_phone.png";

function SolutionCard(props) {
  const { solution, isActivated, company_id, solutionClickHandler } = props;

  const renderAppLogo = (solution) =>{
    let logo = null;

    switch (solution.linked_app_name) {
      case "appointment":
        logo = logoAppointmentScheduler;
        break;
      case "crm":
        logo = logoCrm;
        break;
      case "shoppingcart":
        logo = logoShoppingCart;
        break;
      case "emails":
        logo = logoComputer;
        break;
      case "invoicemanager":
        logo = logoAppointmentScheduler;
        break;
      case "hotel_booking":
        logo = logoBooking;
        break;
      case "cleaning":
        logo = logoAppointmentScheduler;
        break;
      case "food_delivery":
        logo = logoCatering;
        break;
      case "newsletter":
        logo = logoAppointmentScheduler;
        break;
      case "class_scheduling":
        logo = logoTime;
        break;
      case "cloudphone":
        logo = logoCloudPhone;
        break;
      default:
        logo=logoAppointmentScheduler;
    }

    return (
      <img src={logo} className={'app-logo'} alt={solution.display_name}/>
    );
  };

  return (
    <div className="row row-application">
      <div className="col-1 d-flex align-items-center">
        {renderAppLogo(solution)}
      </div>
      <div className="col-5 d-flex align-items-center">
        {solution.display_name}
      </div>
      <div className="col-6 d-flex align-items-center justify-content-end">
        {isActivated ? (
          <React.Fragment>
            <Link to={`/${company_id}/${solution.linked_app_name}/`}>
              <button className="btn btn-primary btn-view-app">
                View App
                <IosArrowDropright className={'icon-view-app icon-right'}/>
              </button>
            </Link>
            <button className="btn btn-secondary btn-app-active" title="Deactivate"
              onClick={() =>
                solutionClickHandler(solution.linked_app_name, solution.id)
              }
            >
              <IosRemove className={'icon-minus'}/>
            </button>
          </React.Fragment>
        ) : (
          <button className="btn btn-primary btn-app-active" title="Activate"
            onClick={() =>
              solutionClickHandler(solution.linked_app_name, solution.id)
            }
          >
            <IosAdd className={'icon-plus'}/>
          </button>
        )}
      </div>
    </div>
  );
}

SolutionCard.propTypes = {
  solution: PropTypes.object.isRequired,
  solutionClickHandler: PropTypes.func.isRequired,
  company_id: PropTypes.string.isRequired
};

export default SolutionCard;
