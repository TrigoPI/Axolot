export default class Clock {
    private start: number;

    constructor() {
        this.start = Date.now();
    }

    public GetTimeSecond(): number {
        return (Date.now() - this.start) / 1000;
    }

    public GetTimeMilli(): number {
        return (Date.now() - this.start);
    }

    public ResetSecond(): number {
        const tmp: number = (Date.now() - this.start) / 1000;
        this.start = Date.now();
        return tmp;
    }  

    public ResetMilli(): number {
        const tmp: number = Date.now() - this.start;
        this.start = Date.now();
        return tmp;
    }

    public Reset(): void {
        this.start = Date.now();
    }
}