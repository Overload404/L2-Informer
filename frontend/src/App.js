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

  let backEnd = "http://l2-informer/backend";
  const [mobListUrl, setMobListUrl] = useState(`${backEnd}/mobs`);
  const [mobType, setMobType] = useState(mobTypes.all);

  const fetchMobList = (mobListUrl, mobListPage) => {
    fetch(`${mobListUrl}?page=${mobListPage}&type=${mobType}`)
      .then((response) => {
        console.log(response);
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
    fetch(`${mobListUrl}${+mobListPage + 1}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMobs((prevMobs) => prevMobs.concat(data.response.data));
        setMobListPage(data.response.pagination.currentPage);
      });
  };
  const fetchMoreMobs = () => {
    console.log(mobListPage);
    handleMoreMobs();
  };

  useEffect(() => {
    fetchMobList(mobListUrl, mobListPage);
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
  const onFilterChange = (filterValue) => {
    console.log(filterValue);
  };

  return (
    <Container>
      <Col className="container col-12">
        <h1 className="col-12">L2-Informer</h1>
        <Container>
          <ButtonToolbar>
            <h5 className="d-flex align-self-center m-2">Type:</h5>
            <ButtonGroup size="lg">
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
            <h5 className="d-flex align-self-center m-2">Week To:</h5>
            <ButtonGroup>
              <Button>All</Button>
              <Button>Bow</Button>
              <Button>Blunt</Button>
              <Button>Sword</Button>
              <Button>Dagger</Button>
              <Button>Dual Fist</Button>
              <Button>Fire</Button>
              <Button>Water</Button>
              <Button>Wind</Button>
              <Button>Earth</Button>
              <Button>Dark</Button>
              <Button>Holy</Button>
            </ButtonGroup>
          </ButtonToolbar>
          <div className="row flex-row mh-100">
            <InfiniteScroll
              dataLength={mobs.length}
              next={fetchMoreMobs}
              hasMore={mobListTotal > mobs.length}
              loader={<h4>Loading...</h4>}
            >
              <MobList mobs={mobs} />
            </InfiniteScroll>
          </div>
        </Container>
      </Col>
    </Container>
  );
}

export default App;
