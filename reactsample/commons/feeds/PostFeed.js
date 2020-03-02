import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Form, Field } from "react-final-form";
import LogoRss from "react-ionicons/lib/LogoRss";
import IosPaperPlaneOutline from "react-ionicons/lib/IosPaperPlaneOutline";

import TextArea from "../form_fields/textArea";
import { required } from "../validators";

function PostFeed(props) {
  const { onSubmit } = props;

  const gotoGlobalFeeds = e => {
    e.preventDefault();
    props.history.push(`/${props.user.company_id}/business/feeds/`);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div className="wuwp-card">
            <div className="content">
              <div className="employee_form">
                <div className="row">
                  <Field name="verb" validate={required}>
                    {({ input, meta }) => (
                      <TextArea
                        className={"input-border-less"}
                        col="12"
                        placeholder="Say something..."
                        meta={meta}
                        {...input}
                      />
                    )}
                  </Field>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-end">
                    <a
                      href={"/"}
                      onClick={gotoGlobalFeeds}
                      className={"btn btn-outline-primary"}
                    >
                      <LogoRss className={"icon-primary icon-left"} />
                      All Feeds
                    </a>
                    &nbsp;&nbsp;
                    <button
                      type="submit"
                      className={"btn btn-primary pl-5 pr-5"}
                    >
                      <IosPaperPlaneOutline
                        className={"icon-default icon-left"}
                      />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    />
  );
}

const mapStateToProps = state => {
  return {
    user: state.account
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(PostFeed)
);
