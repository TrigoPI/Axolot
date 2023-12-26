import * as PIXI from "pixi.js";

import { PixiTexture, Texture } from "./Texture";

export default class Renderer {
    private renderer: PIXI.Renderer;
    private stage: PIXI.Container;

    public constructor() {
        this.renderer = undefined;
        this.stage = new PIXI.Container<PIXI.Sprite>();
    }

    public CreateCanvas(width: number, height: number): void {
        const background: string = "#2d3436";
        this.renderer = new PIXI.Renderer({ width, height, background });
        document.body.appendChild(<HTMLCanvasElement>this.renderer.view);
    }

    public ResizeView(width: number, height: number): void {
        this.renderer.resize(width, height);
    }

    public AddTexture(texture: Texture): void {
        const pixiSprite: PIXI.Sprite = (<PixiTexture>texture).GetSprite();
        this.stage.addChild(pixiSprite);
    }

    public EndScence(): void {
        this.renderer.render(this.stage);
    }
}
