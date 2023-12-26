import { app, BrowserWindow } from "electron"
import { AXOLOT_ASSERT } from "./Assert";

export default class Window {
    private width: number;
    private height: number;
    private win: BrowserWindow | undefined;

    public constructor() {
        this.width = 1080;
        this.height = 720;
        this.win = undefined;
    }

    public SetWindowSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public async Create(index: string): Promise<void> {
        AXOLOT_ASSERT(this.win, "Window already created");
        await app.whenReady();
        const width: number = this.width;
        const height: number = this.height;
        this.win = new BrowserWindow({ width, height });
        this.win.loadFile(index);
    }
}