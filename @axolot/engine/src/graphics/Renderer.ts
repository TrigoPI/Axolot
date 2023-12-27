import * as PIXI from "pixi.js";

import { PixiTexture, Texture } from "./Texture";
import AxolotECS from "../ecs/AxolotECS";
import { Entity } from "../ecs/Ecs-type";
import { _SpriteRenderer, _Transform } from "../scene/Components";

export default class Renderer {
    private ecs: AxolotECS;
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

    public SetECS(ecs: AxolotECS) {
        this.ecs = ecs;
    }

    public ResizeView(width: number, height: number): void {
        this.renderer.resize(width, height);
    }

    public OnAddSpriteRenderer(entity: Entity): void {
        const [ transform, spriteRenderer ] = this.ecs.GetComponents(entity, _Transform, _SpriteRenderer);
        const texture: PixiTexture = <PixiTexture>spriteRenderer.texture;
        const sprite: PIXI.Sprite = new PIXI.Sprite(texture.texture);

        spriteRenderer.sprite = sprite;
        spriteRenderer.sprite.anchor.set(0.5);
        
        spriteRenderer.SetPosition(transform.position);
        spriteRenderer.SetScale(transform.scale);
        spriteRenderer.SetRotation(transform.rotation);
        
        this.stage.addChild(spriteRenderer.sprite);
    }

    public OnUpdateSpriteRenderer(entity: Entity): void {
        const [ transform, spriteRenderer ] = this.ecs.GetComponents(entity, _Transform, _SpriteRenderer);
        spriteRenderer.SetPosition(transform.position);
        spriteRenderer.SetScale(transform.scale);
        spriteRenderer.SetRotation(transform.rotation);
    }

    public EndScence(): void {
        this.renderer.render(this.stage);
    }
}
