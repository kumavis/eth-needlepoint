
module.exports = {
  hooksForBlockchainState
}

function hooksForBlockchainState (blockchainState) {
  return {
    fetchAccountBalance: function (addressHex, cb) {
      const state = blockchainState[addressHex] || {}
      const value = state.balance || zeroBuffer()
        // console.log('fetchAccountBalance', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountNonce: function (addressHex, cb) {
      const state = blockchainState[addressHex] || {}
      const value = state.nonce || zeroBuffer()
        // console.log('fetchAccountNonce', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountCode: function (addressHex, cb) {
      const state = blockchainState[addressHex] || {}
      const value = state.code || zeroBuffer()
        // console.log('fetchAccountCode', addressHex, '->', value)
      cb(null, value)
    },
    fetchAccountStorage: function (addressHex, keyHex, cb) {
      const state = blockchainState[addressHex] || {}
      const storage = state.storage || {}
      const value = storage[keyHex] || zeroBuffer()
        // console.log('fetchAccountStorage', addressHex, keyHex, '->', value)
      cb(null, value)
    }
  }
}

function zeroBuffer() {
  return Buffer.from([0])
}
