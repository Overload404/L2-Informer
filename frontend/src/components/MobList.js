import Card from "react-bootstrap/Card"
import CardGroup from "react-bootstrap/CardGroup"
import Button from "react-bootstrap/Button"
const MobTable = (props) =>{
    
    const passClickedID = (event) =>{
        props.onItemClick(event.target.id)
    }



    return(
        <div>
            <div className="mobTable">
                        {props.mobs.map((mob)=> (
                            <Card className="text-center m-4"onClick = {passClickedID} key = {mob.NPC_ID} id={mob.NPC_ID}>
                                <Card.Header id={mob.NPC_ID}>{mob.NPC_TITLE}</Card.Header>
                                <Card.Body>
                                    <Card.Title id={mob.NPC_ID}>{mob.NPC_NAME}</Card.Title>
                                    <Card.Text>
                                    Level: {mob.NPC_LEVEL}
                                    </Card.Text>
                                    <Button variant="info" className="m-2">Info</Button>
                                    <Button variant="warning" className="m-2">Show On Map</Button>
                                </Card.Body>
                                <Card.Footer className="text-muted" id={mob.NPC_ID}>ID: {mob.NPC_ID}</Card.Footer>
                            </Card>
                        ))}
            </div>
        </div>)
    }

export default MobTable