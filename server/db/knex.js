const knex = require('knex');

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename:'main.db'
    }
});

module.exports = connectedKnex;