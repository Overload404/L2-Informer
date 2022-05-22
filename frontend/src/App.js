import 'bootstrap/dist/css/bootstrap.min.css'
import InfiniteScroll from 'react-infinite-scroll-component';
// import './App.css'
import React, { useEffect,useState } from 'react'
import MobList from './components/MobList';
import DropTable from './components/DropTable';
import SpoilTable from './components/SpoilTable';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

function App() {

  const [mobs, setMobs] = useState([]);
  const [drop, setDrop] = useState([]);
  const [spoil, setSpoil] = useState([])
  const [mobListUrl, setMobListUrl] = useState('http://localhost:3001/allmobs/')
  const [mobListPage, setMobListPage] = useState(1)
  const [mobListTotal, setMobListTotal] = useState(0)



  const fetchMobList = (mobListUrl,mobListPage) => {
    fetch(`${mobListUrl}${mobListPage}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      setMobs(data.response.data)
      setMobListPage(data.response.pagination.currentPage)
      setMobListTotal(data.response.pagination.total)
    })
  }

  const handleMoreMobs = () =>{
    fetch(`${mobListUrl}${(+mobListPage+1)}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      setMobs(prevMobs => (prevMobs.concat(data.response.data)))
      setMobListPage(data.response.pagination.currentPage)
    })
  }
  const fetchMoreMobs = () => {
    console.log(mobListPage)
    handleMoreMobs()
  }

  const fetchDropHandler = async (targetID) => {
    const drops =  await (await (fetch('http://localhost:3001/drop/npc/'+targetID))).json()
    let dropList = await drops.response
    const spoilList = []
    dropList.forEach(async (item)=>{
      if(item.CATEGORY < 0){
        spoilList.push(item)
      }
    })
    dropList = dropList.filter((item) => item.CATEGORY > -1)
    setSpoil(spoilList)
    setDrop(dropList)
  }
  useEffect(()=> {
    fetchMobList(mobListUrl,mobListPage)
  },[mobListUrl])

  const AllNPCsHandler=()=> {
    setMobListPage(1)
    setMobListUrl('http://localhost:3001/allmobs/')
  }
  const MobsHandler = () =>{
    setMobListPage(1)
    setMobListUrl('http://localhost:3001/mobs/')
    // setMobs(NPCs.filter(item => item.TYPE === 'L2Monster'))
  }
  const BossesHandler = () =>{
    setMobListPage(1)
    setMobListUrl('http://localhost:3001/bosses/')
  }
  const NPCsHandler = () =>{
    setMobListPage(1)
    setMobListUrl('http://localhost:3001/npcs/')
  }
  const onFilterChange = (filterValue) =>{
    console.log(filterValue)}

  return (
      <Container>
        <Col className='container col-12'>
          <h1 className='col-12'>L2-Informer</h1>
          <Container>
            <ButtonToolbar>
              <h5 className='d-flex align-self-center m-2'>Type:</h5>
              <ButtonGroup size='lg'>
                  <Button onClick={AllNPCsHandler} variant="primary">All</Button>
                  <Button onClick={MobsHandler} variant="primary">Mobs</Button>
                  <Button onClick={BossesHandler} variant="primary">Bosses</Button>
                  <Button onClick={NPCsHandler} variant="primary">NPC</Button>
              </ButtonGroup>
              <h5 className='d-flex align-self-center m-2'>Week To:</h5>
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
              loader={<h4>Loading...</h4>}>
              <MobList onItemClick = {fetchDropHandler} onFilterChange={onFilterChange} mobs={mobs}/>
              </InfiniteScroll>
              <div className='dummyWrapper'>
                <DropTable drop={drop}/>
                <SpoilTable spoil={spoil}/>
              </div>
            </div>
        </Container>
      </Col>
    </Container>
  );
}

export default App;
