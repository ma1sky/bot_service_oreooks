import { Scenes } from "telegraf";
import { authUser } from "../services/auth.service.js";
import { formatGreeting } from "../messages/auth.message.js";
export const authScene = new Scenes.BaseScene("auth");
authScene.enter(async (ctx) => {
    const result = await authUser("", "", ctx.from.id);
    if (result.success) {
        await ctx.reply("Вы уже авторизованы");
        return ctx.scene.enter("menuScene");
    }
    if (result.reason === "not_found") {
        ctx.scene.session.auth = {
            login: "",
            password: "",
            step: "login"
        };
        return ctx.reply("Введите логин:");
    }
    return ctx.reply("Ошибка сервера");
});
authScene.on("text", async (ctx) => {
    const auth = ctx.scene.session.auth;
    // 1. ввод логина
    if (!auth.login) {
        auth.login = ctx.message.text;
        auth.step = "password";
        return ctx.reply("Введите пароль:");
    }
    // 2. ввод пароля
    if (!auth.password) {
        auth.password = ctx.message.text;
        try {
            const result = await authUser(auth.login, auth.password, ctx.from?.id);
            auth.isAuth = result.success;
            if (!result.success) {
                return ctx.reply("Ошибка авторизации");
            }
            await ctx.reply("Авторизация успешна!");
            return ctx.scene.enter("menuScene");
        }
        catch (err) {
            return ctx.reply("Ошибка сервера. Попробуйте позже.");
        }
    }
});
//# sourceMappingURL=auth.scene.js.map