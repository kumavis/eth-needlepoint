const op = require('./opCodes')
const { returnData, pushData } = require('./opFn')

module.exports = returnLastOnStack

// return the last thing on the stack
function returnLastOnStack(args){
  return [
    // MSTORE (offset:0, word:prev)
    pushData(0),
    op.MSTORE,

    // RETURN (offset:0, length:data2)
    returnData({
      offset: 0,
      length: args.returnLength,
    })
  ]
}
