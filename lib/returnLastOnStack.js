const _ = require('./opCodes')

module.exports = returnLastOnStack

// return the last thing on the stack
function returnLastOnStack(args){
  return [
    _.PUSH1, // PUSH1
    args.mstoreOffset, // (data1) <-- MSTORE offset       top| [prev]
    _.SWAP1, // SWAP1                                     top| [prev, data1]
    _.DUP2, // DUP2                                       top| [data1, prev, data1]
    _.MSTORE, // MSTORE (offset:data1, word:prev)         top| [data1] -> offset:data1, word:prev
    _.PUSH1, // PUSH
    args.returnLength, // (data2) <-- RETURN length       top| [data2, data1]
    _.SWAP1, // SWAP1                                     top| [data1, data2]
    _.RETURN, // RETURN (offset:data1, length:data2)      top| [] -> offset:data1, length:data2
  ]
}