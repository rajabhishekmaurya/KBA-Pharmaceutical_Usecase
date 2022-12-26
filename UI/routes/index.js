var express = require('express');
var router = express.Router();
const {clientApplication} = require('./client');
const {Events} = require('./events')
let eventClient = new Events()
eventClient.contractEventListner("producer", "Admin", "pharmachannel",
"kba-pharmaceutical", "MedicineContract", "addMedicineEvent")



/* GET home page. */
router.get('/', function(req, res, next) {
  let retailerClient = new clientApplication();
 
  retailerClient.generatedAndEvaluateTxn(
      "retailer",
      "Admin",
      "pharmachannel", 
      "kba-pharmaceutical",
      "MedicineContract",
      "queryAllMedicines"
  )
  .then(medicines => {
    const dataBuffer = medicines.toString();
    console.log("medicines are ", medicines.toString())
    const value = JSON.parse(dataBuffer)
    console.log("History DataBuffer is",value)
    res.render('index', { title: 'Pharmaceutical_Usecase', itemList: value});
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
  })
});
 
router.get('/producer', function(req, res, next) {
  let producerClient = new clientApplication();
  producerClient.generatedAndEvaluateTxn(
    "producer",
    "Admin",
    "pharmachannel",
    "kba-pharmaceutical",
    "MedicineContract",
    "queryAllMedicines"
  ).then(medicines =>{
    const data =medicines.toString();
    const value = JSON.parse(data)
    res.render('producer', { title: 'ProducerDashboard', itemList: value });
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
  })

});
router.get('/supplier', function(req, res, next) {
  res.render('supplier', { title: 'Supplier Dashboard' });
});

router.get('/event', function(req, res, next) {
  console.log("Event Response %%%$$^^$%%$",eventClient.getEvents().toString())
  var event = eventClient.getEvents().toString()
  res.send({medicineEvent: event})
  // .then(array => {
  //   console.log("Value is #####", array)
  //   res.send(array);
  // }).catch(err => {
  //   console.log("errors are ", err)
  //   res.send(err)
  // })
  // res.render('index', { title: 'Supplier Dashboard' });
});


router.get('/retailer', function(req, res, next) {
  let retailerClient = new clientApplication();
  retailerClient.generatedAndEvaluateTxn(
    "retailer",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "queryAllMedicines"
  )
  .then(medicines => {
    const dataBuffer = medicines.toString();
    console.log("medicines are ", medicines.toString())
    const value = JSON.parse(dataBuffer)
    console.log("History DataBuffer is",value)
    res.render('retailer', { title: 'Retailer Dashboard', itemList: value});
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
})});



router.get('/addMedicineEvent', async function(req, res, next) {
  let retailerClient = new clientApplication();
  const result = await retailerClient.contractEventListner("producer", "Admin", "pharmachannel", 
  "kba-pharmaceutical", "addMedicineEvent")
  console.log("The result is ####$$$$",result)
  res.render('producer', {view: "medicineEvents", results: result })
})

router.post('/manuwrite',function(req,res){

  const medicineId  = req.body.VinNumb;
  const medicineName = req.body.MedicineMedicineName;
  const DOM = req.body.DOM;
  const producerName = req.body.MedicineProducerName;

  // console.log("Request Object",req)
  let ProducerClient = new clientApplication();
  
  ProducerClient.generatedAndSubmitTxn(
      "producer",
      "Admin",
      "pharmachannel", 
      "kba-pharmaceutical",
      "MedicineContract",
      "createMedicine",
      medicineId ,medicineName,DOM,producerName
    ).then(message => {
        console.log("Message is $$$$",message)
        res.status(200).send({message: "Added Medicine"})
      }
    )
    .catch(error =>{
      console.log("Some error Occured $$$$###", error)
      res.status(500).send({error:`Failed to Add`,message:`${error}`})
    });
});

