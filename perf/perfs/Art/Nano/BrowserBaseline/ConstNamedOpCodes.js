let opCodes = [0, 1, 2];
const [noOp, pushOp, sumOp] = opCodes;

module.exports = {createVm: function (parallelInstructions, floatArray, stack) {
  return function() {
    let i, sp, fp, instructionsLength, instruction, a;
    i = 0;
    sp = 0;
    fp = 0;
    instructionsLength = parallelInstructions.length;
    stack[sp++] = 0;
    while (i < instructionsLength) {
      switch (parallelInstructions[i++]) {
        case noOp:
          1;
          break;
        case pushOp:
          stack[sp++] = floatArray[fp++];
          break;
        case sumOp:
          a = stack[--sp];
          stack[sp - 1] += a;
      }
    }
    return stack[0];
  };
}};