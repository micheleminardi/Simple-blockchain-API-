###### "api" in italian means "bees" 🐝🐝

# 👋 "Ciao" guys!

In my first article I want to talk to you about blockchain (in the easiest way possible), and we will build one with nodejs and a few additional modules.


Part 1 ➡️ what is a blockchain

Part 2 ➡️ how it works 

Part 3 ➡️ write some code



# 📜 what is a blockchain




### 🧱 block
Block means data.
A block is the information that we want to store in the chain, made by two parts:
* Data

An onbject, a transaction, a payment, a note, just an information!

* Hashes

Core of the blockchain, is a criptographed message made with the data of the block, and the timestamp.
If someone change illegaly the data of a block, the hash will change. This changing invalidate the blockchain, becouse the mechanism of validation recreate the hashes with the new data, that will be different from the previous hash.

### 🔗 chain
Chain means storage.
The chain is the place where we store the data, "sorted" by hash sequence

# ⚙️ how it works
In the sempliest way to explain a block chain, we have to focus just in the hash and previoushash values of every single blocks.
Keep calm, we will see soon what this values means!
Our blockchain is drive by http request, with just few commands we can add new blocks, see the evidence of the blocks in the chain, invalidate or convalidate it. 

###blockchain JSON rappresentation
``` json
#Block1
{
  data:"somedata.."
  Previoushash:"123"
  Hash:"455"
}
#Block2
{
  data:"somedata.."
  Previoushash:"455"
  Hash:"685"
}
#Block3
{
  data:"somedata.."
  Previoushash:"685"
  Hash:"594"
}
```
Looks how block2's previoushash is egual to block1's hash, block3's previoushash is egual to block2's hash etc..
This is the centre of the blockchain mechanism!⚙️

# 👨‍💻 write some code

### 🧰 tools we need
* Nodejs
* Express js
* Crypto-js


For a more readable code, we Will put all the stuffs in the root of our little blockchain project.
We need to create three files:
* block.js
* blockchain.js
* main.js


Setup the project

```
$ mkdir blockchain && cd blockchain && npm init -y 
$ npm install express --save && npm install cryptojs --save
```

block.js

```javascript
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

```
blockchain.js

```javascript
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

```

main.js

```javascript
const { BlockChain } = require("./src/blockchain");

var express = require("express");
var app = express();
let blockchain = new BlockChain();
//add two data for example
blockchain.newblock(new Date().getTime(), 392);
blockchain.newblock(new Date().getTime(), 678);

app.get("/", function(req, res) {
  res.json({
    endpoints: [
      {
        action: "chain",
        url: "http://localhost:3000/chain",
        note: "visualize the blockchain"
      },
      {
        action: "add",
        url: "http://localhost:3000/add?amount=35",
        note: "add a newblock with 35 as amount"
      },
      {
        action: "validate",
        url: "http://localhost:3000/validate",
        note: "check if blockchain is corrupted or not"
      },
      {
        action: "corrupt",
        url: "http://localhost:3000/corrupt",
        note: "corrupt the blockchain changing amount value of second block"
      }
    ]
  });
});

app.get("/add", function(req, res) {
  blockchain.newblock(new Date().getTime(), req.query.amount);
  res.json("new block created with amount: " + req.query.amount);
});

app.get("/chain", function(req, res) {
  res.json(blockchain.chain());
});

app.get("/validate", function(req, res) {
  res.json(blockchain.validate());
});

app.get("/corrupt", function(req, res) {
  blockchain.blockchain[2].data.amount = "1644.33";
  res.json("second block amount changed");
});

app.listen(3000, function() {
  console.log("Blockchain listen on port 3000!");
});

```


# 🐝 API endpoints
### show all endpoints and navigate to it
```
GET "localhost:3000"
```
### show the complete blockchain
```
GET "localhost:3000/chain"
```
### add some data to the chain
```
GET "localhost:3000/add?total=12"
```
### check if blockchain is valid
```
GET "localhost:3000/validate"
```
### broke the chain changing second block value
```
GET "localhost:3000/corrupt"
```
# 🔨 HOW TO USE IT
* open the folder in your console
* start the script with:
```
$ node main.js
```
* open the browser on http://localhost:3000


## 🧟 simple usage
* show the chain
* add some other data
* check if blockchain is corrupted
* corrupt the chain
* check again if blockchain is corrupted



###### all codes in this article could be find on the web with a lot of variation, with more or less things
