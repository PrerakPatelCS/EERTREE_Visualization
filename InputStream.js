function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


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
function createDataStream(insertChar, deleteChar, interval){
    let currentIndex = 0;
    let paused = false;
    let speedInterval = interval;
    let inIterateArray = false;
    let actionsQueue = new Queue();

    const iterateArray = async () => {
        inIterateArray = true;
        while(!paused && !actionsQueue.isEmpty()){
            await sleep(speedInterval);
            // console.log(actionsQueue.printQueue());
            request = actionsQueue.peek();
            if(request == undefined){
                continue;
            }
            else{
                request = actionsQueue.poll();
            }
            if(request[0] == 'a'){
                await insertChar(request[1]);
            }
            else{
                while(request[1]--){
                    deleteChar();
                }
            }
        }
        inIterateArray = false;
        pause();
    }

    function addCharacters(str){
        pause();
        for(const c of str){
            actionsQueue.offer(['a', c]);
        }
        resume();
    }

    function deleteCharacters(n){
        pause();
        actionsQueue.offer(['d', n]);
        resume();
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


    const setSpeedInterval = (num) => {
        speedInterval = num;
    }



    // The functions we can use in input handling
    return {
        pause,
        resume,
        addCharacters,
        deleteCharacters,
        setSpeedInterval
    };
}


