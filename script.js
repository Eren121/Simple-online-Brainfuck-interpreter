const runButton = document.getElementById('run_button');
const codePanel = document.getElementById('code_panel');
const inputPanel = document.getElementById('input_panel');
const outputPanel = document.getElementById('output_panel');
const runningTimeText = document.getElementById('running_time');
const array = new Array(30000);
let ptr = 0;
let inputIndex = 0;

runButton.addEventListener('click', event => {

  clearAllData();

  runScript(codePanel.value);

  console.log(`Script output: '${outputPanel.value}'`);
  console.log(array);

  outputPanel.classList.remove('update_animation');
  outputPanel.offsetWidth; // Trigger animation restart.
  outputPanel.classList.add('update_animation');
});

function clearAllData() {

  array.fill(0);
  ptr = 0;
  inputIndex = 0;
  outputPanel.value = "";
}

function getInput(index) {
  if(inputPanel.value.length <= index) {
    return 0;
  }
  else {
    return inputPanel.value.charCodeAt(index);
  }
}

function printOutput(char) {

  outputPanel.value += char;
}

/**
 * Parse brainfuck matching brackets.
 * @return an array of the same size as the script, containing, for each char:
 *          The matching bracket index if the character is '[' or ']'
 *          Else, containing -1.
 */
function parseBrackets(script) {

    const ret = new Array(script.length);
    const stack = [];

    for(let i = 0; i < script.length; i++) {

      switch(script.charAt(i)) {

        case '[':
          stack.push(i);
          break;

        case ']':
          ret[i] = stack.pop(); // Matching '['.
          ret[ret[i]] = i; // Matching ']'.
          break;

        default:
          ret[i] = -1;
          break;

      }
    }

    return ret;
}

function runScript(script) {

  const brackets = parseBrackets(script);
  const startingTime = performance.now();
  const runningTimeUpdater = setInterval(() => {
    const currentTime = performance.now();
    const differenceTimeMillis = currentTime - startingTime;
    runningTimeText.innerHTML = differenceTimeMillis / 1000;
  }, 50);

  for(let eip = 0; eip < script.length; eip++) {

    switch(script.charAt(eip)) {

      case '>': //  Increment the data pointer.
        ptr++;
        break;

      case '<': // Decrement the data pointer.
        ptr--;
        break;

      case '+': // Increment (increase by one) the byte at the data pointer.
        array[ptr]++;
        break;

      case '-': // Decrement (decrease by one) the byte at the data pointer.
        array[ptr]--;
        break;

      case '.': // Output the byte at the data pointer.
        printOutput(String.fromCharCode(array[ptr]));
        break;

      case ',':
        array[ptr] = getInput(inputIndex);
        inputIndex++;
        break;

      case '[': // If the byte at the data pointer is zero,
                // then instead of moving the instruction pointer forward to the next command,
                // jump it forward to the command after the matching ] command.

        if(array[ptr] == 0) {

          eip = brackets[eip];
        }
        break;

      case ']': // If the byte at the data pointer is nonzero,
                // then instead of moving the instruction pointer forward to the next command,
                // jump it back to the command after the matching [ command.

        if(array[ptr] != 0) {

          eip = brackets[eip];
        }
        break;

      default:
        break;
    }
  }

  clearInterval(runningTimeUpdater);
}
