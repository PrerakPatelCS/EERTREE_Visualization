/**
 * This file takes care of all of the input handling that comes from the text area
 * There are so many ways to input text so we want to try our hardest to keep some 
 * invariant conditions
 * 1. Deque = the text in the text area currently
 * 2. caretIndex = the index of the caret(the blinking |)
 * 3. The previous selection
 */


let deque = [];
let caretIndex = 0;
let previousSelection = [];
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
const dataStream = createDataStream(deque, insertToy, deleteToy, intervalSpeed);


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
    caretIndex = textInput.selectionStart
    setSelect(event)
}

// Helps with the caret index invariant condition
function keepTextAreaFocused() {
    textInput.focus();
}

// Processes the character inputs, If something is selected previously we delete it 
function characterInput(event) {
    dataStream.pause();
    const inputType = event.inputType;
    const selectionStart = previousSelection[0];
    const selectionEnd = previousSelection[1];
    const streamIndex = dataStream.getIndex();
    
    if (inputType === 'insertText') {
        // Character input - insert into the deque at the caret index
        const insertedChar = event.data;
        deleteSelect();
        if(streamIndex > caretIndex){
            dataStream.setIndex(caretIndex);
        }
        deque.splice(caretIndex, 0, insertedChar);
    }
    else if (inputType === 'deleteContentBackward') {
        deleteSelect();
        if(selectionStart === selectionEnd){
            // Deletion (Backspace) - remove character at the caret index
            if (caretIndex > 0) {
                deque.splice(caretIndex - 1, 1);
            }
        }
    }
    else if (inputType === 'deleteContentForward') {
        deleteSelect();
        if (selectionStart === selectionEnd){
            // Deletion (Backspace) - remove character at the caret index
            if (caretIndex < deque.length) {
                deque.splice(caretIndex, 1);
            }
        }
    }
    // update the caretPos after the event
    caretPos(event);
    if(streamIndex > caretIndex){
        dataStream.setIndex(caretIndex);
    }
    dataStream.resume();
}

// This is Cntrl V
function multipleInput(event) {
    dataStream.pause();
    deleteSelect();
    // Access the pasted text from the event
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    for(let i = 0; i < pastedText.length; i++){
        deque.splice(caretIndex + i, 0, pastedText[i]);
    }
    caretPos(event);
    dataStream.resume();
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

/**
 * Assumed that the datastream is paused currently!
 * There is not event for if something is selected and then deleted
 * so we keep track of the previous selection and call this function
 */
function deleteSelect(){
    const streamIndex = dataStream.getIndex();
    const selectionStart = previousSelection[0];
    const selectionEnd = previousSelection[1];
    if (selectionStart !== selectionEnd){
        for(let i = selectionStart; i < selectionEnd; i++){
            deque.splice(selectionStart, 1);
        }
        if(streamIndex > selectionStart){
            dataStream.setIndex(selectionStart)
        }
    }
}
