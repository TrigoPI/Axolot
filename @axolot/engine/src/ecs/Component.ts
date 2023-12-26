import ComponentRegistery from "./ComponentRegistery";
import { ComponentClassObject, ComponentType } from "./Ecs-type";

export default function Component<T>(target: ComponentClassObject<T>) {
    const registery: ComponentRegistery = ComponentRegistery.GetInstance();
    const componentType: ComponentType = registery.RegisterComponent();
    (<any>target).toString = () => `${componentType}`;
    (<any>target).GetType  = () => componentType;
    (<any>target).GetClass = () => target;
}
