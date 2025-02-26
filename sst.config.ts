/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "my-sst-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const { table } = await import("./infra/storage");
    const { api } = await import("./infra/api");
    const { web } = await import("./infra/web");

    return {
      TestTable: table.name,
      ApiUrl: api.url,
      SiteUrl: web.url,
    }
  },
});
