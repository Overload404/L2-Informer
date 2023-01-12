import DropTable from "./DropSpoil/DropTable";
import Card from "react-bootstrap/Card";
import MobInfo from "./MobInfo/MobInfo";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import MobMap from "./MobInfo/MobMap";
import linkBuilder from "../routes/routes";

const MobTable = (props) => {
  const [drop, setDrop] = useState([{ name: "Nothing" }]);
  const [spoil, setSpoil] = useState([]);
  const [clickedNPC, setClickedNPC] = useState("");
  const [mobInfoNPC, setMobInfoNPC] = useState("");
  const [mobMapNPC, setMobMapNPC] = useState("");
  const handleInfoModalClose = (emptyString) => {
    setMobInfoNPC(emptyString);
  };
  const handleMapModalClose = (emptyString) => {
    setMobMapNPC(emptyString);
  };

  const handleDropClose = () => {
    setClickedNPC("");
  };
  const mobInfoHandler = async (event) => {
    event.persist();
    setMobInfoNPC(await event.target.id);
    console.log(clickedNPC);
  };

  const mobMapHandler = async (event) => {
    event.persist();
    setMobMapNPC(await event.target.id);
  };
  const fetchDropHandler = async (event) => {
    event.persist();
    let dropList = [];
    try {
      const drops = await (
        await fetch(
          linkBuilder({
            ep: "mobdrop",
            npcid: event.target.id,
          })
        )
      ).json();
      dropList = await drops.response;
      setClickedNPC(event.target.id);
    } catch {
      console.log("Something went wrong");
    }
    const spoilList = [];
    dropList.forEach(async (item) => {
      if (item.category < 0) {
        spoilList.push(item);
      }
    });
    dropList = dropList.filter((item) => item.category !== -1);
    if ((await dropList.length) === 0) {
      setDrop([{ name: "Nothing" }]);
    }
    if ((await spoilList.length) === 0) {
      setSpoil([{ name: "Nothing" }]);
    }
    setSpoil(spoilList);
    setDrop(dropList);
    console.log(clickedNPC);
  };

  return (
    <div>
      <div className="mobTable">
        {props.mobs.length == 0 ? (
          <h3 className="text-center m-5">No NPCs matching your request.</h3>
        ) : (
          props.mobs.map((mob) => (
            <Card
              bg="light"
              text="dark"
              className="m-1"
              key={mob.npc_id}
              id={mob.npc_id}
            >
              <MobInfo
                onModalExit={handleInfoModalClose}
                mob={mob}
                mobInfoNPC={mobInfoNPC}
                onMapButton={setMobMapNPC}
              />
              <MobMap
                mob={mob}
                mobMapNPC={mobMapNPC}
                onModalExit={handleMapModalClose}
                onInfoButton={setMobInfoNPC}
              />
              <Card.Body className="d-flex justify-content-between">
                <div className="w-50 justify-self-start hstack">
                  <span className="h5 m-2 font-weight-bold justify-self-center">
                    {mob.npc_name}
                  </span>
                  <span className="ms-auto">Level: {mob.npc_level}</span>
                </div>
                <div className="justify-self-end">
                  <Button
                    variant="success"
                    className="m-2"
                    onClick={
                      clickedNPC != mob.npc_id
                        ? fetchDropHandler
                        : handleDropClose
                    }
                    id={mob.npc_id}
                  >
                    Show Drop/Spoil
                  </Button>
                  <Button
                    variant="info"
                    className="m-2"
                    id={mob.npc_id}
                    onClick={mobInfoHandler}
                  >
                    Info
                  </Button>
                  <Button
                    variant="warning"
                    className="m-2"
                    id={mob.npc_id}
                    onClick={mobMapHandler}
                  >
                    Show On Map
                  </Button>
                </div>
              </Card.Body>
              <Collapse
                in={clickedNPC == mob.npc_id}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={1000}
              >
                <Container>
                  <DropTable drop={drop} spoil={spoil} />
                </Container>
              </Collapse>
              {/* <Card.Footer className="text-muted-light" id={mob.npc_id}>
                ID: {mob.npc_id}
              </Card.Footer> */}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MobTable;
