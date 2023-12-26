import RAPIER from "@dimforge/rapier2d"

type BodyTypeKeys = {
    DYNAMIC : RAPIER.RigidBodyType
    STATIC  : RAPIER.RigidBodyType
}

export default class Physics {
    public static readonly BodyType: BodyTypeKeys = {
        DYNAMIC : 0,
        STATIC  : 1,
    }
}