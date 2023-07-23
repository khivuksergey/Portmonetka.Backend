const { createProxyMiddleware } = require("http-proxy-middleware");
const { env } = require("process");

//const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(";")[0] : "http://localhost:22114";

const context = [
    "/api/wallet",
    "/api/transaction",
    "/api/category",
    "/api/user"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        //target: target,
        target: "https://localhost:7000",//API Gateway
        secure: false,
        headers: {
            Connection: "Keep-Alive"
        }
    });

    app.use(appProxy);
};
