const { clientApplication } = require('./client')

let ProducerClient = new clientApplication()

ProducerClient.generateAndSubmitTxn(
    "producer",
    "User1",
    "pharmachannel",
    "kba-pharmaceutical",
    "MedicineContract",
    "queryTxn",
    "",
    "readMedicine",
    "Medicine-10"
).then(message => {
    console.log(message.toString())
})