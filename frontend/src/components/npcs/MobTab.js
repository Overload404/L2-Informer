import InfiniteScroll from "react-infinite-scroll-component";
import mobTypes from "./mobTypes";
import React, { useEffect, useState } from "react";
import MobList from "./MobList";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import linkBuilder from "../routes/routes";
import Form from "react-bootstrap/Form";
import WeakpointBar from "./WeakpointBar";
import LevelBar from "./LevelBar";

function MobTab() {
  const [mobs, setMobs] = useState([]);
  const [mobListPage, setMobListPage] = useState(1);
  const [mobListTotal, setMobListTotal] = useState(0);
  const [weakpoint, setWeakpoint] = useState("");
  const [name, setName] = useState("");
  const [mobType, setMobType] = useState(mobTypes.all);
  const [levelmin, setLevelMin] = useState("");
  const [levelmax, setLevelMax] = useState("");

  const fetchMobList = () => {
    fetch(
      linkBuilder({
        type: mobType,
        page: +mobListPage,
        ep: "mobs",
        weakpoint: weakpoint,
        name: name,
        levelmin: levelmin,
        levelmax: levelmax,
      })
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMobs(data.response);
        setMobListTotal(data.pagination.total);
      });
  };

  const handleMoreMobs = () => {
    console.log(levelmin);
    fetch(
      linkBuilder({
        type: mobType,
        page: mobListPage + 1,
        ep: "mobs",
        weakpoint: weakpoint,
        name: name,
      })
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMobs((prevMobs) => prevMobs.concat(data.response));
        setMobListPage(+data.pagination.currentPage);
      });
  };

  useEffect(() => {
    setMobListPage(1);
    fetchMobList();
  }, [mobType, weakpoint, name, levelmax, levelmin]);

  const AllNPCsHandler = () => {
    setMobType(mobTypes.all);
    setMobListPage(1);
  };
  const MobsHandler = () => {
    setMobType(mobTypes.mobs);
    setMobListPage(1);
  };
  const BossesHandler = () => {
    setMobType(mobTypes.bosses);
    setMobListPage(1);
  };
  const NPCsHandler = () => {
    setMobType(mobTypes.npcs);
    setMobListPage(1);
  };

  const handleWeakpointBar = (weakpoint) => {
    setWeakpoint(weakpoint);
    setMobListPage(1);
  };

  const handleSearchByName = (event) => {
    setName(event.target.value);
    setMobListPage(1);
  };
  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <Col className="container col-12">
      <div className="sticky-top">
        <Row className="p-2 justify-content-start text-center bg-dark">
          <Col xs="auto" lg="3" md="auto" className="dark pb-1">
            <h5 className="m-2 justify-content-start">Type</h5>
            <ButtonGroup>
              <Button onClick={AllNPCsHandler} variant="primary">
                All
              </Button>
              <Button onClick={MobsHandler} variant="primary">
                Mobs
              </Button>
              <Button onClick={BossesHandler} variant="primary">
                Bosses
              </Button>
              <Button onClick={NPCsHandler} variant="primary">
                NPC
              </Button>
            </ButtonGroup>
          </Col>
          <WeakpointBar onWeakpointSelect={handleWeakpointBar} />
          <LevelBar
            onLevelMinChange={setLevelMin}
            onLevelMaxChange={setLevelMax}
          />
        </Row>
        <Form onSubmit={preventDefault} className="bg-dark rounded p-1">
          <Row>
            <Col xs={12}>
              <Form.Control
                size="lg"
                as="input"
                type="text"
                placeholder="Search..."
                onChange={handleSearchByName}
              />
            </Col>
          </Row>
        </Form>
      </div>
      <InfiniteScroll
        dataLength={mobs.length}
        next={handleMoreMobs}
        hasMore={mobListTotal > mobs.length}
        loader={<h4>Loading...</h4>}
      >
        <MobList mobs={mobs} />
      </InfiniteScroll>
    </Col>
  );
}

export default MobTab;
