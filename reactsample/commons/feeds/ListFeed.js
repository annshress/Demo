import React from "react";
import FeedCard from "./FeedCard";

function ListFeed(props) {
  const {
    appLaval,
    feeds,
    onEditFeed,
    onCommentSubmit,
    onLoveComment,
    onEditComment,
    onDeleteComment,
    onLoadMore,
    loadedFeed,
    handleGetLovers,
    onLoveFeed,
    handleGetFeedLovers
  } = props;

  return (
    <div>
      {feeds.map(feed => (
        <FeedCard
          appLaval={appLaval}
          feed={feed}
          key={feed.id}
          onEditFeed={onEditFeed}
          onCommentSubmit={onCommentSubmit}
          onLoveComment={onLoveComment}
          onEditComment={onEditComment}
          onDeleteComment={onDeleteComment}
          onLoadMore={onLoadMore}
          loadedFeed={loadedFeed}
          handleGetLovers={handleGetLovers}
          onLoveFeed={onLoveFeed}
          handleGetFeedLovers={handleGetFeedLovers}
        />
      ))}
    </div>
  );
}

export default ListFeed;
