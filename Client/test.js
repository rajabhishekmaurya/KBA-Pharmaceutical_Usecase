const { clientApplication } = require('./client')

let ProducerClient = new clientApplication();

ProducerClient.generateAndSubmitTxn(
    "producer",
    "User1",
    "pharmachannel",
    "kba-pharmaceutical",
    "MedicineContract",
    "invokeTxn",
    "",
    "createMedicine",
    "Medicine-10",
    "Hatchback",
    "21/07/2021",
    "1"
).then(message => {
    console.log(message.toString());
})
