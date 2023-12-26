import { AXOLOT_ASSERT } from "./Assert";
import Window from "./Window";

export default class Application {
    private static created: boolean = false;

    private window: Window;
    private index: string;

    public constructor() {
        this.window = new Window();
        this.index = "";
    }

    public async OnStart(): Promise<void> {}

    public SetIndexPath(path: string): void {
        this.index = path;
    }

    public SetWindowSize(width: number, height: number): void {
        this.window.SetWindowSize(width, height);
    }

    private async Start(): Promise<void> {
        await this.window.Create(this.index);
    }

    public static async CreateApplication(app: Application): Promise<void> {
        AXOLOT_ASSERT(Application.created, "Application already created");
        
        await app.OnStart();
        await app.Start();
    }
}