import React from "react";
import { Modal, Button } from "react-bootstrap";

function LikerModal(props) {
  const { likers, show, handleClose } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-primary text-light">
        <Modal.Title>Likes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {likers && likers.map(liker => (
            <li className="clearfix" key={liker.id}>
              <div className="feed_item">
                <div className="feed_img img-lover">
                  {liker.avatar ? (
                    <img src={liker.avatar} alt="" />
                  ) : (
                    <img
                      src="https://picsum.photos/id/1005/80/80?blur=1"
                      alt=""
                    />
                  )}
                </div>
                <div className="feed_content">
                  <span>
                    {liker.first_name} {liker.last_name} [{liker.username}]
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={'outline-primary'} onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LikerModal;
