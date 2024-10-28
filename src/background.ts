import { COST_FILTER_TYPE, LEVEL_FILTER_OPTIONS, LEVEL_FILTER_TYPE, MEDIA_TYPE_FILTER_TYPE, SUBJECT_FILTER_OPTIONS, SUBJECT_FILTER_TYPE } from './constants';
import { FilterData } from './types';

const createPageTags = async (url: string, callback: { (arg: FilterData[]): void; }) => {
  // const response = await fetch(url);
  // const text = await response.text();
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  const tags: FilterData[] = [
    { type: MEDIA_TYPE_FILTER_TYPE, tag: 'Website' },
    { type: LEVEL_FILTER_TYPE, tag: LEVEL_FILTER_OPTIONS[Math.floor(Math.random() * LEVEL_FILTER_OPTIONS.length)][1] },
    { type: SUBJECT_FILTER_TYPE, tag: SUBJECT_FILTER_OPTIONS[Math.floor(Math.random() * SUBJECT_FILTER_OPTIONS.length)][1] },
    { type: COST_FILTER_TYPE, tag: 'Free' },
  ];
  callback(tags);
}

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "searchResult") {
    createPageTags(message.url, senderResponse);
  }
  return true
});
