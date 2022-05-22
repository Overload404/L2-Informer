

const DropTable = (props) => {
    return (
        <div className='dropTable'>
        <table>
        <thead>
            <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>%</th>
            <th>Group</th>
            </tr>
        </thead>
        <tbody>

        {props.drop.map((drop)=> (
            <tr key = {drop.ID} itemID={drop.ITEM_ID}>
            <td id={drop.ITEM_ID}>{drop.NAME}</td>
            <td id={drop.ITEM_ID}>{drop.MIN}-{drop.MAX}</td>
            <td id={drop.ITEM_ID}>{parseInt(drop.CHANCE)/10000}</td>
            <td id={drop.ITEM_ID}>{drop.CATEGORY}</td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        )}


export default DropTable