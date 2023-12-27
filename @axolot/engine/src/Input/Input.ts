import { Vec2, Vector2 } from "../math";
import { Key } from "./Key";

export enum InputState {
    RELEASED = 0,
    PRESSED  = 1
}

export class Input {
    private static readonly s_Mouse: Vector2 = new Vec2(0, 0);

    private static readonly s_Key: Record<keyof typeof Key, InputState> = {
        BUTTON_0: InputState.RELEASED,
        BUTTON_1: InputState.RELEASED,
        BUTTON_2: InputState.RELEASED,

        SPACE: InputState.RELEASED,
        ENTER: InputState.RELEASED,

        A: InputState.RELEASED,
        B: InputState.RELEASED,
        C: InputState.RELEASED,
        D: InputState.RELEASED,
        E: InputState.RELEASED,
        F: InputState.RELEASED,
        G: InputState.RELEASED,
        H: InputState.RELEASED,
        I: InputState.RELEASED,
        J: InputState.RELEASED,
        K: InputState.RELEASED,
        L: InputState.RELEASED,
        M: InputState.RELEASED,
        N: InputState.RELEASED,
        O: InputState.RELEASED,
        P: InputState.RELEASED,
        Q: InputState.RELEASED,
        R: InputState.RELEASED,
        S: InputState.RELEASED,
        T: InputState.RELEASED,
        U: InputState.RELEASED,
        V: InputState.RELEASED,
        W: InputState.RELEASED,
        X: InputState.RELEASED,
        Y: InputState.RELEASED,
        Z: InputState.RELEASED,
    }

    public static get Mouse(): Vector2 {
        return this.s_Mouse;
    }

    public static IsPressed(key: Key): boolean {
        return Input.s_Key[key] == InputState.PRESSED
    }

    public static IsReleased(key: Key): boolean {
        return Input.s_Key[key] == InputState.RELEASED
    }
}