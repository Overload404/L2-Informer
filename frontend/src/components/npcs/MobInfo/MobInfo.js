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
        <p className="align-self-end">
          {props.mob.npc_name} - lvl.{props.mob.npc_level}
        </p>
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
          <Col
            Col
            xs={12}
            lg={4}
            className="d-flex flex-column align-items-center"
          >
            <h6>Main Stats</h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={6} className="d-flex flex-column align-items-center">
                <p className="text-danger">HP:{props.mob.hp}</p>
                <p className="text-primary">MP:{props.mob.mp}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-center">
                <p className="text-success">EXP:{props.mob.exp}</p>
                <p className="text-success">SP:{props.mob.sp}</p>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row
              xs={12}
              className="justify-content-between border rounded w-100"
            >
              <Col xs={6} className="d-flex flex-column align-items-center">
                <p>P.Atk:{props.mob.patk}</p>
                <p>M.Atk:{props.mob.matk}</p>
                <p>Atk.Speed:{props.mob.atkspd}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <p>P.Def:{props.mob.pdef}</p>
                <p>M.Def:{props.mob.mdef}</p>
                <p>Mv.Speed:{props.mob.runspd}</p>
              </Col>
            </Row>
            <h6>Combat Stats</h6>
            <Row
              xs={12}
              className="justify-content-between border rounded w-100"
            >
              <Col xs={6} className="d-flex flex-column align-items-center">
                <p>STR:{props.mob.str}</p>
                <p>CON:{props.mob.con}</p>
                <p>DEX:{props.mob.dex}</p>
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-center">
                <p>INT:{props.mob.int}</p>
                <p>WIT:{props.mob.wit}</p>
                <p>MEN:{props.mob.men}</p>
              </Col>
            </Row>
          </Col>
          <Col
            Col
            xs={12}
            md="auto"
            lg={4}
            className="d-flex flex-column align-items-center"
          >
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
            <h6>EXP Efficiency:</h6>
            <ProgressBar
              className="w-100"
              striped
              now={(props.mob.exp / props.mob.hp / 6) * 100}
              label={`x ${(props.mob.exp / props.mob.hp).toFixed(2)}`}
            />

            <br />
            <h6> Misc. </h6>
            <Row className="justify-content-between border rounded w-100">
              <Col xs={12} className="d-flex flex-column align-items-center">
                <p>NPC ID:{props.mob.npc_id}</p>
                <p>
                  Aggro:{" "}
                  {props.mob.aggro === 0 ? (
                    <span className="text-success">Passive</span>
                  ) : (
                    <span className="text-danger"> Agressive </span>
                  )}
                </p>
                <p>Faction:{props.faction_id}</p>
              </Col>
            </Row>
          </Col>
          <Col
            xs={12}
            md="auto"
            lg={4}
            className="d-flex flex-column align-items-center"
          >
            <h6>Skills</h6>
            <ListGroup className="skill-list">
              {mobSkills.map((skill) => (
                <ListGroup.Item key={skill.id}>
                  <Stack direction="horizontal" gap={2}>
                    <Image rounded="true" src={`./images/${skill.icon}`} />{" "}
                    <div className="vr" />
                    <p>lvl.{skill.level}</p>
                    <div className="vr" />
                    <p>{skill.name}</p>
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
