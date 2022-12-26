/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const MedicineContract = require('./lib/medicine-contract');
const OrderContract = require('./lib/order-contract')

module.exports.MedicineContract = MedicineContract;
module.exports.OrderContract = OrderContract;
module.exports.contracts = [ MedicineContract, OrderContract ];


