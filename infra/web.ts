const bucket = new sst.aws.Bucket("MyBucket");

export const web = new sst.aws.SvelteKit("MyWeb", {
    path: "./web",
    link: [bucket],
});