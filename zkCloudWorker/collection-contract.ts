/**
 * A simplied (incomplete) example of a contract receiving a set of 
 * hidden/hashed key and value private inputs.
 */
import { SmartContract, state, State, method, Field } from "o1js";
import { MerkleMapWitness } from "o1js";

export class CollectionContract extends SmartContract {
  // state ...
  @state(Field) commitedRoot = State<Field>(); 

  // ... init, etc ...

  @method dispatchValue(
    key: Field,
    value: Field,
    collectionRoot: Field,
    collectionWitness: MerkleMapWitness
  ) {
    let commitedRoot = this.commitedRoot.getAndAssertEquals();

    const [witnessRoot, witnessKey] = collectionWitness.computeRootAndKey(
      value
    );

    key.assertEquals(witnessKey, "Invalid key !") ;
    collectionRoot.assertEquals(witnessRoot, "Invalid root !") ;

    // ...

    this.commitedRoot.set(collectionRoot);
  }
}
