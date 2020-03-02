import React from "react";
import moment from 'moment';
import { connect } from "react-redux";
import {Button, Modal} from "react-bootstrap";
import MdCreate from "react-ionicons/lib/MdCreate";
import IosTrashOutline from "react-ionicons/lib/IosTrashOutline";
import IosHeart from "react-ionicons/lib/IosHeart";
import IosHeartOutline from "react-ionicons/lib/IosHeartOutline";

import man from '../../assets/img/default-man-photo.jpg';
import LikerModal from "./LikerModal";
import {Field, Form} from "react-final-form";
import {required} from "../validators";
import ErrorMessage from "../form_fields/ErroMessage";


function CommentCard(props) {
  const {
    comment,
    onLoveComment,
    onEditComment,
    onDeleteComment,
    currentEmail,
    handleGetLovers
  } = props;
  const [show, setShow] = React.useState(false);
  const [likers, setLikers] = React.useState({
    show: false,
    result: []
  });
  const ref = React.useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseLikers = () => setLikers({ show: false, result: [] });

  const [state, setState] = React.useState({
    ...comment
  });

  const handleShowCommentLikers = async commentId => {
    const users = await handleGetLovers(comment.id);
    setLikers({ show: true, result: users });
  };

  const onSubmit = async ({ id, content }) => {
    const data = { message: content };
    const updated = await onEditComment(id, data);
    setState({ ...comment, ...updated });
    handleClose();
  };

  const commentLove = () =>{
    setState(old => {
      return {
        ...old,
        loved_by_count: old.loved_by_count + (!old.is_loved ? 1 : -1),
        is_loved: !old.is_loved
      };
    });
    onLoveComment(comment.id);
  };

  return(
    <React.Fragment>
      <div className="container container-comment">
        <div className={'row row-comment'}>
          <div className="col-1">
            <img src={state.owner.avatar || man} alt={''} className={'person'}/>
          </div>
          <div className="col-11 comment">
            <div className={'row'}>
              <div className="col-12">
                <span className={'name'}>{state.owner.name}</span>
                <span>
                {state.message}
              </span>
              </div>
            </div>
            <div className="row">
              <div className="col-6 create-date">
                {moment(state.created_on).format('MM-DD-YYYY')} at {moment(state.created_on).format('hh:mm A')}
              </div>
              <div className="col-6 d-flex justify-content-end">
                {state.is_loved ?
                  <div className={'container-comment-love'}>
                    <span className={'love-count'} onClick={() => handleShowCommentLikers(comment.id)}>{state.loved_by_count}</span>
                    <IosHeart className={'icon-is-loved'} onClick={commentLove}/>
                  </div>
                  :
                  <div className={'container-comment-love'}>
                    <span className={'love-count'} onClick={() => handleShowCommentLikers(comment.id)}>{state.loved_by_count}</span>
                    <IosHeartOutline className={'icon-comment-action'} disabled onClick={commentLove}/>
                  </div>
                }
                <MdCreate className={'icon-comment-action'+ (currentEmail !== state.owner.email ? ' disabled':'')} onClick={handleShow}/>
                <IosTrashOutline className={'icon-comment-action'+ (currentEmail !== state.owner.email ? ' disabled':'')} onClick={() => onDeleteComment(comment.id)}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className={'modal-edit-comment'}>
        <Form
          initialValues={{"message": state.message}}
          onSubmit={async values => {
            await onSubmit({ id: comment.id, content: ref.current.value })
          }}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} className={'form-add-comment'}>
              <Modal.Header closeButton className="bg-primary text-light">
                <Modal.Title>Edit Comment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="employee_form">
                  <div className="row">
                    <div className={"col-12 form-fields"}>
                      <Field name="message" validate={required}>
                        {({ input, meta }) => (
                          <React.Fragment>
                            <textarea className={'input-border-less'} ref={ref} {...input}/>
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

      {/* Comment likers */}
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
    currentEmail: state.account.email
  };
};

export default connect(mapStateToProps)(CommentCard);
