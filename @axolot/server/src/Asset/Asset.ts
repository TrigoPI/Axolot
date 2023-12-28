export default class Asset {
    public readonly name: string;
    protected constructor(name: string) {
        this.name = name;
    }
}