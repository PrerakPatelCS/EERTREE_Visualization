/**
 * Class that holds all the visualization functions for the EERTREE
 */
class Visualize {
    /**
     * Take the 2 roots of the EERTREE, the 2 begining nodes
     * The imaginary node or the Odd root node
     * and the Empty node or the even root node
     * Initializes the network which is part of Vis.js
     * @param {Node} imaginary 
     * @param {Node} empty 
     */
    constructor(imaginary, empty){
        let container = document.getElementById('visContainer');
        let nodesData = [];
        nodesData.push(this.createNode(imaginary));
        nodesData.push(this.createNode(empty));
        let nodes = new vis.DataSet(nodesData);
        let edgesData = [];
        this.edgeID = 0;
        edgesData.push(this.createLink(imaginary, imaginary, this.edgeID++));
        edgesData.push(this.createLink(empty, imaginary, this.edgeID++));
        edgesData.push({from: imaginary.id, to:empty.id, hidden:true});
        let edges = new vis.DataSet(edgesData);
        
        this.data = {
            nodes: nodes,
            edges: edges
        };
        this.options = {
            nodes:{
                color: {
                    background: "#F03967",
                    border: "#713EyF",
                    highlight: {
                        background: "blue",
                        border: "black"
                    }
                },
            },
            edges:{
                color: {
                    inherit: false,
                }
            },
            layout:{
                hierarchical: true
            },
        };

        this.network = new vis.Network(container, this.data, this.options);
    }

    
    createNode(node){
        return {
            id: node.id,
            label: node.length < 1 ? node.length.toString() : node.palindrome,
            level: node.level
        };
    }


    createEdge(fromNode, toNode, c){
        return {
            from: fromNode.id,
            to: toNode.id,
            label: c,
            arrows: 'to',
        };
    }


    createLink(fromNode, toNode, id){
        return {
            from: fromNode.id,
            to: toNode.id,
            dashes: true,
            arrows:'to',
            id: id,
        }
    }


    async addNode(node){
        this.data.nodes.add(this.createNode(node))
        await sleep(intervalSpeed);
        
    }


    async delNode(node){
        await sleep(1000);
        this.data.nodes.remove(node.id);
    }


    addEdge(fromNode, toNode, c){
        this.data.edges.add(this.createEdge(fromNode, toNode, c))
    }


    addLink(fromNode, toNode){
        this.data.edges.add(this.createLink(fromNode, toNode, this.edgeID));
        return this.edgeID++;
    }

    async highlight(node){
        console.log("begin" + new Date().toLocaleTimeString());

        await sleep(intervalSpeed);
        this.network.selectNodes([node.id], [true]);
        await sleep(intervalSpeed);
        this.network.selectEdges([node.edgeID]);
        await sleep(intervalSpeed);
        this.network.unselectAll();

        console.log("end" + new Date().toLocaleTimeString());

    }

    highlightStep(step){
        step.classList.add('glow');
    }

    unhighlightStep(step){
        step.classList.remove('glow');
    }
}


/**
 * TODO
 * 1. Make the visualization and show the steps
 * 2. Have psuedocode on the side and highlight what step we are on
 * 3. Add text and links to explain the data structure
 * 4. Add a way to change the theme from white to dark background
 * 
 */