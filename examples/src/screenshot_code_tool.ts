import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { HumanMessage } from "langchain/schema";
import fs from "node:fs/promises";

const visionModel = new ChatOpenAI({
  modelName: "gpt-4-vision-preview",
});

const textModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
});

const chatGptScreenshot = await fs;
const screenshotMessage = new HumanMessage({
  content: [
    {
      type: "image_url",
      image_url: {
        url: "data:image/jpeg;base64,{base64_image}",
      },
    },
  ],
});
const prompt = ChatPromptTemplate.fromMessages([
  [
    "ai",
    "Given the following screenshot of a website, return the React.JS and TailwindCSS code needed to create a clone of it. Include all React.JS code in a single functional component.",
  ],
]);
