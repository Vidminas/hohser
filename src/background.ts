import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { htmlToText } from "html-to-text";
import urlMetadata = require("url-metadata");

import { COST_FILTER_OPTIONS, COST_FILTER_TYPE, LEVEL_FILTER_OPTIONS, LEVEL_FILTER_TYPE, MEDIA_TYPE_FILTER_TYPE, SUBJECT_FILTER_OPTIONS, SUBJECT_FILTER_TYPE } from './constants';
import { FilterData } from './types';

// From https://stackoverflow.com/questions/73825273/creating-a-zod-enum-from-an-object
function z_enumFromArray(array: string[]){
  return z.enum(["Unknown", ...array]);
}

const ResultSchema = z.object({
  subject: z_enumFromArray(SUBJECT_FILTER_OPTIONS.map(option => option[1])),
  level: z_enumFromArray(LEVEL_FILTER_OPTIONS.map(option => option[1])),
  cost: z_enumFromArray(COST_FILTER_OPTIONS.map(option => option[1])),
})

const openai = new OpenAI({ apiKey: "" });

const generateTags = async (url: string, callback: { (arg: FilterData[]): void; }) => {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type');
  let text: string;

  if (contentType.includes("text/html")) {
    const metadata = await urlMetadata(url, { includeResponseBody: true, parseResponseObject: response });
    const description = ((metadata["name"] || metadata["title"] || metadata["og:title"] || metadata["twitter:title"]) ?? "") + ((metadata["description"] || metadata["og:description"] || metadata["twitter:description"]) ?? "");
    text = description + "\n" + htmlToText(metadata["responseBody"]);
  } else {
    text = await response.text();
  }

  text = text.slice(0, 5000);
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are a helpful AI assistant. From the following website text, determine 3 things: 1) the subject area, 2) the level of intended audience, and 3) cost to access this page, if possible. If this information cannot be determined, write "Unknown"' },
    { role: 'user', content: `## Website text:\n\n${text}` },
    { role: 'user', content: `## Tasks: What is the subject area from ${SUBJECT_FILTER_OPTIONS.map(option => option[1]).join(', ')}? What is the level of intended audience from ${LEVEL_FILTER_OPTIONS.map(option => option[1]).join(', ')}? What is the cost to access this page from ${COST_FILTER_OPTIONS.map(option => option[1]).join(', ')}?` },
  ];
  console.log("Asking ChatGPT:", messages);

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages,
    response_format: zodResponseFormat(ResultSchema, "SubjectLevelCostSchema"),
  });

  const result = completion.choices[0].message.parsed;
  console.log("ChatGPT response:", result);
  
  const tags: FilterData[] = [
    { type: MEDIA_TYPE_FILTER_TYPE, tag: contentType.includes('image') ? 'Image' : contentType.includes('video') ? 'Video' : contentType.includes('pdf') ? 'Document' : 'Website' },
  ];
  if (result.subject && result.subject !== "Unknown") {
    tags.push({ type: SUBJECT_FILTER_TYPE, tag: result.subject });
  }
  if (result.level && result.level !== "Unknown") {
    tags.push({ type: LEVEL_FILTER_TYPE, tag: result.level });
  }
  if (result.cost && result.cost !== "Unknown") {
    tags.push({ type: COST_FILTER_TYPE, tag: result.cost });
  }
  callback(tags);
};

const createPageTags = async (url: string, callback: { (arg: FilterData[]): void; }) => {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type');
  const tags: FilterData[] = [
    { type: MEDIA_TYPE_FILTER_TYPE, tag: contentType.includes('image') ? 'Image' : contentType.includes('video') ? 'Video' : contentType.includes('pdf') ? 'Document' : 'Website' },
  ];
  callback(tags);
}

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "searchResult") {
    createPageTags(message.url, senderResponse);
  } else if (message.type === "generateTags") {
    generateTags(message.url, senderResponse);
  }
  return true
});
