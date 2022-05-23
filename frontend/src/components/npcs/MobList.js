import DropTable from "./DropSpoil/DropTable"
import Card from "react-bootstrap/Card"
import Collapse  from "react-bootstrap/Collapse"
import CardGroup from "react-bootstrap/CardGroup"
import Button from "react-bootstrap/Button"
import { useEffect, useState } from 'react'
import Container from "react-bootstrap/esm/Container"
const MobTable = (props) =>{

    const [drop, setDrop] = useState([{"NAME":"Nothing"}]);
    const [spoil, setSpoil] = useState([])
    const [clickedNPC, setClickedNPC] = useState('')

    const testHandler= (event)=>{
        setClickedNPC(event.target.id)
        console.log(clickedNPC)
    }

    const fetchDropHandler = async (event) => {
        event.persist()
        console.log(clickedNPC)
        let dropList = []
        try{
        const drops =  await (await (fetch(`http://localhost:3001/drop/npc/${event.target.id}`))).json()
        dropList = await drops.response
        setClickedNPC(event.target.id)
        }
    catch{
        console.log('Something went wrong')
        }
        const spoilList = []
        dropList.forEach(async (item)=>{
          if(item.CATEGORY < 0){
            spoilList.push(item)
          }
        })
        dropList = dropList.filter((item) => item.CATEGORY > -1)
        if(await dropList.length === 0){
            setDrop([{"NAME":"Nothing"}])
        }
        if(await spoilList.length === 0){
            setSpoil([{"NAME":"Nothing"}])
        }
        setSpoil(spoilList)
        setDrop(dropList)
        console.log(spoilList.length)
      }

    return(
        <div>
            <div className="mobTable">
                        {props.mobs.map((mob)=> (
                            <Card className="text-center m-4" key = {mob.NPC_ID} id={mob.NPC_ID}>
                                <Card.Header>{mob.NPC_TITLE}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{mob.NPC_NAME}</Card.Title>
                                    <Card.Text>
                                    Level: {mob.NPC_LEVEL}
                                    </Card.Text>
                                    <Button variant="success" className="m-2" onClick={fetchDropHandler} id={mob.NPC_ID}>Show Drop/Spoil</Button>
                                    <Button variant="info" className="m-2" id={mob.NPC_ID}>Info</Button>
                                    <Button variant="warning" className="m-2" id={mob.NPC_ID}>Show On Map</Button>
                                </Card.Body>
                                <Collapse in={clickedNPC == mob.NPC_ID} mountOnEnter={true} unmountOnExit={true} timeout={300}>
                                    <Container>
                                        <DropTable drop={drop} spoil={spoil}/>
                                    </Container>
                                </Collapse>
                                <Card.Footer className="text-muted" id={mob.NPC_ID}>ID: {mob.NPC_ID}</Card.Footer>
                            </Card>
                        ))}
            </div>
        </div>)
    }

export default MobTable