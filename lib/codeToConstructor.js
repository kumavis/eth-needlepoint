const { pushData, codeCopy, returnData } = require('./opFn')

module.exports = deployCode

function deployCode(code){
  // offset is num of bytes before code
  var codeCopyOffset = 7 + 5
  return [
    // 7 bytes
    codeCopy({
      memOffset: 00,
      codeOffset: codeCopyOffset,
      length: code.length,
    }),
    // 5 bytes
    returnData({
      offset: 00,
      length: code.length,
    }),
    // code.length bytes
    code
  ]
}
