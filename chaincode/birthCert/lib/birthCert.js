/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BirthCert extends Contract {


//This function initializes the ledger.

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

   
//This function creates a new entry in the ledger that contains the details of an individual's birth certificate.

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

//This function retrieves all the entries from the ledger.

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

//get the birth certificate of specific id -
//This function uses the getState method of the chaincode's execution context (ctx.stub) 
//to query the ledger for a specific birth certificate with an ID id. If the certificate does not exist,
// an error is thrown. Otherwise, the certificate is returned as a string.
 
    async getBirthCert(ctx, id) {
        const birthCertAsBytes = await ctx.stub.getState(id);
        if (!birthCertAsBytes || birthCertAsBytes.length === 0) {
          throw new Error(`Birth certificate with ID: ${id} does not exist`);
        }
        return birthCertAsBytes.toString();
    }
  
    
// The filterQueryData function is an asynchronous function that takes an 
// iterator as input and returns all the results from the given iterator after
// filtering the data based on certain conditions. The function runs a while loop,
// which continues until there are no more results left in the iterator.
// Every time the function loops through an iteration, it checks whether the
// value is present and whether it can be converted to a string.
// If so, it parses the value to JSON and pushes it into an array 
// along with its key. Finally, when there are no more results to loop through,
// it closes the iterator and returns the array of parsed values and keys as a string.

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
