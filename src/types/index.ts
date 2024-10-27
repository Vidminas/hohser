import { PARTIAL_HIDE, FULL_HIDE, COLOR_1, COLOR_2, COLOR_3, HIGHLIGHT, MEDIA_TYPE_FILTER_TYPE, SUBJECT_FILTER_TYPE, LEVEL_FILTER_TYPE, COST_FILTER_TYPE } from '../constants';

export type DisplayStyle = HIGHLIGHT | PARTIAL_HIDE | FULL_HIDE;
export type Color = COLOR_1 | COLOR_2 | COLOR_3 | string;

export interface Domain {
  domainName: string;
  display: DisplayStyle;
  color?: Color;
}

export interface Options {
  showAll: boolean;
  forceColors: boolean;
  partialHideOpacity: number;
  showCounter: boolean;
  useLocalStorage?: boolean;
  highlightColors: string[];
}

export interface SearchEngineConfig {
  toolsButtonSelector?: string;
  toolsButtonSelectedClass?: string;
  toolsBarSelector?: string;
  resultSelector: string;
  domainSelector: string;
  observerSelector: string;
  ajaxResults?: boolean;
  resultUrlSelector?: string;
  domainSelectorForceText?: boolean;
}

export interface StoreState {
  domainsList: Array<Domain>;
  option: boolean;
  addDomain: (domainName: string, display: DisplayStyle, color?: Color) => void;
  editDomain: (index: number, domainName: string, display: DisplayStyle, color?: Color) => void;
  removeDomain: () => void;
}

export interface DomainsCounters {
  fullHide: number;
}

export interface MediaTypeFilter {
  type: MEDIA_TYPE_FILTER_TYPE;
  tag: string;
}
export interface SubjectFilter {
  type: SUBJECT_FILTER_TYPE;
  tag: string;
}
export interface LevelFilter {
  type: LEVEL_FILTER_TYPE;
  tag: string;
}
export interface CostFilter {
  type: COST_FILTER_TYPE;
  tag: string;
}

export type FilterData = MediaTypeFilter | SubjectFilter | LevelFilter | CostFilter;
