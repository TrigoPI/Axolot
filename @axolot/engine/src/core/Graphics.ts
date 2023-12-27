import * as PIXI from "pixi.js"

import { PixiTexture, Texture } from "../graphics/Texture";


type TextureKey = {
    White(): Texture,
}

export default class Graphics {
    private constructor() {};

    public static readonly Texture: TextureKey = {
        White: () => new PixiTexture(PIXI.Texture.WHITE),
    }
}