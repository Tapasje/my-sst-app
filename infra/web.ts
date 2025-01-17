export const web = new sst.aws.StaticSite("MyWeb", {
    build: {
        command: "npm run build",
        output: "dist",
    },
    path: "./web",
});