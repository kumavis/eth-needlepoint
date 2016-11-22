const pushData = require('./pushData')
const _ = require('./opCodes')

exports.delegateCall = function(args) {
  return [
    pushData(args.outLength),
    pushData(args.outOffset),
    pushData(args.inLength),
    pushData(args.inOffset),
    pushData(args.toAddress),
    pushData(args.gas),
    _.DELEGATECALL,
  ]
}

exports.return = function(args) {
  return [
    pushData(args.length),
    pushData(args.offset),
    _.RETURN,
  ]
}

exports.codeCopy = function(args) {
  return [
    pushData(args.length),
    pushData(args.codeOffset),
    pushData(args.memOffset),
    _.CODECOPY
  ]
}

exports.mStore = function(args){
  return [
    pushData(args.data),
    pushData(args.offset),
    _.MSTORE
  ]
}