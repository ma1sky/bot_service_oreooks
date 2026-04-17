import { Scenes } from "telegraf";
import type { BotContext } from "../types.js";
import { authUser, isAuth } from "../api/auth.api.js";
import { formatAuth } from "../messages/auth.message.js";

export const loginScene = new Scenes.BaseScene<BotContext>("login");

loginScene.enter(async (ctx) => {
  	ctx.scene.session.auth = {
		login: "",
		step: "login",
		isAuth: await isAuth(ctx.from?.id as number),
  	};

  	ctx.reply(formatAuth(ctx.from?.first_name as string));
});

loginScene.on("text", async (ctx) => {
    if (ctx.scene.session.auth.login == "") {
      	ctx.scene.session.auth.login = ctx.message.text;
      	return ctx.reply("Введите пароль:");
    }

  	let login = ctx.scene.session.auth.login;
  	let password = ctx.message.text;

 	try {
    	ctx.scene.session.auth.isAuth = await authUser(login, password);
    	await ctx.reply(`Авторизация прошла успешно!`);
  	} catch (err) {
    	return await ctx.reply(
			`Произошла ошибка, попробуйте ввести данные заного. Сначала введите логин.`,
    	);
  	}

	ctx.scene.enter("menuScene");
});
