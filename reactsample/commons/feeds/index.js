/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import IosArrowDropdown from "react-ionicons/lib/IosArrowDropdown";

import "./style.scss";

import {
  handleCreateFeed,
  handleGetAppFeed,
  handleCreateFeedComment,
  handleLoveFeedComment,
  handleLoadMoreComments,
  handleUpdateFeedComment,
  handleDeleteFeedComment,
  handleFetchCommentLovers,
  handleUpdateFeed,
  handleLoveFeed,
  handleFetchFeedLovers
} from "../../remote_access/crm/feeds";
import Header from "../../components/layouts/header";
import NavBarFeeds from "../../components/business/feeds/navBarFeeds";
import NavBarAppointmentSchedular from "../../components/appointment/NavBarAppointmentBooking";
import NavBarCRM from "../../components/crm/NavBarCRM";
import PageTitle from "../../components/layouts/page_title";
import Content from "../../components/layouts/content";
import PostFeed from "./PostFeed";
import Tags from "./Tags";
import ListFeed from "./ListFeed";
import TopHeader from "../../components/layouts/top_header";
import SideNav from "../../components/layouts/SideNav";

function Feeds(props) {
  const PAGESIZE = 8;
  const { company, app_label } = props;
  let headerTitle = "Feeds | ";

  if (app_label === "appointment") {
    headerTitle += "Appointment Scheduler";
  } else if (app_label === "crm") {
    headerTitle += "CRM";
  }

  const [feeds, setFeeds] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    count: 0,
    current: 1
  });

  // to track if all comments have been loaded
  // will hold the offset of comments for each feed
  const [loaded, setLoaded] = React.useState({});

  const onSubmit = async values => {
    values = { ...values, category: app_label };
    const response = await handleCreateFeed({
      company_id: company,
      data: values
    });

    if (response.ok) {
      setFeeds(old => [response.result, ...old]);
    } else {
      return response;
    }
  };

  const onEditFeed = async (feedId, values) => {
    const response = await handleUpdateFeed({
      company_id: company,
      instance_id: feedId,
      data: values
    });
    if (response.ok) {
      return response.result;
    } else {
      console.log(response);
    }
  };

  const onCommentSubmit = async (values, feedId) => {
    values = { ...values, action: feedId };

    const response = await handleCreateFeedComment({
      company_id: company,
      data: values
    });

    if (response.ok) {
      let commented = feeds.filter(feed => feed.id === feedId)[0];
      commented.comments = [...commented.comments, response.result];
      setFeeds(old =>
        [commented, ...old.filter(feed => feed.id !== feedId)].sort(
          (a, b) => a.id < b.id
        )
      );
    } else {
      console.log(response);
    }
  };

  const onEditComment = async (commentId, values) => {
    const response = await handleUpdateFeedComment({
      company_id: company,
      instance_id: commentId,
      data: values
    });
    if (response.ok) {
      return response.result;
    } else {
      console.log(response);
    }
  };

  const onDeleteComment = async commentId => {
    const response = await handleDeleteFeedComment({
      company_id: company,
      instance_id: commentId
    });
    if (response.ok) {
      setFeeds(old => {
        const newFeeds = old.map(feed => {
          feed.comments = feed.comments.filter(
            comment => comment.id !== commentId
          );
          return feed;
        });
        return newFeeds;
      });
    } else {
      console.log(response);
    }
  };

  const onLoveComment = async commentId => {
    const response = await handleLoveFeedComment({
      company_id: company,
      instance_id: commentId
    });
    if (response.ok) {
    }
  };

  const handleGetLovers = async commentId => {
    const response = await handleFetchCommentLovers({
      company_id: company,
      instance_id: commentId
    });
    if (response.ok) {
      return response.result;
    } else {
      console.log(response);
    }
  };

  const onLoveFeed = async feedId => {
    const response = await handleLoveFeed({
      company_id: company,
      instance_id: feedId
    });
    if (response.ok) {
    }
  };

  const handleGetFeedLovers = async feedId => {
    const response = await handleFetchFeedLovers({
      company_id: company,
      instance_id: feedId
    });
    if (response.ok) {
      return response.result;
    } else {
      console.log(response);
    }
  };

  const LIMIT = 10; // default limit on old comments to fetch

  const onLoadMore = async (e, feedId) => {
    e.preventDefault();
    const OFFSET = feeds.filter(feed => feed.id === feedId)[0].comments.length;

    const response = await handleLoadMoreComments({
      company_id: company,
      action_id: feedId,
      limit: LIMIT,
      offset: _.get(
        loaded,
        feedId,
        feeds.filter(feed => feed.id === feedId)[0].comments.length
      )
    });
    if (response.ok) {
      let requestedFeed = feeds.filter(feed => feed.id === feedId)[0];
      requestedFeed.comments = [
        ...response.result.results.reverse(),
        ...requestedFeed.comments
      ];
      setFeeds(old =>
        [requestedFeed, ...old.filter(feed => feed.id !== feedId)].sort(
          (a, b) => a.id < b.id
        )
      );
      setLoaded(old => {
        if (!old[feedId]) {
          old[feedId] = OFFSET;
        }
        old[feedId] += LIMIT;
        return old;
      });
      console.log("main component ", loaded);
    }
  };

  React.useEffect(() => {
    const middleware = async () => {
      const response = await handleGetAppFeed({
        company_id: company,
        app_label: app_label,
        pageSize: PAGESIZE,
        page: pagination.current
      });
      if (response.ok) {
        // set to the state
        setFeeds(old => {
          return [...old, ...response.result.results];
        });
        setPagination(old => {
          return { ...old, count: response.result.count };
        });
      } else {
        console.log(response);
      }
    };
    middleware();
  }, [pagination.current]);

  return (
    <React.Fragment>
      <Header title={headerTitle} />
      <TopHeader />
      <div className={"container-fluid container-feeds"}>
        <div className={"row"}>
          <div className={"col-2 col-side-nav"}>
            {app_label === "" && (
              <SideNav type={"business-application"} company={company} />
            )}
            {app_label === "appointment" && (
              <SideNav type={"appointment-scheduler"} company={company} />
            )}
            {app_label === "crm" && <SideNav type={"crm"} company={company} />}
          </div>
          <div className={"col-10 col-main-content"}>
            {app_label === "" && <NavBarFeeds company_id={company} />}
            {app_label === "appointment" && (
              <NavBarAppointmentSchedular company_id={company} />
            )}
            {app_label === "crm" && <NavBarCRM company_id={company} />}
            <PageTitle
              title="Feeds"
              info="Below you can see the available feeds."
            />
            <Content isBgWhite={false}>
              <div className="row">
                <div className="col-8">
                  <PostFeed
                    company={company}
                    app_label={app_label}
                    onSubmit={onSubmit}
                  />
                </div>
                <div className="col-4">
                  <Tags />
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <ListFeed
                    appLaval={app_label}
                    feeds={feeds}
                    onEditFeed={onEditFeed}
                    onCommentSubmit={onCommentSubmit}
                    onLoveComment={onLoveComment}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    onLoadMore={onLoadMore}
                    loadedFeed={loaded}
                    handleGetLovers={handleGetLovers}
                    pagination={pagination}
                    setPagination={setPagination}
                    onLoveFeed={onLoveFeed}
                    handleGetFeedLovers={handleGetFeedLovers}
                  />
                </div>
              </div>
              {pagination.current < pagination.count && (
                <div className="row">
                  <div className="col-8 d-flex justify-content-center">
                    {Math.ceil(pagination.count / PAGESIZE) >
                    pagination.current ? (
                      <button
                        className="btn btn-primary pl-5 pr-5"
                        onClick={() =>
                          setPagination(old => {
                            return { ...old, current: old.current + 1 };
                          })
                        }
                      >
                        <IosArrowDropdown
                          className={"icon-default icon-left"}
                        />
                        Load More
                      </button>
                    ) : (
                      <button className="btn btn-primary pl-5 pr-5">End</button>
                    )}
                  </div>
                </div>
              )}
            </Content>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Feeds.prop_types = {
  app_label: PropTypes.string,
  company: PropTypes.string.isRequired
};

export default Feeds;
