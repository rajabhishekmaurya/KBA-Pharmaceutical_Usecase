const { clientApplication } = require('./client')

let supplierClient = new clientApplication()

supplierClient.generateAndSubmitTxn(
    "supplier",
    "Admin",
    "pharmachannel",
    "kba-pharmaceutical",
    "OrderContract",
    "queryTxn",
    "",
    "readOrder",
    "Order-06"
).then(message => {
    console.log(message.toString())
})