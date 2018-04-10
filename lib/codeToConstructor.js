const { pushData, codeCopy, returnData } = require('./opFn')

module.exports = deployCode

function deployCode(code){
  // offset is num of bytes before code
  var codeCopyOffset = 7 + 5
  return [
    // 7 bytes
    codeCopy({
      codeOffset: codeCopyOffset,
      length: code.length,
    }),
    // 5 bytes
    returnData({
      length: code.length,
    }),
    // code.length bytes
    code
  ]
}
