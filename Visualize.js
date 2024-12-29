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
                    border: "#000000",
                    highlight: {
                        background: "#F0C698",
                        border: "#000000"
                    }
                },
            },
            edges:{
                color:{
                    inherit: false,
                }
            },
            layout:{
                    randomSeed: undefined,
                    improvedLayout:true,
                    hierarchical: {
                        enabled:true,
                        levelSeparation: 150,
                        nodeSpacing: 100,
                        treeSpacing: 0,
                        blockShifting: false,
                        edgeMinimization: false, // Biggest Issue
                        parentCentralization: true,
                        direction: 'UD',        // UD, DU, LR, RL
                        sortMethod: 'directed',  // hubsize, directed
                    }
            },
            physics: {
                enabled: true, // cannot make it false otherwise we get a worse graph
                hierarchicalRepulsion: {
                    centralGravity: 0.0,
                    springLength: 100,
                    springConstant: 0.01,
                    nodeDistance: 100,
                    damping: 0.09,
                },
                maxVelocity: 35,

            }
        };

        this.network = new vis.Network(container, this.data, this.options);
    }

    
    createNode(node){
        return {
            id: node.id,
            label: node.length < 1 ? node.length.toString() : node.palindrome,
            level: node.level,
        };
    }


    createEdge(fromNode, toNode, c){
        return {
            from: fromNode.id,
            to: toNode.id,
            label: c,
            arrows: 'to',
            color: {
                color: "#ff7f50",
                highlight: "#ffa500",
            },
        };
    }


    createLink(fromNode, toNode, id){
        return {
            from: fromNode.id,
            to: toNode.id,
            physics: false,
            dashes: true,
            arrows:'to',
            id: id,
            color: {
                color: "#0a75ad",
                highlight: "#3399ff",
            },
        }
    }


    addNode(node){
        this.data.nodes.add(this.createNode(node))        
    }


    delNode(node){
        this.data.nodes.remove(node.id);
    }


    addEdge(fromNode, toNode, c){
        this.data.edges.add(this.createEdge(fromNode, toNode, c))
    }


    addLink(fromNode, toNode){
        this.data.edges.add(this.createLink(fromNode, toNode, this.edgeID));
        return this.edgeID++;
    }

    highlightNode(node){
        this.network.selectNodes([node.id], [true]);
    }

    highlightEdge(node) {
        this.network.selectEdges([node.edgeID]);
    }

    highlightStep(step){
        step.classList.add('glow');
    }

    unhighlightStep(step){
        step.classList.remove('glow');
    }
}