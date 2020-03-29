const sha256 = require("crypto-js/sha256");

//a block
class Block {
  //block's constructor
  constructor(data, lastblockhash = "", difficulty = 3) {
    this.data = data;
    this.data.calcweight = 1;
    this.lastblockhash = lastblockhash;
    this.hash = this.hash(difficulty);
  }
  //simple hash calculator
  calculatehash() {
    return sha256(
      JSON.stringify({ ...this.data, lastblockhash: this.lastblockhash })
    ).toString();
  }

  //hash calculator and validation
  hash(difficulty) {
    let hashValue = this.calculatehash();

    let hashSlice = hashValue.slice(0, difficulty);
    let difficultyFactor = "0".repeat(difficulty);

    while (hashSlice !== difficultyFactor) {
      this.data.calcweight++;

      hashValue = this.calculatehash();
      hashSlice = hashValue.slice(0, difficulty);
    }

    return hashValue;
  }
}

module.exports.Block = Block;
