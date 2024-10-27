let pageColorMode = undefined;

export const getPageColorMode = () => {
  if (pageColorMode) {
    return pageColorMode;
  }

  // Approach inspired by https://github.com/code-charity/dark-mode/blob/master/content-scripts/filters.js
  const colors = [];
  let isDark = false;

  function parse(element: Element, depth: number, depth_limit: number) {
    depth++;

    for (let i = 0, l = element.children.length; i < l; i++) {
      const child = element.children[i];
      const rect = child.getBoundingClientRect();

      if (
        rect.width >= document.body.offsetWidth &&
        rect.height >= window.innerHeight
      ) {
        colors.push(getComputedStyle(child).backgroundColor);
      }

      if (depth < depth_limit && child.children) {
        parse(child, depth, depth_limit);
      }
    }
  }

  colors.push(getComputedStyle(document.documentElement).backgroundColor);
  colors.push(getComputedStyle(document.body).backgroundColor);
  parse(document.body, 0, 3);

  for (const color of colors) {
    const arr = color.split("(")[1].split(")")[0].split(",");
    if (arr.length < 4 || parseFloat(arr[3]) > 0.5) {
      const r = parseInt(arr[0]) / 255;
      const g = parseInt(arr[1]) / 255;
      const b = parseInt(arr[2]) / 255;
      const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
      if (lightness < 0.5) {
        isDark = true;
        break;
      }
    }
  }

  pageColorMode = isDark ? 'dark' : 'light';
  return pageColorMode;
}

// From https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
export const waitForElement = (selector: string): Promise<Element> => {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}