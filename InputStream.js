/**
 * This is the data stream, the array will be a string or array of characters
 * The insert and delete functions insert and delete to the EERTREE Data structure
 * the interval is for how long until we process each character
 * Because people can type fast, copy and paste, we want to have a steady stream of inserts
 * The deletes can happen instantly that is okay
 * @param {Array} array 
 * @param {function} insertChar 
 * @param {function} deleteChar 
 * @param {int} interval 
 * @returns 
 */
function createDataStream(array, insertChar, deleteChar, interval){
    let timerId;
    let currentIndex = 0;
    let paused = false;
    let prev = [];
    let speedInterval = interval;

    const iterateArray = () => {
        if(paused) return;
        if(currentIndex < array.length){
            const c = array[currentIndex++];
            prev.push(c);
            insertChar(c);
        }
        else{
            pause();
        }
    };


    const pause = () => {
        clearInterval(timerId);
        paused = true;
    }


    const resume = () => {
        if(!paused) return;
        paused = false;
        timerId = setInterval(iterateArray, speedInterval);
    }


    const getIndex = () => {
        return currentIndex;
    }


    const setIndex = (index) => {
        while(currentIndex > index){
            deleteChar(prev.pop());
            currentIndex--;
        }
        console.log(currentIndex, prev);
    }


    const setSpeedInterval = (num) => {
        speedInterval = num;
        if(paused)
           return;
        else{
            pause();
            resume();
        }
    }


    timerId = setInterval(iterateArray, speedInterval);

    // The functions we can use in input handling
    return {
        pause,
        resume,
        getIndex,
        setIndex,
        setSpeedInterval
    };
}


