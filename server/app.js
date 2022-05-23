const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const db = require("./db/mobSearch")
const cors = require("cors")


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors())

PORT = 3001

app.get('/npcs/:page', async (req,res)=> {
    let page = 1
    try{
        page = + req.params.page
    }
    catch{
        console.log('Something went wrong')
    }

    const response = await db.getNPCs()
    .paginate({perPage: 50, currentPage: page, isLengthAware:true})

    res.status(200).json({response})
});

app.get('/bosses/:page', async (req,res)=> {
    let page = 1
    try{
        page = + req.params.page
    }
    catch{
        console.log('Something went wrong')
    }

    const response = await db.getBosses()
    .paginate({perPage: 50, currentPage: page, isLengthAware:true})

    res.status(200).json({response})
});

app.get('/allmobs/:page', async (req,res)=> {
    let page = 1
    try{
        page = + req.params.page
    }
    catch{
        console.log(`Something went wrong when requesting: ${page}`)
    }

    const response = await db.getAllMobs()
    .paginate({perPage: 50, currentPage: page, isLengthAware:true})

    res.status(200).json({response})
});

app.get('/mobs/:page', async (req,res)=> {
    let page = 1
    try{
        page = + req.params.page
    }
    catch{
        console.log('Something went wrong')
    }

    const response = await db.getMobs()
    .paginate({perPage: 50, currentPage: page, isLengthAware:true})

    res.status(200).json({response})
});

app.get('/mobs/:id', async (req,res)=> {
    const { id } = req.params;
    const response = await db.getMobs().where('NPC_ID',`${id}`)
    res.status(200).json({response})
})

app.get('/items/', async (req,res)=> {
    const response = await db.getItems()
    res.status(200).json({response})
})

app.get('/items/:id', async (req,res)=> {
    const { id } = req.params;
    const response = await db.getItems().where('ITEM_ID',`${id}`)
    res.status(200).json({response})
})

app.get('/drop/item/:id', async (req,res)=>{
    const { id } = req.params;
    const response = await db.getItemDrop().where('ITEM_ID',`${id}`)
    res.status(200).json({response})
})

app.get('/drop/npc/:id', async (req,res)=>{
    const { id } = req.params;
    const response = await db.getMobDrop().where('NPC_ID',`${id}`)
    res.status(200).json({response})
})




app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});