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
import { useState } from "react";

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
        npcid: props.mob.npc_id,
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
                npcid: props.mob.npc_id,
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
      id={props.mob.npc_id}
      size="xl"
      keyboard={true}
      show={props.mob.npc_id == props.mobMapNPC}
      onEnter={fetchSpawns}
      onEscapeKeyDown={modalExitHandle}
      centered
      onHide={modalExitHandle}
    >
      <Modal.Header closeButton xs={4}>
        {props.mob.npc_name} lvl.{props.mob.npc_level}
      </Modal.Header>
      <Modal.Body className="text-align-center">
        {spawns.length !== 0 ? (
          <MapContainer
            className="map"
            center={
              spawns[0].locy
                ? [-spawns[0].locy / 1000, +spawns[0].locx / 1000]
                : [-spawns[0].loc_y / 1000, +spawns[0].loc_x / 1000]
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
              spawn.locy ? (
                <CircleMarker
                  key={+spawn.id + Math.random()}
                  center={[-spawn.locy / 1000, +spawn.locx / 1000]}
                  radius={3}
                />
              ) : (
                <CircleMarker
                  key={+spawn.id + Math.random()}
                  center={[-spawn.loc_y / 1000, +spawn.loc_x / 1000]}
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
