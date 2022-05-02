import Router from "koa-router";
export const authRouter = new Router();
import { authentificationService } from "../service/AuthentificationService";

authRouter.post("/login", async (ctx) => {
  const credentials = ctx.request.body;
  try {
    const token = await authentificationService.login(
      credentials.email,
      credentials.password
    );
    console.log(token);
    ctx.response.status = 200;
    ctx.response.body = { token: token };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = error.message;
  }
});
authRouter.post("/register", async (ctx) => {
  const credentials = ctx.request.body;
  try {
    await authentificationService.register(
      credentials.email,
      credentials.password
    );
    ctx.response.status = 200;
  } catch (Error) {
    ctx.response.status = 400;
    ctx.response.body = error.message;
  }
});
authRouter.put("/activate/:id", async (ctx) => {
  const id = ctx.params.id;
  try {
    authentificationService.activateEmail(id);
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 400;
  }
});
