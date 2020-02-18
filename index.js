const {
    START_BLOCK,
    SIZE,
    DB_NAME,
    DB_BLOCKS_COLLECTION,
    DB_TXNS_COLLECTION

} = require('./globalConfig');
const { getBlock } = require("./src/block");
const { getTxn } = require('./src/txn')
const mongoDBUtil = require('./utils/mongoDBUtil');
const async = require('async')

function processBlocks(blockNos, dbConnection) {
    let block;
    let txnHashes;
    let txn;
    return new Promise((resolve, reject) => {
        async.eachOfSeries(blockNos, async (blockNo, index, callback1) => {
            try {
                block = await getBlock(blockNo)
                await dbConnection.db(DB_NAME).collection(DB_BLOCKS_COLLECTION).insertOne(block)
                console.info("Success Block:", blockNo)
            } catch (err) {
                console.error(`Error processing block ${blockNo}, reason:`, err)
            }
            txnHashes = block.tx
            console.log("\t No. of txns: ", txnHashes.length)

            async.eachOfSeries(txnHashes, async (txnHash, index, callback2) => {
                try {
                    txn = await getTxn(txnHash);
                    txn["height"] = blockNo;
                    txn["txnIndex"] = index;
                    let value = 0;
                    (txn.vout).forEach(out => {
                        value += out.value;
                    });
                    txn["value"] = value;
                    dbConnection.db(DB_NAME).collection(DB_TXNS_COLLECTION).insertOne(txn)
                    .then((result) => {
                        console.log("\t Transaction index: ", index)
                        callback2;
                    })
                } catch (err) {
                    console.error(`Error while processing transaction ${txnHash} of block ${blockNo}: Reason`, err)
                    callback2;
                }
            }, async (err) => {
                await delay(1000);
                callback1;
            });
        }, (err) => {
            resolve(true);
        });
    });
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

mongoDBUtil.getDBConnection().then((dbConnection) => {
    const blockNos = [...Array(SIZE).keys()].map(i => START_BLOCK + i);
    processBlocks(blockNos, dbConnection).then((result) => {
        if (result) {
            dbConnection.close()
            console.log(`Processing Done ${START_BLOCK} to ${START_BLOCK}+${SIZE}`);
        }
    })
})


