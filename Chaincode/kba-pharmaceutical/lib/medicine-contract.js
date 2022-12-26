
'use strict';

const { Contract } = require('fabric-contract-api');

class MedicineContract extends Contract {

    async medicineExists(ctx, medicineId) {
        const buffer = await ctx.stub.getState(medicineId);
        return (!!buffer && buffer.length > 0);
    }

    async createMedicine(ctx, medicineId, medicineName, dateOfManufacture, producerName) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'producer-pharma-com') {
            const exists = await this.medicineExists(ctx, medicineId);
            if (exists) {
                throw new Error(`The medicine ${medicineId} already exists`);
            }
            const asset = {
                medicineName,
                dateOfManufacture,
                status: 'In Factory',
                ownedBy: producerName,
                assetType: 'medicine'
            };
            const buffer = Buffer.from(JSON.stringify(asset));
            await ctx.stub.putState(medicineId, buffer);
            let addMedicineEventData = { Type: 'Medicine creation' };
            await ctx.stub.setEvent('addMedicineEvent', Buffer.from(JSON.stringify(addMedicineEventData)));

        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }


    }

    async readMedicine(ctx, medicineId) {
        const exists = await this.medicineExists(ctx, medicineId);
        if (!exists) {
            throw new Error(`The medicine ${medicineId} does not exist`);
        }
        const buffer = await ctx.stub.getState(medicineId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }


    async deleteMedicine(ctx, medicineId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'producer-pharma-com') {
            const exists = await this.medicineExists(ctx, medicineId);
            if (!exists) {
                throw new Error(`The medicine ${medicineId} does not exist`);
            }
            await ctx.stub.deleteState(medicineId);
        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }

    }
    async queryAllMedicines(ctx){
        const queryString={
            selector:{
                assetType:'medicine'
            },
            sort:[{dateOfManufacture:'asc'}]
        }
        let resultIterator=await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result=await this.getAllResults(resultIterator)
        return JSON.stringify(result)
    }

    async getMedicineHistory(ctx,medicineId){
        let resultIterator=await ctx.stub.getHistoryForKey(medicineId)
        let result=await this.getAllResults(resultIterator,true)
        return JSON.stringify(result)
    }

    async getAllResults(iterator,isHistory){
        let allResult=[]
        for(let res=await iterator.next();!res.done;res=await iterator.next()){
            if(res.value&& res.value.value.toString()){
            let jsonRes={}
            if(isHistory&&isHistory==true){
                jsonRes.TxId=res.value.txId 
                jsonRes.timestamp=res.value.timestamp
                jsonRes.Record=JSON.parse(res.value.value.toString())
            }
            else{
            jsonRes.Key=res.value.key 
            jsonRes.Record=JSON.parse(res.value.value.toString())
            }
            allResult.push(jsonRes)
        }
    }
    await iterator.close()
    return allResult
}

async getMedicinesByRange(ctx,startkey,endkey){
    let resultIterator=await ctx.stub.getStateByRange(startkey,endkey)
    let result=await this.getAllResults(resultIterator,false)
    return JSON.stringify(result)   
}

async getMedicinesWithPagination(ctx,_pageSize,_bookMark){
    const queryString={
        selector:{
            assetType:'medicine'
        }
        
    }
    const pageSize=parseInt(_pageSize,10)
    const bookMark=_bookMark
    const {iterator,metadata}=await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString),pageSize,bookMark)
    let result=await this.getAllResults(iterator,false)
    let results={};
    results.Result=result
    results.ResponseMetaData={
        RecordCount:metadata.feached_records_count,
        Bookmark:metadata.bookmark
    }
    return JSON.stringify(results)
}

/*
async checkMatchingOrders(ctx, medicineId) {
    const exists = await this.medicineExists(ctx, medicineId);
    if (!exists) {
        throw new Error(`The medicine ${medicineId} does not exist`);
    }
    const medicineBuffer = await ctx.stub.getState(medicineId);
    const medicineDetails = JSON.parse(medicineBuffer.toString());

    const queryString = {
        selector: {
            assetType: 'order',
            medicineName: medicineDetails.medicineName
        },
    };

    const orderContract = new OrderContract();
    // const orders = await this.queryAllOrders(
    const orders = await orderContract.queryAllOrders(
        ctx,
        JSON.stringify(queryString)
    );

    return orders;
}



async matchOrder(ctx, medicineId, orderId) {
    const orderContract = new OrderContract();

    const medicineDetails = await this.readMedicine(ctx, medicineId);
    const orderDetails = await orderContract.readOrder(ctx, orderId);

    if (
        orderDetails.medicineName === medicineDetails.medicineName ) {
        medicineDetails.ownedBy = orderDetails.retailerName;
        medicineDetails.status = 'Assigned to a Dealer';

        const newMedicineBuffer = Buffer.from(JSON.stringify(medicineDetails));
        await ctx.stub.putState(medicineId, newMedicineBuffer);

        await orderContract.deleteOrder(ctx, orderId);
        return `Medicine ${medicineId} is assigned to ${orderDetails.retailerName}`;
    } else {
        return 'Order is not matching';
    }
}

*/

async registerMedicine(ctx, medicineId, ownerName, registrationNumber) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID === 'retailer-pharma-com') {
        const exists = await this.medicineExists(ctx, medicineId);
        if (!exists) {
            throw new Error(`The medicine ${medicineId} does not exist`);
        }

        const medicineBuffer = await ctx.stub.getState(medicineId);
        const medicineDetails = JSON.parse(medicineBuffer.toString());

        medicineDetails.status = `Registered to ${ownerName} with plate number ${registrationNumber}`;
        medicineDetails.ownedBy = ownerName;

        const newMedicineBuffer = Buffer.from(JSON.stringify(medicineDetails));
        await ctx.stub.putState(medicineId, newMedicineBuffer);

        return `Medicine ${medicineId} is successfully registered to ${ownerName}`;
    } else {
        return `User under following MSP:${mspID} cannot able to perform this action`;
    }
}


}

module.exports = MedicineContract;