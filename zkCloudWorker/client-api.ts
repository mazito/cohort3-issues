/**
 * Client API for calling the cloud ZKCloudWorker 
 * 
 * IMPORTANT: this is only a preliminary/draft implementation example, as the 
 * structure and types of the Worker, Cleint and APIs are still not defined.
 */
interface TxnPayload {
  data: object;
  options ? : object;
}

interface IsError {
  code: number;
  message: string;
  exception: any;
}

interface SerializedTxn {
  hash: string | null;
  transaction: any | null;
  error: IsError | null;
}

interface SignedSerializedTxn {
  hash: string | null;
  transaction: any | null;
  error: IsError | null;
}

interface TxnResult {
  hash: string | null;
  data: any | null;
  error: IsError | null;
}

interface JobPayload {
  data: object;
  options ? : object;
}

interface JobResult {
  data: any | null;
  error: IsError | null;
}


class ZKCloudWorkerClientAPI {
  private API_KEY = '';
  private jobName = '';

  // this is the worker Job Id after the worker has been launched
  // it allows future communication with worker to check if it 
  // has ended or if it is still working
  private jobId = '';

  // handshake keys for private exchange between 
  // client API and remote worker
  private workerPublicKey = '';
  private privateKey = '';
  private publicKey = '';

  constructor(
    apiKey: string, 
    jobName: string,
    jobId: string,
    workerPublicKey: string,
    privateKey: string,
    publicKey: string
  ) {
  }


  /**
   * Connects with the zkCloudWorker service and requests the launch 
   * of a new cloud worker instance with the given name.
   * 
   * When launching, we stablish a secure private connection between 
   * the local client API and the remote cloud worker.
   * 
   * @param apiKey 
   * @param jobName 
   * @returns new ZKCloudWorker instance
   */
  static async launch(
    apiKey: string, 
    jobName: string
  ): Promise < ZKCloudWorker > {
    return new ZKCloudWorker(
      '', '', '', '', '', '',
    )
  }  


  /**
   * prove() sign() and send()
   * 
   * The called cloud worker is expected to compile the needed Contract, 
   * create the transaction, prove it and send it back serialized. 
   * 
   * Then the serialized transaction can be signed locally using AuroWallet 
   * and finally send it to MINA using the cloud worker.
   * 
   * IMPORTANT: the transaction fee  will be paid by the local sender, using
   * the Auro Wallet at the moment of signing the serialized transaction. 
   * 
   * We only need the sender public key to create and prove the transaction. 
   * The sender private key NEVER leaves the local wallet.
   * 
   * Example:
   * ~~~
   *  let zkWorker = ZKCloudWorker.launch(API_KEY, 'batch-voting-...');
   * 
   *  let serializedTxn = await zkWorker.prove({ 
   *    data: {
   *      claimUid: '012345...789',
   *      // ...
   *    },
   *    options: {
   *      senderAddress: 'B62...',
   *      fee: MIN_FEE // MAX_FEE | AUTO_FEE | number
   *    }
   *  });
   *  if (serializedTxn.error) 
   *    // treat error here
   *  
   *  let signedTxn = await zkWorker.sign(signerAddress, serializedTxn); 
   *  if (signedTxn.error) 
   *    // treat error here 
   *  
   *  let txnResult = await zkWorker.send(signedTxn) ;
   *  if (txnResult.error) 
   *    // treat error here
   * ~~~
   */
  async prove(
    payload: TxnPayload,
  ): Promise < SerializedTxn > {
    // ...
  }

  async sign(
    signerAddress: string,
    serializedTxn: SerializedTxn,
  ): Promise < SignedSerializedTxn > {
    // ...
  }

  async send(
    txn: SignedSerializedTxn
  ): Promise < TxnResult > {
    /// ...
  }


  /**
   * proveAndSend()
   * 
   * The called cloud worker is expected to do all: compile the needed Contract, 
   * create the transaction, prove it, sign it using one of the available 
   * fee payers, and finally send it to MINA.
   * 
   * IMPORTANT: the transaction fee  will be paid by the first fee payer 
   * available from the list of fee payers provided by the ZKCloudWorker service.
   * Also the fee will be set by the cloud worker using some optimal algorithm
   * that minimizes fees.
   * 
   * In this case the sender public key to create and prove the transaction 
   * will be the selected ZKCloudWorker fee payer previously mentioned. 
   * 
   * Example:
   * ~~~
   *  let zkWorker = ZKCloudWorker.launch(API_KEY, 'batch-voting-...');
   * 
   *  let txnResult = await zkWorker.proveAndSend({ 
   *    data: {
   *      claimUid: '012345...789',
   *      // ...
   *    }
   *  });
   * 
   *  if (txnResult.error) 
   *    // treat error here
   * ~~~
   */
  async proveAndSend(
    payload: TxnPayload,
  ): Promise < TxnResult > {
    // ...
  }


  /**
   * Wait till the dispatched transaction is finally included in a block.
   * We need to use the hash of the dispatched txn to query for completion
   * or the transaction fully failed.
   * In both cases we call the provided method to notify it.
   */
  waitForInclusion(
    txnHash: string,
    callback: (result: TxnResult) => void  
  ) {
    // ...
  }


  /**
   * runJob()
   * 
   * The called cloud worker can also be used to easily run jobs not related to 
   * a MINA transaction, and will act just like any serverless function. 
   * 
   * This "generic" job can benefit from the easy to use deploy and call service
   * already implemented for cloud proving without no extra costs.
   * 
   * IMPORTANT: there will be a small fee that needs to be paid for service 
   * usage, but no MINA fees need to be paid.
   * 
   * Example:
   * ~~~
   *  let zkWorker = ZKCloudWorker.launch(API_KEY, 'send-email-to-judges');
   * 
   *  let jobResult = await zkWorker.runJob({ 
   *    data: {
   *      judges: [
   *        // ...
   *      ],
   *    },
   *    options: {
   *      // ...
   *    }
   *  });
   * 
   *  if (txnResult.error) 
   *    // treat error here
   * ~~~
   */
  async runJob(
    payload: JobPayload,
  ): Promise < JobResult > {
    // ...
  }
}