const op = require('./opCodes')
const { mStore, pushData } = require('./opFn')

module.exports = memWrite


function memWrite(args){
  let data = args.data
  let initialOffset = args.offset
  let result = []
  let dataLength = undefined
  // buffer
  if (Buffer.isBuffer(data)) {
    dataLength = data.length
  // number
  } else {
    dataLength = Math.ceil(data.toString(16).length/2)
  }
  // break up data into chunks and push each
  var numChunks = Math.ceil(dataLength/32)
  for (var index = 0; index < numChunks; index++) {
    var offset = index*32
    var dataChunk = data.slice(offset, offset+32)
    result.push([
      mStore({
        data: dataChunk,
        offset: initialOffset+offset,
      })
    ])
  }
  return result
}
