import { ComponentPool, IComponentPool } from "./ComponentPool";
import { ComponentType } from "./Ecs-type";

export default class ComponentRegistery {
    private static sInstance: ComponentRegistery | undefined = undefined;

    private type: ComponentType;
    private pools: IComponentPool[];

    private constructor() {
        this.type = 0;
        this.pools = [];
    }


    public GetPools(): IComponentPool[] {
        return this.pools;
    }

    public RegisterComponent<T>(): ComponentType {
        const pool: ComponentPool<T> = new ComponentPool();
        this.pools[this.type] = pool; 
        return this.type++;
    }

    public static GetInstance(): ComponentRegistery {
        if (!ComponentRegistery.sInstance) ComponentRegistery.sInstance = new ComponentRegistery();
        return ComponentRegistery.sInstance;
    }

    public static GetPools(): IComponentPool[] {
        const registery = ComponentRegistery.GetInstance();
        return registery.GetPools();
    }
}