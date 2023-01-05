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

function MobTab() {
  const [mobs, setMobs] = useState([]);
  const [mobListPage, setMobListPage] = useState(1);
  const [mobListTotal, setMobListTotal] = useState(0);
  const [weakpoint, setWeakpoint] = useState("");
  const [name, setName] = useState("");
  const [mobType, setMobType] = useState(mobTypes.all);

  const fetchMobList = () => {
    fetch(
      linkBuilder({
        type: mobType,
        page: mobListPage,
        ep: "mobs",
        weakpoint: weakpoint,
        name: name,
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
    fetch(
      linkBuilder({
        type: mobType,
        page: mobListPage + 1,
        ep: "mobs",
        weakpoint: weakpoint,
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
  }, [mobType, weakpoint, name]);

  const AllNPCsHandler = () => {
    setMobType(mobTypes.all);
  };
  const MobsHandler = () => {
    setMobType(mobTypes.mobs);
  };
  const BossesHandler = () => {
    setMobType(mobTypes.bosses);
  };
  const NPCsHandler = () => {
    setMobType(mobTypes.npcs);
  };

  const handleAllWeakpoint = () => {
    setWeakpoint("");
  };

  const handleFireWeakpoint = () => {
    setWeakpoint("4279");
  };

  const handleBluntWeakpoint = () => {
    setWeakpoint("4274");
  };

  const handleSacredWeakpoint = () => {
    setWeakpoint("4275");
  };

  const handleBowWeakpoint = () => {
    setWeakpoint("4276");
  };
  const handleWaterWeakpoint = () => {
    setWeakpoint("4280");
  };
  const handleWindWeakpoint = () => {
    setWeakpoint("4281");
  };
  const handleEarthWeakpoint = () => {
    setWeakpoint("4282");
  };
  const handleDarkWeakpoint = () => {
    setWeakpoint("4336");
  };
  const handleShockWeakpoint = () => {
    setWeakpoint("4450");
  };
  const handleDualfistWeakpoint = () => {
    setWeakpoint("4457");
  };
  const handleSpearWeakpoint = () => {
    setWeakpoint("4458");
  };
  const handleSwordWeakpoint = () => {
    setWeakpoint("4460");
  };
  const handleDaggerWeakpoint = () => {
    setWeakpoint("4461");
  };
  const handleSearchByName = (event) => {
    setName(event.target.value);
  };
  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <Col className="container col-12">
      <div className="sticky-top">
        <Row className="p-2 justify-content-around  text-center bg-dark">
          <Col xs={3} className="border rounded dark pb-1">
            <h5 className="m-2 justify-content-center">Type</h5>
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
          <Col xs={8} className="border rounded p-1 pb-1">
            <h5 className="m-2">Weak Point</h5>
            <ButtonGroup size="sm">
              <Button variant="secondary" onClick={handleAllWeakpoint}>
                All
              </Button>
              <Button variant="secondary" onClick={handleBowWeakpoint}>
                Bow
              </Button>
              <Button variant="secondary" onClick={handleBluntWeakpoint}>
                Blunt
              </Button>
              <Button variant="secondary" onClick={handleSwordWeakpoint}>
                Sword
              </Button>
              <Button variant="secondary" onClick={handleSpearWeakpoint}>
                Spear
              </Button>
              <Button variant="secondary" onClick={handleDaggerWeakpoint}>
                Dagger
              </Button>
              <Button variant="secondary" onClick={handleDualfistWeakpoint}>
                Dual Fist
              </Button>
              <Button variant="secondary" onClick={handleFireWeakpoint}>
                Fire
              </Button>
              <Button variant="secondary" onClick={handleWaterWeakpoint}>
                Water
              </Button>
              <Button variant="secondary" onClick={handleWindWeakpoint}>
                Wind
              </Button>
              <Button variant="secondary" onClick={handleEarthWeakpoint}>
                Earth
              </Button>
              <Button variant="secondary" onClick={handleShockWeakpoint}>
                Shock
              </Button>
              <Button variant="secondary" onClick={handleDarkWeakpoint}>
                Dark
              </Button>
              <Button variant="secondary" onClick={handleSacredWeakpoint}>
                Sacred
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Form onSubmit={preventDefault} className="bg-dark rounded p-1">
          <Row>
            <Col xs={10}>
              <Form.Control
                size="lg"
                as="input"
                type="text"
                placeholder="Search..."
                onChange={handleSearchByName}
              />
            </Col>
            <Col xs={2}></Col>
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
