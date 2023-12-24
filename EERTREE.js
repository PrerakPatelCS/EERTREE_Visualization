class Node {
    constructor(len, suffix) {
        this.edges = new Map(); // edges <Character, Node>
        this.link = suffix; // Suffix link points to another node
        this.length = len; // Length of the palindrome represented by this node
        this.palindrome = "";
        this.parent = null;
    }
}

class Eertree {
    constructor() {
        this.nodes = []; // Stack of nodes for deletion only holds nodes of T not the imaginary or empty nodes
        this.imaginary = new Node(-1, null); // also called odd length root node
        this.empty = new Node(0, this.imaginary); // also called even length root node
        this.maxSuffixOfT = this.empty; // this is the current node we are on also the maximum Suffix of tree T
        this.s = ""; // String processed by the Eertree
        this.nodes.push(this.maxSuffixOfT);
    }


    /**
     * Traverse the suffix palindromes of T in the order of decreasing length
     * Keep traversing until we get to imaginary node or until T[len - k] = a
     * @param {Node} startNode 
     * @param {Character} a
     * @returns {Node} u
     */
    getMaxSuffixPalindrome(startNode, a){
        let u = startNode;
        let n = this.s.length;
        //console.log(u.edges, u.link, u.length);
        let k = u.length;
        while(u !== this.imaginary && this.s[n - k - 1] !== a){
            if(u === u.link){
                throw new Error('Infinite Loop');
            }
            u = u.link;
            k = u.length;
        }
        return u;
    }

    
    /**
     * Add will only add at most 1 node to the tree. 
     * We get the max suffix palindrome with the same character before it
     * so we can get cQc which will be the new palindrome, c otherwise
     * If the node is already in the tree then we return 0 and create no new nodes
     * @param {Character} c 
     * @returns int 1 if it created a new node an 0 otherwise
     */
    add(c){
        let Q = this.getMaxSuffixPalindrome(this.maxSuffixOfT, c);
        let createNewNode = !(Q.edges.has(c));
        
        if(createNewNode){
            let P = new Node();
            P.length = Q.length + 2; // this is because Q is a palindrome and the suffix and prefix == c so cQc = P
            //P.length == 1 if Q is the imaginary node
            if(P.length === 1){
                P.link = this.empty;
                P.palindrome = c;
            }
            else{
                /**
                 * Now we need to find the node to suffix link to
                 * Continue traversing suffix palindromes of T starting with the suffix
                 * we found earlier 's link
                 */
                P.link = this.getMaxSuffixPalindrome(Q.link, c).edges.get(c);
                P.palindrome = c + Q.palindrome + c;
            }
            
            this.nodes.push(P);
            P.parent = Q;
            Q.edges.set(c, P);
        }
        this.maxSuffixOfT = Q.edges.get(c);
        this.s += c;

        return createNewNode === true ? 1 : 0;
    }


    /**
     * Delete the last node
     * change maxSuffixOfT
     * Update s
     * update the parent 
     */
    delete(){
        let delNode = this.nodes.pop();
        this.maxSuffixOfT = this.nodes.at(-1);
        this.s = this.s.substring(0, this.s.length - 1);
        let c = delNode.palindrome[0];
        delNode.parent.edges.delete(c);
    }
}
