const _ = require('./opCodes')
const pushData = require('./pushData')
const vmReturn = require('./opFn').return

module.exports = returnLastOnStack

// return the last thing on the stack
function returnLastOnStack(args){
  return [
    // MSTORE (offset:0, word:prev)
    pushData(0),
    _.MSTORE,

    // RETURN (offset:0, length:data2)
    vmReturn({
      offset: 0,
      length: args.returnLength,
    })
  ]
}