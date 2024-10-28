export const HIGHLIGHT = 'HIGHLIGHT';
export type HIGHLIGHT = typeof HIGHLIGHT;

export const PARTIAL_HIDE = 'PARTIAL_HIDE';
export type PARTIAL_HIDE = typeof PARTIAL_HIDE;

export const FULL_HIDE = 'FULL_HIDE';
export type FULL_HIDE = typeof FULL_HIDE;

export const COLOR_1 = 'COLOR_1';
export type COLOR_1 = typeof COLOR_1;

export const COLOR_2 = 'COLOR_2';
export type COLOR_2 = typeof COLOR_2;

export const COLOR_3 = 'COLOR_3';
export type COLOR_3 = typeof COLOR_3;

export const FIREFOX = 'FIREFOX';
export type FIREFOX = typeof FIREFOX;

export const CHROME = 'CHROME';
export type CHROME = typeof CHROME;

export const ADD_DOMAIN = 'ADD_DOMAIN';
export type ADD_DOMAIN = typeof ADD_DOMAIN;

export const EDIT_DOMAIN = 'EDIT_DOMAIN';
export type EDIT_DOMAIN = typeof EDIT_DOMAIN;

export const FETCH_DOMAINS = 'FETCH_DOMAINS';
export type FETCH_DOMAINS = typeof FETCH_DOMAINS;

export const FETCH_DOMAINS_PENDING = 'FETCH_DOMAINS_PENDING';
export type FETCH_DOMAINS_PENDING = typeof FETCH_DOMAINS_PENDING;

export const FETCH_DOMAINS_FULFILLED = 'FETCH_DOMAINS_FULFILLED';
export type FETCH_DOMAINS_FULFILLED = typeof FETCH_DOMAINS_FULFILLED;

export const FETCH_DOMAINS_REJECTED = 'FETCH_DOMAINS_REJECTED';
export type FETCH_DOMAINS_REJECTED = typeof FETCH_DOMAINS_REJECTED;

export const FETCH_OPTIONS = 'FETCH_OPTIONS';
export type FETCH_OPTIONS = typeof FETCH_OPTIONS;

export const FETCH_OPTIONS_PENDING = 'FETCH_OPTIONS_PENDING';
export type FETCH_OPTIONS_PENDING = typeof FETCH_OPTIONS_PENDING;

export const FETCH_OPTIONS_FULFILLED = 'FETCH_OPTIONS_FULFILLED';
export type FETCH_OPTIONS_FULFILLED = typeof FETCH_OPTIONS_FULFILLED;

export const FETCH_OPTIONS_REJECTED = 'FETCH_OPTIONS_REJECTED';
export type FETCH_OPTIONS_REJECTED = typeof FETCH_OPTIONS_REJECTED;

export const TOGGLE_SHOW_ALL = 'TOGGLE_SHOW_ALL';
export type TOGGLE_SHOW_ALL = typeof TOGGLE_SHOW_ALL;

export const TOGGLE_FORCE_COLORS = 'TOGGLE_FORCE_COLORS';
export type TOGGLE_FORCE_COLORS = typeof TOGGLE_FORCE_COLORS;

export const SET_PARTIAL_HIDE_OPACITY = 'SET_PARTIAL_HIDE_OPACITY';
export type SET_PARTIAL_HIDE_OPACITY = typeof SET_PARTIAL_HIDE_OPACITY;

export const TOGGLE_SHOW_COUNTER = 'TOGGLE_SHOW_COUNTER';
export type TOGGLE_SHOW_COUNTER = typeof TOGGLE_SHOW_COUNTER;

export const TOGGLE_LOCAL_STORAGE = 'TOGGLE_LOCAL_STORAGE';
export type TOGGLE_LOCAL_STORAGE = typeof TOGGLE_LOCAL_STORAGE;

export const UPDATE_HIGHLIGHT_CUSTOM_COLORS = 'UPDATE_HIGHLIGHT_CUSTOM_COLORS';
export type UPDATE_HIGHLIGHT_CUSTOM_COLORS = typeof UPDATE_HIGHLIGHT_CUSTOM_COLORS;

export const REMOVE_DOMAIN = 'REMOVE_DOMAIN';
export type REMOVE_DOMAIN = typeof REMOVE_DOMAIN;

export const CLEAR_DOMAIN_LIST = 'CLEAR_DOMAIN_LIST';
export type CLEAR_DOMAIN_LIST = typeof CLEAR_DOMAIN_LIST;

export const MENAGE_ANIMATIONS = 'MENAGE_ANIMATIONS';
export type MENAGE_ANIMATIONS = typeof MENAGE_ANIMATIONS;

export const IMPORT_FROM_OLD_VERSION = 'IMPORT_FROM_OLD_VERSION';
export type IMPORT_FROM_OLD_VERSION = typeof IMPORT_FROM_OLD_VERSION;

