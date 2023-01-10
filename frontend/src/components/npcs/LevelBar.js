import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import React, { useState } from "react";
import Stack from "react-bootstrap/Stack";
import ReactSlider from "react-slider";

function LevelBar(props) {
  const onLevelMinChange = props.onLevelMinChange;
  const onLevelMaxChange = props.onLevelMaxChange;
  const handleLevelRange = (target) => {
    onLevelMinChange(target[0]);
    onLevelMaxChange(target[1]);
  };

  return (
    <Col xs="auto" lg="3" md="auto" className="pb-1">
      <h5 className="m-2">Level</h5>
        <ReactSlider
          className="custom-slider"
          onAfterChange={handleLevelRange}
          trackClassName="custom-slider-track"
          thumbClassName="custom-slider-thumb"
          defaultValue={[0, 100]}
          ariaLabel={["Min", "Max"]}
          ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
          renderThumb={(props, state) => (
            <text {...props}>
              <br /> {state.valueNow}
            </text>
          )}
          pearling
          minDistance={0}
        />
    </Col>
  );
}

export default LevelBar;
