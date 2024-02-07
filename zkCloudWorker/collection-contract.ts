/**
 * A simplied (incomplete) example of a contract receiving a set of 
 * hidden/hashed key and value private inputs.
 * 
 * This contract may represent a collection of items. For example, in Socialcap
 * we represent the registered communities collection as table in a Postgres DB, 
 * with each item (row) of the collection identified by unique UUID.
 * 
 * BUT we also keep an updated MerkleMap of the same table, so we can "prove"
 * that a given item of the collection has not been tampered or modified by an 
 * invalid actor. 
 * 
 * A Leaf for an item of the collection will be constructed like:
 * 
 *  - key = hashString(NONCE, item.uid);
 *  - value = hashJSON(NONCE, item.toJSON());
 *  
 * So the Leaf {key,value} will be hidden/hashed Fields, and can be stored
 * anywhere and transmitted without risking the true values.
 */
import { SmartContract, state, State, method, Field } from "o1js";
import { MerkleMapWitness } from "o1js";

export class CollectionContract extends SmartContract {
  // state ...
  @state(Field) commitedRoot = State<Field>(); 
  @state(Field) itemsCount = State<Field>();

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
