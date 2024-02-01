import { logVersion010MigrationWarning } from "../util/entrypoint_deprecation.js";

/* #__PURE__ */ logVersion010MigrationWarning({
  oldEntrypointName: "embeddings/base",
  newEntrypointName: "embeddings",
  newPackageName: "@langchain/core",
});
export * from "@langchain/core/embeddings";
