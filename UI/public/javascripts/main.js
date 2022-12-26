
function toManuDash() {
    window.location.href='/producer';
}

function swalBasic(data) {
    swal.fire({
        // toast: true,
        icon: `${data.icon}`,
        title: `${data.title}`,
        animation: true,
        position: 'center',
        showConfirmButton: true,
        footer: `${data.footer}`,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
        }
    })
}

// function swalDisplay(data) {
//     swal.fire({
//         // toast: true,
//         icon: `${data.icon}`,
//         title: `${data.title}`,
//         animation: false,
//         position: 'center',
//         html: `<h3>${JSON.stringify(data.response)}</h3>`,
//         showConfirmButton: true,
//         timer: 3000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//             toast.addEventListener('mouseenter', swal.stopTimer)
//             toast.addEventListener('mouseleave', swal.resumeTimer)
//         }
//     }) 
// }

function reloadWindow() {
    window.location.reload();
}

function ManWriteData(){
    event.preventDefault();
    const medicineId  = document.getElementById('medicineId Number').value;
    const medicineName = document.getElementById('medicineMedicineName').value;

    const dom = document.getElementById('dom').value;
    const producerName = document.getElementById('manName').value;
    console.log(medicineId +medicineName+dom+producerName);

    if (medicineId .length==0||medicineName.length==0||dom.length==0||producerName.length==0) {
        const data = {
            title: "You might have missed something",
            footer: "Enter all mandatory fields to add a new medicine",
            icon: "warning"
        }
        swalBasic(data);
        }
    else{
        fetch('/manuwrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({VinNumb: medicineId , MedicineMedicineName: medicineName, DOM: dom, MedicineProducerName: producerName})
        })
        .then(function(response){
            if(response.status == 200) {
                const data = {
                    title: "Success",
                    footer: "Added a new medicine",
                    icon: "success"
                }
                swalBasic(data);
            } else {
                const data = {
                    title: `Medicine with Vin Number ${medicineId } already exists`,
                    footer: "Vin Number must be unique",
                    icon: "error"
                }
                swalBasic(data);
            }

        })
        .catch(function(error){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);
        })    
    }
}
function ManQueryData(){

    event.preventDefault();
    const QmedicineId  = document.getElementById('QueryVinNumbMan').value;
    
    console.log(QmedicineId );

    if (QmedicineId .length==0) {
        const data = {
            title: "Enter a Valid QmedicineId  Number",
            footer: "This is a mandatory field",
            icon: "warning"
        }
        swalBasic(data)  
    }
    else{
        fetch('/manuread',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QVinNumb: QmedicineId })
        })
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function (Medicinedata){
            dataBuf = Medicinedata["Medicinedata"]
            swal.fire({
                // toast: true,
                icon: `success`,
                title: `Current status of medicine with QmedicineId  ${QmedicineId } :`,
                animation: false,
                position: 'center',
                html: `<h3>${dataBuf}</h3>`,
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            }) 
        })
        .catch(function(error){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);        
        })    
    }
}

//Method to get the history of an item
function getMedicineHistory(medicineId) {
    console.log("postalId", medicineId)
    window.location.href = '/medicinehistory?medicineId=' + medicineId;
}

function getMatchingOrders(medicineId) {
    console.log("medicineId",medicineId)
    window.location.href = 'matchOrder?medicineId=' + medicineId;
}

