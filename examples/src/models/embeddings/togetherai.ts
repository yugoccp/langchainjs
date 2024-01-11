import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";

/* Embed queries */
const embeddings = new TogetherAIEmbeddings({
  apiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.TOGETHER_AI_API_KEY
  batchSize: 48, // Default value if omitted is 48. Max value is 96
  modelName: "togethercomputer/m2-bert-80M-8k-retrieval" // Default value if omitted is "togethercomputer/m2-bert-80M-8k-retrieval"
});
const res = await embeddings.embedQuery("Hello world");
console.log(res);
/* Embed documents */
const documentRes = await embeddings.embedDocuments(["Hello world", "Bye bye"]);
console.log({ documentRes });
