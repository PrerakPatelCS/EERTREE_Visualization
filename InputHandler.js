/**
 * This file takes care of all of the input handling that comes from the text area
 * There are so many ways to input text so we want to try our hardest to keep some 
 * invariant conditions
 * 1. Deque = the text in the text area currently
 * 2. caretIndex = the index of the caret(the blinking |)
 * 3. The previous selection
 */


let caretIndex = 0;
let endIndex = 0;
let previousSelection = [0, 0];
const textInput = document.getElementById('textInput');
const speedSlider = document.getElementById('speedSlider');
// These are the lines of code in the pseudocode that we highlight
const line1 = document.getElementById('maxSuffixPalindrome');
const line2 = document.getElementById('QgetMSP');
const line3 = document.getElementById('ifBlock1');
const line4 = document.getElementById('ifBlock2');
const line5 = document.getElementById('elseBlock');
const line6 = document.getElementById('getLink');

let intervalSpeed = parseInt(speedSlider.value);

speedSlider.addEventListener('input', () => {
    intervalSpeed = parseInt(speedSlider.value);
    dataStream.setSpeedInterval(intervalSpeed);
});

// the datastream we use to feed the EERTREE characters at the interval speed
const dataStream = createDataStream(insertToy, deleteToy, intervalSpeed);


keepTextAreaFocused();
textInput.addEventListener('input', characterInput);
textInput.addEventListener('select', setSelect);
textInput.addEventListener('click', caretPos);
textInput.addEventListener('focus', caretPos);
textInput.addEventListener('keyup', handleArrows);
// keep focused getting annoying and stops user from clicking links
//textInput.addEventListener('blur', keepTextAreaFocused);
textInput.addEventListener('paste', multipleInput);


// Disable all Drag and Drop functionality
textInput.addEventListener('dragstart', disable);
textInput.addEventListener('dragenter', disable);
textInput.addEventListener('dragover', disable);
textInput.addEventListener('dragleave', disable);
textInput.addEventListener('dragend', disable);
textInput.addEventListener('drop', disable);
textInput.addEventListener('drag', disable);


function disable(event) {
    event.preventDefault();
}


async function copyToClipboard(str){
    await navigator.clipboard.writeText(str);
}


// gets the caret position and also keeping the previos selection invariant condition
function caretPos(event){
    prevIndex = caretIndex;
    caretIndex = textInput.selectionStart;
    setSelect(event);
}

// Helps with the caret index invariant condition
function keepTextAreaFocused() {
    textInput.focus();
}

// Processes the character inputs, If something is selected previously we delete it 
function characterInput(event) {
    const inputType = event.inputType;
    const selectionStart = previousSelection[0];
    const selectionEnd = previousSelection[1];

    // Only want the paste event to be called
    if(inputType === 'insertFromPaste'){
        return;
    }

    //console.log(caretIndex, endIndex, selectionStart);
    // carretIndex is where the character is being added 
    // endIndex is at the end
    // they should be equal, selectionStart is also equal
    /**
     * CaretIndex and SelectionStart are the same, we can just delete every
     * thing from selectionStart to the end and then re-add the characters
     * that are not part of the event
     */
    let charsToReAdd = '';
    if(selectionStart < endIndex){
        dataStream.deleteCharacters(endIndex - selectionStart);
        endIndex -= (endIndex - selectionStart);
    }


    if (inputType === 'insertText') {
        // Character input - insert into the deque at the caret index
        charsToReAdd = textInput.value.substring(selectionStart + 1);
        dataStream.addCharacters(event.data);
        endIndex += event.data.length;
    }
    else if (inputType === 'deleteContentBackward') {
        if(selectionStart === selectionEnd){
            // Deletion (Backspace) - remove character at the caret index
            charsToReAdd = textInput.value.substring(selectionStart - 1);
            dataStream.deleteCharacters(1);
            endIndex--;
        }
    }
    else if (inputType === 'deleteContentForward') {
        if (selectionStart === selectionEnd){
            // Deletion (delete) - remove character at the caret index
            charsToReAdd = textInput.value.substring(selectionStart);
            dataStream.deleteCharacters(1);
            endIndex--;
        }
    }
    else{
        // this is cntrl V
        console.log(event)
    }

    // update the caretPos after the event
    caretPos(event);
    if(charsToReAdd.length > 0){
        dataStream.addCharacters(charsToReAdd);
        endIndex += charsToReAdd.length;
    }
    //console.log(caretIndex, endIndex);

}

function multipleInput(event){
    
    const selectionStart = previousSelection[0];
    const selectionEnd = previousSelection[1];
    let charsToReAdd = '';
    if(selectionStart < endIndex){
        dataStream.deleteCharacters(endIndex - selectionStart);
        endIndex -= (endIndex - selectionStart);
    }


    //console.log(event);
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');

    dataStream.addCharacters(pastedText);
    charsToReAdd = textInput.value.substring(selectionEnd);
    endIndex += pastedText.length;

    if(charsToReAdd.length > 0){
        dataStream.addCharacters(charsToReAdd);
        endIndex += charsToReAdd.length;
    }
    //console.log(endIndex, selectionStart, selectionEnd, charsToReAdd, pastedText, textInput.value);
    caretPos(event);


}


// for the previous selection invariant
function setSelect(event){
    previousSelection[0] = textInput.selectionStart;
    previousSelection[1] = textInput.selectionEnd;
}

// For the caret position invariant
function handleArrows(event) {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (arrowKeys.includes(event.key)) {
      caretPos(event);
    }
}
