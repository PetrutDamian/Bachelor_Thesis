import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import jwt from "koa-jwt";
import Koa from "koa";
import { timeLogger } from "./utils/Middleware";
import { exceptionHandler } from "./utils/Middleware";
import { authRouter } from "./application/AuthRouter";
import { recordRouter } from "./application/RecordingRouter";
import { jwtConfig } from "./utils/JwtConfig";
import { testRunner } from "./testing/TestRunner";
//testRunner.runTests();

const app = new Koa();

app.use(cors());
app.use(timeLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = "/api";

const publicApiRouter = new Router({ prefix });
publicApiRouter.use("/auth", authRouter.routes());
app.use(publicApiRouter.routes()).use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

const protectedApiRouter = new Router({ prefix });
protectedApiRouter.use("/recordings", recordRouter.routes());
app.use(protectedApiRouter.routes()).use(protectedApiRouter.allowedMethods());

app.listen(3000, () => {
  console.log("Server started...");
});
