const domain = "portal.oncosignal.com";

export const api = new sst.aws.ApiGatewayV2("MyApi", {
    accessLog: {
        retention: "1 year",
    },
    domain: {
        name: `api.${domain}`,
        path: "",
    },
});
api.route("GET /", {
    handler: "packes/functions/src/api.handler",
});