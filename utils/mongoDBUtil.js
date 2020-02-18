const MongoClient = require("mongodb").MongoClient;
const {
    DB_HOST,
    DB_PORT
} = require("../globalConfig")
const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}`
let connection;
module.exports.getDBConnection = () => {
    return new Promise(async (resolve, reject) => {
        if (connection) resolve(connection);
        else {
            connection = await MongoClient.connect(DB_URL);
            resolve(connection);

        }
    });
}