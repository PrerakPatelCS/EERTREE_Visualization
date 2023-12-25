class Visualize {
    constructor(imaginary, empty){
        this.container = document.getElementById('visContainer');
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
        this.options = {
            nodes:{
                color: {
                    
                },
            },
            layout:{
                hierarchical: true
            },
        };

        this.network = new vis.Network(this.container, this.data, this.options);
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

    // Switch the logic so the sortMethod: 'directed' makes the tree correctly
    createLink(toNode, fromNode){
        return {
            from: fromNode.id,
            to: toNode.id,
            dashes: true,
            arrows:'from',
        }
    }


    addNode(node){
        this.data.nodes.add(this.createNode(node))
    }


    delNode(node){
        this.data.nodes.remove(node.id);
        const edgesToRemove = this.data.edges.get().filter(edge => edge.from === node.id || edge.to === node.id);
        edgesToRemove.forEach(edge => this.data.edges.remove(edge.id));
    }


    addEdge(fromNode, toNode, c){
        this.data.edges.add(this.createEdge(fromNode, toNode, c))
    }


    addLink(fromNode, toNode){
        this.data.edges.add(this.createLink(fromNode, toNode))
    }
}
