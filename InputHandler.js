let deque = [];
let caretIndex = 0;
let previousSelection = [];
const textInput = document.getElementById('textInput');
const speedSlider = document.getElementById('speedSlider');

let intervalSpeed = parseInt(speedSlider.value);

speedSlider.addEventListener('input', () => {
    intervalSpeed = parseInt(speedSlider.value);
    dataStream.setSpeedInterval(intervalSpeed);
});


const dataStream = createDataStream(deque, insertToy, deleteToy, intervalSpeed);


keepTextAreaFocused();
textInput.addEventListener('input', characterInput);
textInput.addEventListener('select', setSelect);
textInput.addEventListener('click', caretPos);
textInput.addEventListener('focus', caretPos);
textInput.addEventListener('keyup', handleArrows);
textInput.addEventListener('blur', keepTextAreaFocused);
textInput.addEventListener('paste', multipleInput);

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


function caretPos(event){
    caretIndex = textInput.selectionStart
    setSelect(event)
}


function keepTextAreaFocused() {
    textInput.focus();
}


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
        deque.splice(caretIndex, 0, insertedChar);
        if(streamIndex > caretIndex){
            dataStream.setIndex(caretIndex);
        }
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


function setSelect(event){
    previousSelection[0] = textInput.selectionStart;
    previousSelection[1] = textInput.selectionEnd;
}


function handleArrows(event) {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (arrowKeys.includes(event.key)) {
      caretPos(event);
    }
}

/**
 * Assumed that the datastream is paused currently!
 * 
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
