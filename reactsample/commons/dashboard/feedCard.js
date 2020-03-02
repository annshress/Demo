import React from "react";

function FeedCard(props) {
  const { content } = props;

  return (
    <li className="clearfix" key={content.published}>
      <div className="feed_item">
        <div className="feed_img">
          {content.actor.avatar ? (
            <img src={content.actor.avatar} alt="" />
          ) : (
            <img src="https://picsum.photos/id/1005/80/80?blur=1" alt="" />
          )}
        </div>
        <div className="feed_content">
          <div className="feed_title clearfix">
            <h3>{content.actor.displayName}</h3>
            <span>{content.timesince}</span>
          </div>
          <p>
            {content.verb.toTitle()}{" "}
            {content.object && (
              <u>
                {content.object.displayName && content.object.displayName.toTitle()} ({content.object.uuid})
              </u>
            )}
          </p>
        </div>
      </div>
    </li>
  );
}

export default FeedCard;
