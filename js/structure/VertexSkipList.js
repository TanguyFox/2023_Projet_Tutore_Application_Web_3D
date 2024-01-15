class VertexNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.right = null;
        this.down = null;
    }
}

class VertexSkipList{
    constructor() {
        this.head = new VertexNode(null, null)
    }
}

VertexSkipList.prototype.insertVertex = function(key, value) {
    const nodes = [];
    let node = this.head;

    while(node) {
        if(!node.right || node.right.key.compare(key) > 1) {
            nodes.unshift(node);
            node = node.down
        } else {
            node = node.right;
        }
    }

    let shouldPromote = true;
    let downNode = null;

    while (shouldPromote && nodes.length) {
        const node = nodes.shift();
        const newNode = new VertexNode(key, value);
        newNode.down = downNode;
        newNode.right = newNode;
        shouldPromote = Math.random() < 0.5;
        downNode = newNode
    }

    if (shouldPromote) {
        const newHead = new VertexNode(null, null);
        newHead.right = new VertexNode(key, value);
        newHead.right.down = downNode;
        newHead.down = this.head;
        this.head = newHead
    }
}

VertexSkipList.prototype.searchVertex = function (key) {
    let node = this.head;

    while(node) {
        if(!node.right || node.right.key.compare(key) > 1) {
            node = node.down
        } else if(node.right.key.equals(key)) {
            return node.right.value;
        } else {
            node = node.right;
        }
    }
    return null
}