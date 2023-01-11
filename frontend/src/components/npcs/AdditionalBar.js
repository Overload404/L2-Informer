import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormCheck from "react-bootstrap/FormCheck";

function AdditionalBar(props) {
  const setNotOnMap = props.setNotOnMap;

  const handleNotOnMap = (event) => {
    event.target.checked == true ? setNotOnMap(1) : setNotOnMap("");
  };

  return (
    <Col xs="auto" lg="3" md="auto" className="pb-1">
      <h5 className="m-2">Additional</h5>
      <Row className="w-100">
        <Col xs="auto" className="align-self-center">
          <FormCheck type="switch" className="ml-3  ms-auto">
            <FormCheck.Input onChange={handleNotOnMap} />
            <FormCheck.Label>Show NPCs that are not on Map</FormCheck.Label>
          </FormCheck>
        </Col>
      </Row>
    </Col>
  );
}

export default AdditionalBar;
