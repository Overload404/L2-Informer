import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
import Image from "react-bootstrap/Image";
import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import linkBuilder from "../../routes/routes";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const MobInfo = (props) => {
  const modalExitHandle = () => {
    props.onModalExit("");
  };
  const [mobSkills, setMobSkills] = useState([]);

  const mapButtonFuction = props.onMapButton;
  const modalExitFuction = props.onModalExit;

  const onMapBtnClick = (props) => {
    mapButtonFuction(props.target.id);
    modalExitFuction("");
  };

  const fetchMobSkills = () => {
    fetch(
      linkBuilder({
        ep: "mobskills",
        npcid: props.mob.npc_id,
      })
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMobSkills(data.response);
      });
  };

  return (
    <Modal
      backdrop={true}
      id={props.mob.npc_id}
      size="xl"
      show={props.mob.npc_id == props.mobInfoNPC}
      keyboard={true}
      onEnter={fetchMobSkills}
      onEscapeKeyDown={modalExitHandle}
      centered
      onHide={modalExitHandle}
    >
      <Modal.Header closeButton xs={4}>
        <text>
          {props.mob.npc_name} (LVL: {props.mob.npc_level})
        </text>
        <Button
          variant="warning"
          className="m-2"
          id={props.mob.npc_id}
          onClick={onMapBtnClick}
        >
          Show on Map
        </Button>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Row className="justify-content d-flex flex-wrap">
          <Col className="d-flex flex-column align-items-center">
            <h6>Main Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column align-items-center">
                <text className="text-danger">HP:{props.mob.hp}</text>
                <text className="text-primary">MP:{props.mob.mp}</text>
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-center">
                <text className="text-success">EXP:{props.mob.exp}</text>
                <text className="text-success">SP:{props.mob.SP}</text>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column align-items-center">
                <text>P.Atk:{props.mob.patk}</text>
                <text>M.Atk:{props.mob.matk}</text>
                <text>Atk.Speed:{props.mob.atkspd}</text>
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <text>P.Def:{props.mob.pdef}</text>
                <text>M.Def:{props.mob.mdef}</text>
                <text>Mv.Speed:{props.mob.runspd}</text>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column align-items-center">
                <text>STR:{props.mob.str}</text>
                <text>CON:{props.mob.con}</text>
                <text>DEX:{props.mob.dex}</text>
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-center">
                <text>INT:{props.mob.int}</text>
                <text>WIT:{props.mob.wit}</text>
                <text>MEN:{props.mob.men}</text>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex flex-column align-items-center">
            <Image
              src={`./images/npcs/${props.mob.npc_id}.jpg`}
              alt={`${props.mob.npc_name} lvl: ${props.mob.npc_level}`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "./images/npcs/no.jpg";
                currentTarget.height = 174;
                currentTarget.width = 174;
              }}
              rounded
            />
            <h6>Experience compared to HP:</h6>
            <textrogressBar
              className="w-100"
              striped
              now={(props.mob.exp / props.mob.hp / 6) * 100}
              label={`x ${(props.mob.exp / props.mob.hp).toFixed(2)}`}
            />
          </Col>
          <Col>
            <ListGroup>
              {mobSkills.map((skill) => (
                <ListGroup.Item key={skill.id}>
                  <Stack direction="horizontal" gap={2}>
                    <Image src={`./images/${skill.icon}`} />{" "}
                    <div className="vr" />
                    <text>lvl.{skill.level}</text>
                    <div className="vr" />
                    <text>{skill.name}</text>
                  </Stack>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MobInfo;
