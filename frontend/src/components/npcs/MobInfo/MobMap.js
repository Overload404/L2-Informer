import Modal from "react-bootstrap/Modal";
import { CRS } from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMap,
  ImageOverlay,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "../../../../node_modules/leaflet/dist/leaflet.css";
import linkBuilder from "../../routes/routes";
import { useEffect, useState, useRef } from "react";

const MobMap = (props) => {
  const modalExitHandle = () => {
    props.onModalExit("");
  };
  const [spawns, setSpawns] = useState([]);

  const fetchSpawns = () => {
    fetch(
      linkBuilder({
        ep: "mobSpawn",
        page: 1,
        npcid: props.mob.NPC_ID,
      })
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSpawns(data.response);
        return data;
      })
      .then((data) =>
        data.response.length === 0
          ? fetch(
              linkBuilder({
                ep: "bossSpawn",
                page: 1,
                npcid: props.mob.NPC_ID,
              })
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                setSpawns((prevSpawns) => prevSpawns.concat(data.response));
              })
          : null
      );
  };

  return (
    <Modal
      backdrop={true}
      id={props.mob.NPC_ID}
      size="xl"
      keyboard={true}
      show={props.mob.NPC_ID === props.mobMapNPC}
      onEnter={fetchSpawns}
      onEscapeKeyDown={modalExitHandle}
      centered
      onHide={modalExitHandle}
    >
      <Modal.Header>
        {props.mob.NPC_NAME} lvl.{props.mob.NPC_LEVEL}
      </Modal.Header>
      <Modal.Body className="text-align-center">
        {spawns.length !== 0 ? (
          <MapContainer
            className="map"
            center={
              spawns[0].LOCY
                ? [-spawns[0].LOCY / 1000, +spawns[0].LOCX / 1000]
                : [-spawns[0].LOC_Y / 1000, +spawns[0].LOC_X / 1000]
            }
            zoom={3}
            scrollWheelZoom={false}
            crs={CRS.Simple}
            maxBounds={[
              [262.144, 327.68],
              [-262.144, -327.68],
            ]}
            maxZoom={3}
            minZoom={2}
          >
            <ImageOverlay
              bounds={[
                [262.144, 327.68],
                [-262.144, -327.68],
              ]}
              url="./images/world_map.jpg"
            />
            {spawns.map((spawn) =>
              spawn.LOCY ? (
                <CircleMarker
                  key={+spawn.ID + Math.random()}
                  center={[-spawn.LOCY / 1000, +spawn.LOCX / 1000]}
                  radius={3}
                />
              ) : (
                <CircleMarker
                  key={+spawn.BOSS_ID + Math.random()}
                  center={[-spawn.LOC_Y / 1000, +spawn.LOC_X / 1000]}
                  radius={3}
                />
              )
            )}
          </MapContainer>
        ) : (
          <p>Mob doesn't normally spawn in the world</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MobMap;
