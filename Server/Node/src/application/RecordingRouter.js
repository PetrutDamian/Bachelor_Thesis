import Router from "koa-router";
import { RecordingsDatabase } from "../persistence/RecordingsDB";
import { recordingsService } from "../service/RecordingsService";
export const recordRouter = new Router();

const koaBody = require("koa-body")({ multipart: true, uploadDir: "." });

recordRouter.post("/upload", koaBody, async (ctx) => {
  const { path, name } = ctx.request.files.file;

  const ripe = await recordingsService.submitRecording(
    path,
    name,
    ctx.state.user._id
  );
  ctx.response.body = ripe;
  ctx.response.status = 200;
});

recordRouter.get("/", koaBody, async (ctx) => {
  const userId = ctx.state.user._id;
  const recordings = await recordingsService.getRecordingsHistory(userId);
  ctx.response.body = recordings;
  ctx.response.status = 200;
});
