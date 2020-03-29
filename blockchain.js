const { Block } = require("./block");

class BlockChain {
  //blockchain constructor
  constructor() {
    this.blockchain = [];
    console.log("catena builded");

    const genesiblock = new Block({
      timestamp: new Date().getTime(),
      amount: 0
    });

    this.blockchain.push(genesiblock);
    console.log("genesi block added");
  }

  //return the first block
  firstblock() {
    return this.blockchain[0];
  }
  //return the last block
  lastblock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  //add a block to the blockchain
  newblock(timestamp, amount) {
    let block = new Block({ timestamp, amount }, this.lastblock().hash);
    this.blockchain.push(block);
    console.log("newblock created with amount: " + amount);
  }
  //this function control all the sequence of hash, and return if chain is ok or corrupted
  validate() {
    for (let i = 1; i < this.blockchain.length; i++) {
      console.log("block: " + i);
      const current = this.blockchain[i].calculatehash();

      if (this.blockchain[i].hash !== current) {
        console.log("corrupted chain");
        return "corrupted chain";
      }

      if (this.blockchain[i].lastblockhash != this.blockchain[i - 1].hash) {
        console.log("corrupted chain");
        return "corrupted chain";
      }
    }
    console.log("blockchain ok");
    return "blockchain ok";
  }

  chain() {
    return this.blockchain;
  }
}

module.exports.BlockChain = BlockChain;
