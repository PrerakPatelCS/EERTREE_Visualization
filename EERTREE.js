class Node {
    constructor(len, suffix, nodeID, level, edgeID) {
        this.edges = new Map(); // edges <Character, Node>
        this.link = suffix; // Suffix link points to another node
        this.length = len; // Length of the palindrome represented by this node
        this.palindrome = "";
        this.parent = null; // this is for delete 
        this.id = nodeID; // ID for the visualization, each node needs an id for reference
        this.edgeID = edgeID;
        this.level = level; // Level for the visualization hierarchy
    }

    toString(){
        return `Node ID: ${this.id}, Level: ${this.level}, Length: ${this.length}, Palindrome: ${this.palindrome}, Edge ID: ${this.edgeID}`;
    }
}

class Eertree {
    constructor() {
        this.nodeID = 0; // This is how we denote the ID
        let edgeID = 0; // Denotes the id of the edge
        this.nodes = []; // Stack of nodes for deletion only holds nodes of T not the imaginary or empty nodes
        this.imaginary = new Node(-1, null, this.nodeID++, 1, edgeID++); // also called odd length root node
        this.empty = new Node(0, this.imaginary, this.nodeID++, 2, edgeID++); // also called even length root node
        this.maxSuffixOfT = this.empty; // this is the current node we are on also the maximum Suffix of tree T
        this.s = ""; // String processed by the Eertree
        this.nodes.push(this.empty);
        this.visual = new Visualize(this.imaginary, this.empty); // Instance to the Visual class that has all the visualization functions
        this.visual.highlightNode(this.empty);
    }


    /**
     * Add will only add at most 1 node to the tree. 
     * We get the max suffix palindrome with the same character before it
     * so we can get cQc which will be the new palindrome, c otherwise
     * If the node is already in the tree then we return 0 and create no new nodes
     * @param {Character} c 
     * @returns int 1 if it created a new node an 0 otherwise
     */
    async add(c){
        /**
         * Traverse the suffix palindromes of T in the order of decreasing length
         * Keep traversing until we get to imaginary node or until T[len - k] = a
         * @param {Node} startNode 
         * @param {Character} a
         * @returns {Node} u
         */
        const getMaxSuffixPalindrome = async (startNode, a) =>{
            this.visual.highlightStep(line1);
            let u = startNode;
            let n = this.s.length;
            let k = u.length;
            while(u !== this.imaginary && this.s[n - k - 1] !== a){
                if(u === u.link){
                    throw new Error('Infinite Loop');
                }
                this.visual.highlightNode(u);
                await sleep(intervalSpeed);
                this.visual.highlightEdge(u);
                await sleep(intervalSpeed);
                u = u.link;
                k = u.length;
            }
            this.visual.unhighlightStep(line1);
            return u;
        };


        this.visual.highlightStep(line2);
        let Q = await getMaxSuffixPalindrome(this.maxSuffixOfT, c);
        this.visual.unhighlightStep(line2);

        let createNewNode = !(Q.edges.has(c));

        
        if(createNewNode){
            this.visual.highlightStep(line3);
            let P = new Node();
            P.length = Q.length + 2; 
            // this is because Q is a palindrome and the suffix and prefix == c so cQc = P
            //P.length == 1 if Q is the imaginary node
            if(P.length === 1){
                this.visual.highlightStep(line4);
                await sleep(intervalSpeed);

                P.link = this.empty;
                P.palindrome = c;
                P.level = this.empty.level + 1;

                this.visual.unhighlightStep(line4);
            }
            else{
                /**
                 * Now we need to find the node to suffix link to
                 * Continue traversing suffix palindromes of T starting with the suffix
                 * we found earlier 's link
                 */
                this.visual.highlightStep(line5);
                this.visual.highlightStep(line6);
                await sleep(intervalSpeed);

                let temp = await getMaxSuffixPalindrome(Q.link, c);
                this.visual.unhighlightStep(line6);

                P.link = temp.edges.get(c);
                P.palindrome = c + Q.palindrome + c;
                P.level = Q.level + 1;

                this.visual.unhighlightStep(line5);
            }
            P.id = this.nodeID++;
            P.parent = Q;
            Q.edges.set(c, P);
            
            // Draw the node edge and suffix link
            this.visual.addNode(P);
            this.visual.addEdge(Q, P, c);
            P.edgeID = this.visual.addLink(P, P.link);
            await sleep(intervalSpeed);
            this.visual.unhighlightStep(line3);
        }

        this.maxSuffixOfT = Q.edges.get(c);
        this.nodes.push(this.maxSuffixOfT);
        this.s += c;
        //console.log(this.maxSuffixOfT.toString());
        this.visual.highlightNode(this.maxSuffixOfT);
        return createNewNode === true ? 1 : 0;
    }


    /**
     * Delete the last node
     * change maxSuffixOfT
     * Update s
     * update the parent 
     * if the node was null we the last node that is not null
     */
    delete(){
        let n = this.nodes.length;
        if(n === 1){
            return;
        }
        let delNode = this.nodes.pop();
        this.s = this.s.substring(0, this.s.length - 1);
        let c = delNode.palindrome[0];
        if(delNode.parent !== null){
            delNode.parent.edges.delete(c);
        }
        this.visual.delNode(delNode);
        this.maxSuffixOfT = this.nodes[n - 1];
        this.visual.highlightNode(this.maxSuffixOfT);
    }
}

// The instance of Eertree we will use with the methods we feed into the input stream
let eertree = new Eertree();
const insertToy = async (c) =>{
    await eertree.add(c);
    //console.log("Inserted " + c);
    //console.log(eertree.nodes);
};

const deleteToy = (c) =>{
    eertree.delete();
    //console.log("Deleted " + c);
    //console.log(eertree.nodes);
};