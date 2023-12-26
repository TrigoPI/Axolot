export default class SparseSet<ID extends number, T> {
    private idToIndex: number[];
    private indexToId: ID[];
    private objects: T[];
    private freeIds: ID[];

    public constructor() {
        this.idToIndex = [];
        this.indexToId = [];
        this.objects = [];
        this.freeIds = [];
    }

    public Size(): number {
        return this.objects.length;
    }

    public Get(id: ID): T | undefined {
        return this.objects[this.idToIndex[id]];
    }

    public Add(a: T): ID {
        const i: number = this.objects.length; 
        const id: ID = (this.freeIds.length == 0)? <ID>this.idToIndex.length : this.freeIds.pop();
        
        this.objects.push(a);
        
        this.idToIndex[id] = i;            
        this.indexToId[i] = id;
              
        return id;
    }

    public Remove(id: ID): T {
        const objectLength: number = this.objects.length - 1;
        const indexOfRemovedElement: number = this.idToIndex[id];
        const removedObject: T = this.objects[indexOfRemovedElement];
        const idOfLastElement: ID = this.indexToId[objectLength];
        const lastObject: T = this.objects[objectLength];

        this.objects[indexOfRemovedElement] = lastObject;
        this.indexToId[indexOfRemovedElement] = idOfLastElement;
        this.idToIndex[idOfLastElement] = indexOfRemovedElement;
        this.idToIndex[id] = undefined;

        this.objects.pop();
        this.indexToId.pop();
        this.freeIds.push(id);

        return removedObject;
    }
}



// public Display(): void {
//     console.log("------------ID:INDEX------------");
//     this.idToIndex.forEach((i, id) => console.log(`${id}:${i}`));
//     console.log("------------INDEX:ID------------");
//     this.indexToId.forEach((id, i) => console.log(`${i}:${id}`));
//     console.log("------------VALUE------------");
//     this.objects.forEach((obj) => console.log(obj));
// }