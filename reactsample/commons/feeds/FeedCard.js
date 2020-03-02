import React from 'react';
import moment from 'moment';
import _ from "lodash";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";
import {Button, InputGroup, FormControl, Modal} from "react-bootstrap";
import IosCalendarOutline from 'react-ionicons/lib/IosCalendarOutline';
import IosHeartOutline from 'react-ionicons/lib/IosHeartOutline';
import IosHeart from 'react-ionicons/lib/IosHeart';
import IosChatboxesOutline from 'react-ionicons/lib/IosChatboxesOutline';
import LogoRss from "react-ionicons/lib/LogoRss";
import IosPaperPlaneOutline from "react-ionicons/lib/IosPaperPlaneOutline";
import MdCreate from "react-ionicons/lib/MdCreate";

import logoAppointmentScheduler from "../../assets/img/app_logo_appointment.png";
import logoCrm from "../../assets/img/app_logo_crm.png";
import logoShoppingCart from "../../assets/img/app_logo_shopping.png";
import logoComputer from "../../assets/img/app_logo_computer.png";
import logoBooking from "../../assets/img/app_logo_booking.png";
import logoCatering from "../../assets/img/app_logo_catering.png";

import woman from '../../assets/img/default-woman-photo.jpg';
import CommentCard from "./CommentCard";
import Divider from "../divider";
import LikerModal from "./LikerModal";
import {required} from "../validators";
import ErrorMessage from "../form_fields/ErroMessage";


