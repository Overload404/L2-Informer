const knex = require('./knex')
const { attachPaginate } = require('knex-paginate');
attachPaginate();

// MOBS
const getAllMobs = () => {
    return knex.select().from('mobsnpcid')
    .whereIn('TYPE',['L2RaidBoss', 'L2GrandBoss','L2Npc','L2Monster','L2Chest','L2Teleporter', 'L2RiftInvader'])
}
const getMobs = () => {
    return knex.select().from('mobsnpcid')
    .whereIn('TYPE',['L2Monster','L2Chest','L2RiftInvader'])
}
const getBosses = () => {
    return knex.select().from('mobsnpcid')
    .whereIn('TYPE',['L2RaidBoss', 'L2GrandBoss'])
}
const getNPCs = () => {
    return knex.select().from('mobsnpcid')
    .whereIn('TYPE',['L2Teleporter','L2Npc'])
}

//ITEMS
const getItems = () =>{
    return knex.select().from('items')
}

//DROP
const getMobDrop = () =>{
    return knex.select(['droplist.*', 'NAME'])
    .from('droplist')
    .innerJoin('items', 'items.ITEM_ID', "droplist.ITEM_ID")
}

const getItemDrop = () =>{
    return knex.select()
    .from('droplist')
    .innerJoin('mobsnpcid', 'mobsnpcid.NPC_ID', "droplist.NPC_ID")
}

module.exports = {
    getMobs,
    getAllMobs,
    getItems,
    getMobDrop,
    getItemDrop,
    getBosses,
    getNPCs,
}

// 'SELECT mobsnpcid.NPC_NAME AS Name, mobsnpcid.NPC_LEVEL as lvl, mobsnpcid.NPC_ID as NPCID FROM mobsnpcid WHERE mobsnpcid.TYPE = "L2Monster"'