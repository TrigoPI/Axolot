import { Clock } from "../math";

export default class Application {
    private static created: boolean = false;

    private serverTickRate: number;
    private gameTickRate: number;

    private running: boolean;
    private gameLoopTimeout: NodeJS.Timeout;
    private serverLoopTimeout: NodeJS.Timeout;
    private dtClock: Clock;

    public constructor() {
        this.dtClock = new Clock();
        this.gameTickRate = 1000 / 60;
        this.serverTickRate = 1000 / 5;
        this.running = true;

        this.gameLoopTimeout = undefined;
        this.serverLoopTimeout = undefined;
    }

    public async OnStart(): Promise<void> {};
    public async OnRuntimeStart(): Promise<void> {};
    public async OnShutdown(): Promise<void> {};
    
    public OnServerUpdate(): void {};
    public OnRuntimeUpdate(dt: number): void {};

    public Stop(): void {
        this.running = false;
    }

    public SetGameTickRate(rate: number): void {
        this.gameTickRate = rate;
    }

    public SetServerTickRate(rate: number): void {
        this.serverTickRate = rate;
    }

    private ShutDown(): void {
        clearInterval(this.gameLoopTimeout);
        clearInterval(this.serverLoopTimeout);
    }

    private async Update(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.gameLoopTimeout = setInterval(() => {
                const dt: number = this.dtClock.ResetSecond();

                if (!this.running) {
                    resolve();
                    return;
                }
                
                this.OnRuntimeUpdate(dt);
            }, this.gameTickRate);

            this.serverLoopTimeout = setInterval(() => {
                this.OnServerUpdate();
            }, this.serverTickRate);
        });
    }

    public static async CreateApplication(app: Application): Promise<void> {
        if (Application.created) throw new Error("Application already created");
        await app.OnStart();

        await app.OnRuntimeStart();
        await app.Update();

        app.ShutDown();
        await app.OnShutdown();
    }
}