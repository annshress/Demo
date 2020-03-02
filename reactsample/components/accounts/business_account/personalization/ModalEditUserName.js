import React, { useState } from "react";
import { connect } from "react-redux";
import { Field, Form } from "react-final-form";
import { Button, Modal } from "react-bootstrap";
import { required } from "../../../../commons/validators";
import TextInput from "../../../../commons/form_fields/textInput";
import IosCreateOutline from "react-ionicons/lib/MdCreate";
import { HandleUpdateUserDetail } from "../../../../remote_access/accounts/business_account";
import { generateAndRemoveNotification } from "../../../../store/actionCreators";

function ModalEditUserName(props) {
  const { user, companyId, getUserDetails } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onEditUserName = async values => {
    let updatedUser = {};
    updatedUser.id = user.id;
    updatedUser.first_name = values.first_name;
    updatedUser.last_name = values.last_name;

    const resp = await HandleUpdateUserDetail({
      company: companyId,
      user: updatedUser
    });

    if (resp.ok) {
      getUserDetails();
      setShow(false);
      generateAndRemoveNotification(201, "User name updated.");
    } else {
      return resp;
    }
  };

  return (
    <React.Fragment>
      <IosCreateOutline className={"icon-secondary"} onClick={handleShow} />
      <Modal show={show} onHide={handleClose}>
        <Form
          initialValues={user}
          onSubmit={onEditUserName}
          render={({
            submitError,
            handleSubmit,
            reset,
            submitting,
            pristine,
            values
          }) => (
            <form onSubmit={handleSubmit} className="employee_form">
              <Modal.Header closeButton className="bg-primary text-light">
                <Modal.Title>Edit User Name</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {submitError && (
                  <div className="row">
                    <div className="col-12">
                      <span className="error">{submitError}</span>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-12">
                    <Field name="first_name" validate={required}>
                      {({ input, meta }) => (
                        <TextInput label="First Name" meta={meta} {...input} />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Field name="last_name" validate={required}>
                      {({ input, meta }) => (
                        <TextInput label="Last Name" meta={meta} {...input} />
                      )}
                    </Field>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-primary" onClick={handleClose}>
                  Close
                </Button>
                <button
                  type="submit"
                  name=""
                  className="btn btn-info pl-4 pr-4"
                >
                  Save
                </button>
              </Modal.Footer>
            </form>
          )}
        />
      </Modal>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    companyId: state.account.company_id
  };
}

export default connect(
  mapStateToProps,
  null
)(ModalEditUserName);
