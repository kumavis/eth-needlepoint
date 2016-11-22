const flatten = require('flatten')

module.exports = compileStructure

// flattens buffers
function compileStructure(structure){
  var result = _compileStructure(structure)
  if (structure !== result) {
    console.log('compiling:', structure)
    console.log('result:', result)
  }
  return result
}

function _compileStructure(structure){
  if (Buffer.isBuffer(structure)) structure = bufferToArray(structure)
  if (Array.isArray(structure)) {
    return flatten(structure.map(compileStructure))
  } else {
    return structure
  }
}

function bufferToArray(buffer){
  return [].slice.call(buffer)
}