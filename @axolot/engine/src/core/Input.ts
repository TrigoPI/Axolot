import { Key } from "./Key";

type KeyState = 'RELEASED' | 'PRESSED';

export default class Input {
    public static readonly State: Record<KeyState, number> = { RELEASED: 0, PRESSED: 1 }

    public static readonly Key: Record<keyof typeof Key, number> = {
        SPACE: Input.State.RELEASED,
        ENTER: Input.State.RELEASED,

        A: Input.State.RELEASED,
        B: Input.State.RELEASED,
        C: Input.State.RELEASED,
        D: Input.State.RELEASED,
        E: Input.State.RELEASED,
        F: Input.State.RELEASED,
        G: Input.State.RELEASED,
        H: Input.State.RELEASED,
        I: Input.State.RELEASED,
        J: Input.State.RELEASED,
        K: Input.State.RELEASED,
        L: Input.State.RELEASED,
        M: Input.State.RELEASED,
        N: Input.State.RELEASED,
        O: Input.State.RELEASED,
        P: Input.State.RELEASED,
        Q: Input.State.RELEASED,
        R: Input.State.RELEASED,
        S: Input.State.RELEASED,
        T: Input.State.RELEASED,
        U: Input.State.RELEASED,
        V: Input.State.RELEASED,
        W: Input.State.RELEASED,
        X: Input.State.RELEASED,
        Y: Input.State.RELEASED,
        Z: Input.State.RELEASED
    } 
}