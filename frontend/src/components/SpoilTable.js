const SpoilTable = (props) => {
    return(
        <div className="h-50">
          <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
              {props.spoil.map((spoil)=> (
                  <tr key = {spoil.ID} itemID={spoil.ITEM_ID}>
                  <td id={spoil.ITEM_ID}>{spoil.NAME}</td>
                  <td id={spoil.ITEM_ID}>{spoil.MIN}-{spoil.MAX}</td>
                  <td id={spoil.ITEM_ID}>{parseInt(spoil.CHANCE)/10000}</td>
                  </tr>
              ))}
              </tbody>
          </table>
          </div>
    )
}

export default SpoilTable

