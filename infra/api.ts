import { getDomainConfig } from "../lib/utils";

const { domain } = await getDomainConfig();

export const api = new sst.aws.ApiGatewayV2("MyApi", {
    accessLog: {
        retention: "1 year",
    },
    domain: {
        name: `api.${domain}`,
        path: "v1",
    },
});
api.route("GET /", "packages/functions/src/getItems.handler", {
    auth: { iam: true }
});