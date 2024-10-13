import StorageManager from "./content/storageManager";
import { SearchEngineConfig, DisplayStyle, Color, Domain, DomainsCounters } from "./types";
import * as config from "./config";
import { PARTIAL_HIDE, FULL_HIDE, HIGHLIGHT, LOCAL_STORAGE, SYNC_STORAGE } from "./constants";
import './content.scss';
import { Options } from './types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ResultManagement } from './components/Content/ResultManagement';
import { ResizeObserver } from './mock/ResizeObserver';
import { DomainsCounter } from './components/Content/DomainsCounter';
import FilterDropdown from './components/FilterDropdown/FilterDropdown';
import Image from "@mui/icons-material/Image";
import VideoLibrary from "@mui/icons-material/VideoLibrary";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import Web from "@mui/icons-material/Web";
import Palette from "@mui/icons-material/Palette";
import Diversity3 from "@mui/icons-material/Diversity3";
import Science from "@mui/icons-material/Science";
import Spa from "@mui/icons-material/Spa";
import Translate from "@mui/icons-material/Translate";
import Synagogue from "@mui/icons-material/Synagogue";
import Calculate from "@mui/icons-material/Calculate";
import Handyman from "@mui/icons-material/Handyman";
import MoneyOff from "@mui/icons-material/MoneyOff";
import Paid from "@mui/icons-material/Paid";
import Payments from "@mui/icons-material/Payments";

// Initialize storage manager
const storageManager = new StorageManager();
let options: Options;

// Determine search engine and apply right config
const searchEngine = (location.host.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/) || [])[1];
const searchEngineConfig: SearchEngineConfig = config[searchEngine];

// Array of management component anchors
const managementComponentAnchors: Array<Element> = [];

function processNavbar() {
  if (!searchEngineConfig.toolsBarSelector)
    return null;

  if (searchEngineConfig.toolsButtonSelector) {
    const toolsButton: HTMLDivElement | null = document.querySelector(
      searchEngineConfig.toolsButtonSelector
    );

    if (toolsButton && (!searchEngineConfig.toolsButtonSelectedClass || !document.querySelector(searchEngineConfig.toolsButtonSelectedClass))) {
      toolsButton.click();
    }
  }

  const toolsBar: HTMLDivElement | null = document.querySelector(
    searchEngineConfig.toolsBarSelector
  );
  if (!toolsBar)
    return null;

  toolsBar.style.height = "auto";

  const insideToolBar = toolsBar.firstElementChild as HTMLDivElement;
  insideToolBar.style.alignItems = "end";

  const container = document.createElement("div");
  insideToolBar.insertBefore(container, insideToolBar.children[1]);
  let colourScheme = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') as 'light' | 'dark';
  if (colourScheme !== 'light' && colourScheme !== 'dark') {
    const bodyBackground = getComputedStyle(document.body).getPropertyValue('background-color');
    if (bodyBackground === 'rgb(255, 255, 255)') {
        colourScheme = 'light';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        colourScheme = 'dark';
    } else {
        colourScheme = 'light';
    }
  }
  ReactDOM.render(
  <>
    <FilterDropdown
      label={"Media types"}
      colourScheme={colourScheme}
      options={[
        [Image, "Images"],
        [VideoLibrary, "Videos"],
        [PictureAsPdf, "Documents"],
        [Web, "Websites"],
      ]}
    />
    <FilterDropdown
      label={"Subjects"}
      colourScheme={colourScheme}
      options={[
        [Palette, "Expressive Arts"],
        [Diversity3, "Social studies"],
        [Science, "Sciences"],
        [Spa, "Health and wellbeing"],
        [Translate, "Languages"],
        [Synagogue, "Religious and moral education"],
        [Calculate, "Numeracy and mathematics"],
        [Handyman, "Technologies"],
      ]}
    />
    <FilterDropdown
      label={"Levels"}
      colourScheme={colourScheme}
      options={[
        [null, "BGE Early (ELC and P1)"],
        [null, "BGE First (P2-P4)"],
        [null, "BGE Second (P5-P7)"],
        [null, "BGE Third (S1-S3)"],
        [null, "National 3 (S3)"],
        [null, "National 4 (S4)"],
        [null, "National 5 (S4)"],
        [null, "Higher (S5-S6)"],
        [null, "Advanced Higher (S5-S6)"],
      ]}
    />,
    <FilterDropdown
      label={"Cost"}
      colourScheme={colourScheme}
      options={[
        [MoneyOff, "Free"],
        [Payments, "Subscription"],
        [Paid, "Paid"],
      ]}
    />
  </>, container);

  return toolsBar;
}

// Turn array of RGBA values into CSS `rgba` function call
function getRgbCss (color: Array<number>, alpha = 1): string {
  return `rgba(${color.map(Math.floor).join(', ') || null}, ${alpha})`;
}

