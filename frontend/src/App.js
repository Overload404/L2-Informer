import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import MobTab from "./components/npcs/MobTab";

function App() {
  return (
    <Container className="bg-dark text-light rounded border">
      <h1 className="col-12 bg-dark">
        <img
          src="./l2tldr-logo-dark-theme.png"
          alt="logo"
          width={100}
          height={100}
        />
      </h1>
      <MobTab />
    </Container>
  );
}

export default App;
