import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import React, { useState } from "react";
import FormCheck from "react-bootstrap/FormCheck";
import Row from "react-bootstrap/Row";

function WeakpointBar(props) {
  const [weakpointSel, setWeakpointSel] = useState("Select");

  const handleWeakpointSelect = (event) => {
    props.onWeakpointSelect(event.target.id);
    setWeakpointSel(event.target.text);
  };

  const setIsUndead = props.setIsUndead;

  const handleUndead = (event) => {
    event.target.checked == true ? setIsUndead(1) : setIsUndead("");
  };

  return (
    <Col xs="auto" lg="3" md="auto" className="pb-1">
      <h5 className="m-2">Weak Point</h5>
      <Row className="w-100">
        <Col xs="auto" lg="6">
          <DropdownButton
            title={weakpointSel}
            className="btn-block"
            block="true"
          >
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id=""
            >
              All
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4276"
            >
              Bow
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4274"
            >
              Blunt
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4460"
            >
              Sword
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4458"
            >
              Spear
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4461"
            >
              Dagger
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4457"
            >
              Dual Fist
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4279"
            >
              Fire
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4280"
            >
              Water
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4281"
            >
              Wind
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4282"
            >
              Earth
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4450"
            >
              Shock
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4336"
            >
              Dark
            </Dropdown.Item>
            <Dropdown.Item
              variant="secondary"
              onClick={handleWeakpointSelect}
              id="4275"
            >
              Sacred
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="auto" lg="6" className="align-self-center">
          <FormCheck
            type="switch"
            className="ml-3  ms-auto"
            onChange={handleUndead}
          >
            <FormCheck.Input onChange={handleUndead} />
            <FormCheck.Label>Undead</FormCheck.Label>
          </FormCheck>
        </Col>
      </Row>
    </Col>
  );
}

export default WeakpointBar;
