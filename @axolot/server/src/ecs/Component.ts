import ComponentRegistery from "./ComponentRegistery";
import { ComponentClassObject, ComponentType } from "./Ecs-type";

export default function Component(name: string) {
    return <T>(target: ComponentClassObject<T>) => {
        const registery: ComponentRegistery = ComponentRegistery.GetInstance();
        const componentType: ComponentType = registery.RegisterComponent();
        (<any>target).GetType  = () => componentType;
        (<any>target).GetName  = () => name;
    }
}
