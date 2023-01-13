import Col from "react-bootstrap/Col";
import React from "react";
import ReactSlider from "react-slider";

function LevelBar(props) {
  const onLevelMinChange = props.onLevelMinChange;
  const onLevelMaxChange = props.onLevelMaxChange;
  const handleLevelRange = (target) => {
    onLevelMinChange(target[0]);
    onLevelMaxChange(target[1]);
  };

  return (
    <Col lg="6" xl="3" md="6" sm="12" className="pb-1">
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
          <p {...props}>
            <br /> {state.valueNow}
          </p>
        )}
        pearling
        minDistance={0}
      />
    </Col>
  );
}

export default LevelBar;
