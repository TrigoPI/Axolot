import * as PIXI from "pixi.js"

export interface Texture {
    GetWidth(): number 
    GetHeight(): number
    GetColor(): string
    SetColor(color: string): void
}

export class PixiTexture implements Texture {
    private pixiSprite: PIXI.Sprite;

    public constructor(pixiTexture: PIXI.Texture) {
        this.pixiSprite = new PIXI.Sprite(pixiTexture);
        this.pixiSprite.anchor.set(0.5);
    }

    public GetSprite(): PIXI.Sprite {
        return this.pixiSprite;
    }

    public GetWidth(): number {
        return this.pixiSprite.texture.width;
    }

    public GetHeight(): number  {
        return this.pixiSprite.texture.height;
    }

    public GetColor(): string {
        return `#${this.pixiSprite.tintValue.toString(16)}`;
    } 

    public SetColor(color: string): void {
        this.pixiSprite.tint = color;
    }

    public SetPosition(x: number, y: number): void {
        this.pixiSprite.position.x = x;
        this.pixiSprite.position.y = y;
    }

    public SetScale(x: number, y: number): void {
        this.pixiSprite.scale.x = x;
        this.pixiSprite.scale.y = y;
    }

    public SetRotation(r: number): void {
        this.pixiSprite.rotation = r;
    }
}