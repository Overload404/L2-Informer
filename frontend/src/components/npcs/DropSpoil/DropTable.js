import Table from 'react-bootstrap/Table'

const DropTable = (props) => {
    let dropExists = (props.drop != undefined)
    let spoilExists = props.spoil != undefined

    
    return (
        <div>
            {dropExists ? (
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
                    {props.drop.map((drop)=> (
                        <tr key = {drop.ID} itemID={drop.ITEM_ID}>
                            <td id={drop.ITEM_ID}>{drop.NAME}</td>
                            <td id={drop.ITEM_ID}>{drop.MIN}-{drop.MAX}</td>
                            <td id={drop.ITEM_ID}>{parseInt(drop.CHANCE)/10000}</td>
                            <td id={drop.ITEM_ID}>{drop.CATEGORY}</td>
                        </tr>
                ))}
                </tbody>
            </Table>) : (<h4></h4>)
            }
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
                {props.spoil.map((spoil)=> (
                    <tr key = {spoil.ID} itemID={spoil.ITEM_ID}>
                    <td id={spoil.ITEM_ID}>{spoil.NAME}</td>
                    <td id={spoil.ITEM_ID}>{spoil.MIN}-{spoil.MAX}</td>
                    <td id={spoil.ITEM_ID}>{parseInt(spoil.CHANCE)/10000}</td>
                    </tr>
                ))}
                </tbody>
            </Table>):(<h4>Aaaaaaaaand... Nothing can be spoiled.</h4>)
            }
        </div>
        )}


export default DropTable