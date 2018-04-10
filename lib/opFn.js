const op = require('./opCodes')
const symbol = require('./symbols')

module.exports = {
  delegateCall,
  returnData,
  codeCopy,
  memStore,
  memLoad,
  loadCallData,
  copyCallData,
  log,
  pushData,
}

function delegateCall(args) {
  return [
    pushData(args.outLength),
    pushData(args.outOffset),
    pushData(args.inLength),
    pushData(args.inOffset),
    pushData(args.toAddress),
    pushData(args.gas),
    op.DELEGATECALL,
  ]
}

function returnData(args) {
  return [
    pushData(args.length),
    pushData(args.offset || zeroBuffer()),
    op.RETURN,
  ]
}

function codeCopy(args) {
  return [
    pushData(args.length),
    pushData(args.codeOffset || zeroBuffer()),
    pushData(args.memOffset || zeroBuffer()),
    op.CODECOPY
  ]
}

function memStore(args) {
  return [
    pushData(args.data),
    pushData(args.offset),
    op.MSTORE
  ]
}

function memLoad(args = {}) {
  return [
    pushData(args.offset || zeroBuffer()),
    op.MLOAD
  ]
}

function loadCallData(args = {}) {
  return [
    pushData(args.offset || zeroBuffer()),
    op.CALLDATALOAD,
  ]
}

function copyCallData(args = {}) {
  return [
    args.dataLength ? pushData(args.dataLength) : op.CALLDATASIZE,
    pushData(args.dataOffset || zeroBuffer()),
    pushData(args.memOffset || zeroBuffer()),
    op.CALLDATACOPY,
  ]
}

function log(args) {
  const opName = `LOG${args.logs.length}`
  const logOp = op[opName]

  // validate args
  if (!logOp) throw new Error(`Invalid LOG op name "${opName}"`)
  // FROM_STACK logs must come first
  //   [x, y, FROM_STACK] is bad
  //   [FROM_STACK, x, y] is good
  //   [FROM_STACK, FROM_STACK, x] is good
  const stackLogs = []
  args.logs.forEach((log, index) => {
    if (log === symbol.FROM_STACK) {
      if (stackLogs.length !== index) {
        throw new Error('all FROM_STACK logs must come first')
      }
      stackLogs.push(log)
    } else if (!Buffer.isBuffer(log)) {
      throw new Error(`log is not a buffer: "${log}"`)
    }
  })

  // build ops
  // first all logs that are not coming from the stack
  const ops = args.logs
    .filter(log => log !== symbol.FROM_STACK)
    .map(log => pushData(log))
  // add the mem portion
  ops.push(pushData(args.memLength || Buffer.from([32])))
  ops.push(pushData(args.memOffset || zeroBuffer()))
  // push actual log opcode
  ops.push(logOp)
  return ops
}

function pushData(data) {
  let dataLength = undefined
  // buffer
  if (Buffer.isBuffer(data)) {
    dataLength = data.length
  // number
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

function zeroBuffer() {
  return Buffer.from([0])
}
