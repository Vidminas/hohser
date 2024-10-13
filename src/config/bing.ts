import { SearchEngineConfig } from '../types';

export const bing: SearchEngineConfig = {
  toolsButtonSelector: '#scope_tools_wrapper',
  toolsButtonSelectedClass: '#scope_tools_wrapper.active',
  toolsBarSelector: "#b_tween",
  resultSelector: '.b_algo',
  domainSelector: '.b_attribution cite',
  observerSelector: '#b_results'
};
