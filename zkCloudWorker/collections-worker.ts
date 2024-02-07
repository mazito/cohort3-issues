/**
 * This is a specific worker that will be launched and called by the service. 
 * In fact it will be "converted" to an AWS Lambda function that will be 
 * instantiated and executed on demand.
 * 
 * IMPORTANT: this is only a preliminary/draft implementation example, as the 
 * structure and types of the Worker are still not defined.
 */

import { PublicKey, Mina } from 'o1js';
import { TxnPayload, ZKCloudWorker, Launchpad, SerializedTxn, Serializer } from "@zkCloudWorker/worker";
import { CollectionContract } from "@socialcap/collections";

class CollectionsWorker extends ZKCloudWorker {

  // this will be the function that the zkCloudWorker service will call and run 
  async prove(payload: TxnPayload): Promise<SerializedTxn> {

    let { key, value, collectionAddress, collectionRoot, collectionWitness } = payload.data;
    let { senderAddress, fee } = payload.options; 

    // of course, this can be cached ...
    await CollectionContract.compile();

    let zkApp = new CollectionContract(
      PublicKey.fromBase58(collectionAddress)
    );

    let txn = await Mina.transaction(
      { sender: PublicKey.fromBase58(senderAddress), fee: fee }, 
      () => { 
        zkApp.dispatchValue(key, value, collectionRoot, collectionWitness); 
      }
    );

    await txn.prove();

    let serializedTxn = Serializer.toJSON(txn);

    return serializedTxn; 
  }
}

// need to register it so it can be launched using its unique name
Launchpad.register("collections-prover", new CollectionsWorker());
