import { LEVELS, SUBJECTS } from './constants';
import { FilterData } from './types';

const createPageTags = async (url: string, callback: { (arg: FilterData[]): void; }) => {
  // const response = await fetch(url);
  // const text = await response.text();
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  const tags: FilterData[] = [
    { type: 'MEDIA_TYPE', tag: 'Website' },
    { type: 'LEVEL', tag: LEVELS[Math.floor(Math.random() * LEVELS.length)] },
    { type: 'SUBJECT', tag: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)] },
    { type: 'COST', tag: 'Free' },
  ];
  callback(tags);
}

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "searchResult") {
    createPageTags(message.url, senderResponse);
  }
  return true
});
