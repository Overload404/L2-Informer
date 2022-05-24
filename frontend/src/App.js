import "bootstrap/dist/css/bootstrap.min.css";
import InfiniteScroll from "react-infinite-scroll-component";
import mobTypes from "./components/npcs/mobTypes";
// import './App.css'
import React, { useEffect, useState } from "react";
import MobList from "./components/npcs/MobList";
import DropTable from "./components/npcs/DropSpoil/DropTable";
import SpoilTable from "./components/npcs/DropSpoil/SpoilTable";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

function App() {
  const [mobs, setMobs] = useState([]);
  const [mobListPage, setMobListPage] = useState(1);
  const [mobListTotal, setMobListTotal] = useState(0);
  const [isVulnFilter, setIsVulnFilter] = useState(false);
  const [vuln, setVuln] = useState("");

  let backEnd = "http://l2-informer/backend";

  const [mobListUrl, setMobListUrl] = useState(`${backEnd}/mobs?`);
  const [mobType, setMobType] = useState(mobTypes.all);

  const fetchMobList = () => {
    fetch(`${mobListUrl}page=${mobListPage}&type=${mobType}`)
      .then((response) => {
        let fullMobListUrl = `${mobListUrl}page=${mobListPage}&type=${mobType}`;
        console.log(fullMobListUrl);
        return response.json();
      })
      .then((data) => {
        setMobs(data.response);
        setMobListPage(data.pagination.currentPage);
        setMobListTotal(data.pagination.total);
      });
  };

  // let backEnd = 'http://localhost:3001'
  // const [mobListUrl, setMobListUrl] = useState(`${backEnd}/allmobs`)
  // const fetchMobList = (mobListUrl,mobListPage) => {
  //   fetch(`${mobListUrl}/${mobListPage}`)
  //   .then(response => {
  //     console.log(response)
  //     return response.json();
  //   })
  //   .then(data => {
  //     setMobs(data.response.data)
  //     setMobListPage(data.response.pagination.currentPage)
  //     setMobListTotal(data.response.pagination.total)
  //   })
  // }

  const handleMoreMobs = () => {
    fetch(`${mobListUrl}page=${+mobListPage + 1}&type=${mobType}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMobs((prevMobs) => prevMobs.concat(data.response));
        setMobListPage(data.pagination.currentPage);
      });
  };

  useEffect(() => {
    fetchMobList();
  }, [mobType]);

  const AllNPCsHandler = () => {
    setMobListPage(1);
    setMobType(mobTypes.all);
  };
  const MobsHandler = () => {
    setMobListPage(1);
    setMobType(mobTypes.mobs);
    // setMobs(NPCs.filter(item => item.TYPE === 'L2Monster'))
  };
  const BossesHandler = () => {
    setMobListPage(1);
    setMobType(mobTypes.bosses);
  };
  const NPCsHandler = () => {
    setMobListPage(1);
    setMobType(mobTypes.npcs);
  };

  const handleAllVuln = () => {
    setIsVulnFilter(false);
    setVuln("");
  };
  const handleFireVuln = () => {
    setIsVulnFilter(true);
    setVuln("4279");
  };

  return (
    <Container>
      <Col className="container col-12">
        <h1 className="col-12">L2-Informer</h1>
        <Row className="p-2 justify-content-around  text-center">
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
            <ButtonGroup>
              <Button variant="secondary" onClick={handleAllVuln}>
                All
              </Button>
              <Button variant="secondary">Bow</Button>
              <Button variant="secondary">Blunt</Button>
              <Button variant="secondary">Sword</Button>
              <Button variant="secondary">Dagger</Button>
              <Button variant="secondary">Dual Fist</Button>
              <Button variant="secondary" onClick={handleFireVuln}>
                Fire
              </Button>
              <Button variant="secondary">Water</Button>
              <Button variant="secondary">Wind</Button>
              <Button variant="secondary">Earth</Button>
              <Button variant="secondary">Dark</Button>
              <Button variant="secondary">Holy</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <div className="row flex-row mh-100">
          <InfiniteScroll
            dataLength={mobs.length}
            next={handleMoreMobs}
            hasMore={mobListTotal > mobs.length}
            loader={<h4>Loading...</h4>}
          >
            <MobList mobs={mobs} />
          </InfiniteScroll>
        </div>
      </Col>
    </Container>
  );
}

export default App;
