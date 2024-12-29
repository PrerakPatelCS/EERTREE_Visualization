class Queue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;
        this.backIndex = 0;
    }
    offer(item) {
        this.items[this.backIndex++] = item;
        if(item[0] == 'd'){
            this.simplify();
        }
        return item + ' inserted';
    }
    poll() {
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        
        if(this.frontIndex >= 10){

            let shift = this.frontIndex;
            for(let i = this.frontIndex; i < this.backIndex; i++){
                this.items[i - shift] = this.items[this.frontIndex];
                delete this.items[this.frontIndex++];
            }
            this.frontIndex = 0;
            this.backIndex -= shift;

        }
        
        return item;
    }
    peek() {
        return this.items[this.frontIndex];
    }
    isEmpty(){
        return this.frontIndex == this.backIndex;
    }
    simplify(){
        let n = this.items.length;
        let toDelete = 0;
        for(let i = this.backIndex - 1; i >= this.frontIndex; i--){
            let item = this.items[i];
            if(item[0] == 'd'){
                toDelete += item[1];
                delete this.items[i];
            }
            else if(toDelete > 0){
                toDelete--;
                delete this.items[i];
            }
            else{
                this.backIndex = i + 1;
                break;
            }
            this.backIndex = i;
        }
        
        if(toDelete > 0){
            this.items[this.backIndex++] = ['d', toDelete];
        }
    }
    printQueue() {
        let str = this.frontIndex + " " + this.backIndex + " ";
        for(var i = 0; i <= this.items.length; i++)
            str += this.items[i] +"\t";
        return str;
    }
}