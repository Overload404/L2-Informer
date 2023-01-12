import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import MobTab from "./components/npcs/MobTab";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"

function App() {

  const [activeTab, setActiveTab] = useState("npcs")

  const handleTabSwitch = (event) => {
    setActiveTab(event.target.value)
  }

  return (
    <Container className="min-vh-100 bg-dark text-light rounded border">
      <Row className="d-flex flex-wrap justify-content-sm-center justify-content-md-start"> 
        <Col xs="auto" md="1" className="ml-4 mr-4">
          <h1 className="bg-dark">
            <img
              src="./l2tldr-logo-dark-theme.png"
              alt="logo"
              width={100}
              height={100}
            />
          </h1>
        </Col>
        <Col xs="auto" md-col className="d-flex flex-wrap justify-content-md-start align-items-center justify-content-sm-center border rounded m-2 p-1 pr-3 pl-3">
            <Button onClick={handleTabSwitch} value="npcs">NPCs</Button>
            <Button onClick={handleTabSwitch} value="items">Items</Button>
            <Button onClick={handleTabSwitch} value="traders">Traders</Button> 
            <Button onClick={handleTabSwitch} value="quests">Quests</Button>
            <Button onClick={handleTabSwitch} value="manor">Manor</Button>
            <Button onClick={handleTabSwitch} value="craft">Craft</Button>
            <Button onClick={handleTabSwitch} value="sets">Sets</Button> 
            <Button onClick={handleTabSwitch} value="skills">Skills</Button> 
            
        </Col>
      </Row>
  
      {activeTab == "npcs" && <MobTab />}
    </Container>
  );
}

export default App;
