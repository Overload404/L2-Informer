import ListGroup from "react-bootstrap/ListGroup";

const DropTable = (props) => {
  let dropExists = props.drop !== undefined && props.drop.length !== 0;
  let spoilExists = props.spoil !== undefined && props.drop.length !== 0;
  console.log(props.spoil);

  return (
    <div>
      <ListGroup>
        {dropExists &&
          props.drop.map((drop) => (
            <ListGroup.Item
              key={drop.ID}
              itemID={drop.ITEM_ID}
              className="text-start"
            >
              <p>
                {" "}
                <img
                  src={`./images/${drop.ICON}`}
                  alt={`${drop.NAME}`}
                /> Drops {drop.MIN}-{drop.MAX} {drop.NAME} with a{" "}
                {parseInt(drop.CHANCE) / 10000}% chance
              </p>
            </ListGroup.Item>
          ))}
        {spoilExists &&
          props.spoil.map((spoil) => (
            <ListGroup.Item
              key={spoil.ID}
              itemID={spoil.ITEM_ID}
              className="text-start"
            >
              <p>
                {" "}
                <img src={`./images/${spoil.ICON}`} alt={`${spoil.NAME}`} /> Can
                be spoiled for {spoil.MIN}-{spoil.MAX} {spoil.NAME} with a{" "}
                {parseInt(spoil.CHANCE) / 10000}% chance
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
              <tr key={drop.ID} itemID={drop.ITEM_ID}>
                <td id={drop.ITEM_ID}>{drop.NAME}</td>
                <td id={drop.ITEM_ID}>
                  {drop.MIN}-{drop.MAX}
                </td>
                <td id={drop.ITEM_ID}>{parseInt(drop.CHANCE) / 10000}</td>
                <td id={drop.ITEM_ID}>{drop.CATEGORY}</td>
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
                <tr key={spoil.ID} itemID={spoil.ITEM_ID}>
                  <td id={spoil.ITEM_ID}>{spoil.NAME}</td>
                  <td id={spoil.ITEM_ID}>
                    {spoil.MIN}-{spoil.MAX}
                  </td>
                  <td id={spoil.ITEM_ID}>{parseInt(spoil.CHANCE) / 10000}</td>
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
