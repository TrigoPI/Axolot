export function AXOLOT_ASSERT(cond: any, msg: string): void {
    if (cond) throw new Error(msg);
}