router.post('/manuread',async function(req,res){
  const QmedicineId  = req.body.QVinNumb;
  let ProducerClient = new clientApplication();
  
  ProducerClient.generatedAndEvaluateTxn( 
    "producer",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "readMedicine", QmedicineId )
    .then(message => {
      
      res.status(200).send({ Medicinedata : message.toString() });
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to Add`,message:`${error}`})
    });

 })

 //  Get History of a medicine
 router.get('/medicinehistory',async function(req,res){
  const medicineId = req.query.medicineId;
 
  let retailerClient = new clientApplication();
  
  retailerClient.generatedAndEvaluateTxn( 
    "producer",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "getMedicineHistory", medicineId).then(message => {
    const dataBuffer = message.toString();
    
    const value = JSON.parse(dataBuffer)
    res.render('history', { itemList: value , title: "Medicine History"})

  });

 })

 //Register a medicine

 router.post('/registerMedicine',async function(req,res){
  const QmedicineId  = req.body.QVinNumb;
  const MedicineOwner = req.body.medicineOwner;
  const RegistrationNumber = req.body.regNumber
  let RetailerClient = new clientApplication();
  
  RetailerClient.generatedAndSubmitTxn( 
    "retailer",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "registerMedicine", QmedicineId ,MedicineOwner,RegistrationNumber)
    .then(message => {
    
      res.status(200).send("Successfully created")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to create`,message:`${error}`})
    });

 })
// Create order
router.post('/createOrder',async function(req,res){
  const orderNumber = req.body.orderNumber;
  const medicineMedicineName = req.body.medicineMedicineName;
  const supplierName = req.body.supplierName
  let SupplierClient = new clientApplication();

  const transientData = {
    medicineName: Buffer.from(medicineMedicineName),
    supplierName: Buffer.from(supplierName)
  }
  
  SupplierClient.generatedAndSubmitPDC( 
    "supplier",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "OrderContract",
    "createOrder", orderNumber,transientData)
    .then(message => {
      
      res.status(200).send("Successfully created")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to create`,message:`${error}`})
    });

 })

 router.post('/readOrder',async function(req,res){
  const orderNumber = req.body.orderNumber;
  let SupplierClient = new clientApplication();
  SupplierClient.generatedAndEvaluateTxn( 
    "supplier",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "OrderContract",
    "readOrder", orderNumber).then(message => {
   
    res.send({orderData : message.toString()});
  }).catch(error => {
    alert('Error occured')
  })

 })

 //Get all orders
 router.get('/allOrders',async function(req,res){
  let SupplierClient = new clientApplication();
  SupplierClient.generatedAndEvaluateTxn( 
    "supplier",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "OrderContract",
    "queryAllOrders","").then(message => {
    const dataBuffer = message.toString();
    const value = JSON.parse(dataBuffer);
    res.render('orders', { itemList: value , title: "All Orders"})
    }).catch(error => {
    //alert('Error occured')
    console.log(error)
  })

 })
 //Find matching orders
 router.get('/matchOrder',async function(req,res){
  const medicineId = req.query.medicineId;
 
  let retailerClient = new clientApplication();
  
  retailerClient.generatedAndEvaluateTxn( 
    "producer",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "checkMatchingOrders", medicineId).then(message => {
    console.log("Message response",message)
    var dataBuffer = message.toString();
    var data =[];
    data.push(dataBuffer,medicineId)
    console.log("checkMatchingOrders",data)
    const value = JSON.parse(dataBuffer)
    let array = [];
    if(value.length) {
        for (i = 0; i < value.length; i++) {
            array.push({
               "orderId": `${value[i].Key}`,"medicineId":`${medicineId}`,
                "MedicineName": `${value[i].Record.medicineName}`,
                "supplierName": `${value[i].Record.supplierName}`,"assetType": `${value[i].Record.assetType}`
            })
        }
    }
    console.log("Array value is ", array)
    console.log("Medicine id sent",medicineId)
    res.render('matchOrder', { itemList: array , title: "Matching Orders"})

  });

 })

 router.post('/match',async function(req,res){
  const orderId = req.body.orderId;
  const medicineId = req.body.medicineId
  let SupplierClient = new clientApplication();
  SupplierClient.generatedAndSubmitTxn( 
    "supplier",
    "Admin",
    "pharmachannel", 
    "kba-pharmaceutical",
    "MedicineContract",
    "matchOrder", medicineId,orderId).then(message => {
   
      res.status(200).send("Successfully Matched order")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to Match Order`,message:`${error}`})
    });

 })



module.exports = router;