function hexToRgb (h: any): Array<number> {
  const r = "0x" + h[0] + h[1];
  const g = "0x" + h[2] + h[3];
  const b = "0x" + h[4] + h[5];
  return [+r, +g, +b];
}

// Apply styles to matches results
function applyResultStyle (
  result: HTMLElement,
  color: Color,
  displayStyle: DisplayStyle,
  options: Options,
): void {
  const domainColors = {
    COLOR_1: [245, 0, 87],
    COLOR_2: [139, 195, 74],
    COLOR_3: [3, 169, 244]
  };
  // Add custom highlight colors to the domainColors list
  options?.highlightColors?.forEach((color: string, i: number) => {
    domainColors[`COLOR_${i+4}`] = color.includes('super') ? color : hexToRgb(color);
  });
  const alpha = 0.12;
  if (displayStyle === HIGHLIGHT && Array.isArray(domainColors[color])) {
    result.classList.add("hohser_highlight");
    result.setAttribute('style', `background-color: ${getRgbCss(domainColors[color], alpha)}${!options || options?.forceColors ? '!important' : ''}`);
    result.style.transition = `.5s`;
    result.style.boxShadow = `0 0 0 5px ${getRgbCss(domainColors[color], alpha)}`;
  } else if (displayStyle === PARTIAL_HIDE) {
    result.classList.add("hohser_partial_hide");
    if (options?.partialHideOpacity) {
      result.setAttribute('style', `opacity: ${options?.partialHideOpacity / 100}`);
    }
  } else if (displayStyle === FULL_HIDE && (!options || !options?.showAll)) {
    result.classList.add("hohser_full_hide");
  } else if (displayStyle === FULL_HIDE && options && options?.showAll) {
    result.classList.add("hohser_partial_hide");
  } else if (!Array.isArray(domainColors[color])) {
    result.classList.add(domainColors[color]);
  }
}

// Remove styles from result
function removeResultStyle (
  result: HTMLElement
): void {
  result.classList.remove("hohser_highlight");
  result.classList.remove("hohser_partial_hide");
  result.classList.remove("hohser_full_hide");
  result.style.backgroundColor = '';
  result.style.boxShadow = '';
}

const fetchedMap = {};

// Process one result
function processResult (r: Element, domainList: any, options: any, processResultsAttempt: number): DisplayStyle | null {
  let displayStyle: DisplayStyle | null = null;
  try {
    const result = r as HTMLElement;
    result.classList.add('hohser_result', 'hohser_result-' + searchEngine);
    const domain = searchEngineConfig.resultUrlSelector &&
      result.querySelector(
        searchEngineConfig.resultUrlSelector
      ) as HTMLAnchorElement ||
      result.querySelector(
        searchEngineConfig.domainSelector
      ) as HTMLElement;
    // Skip result if no domain selector
    if (!domain) return displayStyle;

    const url = searchEngineConfig.domainSelectorForceText ?
      (domain as HTMLElement).innerText :
      (domain as HTMLAnchorElement).href || (domain as HTMLElement).innerText;
    if (!url) {
      throw new Error("No domain info");
    }

    let matchedString: string | null = null;

    if (!fetchedMap[url]) {
      fetchedMap[url] = true;
      chrome.runtime.sendMessage({type: "searchResult", url: url}, function(text) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const article = doc.querySelector('p');
          // `document.querySelector` may return null if the selector doesn't match anything.
          if (article) {
            const articleText = article.textContent;
            const wordMatchRegExp = /[^\s]+/g; // Regular expression
            const words = articleText.matchAll(wordMatchRegExp);
            // matchAll returns an iterator, convert to array to get word count
            const wordCount = [...words].length;
            const readingTime = Math.round(wordCount / 200);
            const badge = document.createElement("p");
            // Use the same styling as the publish information in an article's header
            badge.classList.add("color-secondary-text", "type--caption");
            badge.textContent = `⏱️ ${readingTime} min read`;

            // Support for API reference docs
            // const heading = article.querySelector("h1");
            // Support for article docs with date
            // const date = article.querySelector("time")?.parentNode;

            result.insertAdjacentElement("afterend", badge);
          } else {
            // console.log(text);
            const badge = document.createElement("p");
            // Use the same styling as the publish information in an article's header
            badge.classList.add("color-secondary-text", "type--caption");
            badge.textContent = `No articles found in result ¯\\_(ツ)_/¯`;
            result.insertAdjacentElement("afterend", badge);
          }
      });
    }

    // Add or remove classes to matches results
    const matches = domainList.filter((s: Domain) => url.includes(s.domainName));
    if (matches.length > 0) {
      const domain = matches.reduce(function (a: Domain, b: Domain) { return a.domainName.length > b.domainName.length ? a : b; });
      removeResultStyle(result);
      applyResultStyle(result, domain.color, domain.display, options);
      matchedString = domain.domainName;
      displayStyle = domain.display;
    } else {
      removeResultStyle(result);
    }

    // Add management component to the result
    const managementComponentAnchor = result.appendChild(document.createElement("span"));
    managementComponentAnchor.classList.add("hohser_result_management");
    managementComponentAnchors.push(managementComponentAnchor);

    // Listen to management component buttons click and stop event propagation
    function handleManagementComponentClick(e: React.MouseEvent<HTMLButtonElement>, action: string, color: string | null, domain: string): void {
      e.preventDefault();
      e.stopPropagation();
      if (action === "REMOVE_DOMAIN") {
        storageManager.removeEntry(matchedString);
      } else if (action === "FULL_HIDE" || action === "PARTIAL_HIDE" || action === "HIGHLIGHT") {
        storageManager.save(domain, action, color);
      }
    }

    ReactDOM.render(
      <ResultManagement url={url} showDeleteButton={!!matchedString} handleClick={handleManagementComponentClick} />,
      managementComponentAnchor as HTMLElement
    );
  } catch (e) {
    console.warn(e);
    // Try to process result again
    if (++processResultsAttempt <= 3) {
      setTimeout(() => {
        processResult(r, domainList, options, processResultsAttempt);
      }, 100 * Math.pow(processResultsAttempt, 3));
    }
  }
  return displayStyle;
}

