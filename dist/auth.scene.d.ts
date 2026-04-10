import { Scenes } from 'telegraf';
export interface LoginSceneSession extends Scenes.SceneSessionData {
    step?: string;
    login?: string;
}
export type OreooksContext = Scenes.SceneContext<LoginSceneSession>;
export declare const loginScene: Scenes.BaseScene<OreooksContext>;
//# sourceMappingURL=auth.scene.d.ts.map