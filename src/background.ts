import { ChipData, LEVELS, SUBJECTS, LOCAL_STORAGE, SYNC_STORAGE } from './constants';
import StorageManager from "./content/storageManager";
import { Options } from './types';

const storageManager = new StorageManager();
const browserStorageSync = ((typeof browser !== 'undefined') && browser.storage.sync) ||
                         ((typeof chrome !== 'undefined') && (chrome.storage as any).promise.sync);
const initStorageManager = browserStorageSync.get('options').then((result: any) => {
  const options = result.options as Options;
  const useLocalStorage = options && !!options.useLocalStorage;
  storageManager.storageType = useLocalStorage ? LOCAL_STORAGE : SYNC_STORAGE;
});

const createPageTags = async (url: string) => {
  // const response = await fetch(url);
  // const text = await response.text();
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(text, 'text/html');
  const tags: ChipData[] = [
    { key: 0, label: 'Website' },
    { key: 1, label: LEVELS[Math.floor(Math.random() * LEVELS.length)] },
    { key: 2, label: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)] },
    { key: 3, label: 'VeryPaid' },
  ];
  return tags;
}

const getPageTags = async (url: string, callback: { (arg: ChipData[]): void; }) => {
  try {
    await initStorageManager;
    const tagData = await storageManager.fetchTags() || {};
    if (!(url in tagData)) {
      tagData[url] = await createPageTags(url);
      await storageManager.saveTags(tagData);
    }
    const tags = tagData[url];
    callback(tags);
  } catch (error) {
    console.error('Error:', error);
  }
};

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
  if (message.type === "searchResult") {
    getPageTags(message.url, senderResponse);
  }
  return true
});
