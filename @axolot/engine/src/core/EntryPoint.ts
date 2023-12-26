import Application from "./Application";

export default function EntryPoint<T extends { new(): Application }>(target: T): void {    
    const app: Application = new target();
    Application.CreateApplication(app);
}