export default class Queue<T> {
    private buffer: T[];

    public constructor() {
        this.buffer = [];
    }

    public Size(): number {
        return this.buffer.length;
    }

    Pop(): T {
        return this.buffer.shift();
    }

    Push(a: T): void {
        this.buffer.push(a);
    }

}