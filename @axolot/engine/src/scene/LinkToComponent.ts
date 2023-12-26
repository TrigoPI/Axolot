import { ComponentClassObject } from "../ecs/Ecs-type";

export default function LinkToComponent<T>(componentClass: ComponentClassObject<T>) {
    return <K>(target: ComponentClassObject<K>) => {
        (<any>target).s_ComponentClass = componentClass;
    }
}