// Process results function
async function processResults (domainList: Domain[], options: Options): Promise<void> {
  const domainsCounters: DomainsCounters = {fullHide: 0};

  const resultsList = document.querySelectorAll(
    searchEngineConfig.resultSelector
  );

  // Clear managementComponent anchors
  managementComponentAnchors.forEach(a => {
    try{
      if (a.parentNode) a.parentNode.removeChild(a);
    } catch (e) {
      console.log(e);
    }
  });

  resultsList.forEach(r => {
    // Number of attempts to process results
    const processResultsAttempt: number = 0;
    const displayStyle = processResult(r, domainList, options, processResultsAttempt);
    if (displayStyle === FULL_HIDE) {
      domainsCounters.fullHide++;
    }
  });

  // Show hidden results counter
  if (options?.showCounter && domainsCounters.fullHide > 0){
    if (!document.getElementById('hohser_domains_counter')) {
      const counterElement = document.body.appendChild(document.createElement("span"));
      counterElement.id ='hohser_domains_counter';
    }
    ReactDOM.render(
      <DomainsCounter domainsCounters={domainsCounters} />,
      document.getElementById('hohser_domains_counter') as HTMLElement
    );
  } else if(document.getElementById('hohser_domains_counter')) {
    const element = document.getElementById('hohser_domains_counter');
    if (element && element.parentNode) element.parentNode.removeChild(element);
  }
}

if (document.readyState !== 'complete') {
  window.addEventListener('load', () => {
    const toolBar = processNavbar();
    // const observer = new MutationObserver(processNavbar);
    // observer.observe(toolBar, { childList: true });
  }, false);
} else {
  const toolBar = processNavbar();
  // const observer = new MutationObserver(processNavbar);
  // observer.observe(toolBar, { childList: true });
}

// Check if Firefox or Chrome and assign the right storage object
const browserStorageSync = ((typeof browser !== 'undefined') && browser.storage.sync) ||
                         ((typeof chrome !== 'undefined') && (chrome.storage as any).promise.sync);

browserStorageSync.get('options')
  .then((o: any) => {
    options = o && o.options as Options;
    const useLocalStorage = options && !!options.useLocalStorage;
    storageManager.storageType = useLocalStorage ? LOCAL_STORAGE : SYNC_STORAGE;
    return storageManager.fetchDomainsList();
  })
  .then((d: Domain[]) => {
    let domainList = d;
    // Initial process results
    console.log("YO!");
    processResults(domainList, options);

    // Process results on page load
    document.addEventListener('load', () => {
      processResults(domainList, options);
    });

    // Process results on DOM change
    const targets = document.querySelectorAll(searchEngineConfig.observerSelector);
    targets.forEach(target => {
      const observer = new MutationObserver(function () {
        processResults(domainList, options);
      });
      if (target) observer.observe(target, { childList: true });
    });

    // Process results on storage change event
    storageManager.oryginalBrowserStorage.onChanged.addListener((storage: any) => {
      domainList = (storage.domainsList && storage.domainsList.newValue) || domainList;
      options = (storage.options && storage.options.newValue) || options;
      processResults(domainList, options);
    });

    // Process results on add new page by AutoPagerize extension
    document.addEventListener("AutoPagerize_DOMNodeInserted", function () {
      processResults(domainList, options);
    }, false);

    if (searchEngineConfig.ajaxResults) {

      // Observe resize event on result wrapper
      let isResized: any;
      const resizeObserver = new ResizeObserver(() => {
        window.clearTimeout( isResized );
        isResized = setTimeout(() => {
          processResults(domainList, options);
        }, 500);
      });

      const resultsWrappers = document.querySelectorAll(searchEngineConfig.observerSelector);
      resultsWrappers.forEach(resultsWrapper => {
        resizeObserver.observe(resultsWrapper);
      });

    }
  });
