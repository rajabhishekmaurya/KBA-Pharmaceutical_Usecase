const { EventListener } = require('./events')

let ProducerEvent = new EventListener();
ProducerEvent.txnEventListener("producer", "Admin", "pharmachannel",
    "kba-pharmaceutical", "orderContract", "createMedicine",
    "medicine009", "xxxx20", "11/05/2021", "xxxxzx");
