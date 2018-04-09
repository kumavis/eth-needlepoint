const tape = require('tape')
const flatten = require('flatten')
const createHookedVm = require('ethereumjs-vm/dist/hooked')
const returnLastOnStack = require('../lib/returnLastOnStack')
const op = require('../lib/opCodes')
const { hooksForBlockchainState } = require('./util')

//
// A simple contract that returns the balance of itself
//

tape('simple contract test', function (test) {
  var contractAddressHex = '0x1234000000000000000000000000000000001234'
  var contractAddress = new Buffer(contractAddressHex.slice(2), 'hex')
  var contractBalanceHex = '0xabcd00000000000000000000000000000000000000000000000000000000abcd'

  var contractCode = new Buffer(flatten([
    op.ADDRESS, // ADDRESS of contract being run
    op.BALANCE, // BALANCE of address on stack
    // return the last thing on the stack
    returnLastOnStack({ mstoreOffset: 0x60, returnLength: 0x20 }),
  ]))

  var blockchainState = {
    [contractAddressHex]: {
      balance: contractBalanceHex,
      nonce: '0x00',
      code: '0x' + contractCode.toString('hex'),
      storage: {}
    }
  }

  var vm = createHookedVm({
    enableHomestead: true
  }, hooksForBlockchainState(blockchainState))

  // vm.on('step', function(stepData){
  //   console.log(`========================================================`)
  //   console.log(`stack:`,stepData.stack)
  //   console.log(`${stepData.opcode.name} (${stepData.opcode.in})->(${stepData.opcode.out})`)
  // })

  vm.runCode({
    code: contractCode,
    address: contractAddress,
    gasLimit: Buffer.from('ffffffffff', 'hex')
  }, function (err, results) {
    // console.log(arguments)

    test.ifError(err, 'Should run code without error')
    test.ifError(results.exceptionError, 'Should run code without vm error')

    test.equal('0x' + results.return.toString('hex'), contractBalanceHex, 'Should return correct balance of contract')

    test.end()
  })
})
