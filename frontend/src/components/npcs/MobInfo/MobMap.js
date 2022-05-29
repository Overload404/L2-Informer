import Modal from "react-bootstrap/Modal";

const world_map = require("./world_map.jpg");

const MobMap = (props) => {
  const modalExitHandle = () => {
    props.onModalExit("");
  };

  return (
    <Modal
      backdrop={true}
      id={props.mob.NPC_ID}
      size="xl"
      keyboard={true}
      // onEnter={fetchMobMarkers}
      show={props.mob.NPC_ID === props.mobMapNPC}
      onEscapeKeyDown={modalExitHandle}
      centered
      onHide={modalExitHandle}
    >
      <Modal.Header>
        {props.mob.NPC_NAME} lvl.{props.mob.NPC_LEVEL}
      </Modal.Header>
      <Modal.Body></Modal.Body>
    </Modal>
  );
};

export default MobMap;
