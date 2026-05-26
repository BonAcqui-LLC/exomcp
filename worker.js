export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.exomcp.com") {
      return Response.redirect(`https://exomcp.com${url.pathname}${url.search}${url.hash}`, 301);
    }
    return env.ASSETS.fetch(request);
  },
  async email(message, env, ctx) {
    await message.forward("ceo@bonacqui.com");
  }
};
