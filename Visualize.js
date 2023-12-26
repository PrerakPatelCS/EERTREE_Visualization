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
        edgesData.push(this.createLink(empty, imaginary));
        edgesData.push(this.createLink(imaginary, imaginary));
        edgesData.push({from: imaginary.id, to:empty.id, hidden:true});
        let edges = new vis.DataSet(edgesData);
        this.data = {
            nodes: nodes,
            edges: edges
        };
        let options = {
            nodes:{
                color: {
                    
                },
            },
            layout:{
                hierarchical: true
            },
        };

        this.network = new vis.Network(container, this.data, options);
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


    createLink(fromNode, toNode){
        return {
            from: fromNode.id,
            to: toNode.id,
            dashes: true,
            arrows:'to',
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
        this.data.edges.add(this.createLink(fromNode, toNode))
    }
}
