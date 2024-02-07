**On private inputs**

Private inputs will effectively leave the browser, and though they may be encrypted as described in [app-worker-events-flow](./app-worker-event-flow.md), securely decrypting them in the contract itself is not very feasible. 

As described we could use the worker private key, but this is not a great change, because using the worker private key means they can be decrypted before they reach the contract and so can be exposed inside the worker code.

The best countermeasure against this is to verify the cloud worker code. One aspect of it by forcing the worker code to be open-source and auditable. The second aspect is the ability to verify that the code that is being executed in the cloud worker, is exactly the same code existent in the particular open-source repository and commit. 

There is also a proposal using zkCloudWorker exactly attaching this issue: [Enhancing Transparency and Trust in zkApps with zkCloudWorker Contract Verification](https://zkignite.minaprotocol.com/zkignite/zkapp-cohort-3/feedbackandrefinement/suggestion/758)

**Obfuscating or hidding private inputs**

Private inputs do not always be passed in a "readable" form to a SmartContract. We can "hash" them and passed the hashed values to a Contract.

For example, we can have a simple contract, using a MerkleMap, that receives (an proves) a hashed key and value, and that the key+value belong to a given collection. See the sample code here for some contract here: 

We would implement a zKCloudWorker for proving, can look at example code here:

And in the App, we will do something like:
~~~
  import { PublicKey, Field, Poseidon, MerkleMap, MerkleMapWitness } from "o1js";
  import { OffchainMerkleStorage } from "@socialcap/services";
  import { ZKCloudWorkerClient } from "@zkCloudWorker/client";

  // some secret NONCE known only to the user/app 
  // this NEVER leaves the browser
  const NONCE = Field(...);

  // the real private inputs NEVER leave the browser
  let key = Field(1001); 
  let value = Field(10001);

  // hashed/hidden private inputs 
  let leafKey = Poseidon.hash([NONCE, key]);
  let leafValue = Poseidon.hash([NONCE, value])

  // the collection Merkle Map leafs only hold hashed keys an values
  // this are never never disclosed ... 
  let merkleMap = await OffchainMerkleStorage.load('communities-collection");
  let collectionRoot = merkleMap.root();
  let colletionWitness = merkleMap.witness(leafKey);

  // now we can call the zkCloudWorker with the hidden private inputs

  let cloudWorker = ZKCloudWorkerClient.launch(
    API_TOKEN, // the API token need to connect with Launchpad
    "collections-prover" // the particular zkCloudWorker name 
  );

  let stxn = await cloudWorker.prove({
    data: { 
      key: leafKey,
      value: leafValue,
      collectionAddress: COMMUNITY_COLLECTION_ADDR, // deployed contract ...      
      collectionRoot: collectionRoot,
      colectionWitness: collectionWitness
    }, 
    options: {
      senderAddress: 'B62...',
      fee: MIN_FEE
    }
  })

  // ...
~~~

CONCLUSION: The real values of the private inputs NEVER level the browser, but we can effectively do fully private proving in the cloud worker.
