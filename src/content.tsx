import StorageManager from "./content/storageManager";
import { SearchEngineConfig, DisplayStyle, Color, Domain } from "./types";
import * as config from "./config";
import { PARTIAL_HIDE, FULL_HIDE, HIGHLIGHT } from "./constants";
import './content.css';
import { Options } from './types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ResultManagement } from './components/Content/ResultManagement';
import { ResizeObserver } from './mock/ResizeObserver';

// Initialize storage manager
const storageManager = new StorageManager();

// Determine search engine and apply right config
const searchEngine = (location.host.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/) || [])[1];
let searchEngineConfig: SearchEngineConfig = config[searchEngine];

// Array of management component anchors
const managementComponentAnchors: Array<Element> = [];

// Number of attempts to process results
let processResultsAttempt: number = 0;

// Process results function
async function processResults () {
  try {
  const resultsList = document.querySelectorAll(
    searchEngineConfig.resultSelector
  );

  // Fetching domains list and options
  const domainsList = await storageManager.fetchDomainsList();
  const options = await storageManager.fetchOptions();

  // Clear managementComponent anchors
  managementComponentAnchors.forEach(a => {
    try{
      if (a.parentNode) a.parentNode.removeChild(a);
    } catch (e) {
      console.log(e);
    }
  });

  resultsList.forEach(r => {
    const result = r as HTMLElement;
    result.classList.add('hohser_result');
      const domain = result.querySelector(
        searchEngineConfig.domainSelector
      );
      const url = (domain as HTMLElement).innerText;

      const url = domain.innerText;

      if (!url) {
        throw "No domain info";
      }

      // Add management component to the result
      const managementComponentAnchor = result.appendChild(document.createElement("span"));
      managementComponentAnchor.classList.add("hohser_result_management");
      managementComponentAnchors.push(managementComponentAnchor);
      ReactDOM.render(
        <ResultManagement result={result} url={url} storageManager={storageManager} />,
        managementComponentAnchor as HTMLElement
      );

      // Listen to management results buttons click and event stop propagation
      managementComponentAnchor.addEventListener('click', (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        let action;
        let color;
        let domain;
        const nodeName = e.target.nodeName;
        if (e.target && nodeName === 'BUTTON') {
          action = e.target.dataset.action;
          color = e.target.dataset.color;
          domain = e.target.dataset.domain;
        } else if (e.target && nodeName === 'SVG' || nodeName === 'svg') {
          action = e.target.parentNode.parentNode.dataset.action;
          color = e.target.parentNode.parentNode.dataset.color;
          domain = e.target.parentNode.parentNode.dataset.domain;
        } else if (e.target && nodeName === 'PATH' || nodeName === 'path') {
          action = e.target.parentNode.parentNode.parentNode.dataset.action;
          color = e.target.parentNode.parentNode.parentNode.dataset.color;
          domain = e.target.parentNode.parentNode.parentNode.dataset.domain;
        }
        storageManager.save(domain, action, color);
      });

      // Add or remove classes to the matches results
      const matches = domainsList.filter((s: Domain) => url.includes(s.domainName));
      if (matches.length > 0) {
        removeResultStyle(result);
        applyResultStyle(result, matches[0].color, matches[0].display, options);
      } else {
        removeResultStyle(result);
      }
  });
  } catch (e) {
    console.error(e);
    // Try to process results again
    if (++processResultsAttempt <= 3) {
      setTimeout(() => {
        processResults();
      }, 100 * Math.pow(processResultsAttempt, 3));
    }
  }
}

// Turn array of RGBA values into CSS `rgba` function call
function getRgbCss (color: Array<number>, alpha = 1) {
  return `rgba(${color.map(Math.floor).join(', ') || null}, ${alpha})`;
}

// Apply styles to matches results
function applyResultStyle (
  result: HTMLElement,
  color: Color,
  displayStyle: DisplayStyle,
  options: Options
) {
  const domainColors = {
    COLOR_1: [245, 0, 87],
    COLOR_2: [139, 195, 74],
    COLOR_3: [3, 169, 244]
  };
  const alpha = 0.12;
  if (displayStyle === HIGHLIGHT) {
    result.classList.add("hohser_highlight");
    result.style.backgroundColor = getRgbCss(domainColors[color], alpha);
    result.style.transition = `.5s`;
    if (searchEngine === "google") {
      result.style.boxShadow = `0 0 0 5px ${getRgbCss(domainColors[color], alpha)}`;
    }
    if (searchEngine === "startpage") {
      // On Startpage, use solid but lighter color
      // since search results can overlap
      const lightColor = domainColors[color].map(val => val + (255 - val) * (1 - alpha));
      result.style.backgroundColor = getRgbCss(lightColor);
    }
  } else if (displayStyle === PARTIAL_HIDE) {
    result.classList.add("hohser_partial_hide");
  } else if (displayStyle === FULL_HIDE && !options.showAll) {
    result.classList.add("hohser_full_hide");
  } else if (displayStyle === FULL_HIDE && options.showAll) {
    result.classList.add("hohser_partial_hide");
  }
}

// Remove styles from result
function removeResultStyle (
  result: HTMLElement
) {
  result.classList.remove("hohser_highlight");
  result.classList.remove("hohser_partial_hide");
  result.classList.remove("hohser_full_hide");
  result.style.backgroundColor = null;
  result.style.boxShadow = null;
}

// Initial process results
processResults();

// Process results on page load
document.addEventListener('load', () => {
  processResults();
});

// Process results on DOM change
const target = document.querySelector(searchEngineConfig.observerSelector);
const observer = new MutationObserver(function (mutations) {
  processResults();
});
if (target) observer.observe(target, { childList: true });

// Process results on storage change event
storageManager.oryginalBrowserStorage.onChanged.addListener(() => {
  processResults();
});

if (searchEngineConfig.ajaxResults) {

  // Observe resize event on result wrapper
  var isResized: any;
  const resizeObserver = new ResizeObserver((entries: any) => {
    window.clearTimeout( isResized );
    isResized = setTimeout(() => {
      processResults();
    }, 100);
  });

  const resultsWrapper = document.querySelector(searchEngineConfig.observerSelector);
  resizeObserver.observe(resultsWrapper);

}
