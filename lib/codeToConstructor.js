const pushData = require('./pushData')
// const _ = require('./opCodes')
const codeCopy = require('./opFn').codeCopy
const vmReturn = require('./opFn').return

module.exports = deployCode

function deployCode(code){
  // offset is num of bytes before code
  var codeCopyOffset = 7+5
  return [
    // 7 bytes
    codeCopy({
      memOffset: 00,
      codeOffset: codeCopyOffset,
      length: code.length,
    }),
    // 5 bytes
    vmReturn({
      offset: 00,
      length: code.length,
    }),
    // code.length bytes
    code
  ]
}