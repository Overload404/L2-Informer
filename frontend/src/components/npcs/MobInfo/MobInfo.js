import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import Image from "react-bootstrap/Image";

const MobInfo = (props) => {
  const modalExitHandle = () => {
    props.onModalExit("");
  };
  return (
    <Modal
      backdrop={true}
      id={props.mob.NPC_ID}
      size="xl"
      show={props.mob.NPC_ID === props.mobInfoNPC}
      keyboard={true}
      onEscapeKeyDown={modalExitHandle}
      centered
      onHide={modalExitHandle}
    >
      <Modal.Header closeButton xs={4}>
        <p>
          {props.mob.NPC_NAME} (LVL: {props.mob.NPC_LEVEL})
        </p>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Row className="justify-content">
          <Col xs={4} className="d-flex flex-column align-items-center">
            <h6>Main Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column">
                <p className="text-danger">HP:{props.mob.HP}</p>
                <p className="text-primary">MP:{props.mob.MP}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <p className="text-success">EXP:{props.mob.EXP}</p>
                <p className="text-success">SP:{props.mob.SP}</p>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column">
                <p>P.Atk:{props.mob.PATK}</p>
                <p>M.Atk:{props.mob.MATK}</p>
                <p>Atk.Speed:{props.mob.ATKSPD}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <p>P.Def:{props.mob.PDEF}</p>
                <p>M.Def:{props.mob.MDEF}</p>
                <p>Mv.Speed:{props.mob.RUNSPD}</p>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column">
                <p>STR:{props.mob.STR}</p>
                <p>CON:{props.mob.CON}</p>
                <p>DEX:{props.mob.DEX}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <p>INT:{props.mob.INT}</p>
                <p>WIT:{props.mob.WIT}</p>
                <p>MEN:{props.mob.MEN}</p>
              </Col>
            </Row>
          </Col>
          <Col xs={4} className="d-flex flex-column align-items-center">
            <Image
              src={`./images/npcs/${props.mob.NPC_ID}.jpg`}
              alt={`${props.mob.NPC_NAME} lvl: ${props.mob.NPC_LEVEL}`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "./images/npcs/no.jpg";
                currentTarget.height = 174;
                currentTarget.width = 174;
              }}
              rounded
            />
            <h6>Experience compared to HP:</h6>
            <ProgressBar
              className="w-100"
              striped
              now={(props.mob.EXP / props.mob.HP / 6) * 100}
              label={`x ${(props.mob.EXP / props.mob.HP).toFixed(2)}`}
            />
          </Col>
          <Col xs={4}></Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MobInfo;
