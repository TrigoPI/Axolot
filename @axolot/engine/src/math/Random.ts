export default class Random {
    public static uuidv4(): string {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) => {
            const n: number = Number(c);
            return (n ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> n / 4).toString(16)
        });
    }
}