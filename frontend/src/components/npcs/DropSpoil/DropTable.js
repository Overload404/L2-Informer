import ListGroup from "react-bootstrap/ListGroup";

const DropTable = (props) => {
  let dropExists = props.drop !== undefined && props.drop.length !== 0;
  let spoilExists = props.spoil !== undefined && props.drop.length !== 0;
  console.log(props.drop);

  return (
    <div>
      <ListGroup>
        {dropExists &&
          props.drop.map((drop) => (
            <ListGroup.Item
              key={drop.id}
              itemID={drop.item_id}
              className="text-start"
              variant="dark"
            >
              <p>
                {" "}
                <img
                  src={`./images/${drop.icon}`}
                  alt={`${drop.name}`}
                /> Drops {drop.min}-{drop.max} {drop.name} with a{" "}
                {parseInt(drop.chance) / 10000}% chance
              </p>
            </ListGroup.Item>
          ))}
        {spoilExists &&
          props.spoil.map((spoil) => (
            <ListGroup.Item
              key={spoil.id}
              itemID={spoil.item_id}
              className="text-start"
              variant="dark"
            >
              <p>
                {" "}
                <img src={`./images/${spoil.icon}`} alt={`${spoil.name}`} /> Can
                be spoiled for {spoil.min}-{spoil.max} {spoil.name} with a{" "}
                {parseInt(spoil.chance) / 10000}% chance
              </p>
            </ListGroup.Item>
          ))}
      </ListGroup>
      {/* {dropExists ? (
        <Table>
          <thead>
            <tr>
              <th>Drops</th>
              <th>Amount</th>
              <th>%</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {props.drop.map((drop) => (
              <tr key={drop.id} itemID={drop.item_id}>
                <td id={drop.item_id}>{drop.name}</td>
                <td id={drop.item_id}>
                  {drop.min}-{drop.max}
                </td>
                <td id={drop.item_id}>{parseInt(drop.chance) / 10000}</td>
                <td id={drop.item_id}>{drop.CATEGORY}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <h4>No drops</h4>
      )}
      <div>
        {spoilExists ? (
          <Table>
            <thead>
              <tr>
                <th>Spoils</th>
                <th>Amount</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {props.spoil.map((spoil) => (
                <tr key={spoil.id} itemID={spoil.item_id}>
                  <td id={spoil.item_id}>{spoil.name}</td>
                  <td id={spoil.item_id}>
                    {spoil.min}-{spoil.max}
                  </td>
                  <td id={spoil.item_id}>{parseInt(spoil.chance) / 10000}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h4>Aaaaaaaaand... Nothing can be spoiled.</h4>
        )}
      </div> */}
    </div>
  );
};

export default DropTable;
