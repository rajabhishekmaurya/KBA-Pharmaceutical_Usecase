/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MedicineContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MedicineContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MedicineContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"medicine 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"medicine 1002 value"}'));
    });

    describe('#medicineExists', () => {

        it('should return true for a medicine', async () => {
            await contract.medicineExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a medicine that does not exist', async () => {
            await contract.medicineExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMedicine', () => {

        it('should create a medicine', async () => {
            await contract.createMedicine(ctx, '1003', 'medicine 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"medicine 1003 value"}'));
        });

        it('should throw an error for a medicine that already exists', async () => {
            await contract.createMedicine(ctx, '1001', 'myvalue').should.be.rejectedWith(/The medicine 1001 already exists/);
        });

    });

    describe('#readMedicine', () => {

        it('should return a medicine', async () => {
            await contract.readMedicine(ctx, '1001').should.eventually.deep.equal({ value: 'medicine 1001 value' });
        });

        it('should throw an error for a medicine that does not exist', async () => {
            await contract.readMedicine(ctx, '1003').should.be.rejectedWith(/The medicine 1003 does not exist/);
        });

    });

    describe('#updateMedicine', () => {

        it('should update a medicine', async () => {
            await contract.updateMedicine(ctx, '1001', 'medicine 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"medicine 1001 new value"}'));
        });

        it('should throw an error for a medicine that does not exist', async () => {
            await contract.updateMedicine(ctx, '1003', 'medicine 1003 new value').should.be.rejectedWith(/The medicine 1003 does not exist/);
        });

    });

    describe('#deleteMedicine', () => {

        it('should delete a medicine', async () => {
            await contract.deleteMedicine(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a medicine that does not exist', async () => {
            await contract.deleteMedicine(ctx, '1003').should.be.rejectedWith(/The medicine 1003 does not exist/);
        });

    });

});
