/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

async function getCollectionName(ctx) {
    const mspid = ctx.clientIdentity.getMSPID();
    const collectionName = `_implicit_org_${mspid}`;
    return collectionName;
}

class OrderContract extends Contract {

    async orderExists(ctx, orderId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, orderId);
        return (!!data && data.length > 0);
    }
//.....................................................................
    async createOrder(ctx, orderId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'retailer-pharma-com') {
            const exists = await this.orderExists(ctx, orderId);
            if (exists) {
                throw new Error(`The asset order ${orderId} already exists`);
            }

            const orderAsset = {};

            const transientData = ctx.stub.getTransient();
            if (transientData.size === 0 ||
                !transientData.has('medicineName') ||
                !transientData.has('retailerName')) {
                throw new Error('The private data was not specified in transient data. Please try again.');
            }
            orderAsset.medicineName = transientData.get('medicineName').toString();
            orderAsset.retailerName = transientData.get('retailerName').toString();
            orderAsset.assetType = 'order'

            const collectionName = await getCollectionName(ctx);
            await ctx.stub.putPrivateData(collectionName, orderId, Buffer.from(JSON.stringify(orderAsset)));
        }

        else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }

    }

    async readOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The asset order ${orderId} does not exist`);
        }
        let privateDataString;
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, orderId);
        privateDataString = JSON.parse(privateData.toString());
        return privateDataString;
    }
    //..........................................

    async updateOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The asset order ${orderId} does not exist`);
        }
        const privateAsset = {};

        const transientData = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('privateValue')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }
        privateAsset.privateValue = transientData.get('privateValue').toString();

        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, orderId, Buffer.from(JSON.stringify(privateAsset)));
    }

    async deleteOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The asset order ${orderId} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.deletePrivateData(collectionName, orderId);
    }

    async verifyOrder(ctx, mspid, orderId, objectToVerify) {

        // Convert provided object into a hash
        const hashToVerify = crypto.createHash('sha256').update(objectToVerify).digest('hex');
        const pdHashBytes = await ctx.stub.getPrivateDataHash(`_implicit_org_${mspid}`, orderId);
        if (pdHashBytes.length === 0) {
            throw new Error('No private data hash with the key: ' + orderId);
        }

        const actualHash = Buffer.from(pdHashBytes).toString('hex');

        // Compare the hash calculated (from object provided) and the hash stored on public ledger
        if (hashToVerify === actualHash) {
            return true;
        } else {
            return false;
        }
    }


}

module.exports = OrderContract;
