const { EventListener } = require('./events')

let ProducerEvent = new EventListener();
ProducerEvent.contractEventListener("producer", "Admin", "pharmachannel",
    "kba-pharmaceutical", "MedicineContract", "addMedicineEvent");
