import React from "react";
import { Field } from "react-final-form";
import { Form } from "react-final-form";
import { InputGroup, FormControl } from "react-bootstrap";

import Divider from "../../../../commons/divider";
import FileInput from "../../../../commons/form_fields/FileInput";
import ModalEditUserName from "./ModalEditUserName";
import ModalEditSingleField from "../../../../commons/ModalEditSingleField";
import defaultImg from "../../../../assets/img/False.jpg";

function Personalization(props) {
  const { getUserDetails, handleFileChange, imageRef } = props;
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" }
  ];
  const tzOptions = [
    { value: "est", label: "US / Eastern" },
    { value: "pst", label: "US / Pacific" }
  ];

  return (
    <div className="wuwp-card">
      <div className="title with-border">
        <h3>Personalization</h3>
      </div>
      <div className="content">
        <div className="row">
          <Divider type={"blank"} size={"sm"} />
        </div>

        {props.error && (
          <div className="row">
            <div className="col-12">
              <small className="alert alert-danger">
                Error : {props.error}
              </small>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-5">
            <div className="row">
              <div className="col-12 d-flex justify-content-between">
                {props.user && (
                  <span>
                    {props.user.first_name} {props.user.last_name}
                  </span>
                )}
                <button className={"btn-actions"}>
                  <ModalEditUserName
                    user={props.user}
                    getUserDetails={getUserDetails}
                  />
                </button>
              </div>
            </div>
            <div className="row">
              <Divider type={"blank"} size={"sm"} />
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-start">
                {props.user.avatar && (
                  <img
                    alt={""}
                    className="profile rounded-circle"
                    src={props.user.avatar}
                  />
                )}
                {!props.user.avatar && (
                  <img
                    alt={""}
                    className="profile rounded-circle"
                    src={defaultImg}
                  />
                )}
              </div>
            </div>
            <div className="row">
              <Divider type={"blank"} size={"md"} />
            </div>
            <div className="row">
              <div className="col-12">
                <Form
                  onSubmit={handleFileChange}
                  render={({
                    handleSubmit,
                    reset,
                    submitting,
                    pristine,
                    values
                  }) => (
                    <form onSubmit={handleSubmit} className="employee_form">
                      <Field name="user.avatar">
                        {({ input, meta }) => (
                          <FileInput
                            handleFileChange={handleFileChange}
                            ref={imageRef}
                            labelText={"Upload"}
                            meta={meta}
                            {...input}
                          />
                        )}
                      </Field>
                    </form>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="row">
              <div className="col-12">
                <InputGroup className={"personal-info"}>
                  <InputGroup.Prepend>
                    <InputGroup.Text className={"label"}>
                      Nick Name
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Nick Name"
                    disabled
                    value={props.user.username}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text className={"p-0"}>
                      <ModalEditSingleField
                        type={"text"}
                        modalTitle={"Edit Nick Name"}
                        initValues={{ nick_name: props.user.username }}
                        fieldName={"nick_name"}
                        fieldLabel={"Nick Name"}
                        disabled={true}
                      />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </div>
            <div className="row">
              <Divider type={"without_border"} size={"sm"} />
            </div>
            <div className="row">
              <div className="col-12">
                <InputGroup className={"personal-info"}>
                  <InputGroup.Prepend>
                    <InputGroup.Text className={"label"}>
                      Language
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Language"
                    disabled
                    value={"English"}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text className={"p-0"}>
                      <ModalEditSingleField
                        type={"select"}
                        options={languageOptions}
                        modalTitle={"Edit Language"}
                        initValues={{}}
                        fieldName={"language"}
                        fieldLabel={"Language"}
                        disabled={true}
                      />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </div>
            <div className="row">
              <Divider type={"without_border"} size={"sm"} />
            </div>
            <div className="row">
              <div className="col-12">
                <InputGroup className={"personal-info"}>
                  <InputGroup.Prepend>
                    <InputGroup.Text className={"label"}>
                      Timezone
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    aria-label="Timezone"
                    disabled
                    value={"US / Eastern"}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text className={"p-0"}>
                      <ModalEditSingleField
                        type={"select"}
                        options={tzOptions}
                        modalTitle={"Edit Timezone"}
                        initValues={{}}
                        fieldName={"timezone"}
                        fieldLabel={"Timezone"}
                        disabled={true}
                      />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personalization;
