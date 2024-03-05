
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Might have to make this an async function
 * Only want 1 iterate array
 * 
 * 
 */

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
    let currentIndex = 0;
    let paused = false;
    let prev = [];
    let speedInterval = interval;
    let inIterateArray = false;

    const iterateArray = async () => {
        while(!paused && currentIndex < array.length){
            inIterateArray = true;
            await sleep(speedInterval);
            const c = array[currentIndex++];
            prev.push(c);
            await insertChar(c);
        }
        inIterateArray = false;
        pause();
    }


    const pause = () => {
        paused = true;
    }


    const resume = () => {
        paused = false;
        if(!inIterateArray){
            iterateArray();
        }
        
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
    }


    // The functions we can use in input handling
    return {
        pause,
        resume,
        getIndex,
        setIndex,
        setSpeedInterval
    };
}


