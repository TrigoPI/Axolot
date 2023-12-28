import { Database, DatabaseReference, getDatabase, ref, set } from "firebase/database"
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { Application, AxolotEntity, BodyType, EntryPoint, RigidBody2D, Scene, Script, Transform } from "@axolot/server";

import Player from "./scripts/Player";
import { readFile } from "fs/promises";

@EntryPoint
export default class Server extends Application {
    private scene: Scene;

    private firebaseApp: FirebaseApp;
    private firebaseAuth: Auth;
    private rtDatabase: Database;
    
    private serverId: string;
    private serverRef: DatabaseReference;

    public override async OnStart(): Promise<void> {
        // await this.AuthToFirebase();
        
        this.CreateScene();
        this.SetGameTickRate(1000 / 60);
        this.SetServerTickRate(1000);
    }

    public override async OnRuntimeStart(): Promise<void> {
        this.scene.OnRuntimeStart();    
    }

    public override OnRuntimeUpdate(dt: number): void {
        this.scene.OnRuntimeUpdate(dt);
    }

    public override OnServerUpdate(): void {
        this.scene.OnServerUpdate();
    }

    private CreateScene(): void {
        this.scene = new Scene();

        const player: AxolotEntity = this.scene.CreateEntity("player");
        player.AddComponent(Transform, 500, 500);
        player.AddComponent(RigidBody2D, BodyType.STATIC);
        player.AddComponent(Script, Player);
    }

    private async AuthToFirebase(): Promise<void> {
        const buffer: Buffer = await readFile("../auth/firebase.auth.json");
        const credential: Record<string, any> = JSON.parse(buffer.toString());
        
        this.firebaseApp = initializeApp(credential);
        this.firebaseAuth = getAuth();
        
        onAuthStateChanged(this.firebaseAuth, (user: User) => {
            if (!user) return;
            this.serverId = user.uid;
            this.rtDatabase = getDatabase();
            this.serverRef = ref(this.rtDatabase, `server/${this.serverId}`);

            set(this.serverRef, {
                hello: "world"
            });
        });

        try {
            await signInAnonymously(this.firebaseAuth);
        } catch(e: any) {
            const errorCode = e.code;
            const errorMessage = e.message;
        
            console.log(errorCode);
            console.log(errorMessage);
        }
    }
}