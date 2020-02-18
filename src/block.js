const {
    HOST_IP,
    PORT,
    USERNAME,
    PASSWORD,
    NETWORK_NAME
} = require("./../globalConfig");
const Client = require("bitcoin-core");

const client = new Client({
    host: HOST_IP,
    network: NETWORK_NAME,
    port: PORT,
    username: USERNAME,
    password: PASSWORD
});
module.exports.getBlock = async (blockNumber) => {
    try {
        let blockHash = await client.getBlockHash(blockNumber);
        let block = await client.getBlock(blockHash);
        return block;
    } catch (err) {
        console.error("Error occured while getting block details for", blockNumber, " ", err)
    }
}