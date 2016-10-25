module.exports = pushData

function pushData(data){
  let dataLength = undefined
  if (Buffer.isBuffer(data)) {
    dataLength = data.length
  } else {
    dataLength = Math.ceil(data.toString(16).length/2)
  }
  if (dataLength>32) throw new Error('pushData - data too big')
  const pushOp = 0x60 + dataLength - 1
  return [
    pushOp,
    data
  ]
}