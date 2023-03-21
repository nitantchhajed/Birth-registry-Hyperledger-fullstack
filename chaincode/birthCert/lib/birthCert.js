/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BirthCert extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

   

    async createBirthCert(ctx, id, name, dob, father_name, gender, mother_name, address_birth, address, placeofbirth, hospital_name, weight) {
        try {
            // var hash = sha256(new Date());
            const birthCert = {
                name,
                docType: 'birthCert',
                dob,
                father_name,
                gender,
                mother_name,
                address_birth,
                address,
                placeofbirth,
                hospital_name,
                weight
            };

            await ctx.stub.putState(id, Buffer.from(JSON.stringify(birthCert)));
            } catch (error) {
                console.log("error", error);   
            }
    }

    async allList(ctx) {

        try {
            let queryString = {};
            queryString.selector = {
                docType: 'birthCert'
             
            };
            let iterator =  await ctx.stub.getQueryResult(JSON.stringify(queryString));;
            let data = await this.filterQueryData(iterator);
            
            return JSON.parse(data);
        } catch (error) {
            console.log("error", error);
        }

    }

   
    async filterQueryData(iterator){
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = BirthCert;
