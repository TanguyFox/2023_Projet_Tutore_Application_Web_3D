export class Face {
    constructor(edge) {
        this.edge = edge;
    }

    degree(){
        if(this.edge == null){
            return 0;
        }
        let e = this.edge;
        let p = this.edge.next;
        let count = 1;
        while(p !== e){
            count++;
            p = p.next;
        }
        return count;
    }

}