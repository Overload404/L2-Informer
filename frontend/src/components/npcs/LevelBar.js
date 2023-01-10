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
    <Col xs="auto" lg="2" md="auto" className="pb-1">
      <h5 className="m-2">Level</h5>
      <div className="custom-range">
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
      </div>

      {/* <Stack direction="horizontal">
        <DropdownButton title={levelSel} className="btn-block" block="true">
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 1, maxlevel = 10 )}
            >
            1 - 10
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 11, maxlevel = 20 )}
            >
            11 - 20
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 21, maxlevel = 30 )}
            >
            21 - 30
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 31, maxlevel = 40 )}
            >
            31 - 40
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 41, maxlevel = 50 )}
            >
            41 - 50
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 51, maxlevel = 60 )}
            >
            51 - 60
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 61, maxlevel = 70 )}
            >
            61 - 70
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 71, maxlevel = 80 )}
            >
            71 - 80
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 81, maxlevel = 90 )}
            >
            81 - 90
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={()=>handleLevelSelect(minlevel = 911, maxlevel = 100 )}
            >
            91 - 100
            </Dropdown.Item>
            <Dropdown.Item
            variant="secondary"
            onSelect={}
            >
            Custom
            </Dropdown.Item>
        </DropdownButton> */}

      {/* </Stack> */}
    </Col>
  );
}

export default LevelBar;