function RegisterMedicine(){
    console.log("Entered the register function")
    event.preventDefault();
    const QVinNumb = document.getElementById('QVinNumb').value;
    const medicineOwner = document.getElementById('medicineOwner').value;
    const regNumber = document.getElementById('regNumber').value;
    console.log(QVinNumb+medicineOwner+regNumber);

    if (QVinNumb.length==0||medicineOwner.length==0||regNumber.length==0) {
        const data = {
            title: "You have missed something",
            footer: "All fields are mandatory",
            icon: "warning"
        }
        swalBasic(data)   
    }
    else{
        fetch('/registerMedicine',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QVinNumb: QVinNumb, medicineOwner: medicineOwner, regNumber: regNumber})
        })
        .then(function(response){
            if(response.status === 200){
            const data = {
                title: `Registered medicine ${QVinNumb} to ${medicineOwner}`,
                footer: "Registered medicine",
                icon: "success"
            }
            swalBasic(data)
            } else {
                const data = {
                    title: `Failed to register medicine`,
                    footer: "Please try again !!",
                    icon: "error"
                }
                swalBasic(data)           
            }
        })
        .catch(function(err){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);         
        })    
    }
}

function createOrder() {
    console.log("Entered the order function")
    event.preventDefault();
    const orderNumber = document.getElementById('orderNumber').value;
    const medicineMedicineName = document.getElementById('medicineMedicineName').value;

    const supplierName = document.getElementById('supplierName').value;
    console.log(orderNumber + medicineMedicineName + supplierName);

    if (orderNumber.length == 0 || medicineMedicineName.length == 0 ||  supplierName.length == 0) {
            const data = {
                title: "You have missed something",
                footer: "All fields are mandatory",
                icon: "warning"
            }
            swalBasic(data)  
    }
    else {
        fetch('/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderNumber: orderNumber, medicineMedicineName: medicineMedicineName,supplierName: supplierName })
        })
            .then(function (response) {
                if (response.status === 200) {
                    const data = {
                        title: `Order is created`,
                        footer: "Raised Order",
                        icon: "success"
                    }
                    swalBasic(data)

                } else {
                    const data = {
                        title: `Failed to create order`,
                        footer: "Please try again !!",
                        icon: "error"
                    }
                    swalBasic(data)                  }
            })
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);               
            })
    }
}

function readOrder() {
    console.log("Entered the order function")
    event.preventDefault();
    const orderNumber = document.getElementById('ordNum').value;
    
    console.log(orderNumber );

    if (orderNumber.length == 0) {
        const data = {
            title: "Enter a order number",
            footer: "Order Number is mandatory",
            icon: "warning"
        }
        swalBasic(data)     
    }
    else {
        fetch('/readOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderNumber: orderNumber})
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (orderData){
                dataBuf = orderData["orderData"]
                swal.fire({
                    // toast: true,
                    icon: `success`,
                    title: `Current status of Order : `,
                    animation: false,
                    position: 'center',
                    html: `<h3>${dataBuf}</h3>`,
                    showConfirmButton: true,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer)
                        toast.addEventListener('mouseleave', swal.resumeTimer)
                    }
                })           
            })
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);              
            })
    }
}

function matchOrder(orderId,medicineId) {
    if (!orderId|| !medicineId) {
        const data = {
            title: "Enter a order number",
            footer: "Order Number is mandatory",
            icon: "warning"
        }
        swalBasic(data)   
    } else {
        fetch('/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId,medicineId})
        })
            .then(function (response) {
                if (response.status === 200) {
                    const data = {
                        title: `Order matched successfully`,
                        footer: "Order matched",
                        icon: "success"
                    }
                    swalBasic(data)
                } else {
                    const data = {
                        title: `Failed to match order`,
                        footer: "Please try again !!",
                        icon: "error"
                    }
                    swalBasic(data)                 }
            })
            
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);  
            })
    }
}


function allOrders() {
    window.location.href='/allOrders';
}


function getEvent() {
    fetch('/event', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log("Response is ###",response)
            return response.json()
        })
        .then(function (event) {
            dataBuf = event["medicineEvent"]
            swal.fire({
                toast: true,
                // icon: `${data.icon}`,
                title: `Event : `,
                animation: false,
                position: 'top-right',
                html: `<h5>${dataBuf}</h5>`,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            }) 
        })
        .catch(function (err) {
            swal.fire({
                toast: true,
                icon: `error`,
                title: `Error`,
                animation: false,
                position: 'top-right',
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            })        
        })
}