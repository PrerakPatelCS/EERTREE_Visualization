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

    const getIndex = () => {
        return currentIndex;
    }

    const pause = () => {
        clearInterval(timerId);
        paused = true;
    }

    const resume = () => {
        if(!paused) return;
        paused = false;
        timerId = setInterval(iterateArray, speedInterval);
    }

    const setIndex = (index) => {
        while(currentIndex > index){
            deleteChar(prev.pop());
            currentIndex--;
        }
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

    return {
        pause,
        resume,
        getIndex,
        setIndex,
        setSpeedInterval
    };
}


