import { test } from "@jest/globals";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { FakeChatModel, FakeListChatModel } from "../../utils/testing/index.js";

test("Test ChatModel uses callbacks", async () => {
  const model = new FakeChatModel({});
  let acc = "";
  const response = await model.invoke("Hello there!", {
    callbacks: [
      {
        handleLLMNewToken: (token: string) => {
          console.log(token);
          acc += token;
        },
      },
    ],
  });
  expect(response.content).toEqual(acc);
});

test("Test ChatModel uses callbacks with a cache", async () => {
  const model = new FakeChatModel({
    cache: true,
  });
  let acc = "";
  const response = await model.invoke("Hello there!");
  const response2 = await model.invoke("Hello there!", {
    callbacks: [
      {
        handleLLMNewToken: (token: string) => {
          console.log(token);
          acc += token;
        },
      },
    ],
  });
  expect(response.content).toEqual(response2.content);
  expect(response2.content).toEqual(acc);
});

test("Test ChatModel uses callbacks with a cache", async () => {
  const model = new FakeChatModel({
    cache: true,
  });
  let acc = "";
  const response = await model.invoke("Hello there!");
  const response2 = await model.invoke("Hello there!", {
    callbacks: [
      {
        handleLLMNewToken: (token: string) => {
          console.log(token);
          acc += token;
        },
      },
    ],
  });
  expect(response.content).toEqual(response2.content);
  expect(response2.content).toEqual(acc);
});

test("Test ChatModel legacy params withStructuredOutput", async () => {
  const model = new FakeListChatModel({
    responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
  }).withStructuredOutput({
    includeRaw: false,
    schema: z.object({
      test: z.boolean(),
      nested: z.object({
        somethingelse: z.string(),
      }),
    }),
  });
  const response = await model.invoke("Hello there!");
  // @ts-expect-error not in run output type
  console.log(response.notthere);
  console.log(response.nested.somethingelse);
  expect(response).toEqual({
    test: true,
    nested: { somethingelse: "somevalue" },
  });
});

// test("Test ChatModel legacy params includeRaw withStructuredOutput", async () => {
//   const model = new FakeListChatModel({
//     responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
//   }).withStructuredOutput({
//     includeRaw: true,
//     schema: z.object({
//       test: z.boolean(),
//       nested: z.object({
//         somethingelse: z.string(),
//       }),
//     }),
//   });
//   const response = await model.invoke("Hello there!");
//   // @ts-expect-error legacy
//   console.log(response.nested);
//   console.log(response.parsed.nested);
// });

test("Test ChatModel withStructuredOutput with supplied type arg", async () => {
  const model = new FakeListChatModel({
    responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
  }).withStructuredOutput<{ forcedArg: number }>({
    includeRaw: false,
    schema: z.object({
      test: z.boolean(),
      nested: z.object({
        somethingelse: z.string(),
      }),
    }),
  });
  const response = await model.invoke("Hello there!");
  // @ts-expect-error run output type forced to something else
  console.log(response.nested.somethingelse);
  // No error here
  console.log(response.forcedArg);
  expect(response).toEqual({
    test: true,
    nested: { somethingelse: "somevalue" },
  });
});

test("Test ChatModel withStructuredOutput new syntax", async () => {
  const model = new FakeListChatModel({
    responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
  }).withStructuredOutput<{ forcedArg: number }>(
    z.object({
      test: z.boolean(),
      nested: z.object({
        somethingelse: z.string(),
      }),
    })
  );
  const response = await model.invoke("Hello there!");
  // @ts-expect-error run output type forced to something else
  console.log(response.nested.somethingelse);
  // No error here
  console.log(response.forcedArg);
  expect(response).toEqual({
    test: true,
    nested: { somethingelse: "somevalue" },
  });
});

test("Test ChatModel withStructuredOutput new syntax and JSON schema", async () => {
  const model = new FakeListChatModel({
    responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
  }).withStructuredOutput(
    zodToJsonSchema(
      z.object({
        test: z.boolean(),
        nested: z.object({
          somethingelse: z.string(),
        }),
      })
    )
  );
  const response = await model.invoke("Hello there!");
  // No error here
  console.log(response.nested.somethingelse);
  // Also no error here
  console.log(response.forcedArg);
  expect(response).toEqual({
    test: true,
    nested: { somethingelse: "somevalue" },
  });
});

test("Test ChatModel withStructuredOutput new syntax and includeRaw", async () => {
  const model = new FakeListChatModel({
    responses: [`{ "test": true, "nested": { "somethingelse": "somevalue" } }`],
  }).withStructuredOutput(
    z.object({
      test: z.boolean(),
      nested: z.object({
        somethingelse: z.string(),
      }),
    }),
    { includeRaw: true }
  );
  const response = await model.invoke("Hello there!");
  // @ts-expect-error run output includes raw
  console.log(response.nested.somethingelse);
  // No error
  console.log(response.parsed);
});