function FeedCard(props) {
  const {
    appLaval,
    feed,
    onEditFeed,
    onCommentSubmit,
    onLoveComment,
    onEditComment,
    onDeleteComment,
    onLoadMore,
    loadedFeed,
    handleGetLovers,
    currentId,
    onLoveFeed,
    handleGetFeedLovers
  } = props;

  let [state, setState] = React.useState({
    ...feed
  });
  let [show, setShow] = React.useState(false);
  let [likers, setLikers] = React.useState({
    show: false,
    result: []
  });

  let commentRef = React.createRef(null);
  let feedRef = React.createRef(null);
  const appName = _.get(state.object, "appType", undefined);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const onSave = async () => {
    const updated = await onEditFeed(state.id, { verb: feedRef.current.value });
    setState({ ...feed, ...updated });
    handleClose();
  };

  const handleLikeFeed = () => {
    setState(old => {
      return {
        ...old,
        is_loved: !old.is_loved,
        lovers_count: old.lovers_count + (!old.is_loved ? 1 : -1)
      };
    });
    onLoveFeed(feed.id);
  };

  const handleShowFeedLikers = async (e) => {
    e.preventDefault();

    const users = await handleGetFeedLovers(feed.id);
    if (users.length < 1) {
      return;
    }
    setLikers({ show: true, result: users });
  };

  const handleCloseLikers = () => setLikers({ show: false, result: [] });

  const renderAppNameHeader = (appType)=>{
    if (appType==="appointment"){
      return(
        <React.Fragment>
          <img src={logoAppointmentScheduler} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Appointment Scheduler
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="crm"){
      return(
        <React.Fragment>
          <img src={logoCrm} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            CRM
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="shoppingcart"){
      return(
        <React.Fragment>
          <img src={logoShoppingCart} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Shopping Cart
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="emails"){
      return(
        <React.Fragment>
          <img src={logoComputer} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Emails
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="invoicemanager"){
      return(
        <React.Fragment>
          <img src={logoAppointmentScheduler} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Invoice Manager
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="hotel_booking"){
      return(
        <React.Fragment>
          <img src={logoBooking} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Invoice Manager
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="cleaning"){
      return(
        <React.Fragment>
          <img src={logoAppointmentScheduler} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Cleaning
          </h3>
        </React.Fragment>
      )
    }
    if (appType==="food_delivery"){
      return(
        <React.Fragment>
          <img src={logoCatering} alt="" className={'app-type'}/>
          <h3 className={'without-sidebar'}>
            Food Delivery
          </h3>
        </React.Fragment>
      )
    }

    return(
      <React.Fragment>
        <img src={logoAppointmentScheduler} alt="" className={'app-type'}/>
        <h3 className={'without-sidebar'}>
          {appType}
        </h3>
      </React.Fragment>
    )
  };

  return(
    <React.Fragment>
      <div className="wuwp-card feed-card">
        {appLaval === '' && appName &&
          <div className="title with-border">
            {renderAppNameHeader(appName)}
          </div>
        }
        {appLaval !== '' &&
          <div className="title with-border">
            <h3 className={'without-sidebar'}>
              <LogoRss className={'icon-feed icon-left'}/>
              {state.verb}
            </h3>
          </div>
        }
        <div className="content">
          <div className="row">
            <div className="col-1">
              <img src={state.actor.avatar || woman} alt={''} className={'person'}/>
            </div>
            <div className="col-11">
              <div className="row">
                <div className="col-12 display-name">
                  {state.actor.displayName}
                </div>
              </div>
              {appLaval === '' &&
                <div className="row">
                  <div className="col-12 display-verb">
                    {state.verb}
                  </div>
                </div>
              }
              <div className="row">
                <div className="col-6">
                  <div className={'publish-date'}>
                    <IosCalendarOutline className={'icon-publish-date'}/>
                    <span className={'left'}>
                    {moment(state.published).format('MM-DD-YYYY')}
                  </span>
                    <span className={'right'}>
                    {moment(state.published).format('hh:mm A')}
                  </span>
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-end pr-5">
                  <MdCreate className={'icon-action' + (currentId !== state.actor.id ? ' disabled':'')} onClick={handleShow}/>
                  <IosChatboxesOutline className={'icon-action'}/>
                  {state.is_loved ?
                    <div className={'container-love'}>
                      <span className={'love-count'} onClick={handleShowFeedLikers}>{state.lovers_count}</span>
                      <IosHeart className={'icon-is-loved'} onClick={handleLikeFeed}/>
                    </div>
                    :
                    <div className={'container-love'}>
                      <span className={'love-count'} onClick={handleShowFeedLikers}>{state.lovers_count}</span>
                      <IosHeartOutline className={'icon-action'} disabled onClick={handleLikeFeed}/>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <Divider type={'blank'}/>
          </div>
          {feed.comments_count > 3 && _.get(loadedFeed, feed.id, 0) < feed.comments_count && (
            <div className={'row'}>
              <div className="col-12">
                <div className="container container-comment">
                  <div className={'row row-comment'}>
                    <div className="col-12">
                      <a href={'/'} onClick={(e) => onLoadMore(e,feed.id)} className={'show-all'}>Show All {feed.comments_count} Comments.</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-12">
              {feed.comments && feed.comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onLoveComment={onLoveComment}
                  onEditComment={onEditComment}
                  onDeleteComment={onDeleteComment}
                  handleGetLovers={handleGetLovers}
                />
              ))}
            </div>
          </div>
          <div className="row">
            <Divider type={'blank'}/>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="container-fluid container-create-comment">
                <Form
                  onSubmit={async values => {
                    commentRef.current.value = "";
                    // FIXME: does not work; does not empty the input field
                    await onCommentSubmit(values, feed.id);
                  }}
                  render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit} className={'form-add-comment'}>
                      <Field name="message" validate={required}>
                        {({ input, meta }) => (
                          <React.Fragment>
                            <InputGroup className="mb-3">
                              <FormControl
                                className={'input-border-less'}
                                placeholder="Comment"
                                ref={commentRef}
                                meta={meta}
                                {...input}
                              />
                              {/*<FormControlInput*/}
                              {/*  className={'input-border-less'}*/}
                              {/*  placeholder="Comment"*/}
                              {/*  meta={meta}*/}
                              {/*  {...input}*/}
                              {/*/>*/}
                              <InputGroup.Append>
                                <button type="submit" className="btn btn-primary pl-4 pr-4">
                                  <IosPaperPlaneOutline className={'icon-default'}/>
                                </button>
                              </InputGroup.Append>
                            </InputGroup>
                            {(meta.error || meta.submitError) && meta.touched &&
                              <div className={'error-comment'}>
                                <ErrorMessage meta={meta}/>
                              </div>
                            }
                          </React.Fragment>
                        )}
                      </Field>
                    </form>
                  )}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className={'modal-edit-feed'}>
        <Form
          initialValues={{"verb": state.verb}}
          onSubmit={onSave}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} className={'form-add-comment'}>
              <Modal.Header closeButton className="bg-primary text-light">
                <Modal.Title>Edit Feed</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="employee_form">
                  <div className="row">
                    <div className={"col-12 form-fields"}>
                      <Field name="verb" validate={required}>
                        {({ input, meta }) => (
                          <React.Fragment>
                            <textarea className={'input-border-less'} ref={feedRef} {...input}/>
                            {(meta.error || meta.submitError) && meta.touched &&
                              <div className={'error-comment'}>
                                <ErrorMessage meta={meta}/>
                              </div>
                            }
                          </React.Fragment>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant={'outline-primary'} onClick={handleClose}>
                  Close
                </Button>
                <Button variant={'primary pl-5 pr-5'} type={'submit'}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          )}
        />
      </Modal>

      {/* Feed likers */}
      <LikerModal
        likers={likers.result}
        show={likers.show}
        handleClose={handleCloseLikers}
      />
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  // to check in the front, if current user is same as the comment owner
  return {
    currentId: state.account.id
  };
};

export default connect(mapStateToProps)(FeedCard);
