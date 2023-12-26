import * as PIXI from "pixi.js"

import { PixiTexture, Texture } from "../graphics/Texture";


type TextureKey = {
    White(): Texture,
    Color(color: string): Texture
}

export default class Graphics {
    public static readonly Texture: TextureKey = {
        White: () => new PixiTexture(PIXI.Texture.WHITE),
        Color: (color: string) => {            
            const texture: PixiTexture =  new PixiTexture(PIXI.Texture.WHITE)
            texture.SetColor(color);
            return texture;
        }
    }

    private constructor() {};
}