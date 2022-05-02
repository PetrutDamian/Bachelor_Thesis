export const timeLogger = async (ctx, next) => {
  const start = Date.now();
  console.log("request recived");
  console.log(JSON.stringify(ctx.request));
  await next();
  console.log(
    `${ctx.method} ${ctx.url} => ${ctx.response.status}, ${
      Date.now() - start
    }ms \nbody:${JSON.stringify(ctx.request.body)} \nresponse:${JSON.stringify(
      ctx.response
    )}`
  );
};
export const exceptionHandler = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    console.log("exception");
    console.log("err: " + err);
    ctx.body = { message: err.message || "Unexpected error." };
    ctx.status = err.status || 500;
  }
};
