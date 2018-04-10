const tape = require('tape')
const createHookedVm = require('ethereumjs-vm/dist/hooked')
const FakeTransaction = require('ethereumjs-tx/fake')
const ethUtil = require('ethereumjs-util')

const compile = require('../lib/compile')
const returnLastOnStack = require('../lib/returnLastOnStack')
const op = require('../lib/opCodes')
const symbol = require('../lib/symbols')
const { loadCallData, log } = require('../lib/opFn')
const codeToConstructor = require('../lib/codeToConstructor')
const { hooksForBlockchainState } = require('./util')

//
// A simple contract that emits a log based on tx data
//

tape('emit log contract', function (test) {
  const senderAddressHex = ethUtil.bufferToHex(ethUtil.setLengthRight(ethUtil.toBuffer('0xffff'), 20))
  const contractAddressHex = ethUtil.bufferToHex(ethUtil.setLengthRight(ethUtil.toBuffer('0x1234'), 20))
  const dataSlugHex = ethUtil.bufferToHex(ethUtil.setLengthRight(ethUtil.toBuffer('0x43110'), 32))

  const contractCode = new Buffer(compile([
    // load tx data onto stack
    loadCallData(),
    // emit a log with one topic, using item from stack
    log({ logs: [symbol.FROM_STACK] })
  ]))
  const constructorCode = new Buffer(compile(codeToConstructor(contractCode)))

  console.log('compiled code:', ethUtil.bufferToHex(contractCode))
  console.log('deploy code:', ethUtil.bufferToHex(constructorCode))

  const blockchainState = {
    [contractAddressHex]: {
      balance: '0x00',
      nonce: '0x00',
      code: '0x' + contractCode.toString('hex'),
      storage: {}
    }
  }

  const targetTx = new FakeTransaction({
    from: senderAddressHex,
    to: contractAddressHex,
    data: dataSlugHex,
    gasLimit: '0xffffff'
  })

  const vm = createHookedVm({
    enableHomestead: true
  }, hooksForBlockchainState(blockchainState))

  // vm.on('step', function(stepData){
  //   console.log(`========================================================`)
  //   console.log(`stack:`,stepData.stack)
  //   console.log(`${stepData.opcode.name} (${stepData.opcode.in})->(${stepData.opcode.out})`)
  // })

  vm.runTx({
    tx: targetTx,
    skipNonce: true,
    skipBalance: true,
  }, function (err, results) {
    test.ifError(err, 'Should run code without error')
    test.ifError(results.exceptionError, 'Should run code without vm error')

    const logs = results.vm.logs
    test.equal(logs.length, 1, 'should emit one log')
    const theLog = logs[0]
    const [address, topics, mem] = theLog
    test.equal(ethUtil.bufferToHex(address), contractAddressHex, 'should be the contract address')
    test.equal(topics.length, 1, 'should contain one topic')
    const theTopic = topics[0]
    test.equal(ethUtil.bufferToHex(theTopic), dataSlugHex, 'topic should match sent data')
    test.equal(mem.length, 0, 'captured memory should be zero length')

    test.end()
  })
})
