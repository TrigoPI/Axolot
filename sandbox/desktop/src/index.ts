import { resolve } from "path";
import { Application, EntryPoint } from "@axolot/desktop";

@EntryPoint
export default class SandboxDesktopApp extends Application {
    private webPath: string;

    public override async OnStart(): Promise<void> {
        this.webPath = resolve("../web/public", "index.html");
        this.SetIndexPath(this.webPath);
    }
}