export const IMPORT_FROM_OLD_VERSION_PENDING = 'IMPORT_FROM_OLD_VERSION_PENDING';
export type IMPORT_FROM_OLD_VERSION_PENDING = typeof IMPORT_FROM_OLD_VERSION_PENDING;

export const IMPORT_FROM_OLD_VERSION_FULFILLED = 'IMPORT_FROM_OLD_VERSION_FULFILLED';
export type IMPORT_FROM_OLD_VERSION_FULFILLED = typeof IMPORT_FROM_OLD_VERSION_FULFILLED;

export const IMPORT_FROM_OLD_VERSION_REJECTED = 'IMPORT_FROM_OLD_VERSION_REJECTED';
export type IMPORT_FROM_OLD_VERSION_REJECTED = typeof IMPORT_FROM_OLD_VERSION_REJECTED;

export const IMPORT_DOMAINS = 'IMPORT_DOMAINS';
export type IMPORT_DOMAINS = typeof IMPORT_DOMAINS;

export const LOCAL_STORAGE = 'local';
export type LOCAL_STORAGE = typeof LOCAL_STORAGE;

export const SYNC_STORAGE = 'sync';
export type SYNC_STORAGE = typeof SYNC_STORAGE;

export const GET_CURRENT_URL = 'GET_CURRENT_URL';
export type GET_CURRENT_URL = typeof GET_CURRENT_URL;

export const GET_CURRENT_URL_FULFILLED = 'GET_CURRENT_URL_FULFILLED';
export type GET_CURRENT_URL_FULFILLED = typeof GET_CURRENT_URL_FULFILLED;

export const MEDIA_TYPE_FILTER_TYPE = 'Media type';
export type MEDIA_TYPE_FILTER_TYPE = typeof MEDIA_TYPE_FILTER_TYPE;

export const SUBJECT_FILTER_TYPE = 'Subject';
export type SUBJECT_FILTER_TYPE = typeof SUBJECT_FILTER_TYPE;

export const LEVEL_FILTER_TYPE = 'Level';
export type LEVEL_FILTER_TYPE = typeof LEVEL_FILTER_TYPE;

export const COST_FILTER_TYPE = 'Cost';
export type COST_FILTER_TYPE = typeof COST_FILTER_TYPE;

export type FILTER_TYPE = MEDIA_TYPE_FILTER_TYPE | SUBJECT_FILTER_TYPE | LEVEL_FILTER_TYPE | COST_FILTER_TYPE;

import SvgIcon from "@mui/material/SvgIcon";
export type FILTER_OPTIONS = [typeof SvgIcon, string][];

import Image from "@mui/icons-material/Image";
import VideoLibrary from "@mui/icons-material/VideoLibrary";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import Web from "@mui/icons-material/Web";
import Palette from "@mui/icons-material/Palette";
export const MEDIA_TYPE_FILTER_OPTIONS: FILTER_OPTIONS = [
  [Image, "Image"],
  [VideoLibrary, "Video"],
  [PictureAsPdf, "Document"],
  [Web, "Website"],
];

import Diversity3 from "@mui/icons-material/Diversity3";
import Science from "@mui/icons-material/Science";
import Spa from "@mui/icons-material/Spa";
import Translate from "@mui/icons-material/Translate";
import Synagogue from "@mui/icons-material/Synagogue";
import Calculate from "@mui/icons-material/Calculate";
import Handyman from "@mui/icons-material/Handyman";
export const SUBJECT_FILTER_OPTIONS: FILTER_OPTIONS = [
  [Palette, "Expressive arts"],
  [Diversity3, "Social studies"],
  [Science, "Sciences"],
  [Spa, "Health and wellbeing"],
  [Translate, "Languages"],
  [Synagogue, "Religious and moral education"],
  [Calculate, "Numeracy and mathematics"],
  [Handyman, "Technologies"],
];

export const LEVEL_FILTER_OPTIONS: FILTER_OPTIONS = [
  [null, "BGE Early (ELC and P1)"],
  [null, "BGE First (P2-P4)"],
  [null, "BGE Second (P5-P7)"],
  [null, "BGE Third (S1-S3)"],
  [null, "National 3 (S3)"],
  [null, "National 4 (S4)"],
  [null, "National 5 (S4)"],
  [null, "Higher (S5-S6)"],
  [null, "Advanced Higher (S5-S6)"],
];

import MoneyOff from "@mui/icons-material/MoneyOff";
import Paid from "@mui/icons-material/Paid";
import Payments from "@mui/icons-material/Payments";
export const COST_FILTER_OPTIONS: FILTER_OPTIONS = [
  [MoneyOff, "Free"],
  [Payments, "Subscription"],
  [Paid, "Paid"],
];
