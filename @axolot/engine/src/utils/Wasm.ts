export class WASM {
    private static rapier: typeof import("@dimforge/rapier2d") | undefined = undefined;

    public static async Load(): Promise<void> {
        WASM.RAPIER = await import("@dimforge/rapier2d");
    }

    public static get RAPIER() {
        return WASM.rapier;
    }

    private static set RAPIER(rapier: typeof import("@dimforge/rapier2d")) {
        if (WASM.rapier) throw new Error("Rapier already loaded");
        WASM.rapier = rapier;
    }
}