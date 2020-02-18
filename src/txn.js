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
module.exports.getTxn = async (txnHash) => {
    try {

        let txn = await client.getRawTransaction(txnHash, true);
        return txn;
    } catch (err) {
        console.error("Error occured while getting txn details for", txnHash, " ", err)
    }
}
