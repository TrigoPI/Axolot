import * as PIXI from "pixi.js"

export interface Texture {
    GetWidth(): number 
    GetHeight(): number
}

export class PixiTexture implements Texture {
    public readonly texture: PIXI.Texture;

    public constructor(texture: PIXI.Texture) {
        this.texture = texture;
    }

    public GetWidth(): number {
        return this.texture.width;
    }

    public GetHeight(): number  {
        return this.texture.height;
    }
}