const { clientApplication } = require('./client');

let supplierClient = new clientApplication();
const transientData = {
     medicineName: Buffer.from('Honda'),
    supplierName: Buffer.from('XXX')
}

supplierClient.generateAndSubmitTxn(
    "supplier",
    "Admin",
    "pharmachannel",
    "kba-pharmaceutical",
    "OrderContract",
    "privateTxn",
    transientData,
    "createOrder",
    "Order-06"
).then(msg => {
    console.log(msg.toString())
});