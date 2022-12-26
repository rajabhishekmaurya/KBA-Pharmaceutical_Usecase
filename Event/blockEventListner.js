const { EventListener } = require('./events')

let ProducerEvent = new EventListener();
ProducerEvent.blockEventListener("producer", "Admin", "pharmachannel");
