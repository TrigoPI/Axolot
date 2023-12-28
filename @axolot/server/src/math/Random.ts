import { randomUUID } from "crypto";

export default class Random {
    public static uuidv4(): string {
        return randomUUID();
    }
}