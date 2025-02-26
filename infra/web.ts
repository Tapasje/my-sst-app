import { getDomainConfig } from "../lib/utils";

const { domain } = await getDomainConfig();

export const web = new sst.aws.StaticSite("MyWeb", {
    build: {
        command: "npm run build",
        output: "dist",
    },
    domain,
    path: "./web",
});