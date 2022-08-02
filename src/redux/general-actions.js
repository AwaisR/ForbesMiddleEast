import {
  SET_HEADER_CATEGORIES,
  SET_LIST_CATEGORIES,
  SET_HOME_FEATURED_ITEMS,
  SET_HOME_EDITORS_PICK,
  SET_HOME_POPULAR,
  SET_FOOTER_EVENTS,
  SET_FOOTER_MAGAZINES,
  SET_FOOTER_LIST,
  SET_FOOTER_CONFIG,
  ADD_LOADEDIMAGE,
} from "./general-reducers";

export const setHeaderCategories = (data) => ({
  type: SET_HEADER_CATEGORIES,
  data,
});

export const setListCategories = (data) => ({
  type: SET_LIST_CATEGORIES,
  data,
});

export const setHomeFeaturedItems = (data) => ({
  type: SET_HOME_FEATURED_ITEMS,
  data,
});

export const setHomeEditorsPick = (data) => ({
  type: SET_HOME_EDITORS_PICK,
  data,
});

export const setHomePopular = (data) => ({
  type: SET_HOME_POPULAR,
  data,
});

export const setFooterEvents = (data) => ({
  type: SET_FOOTER_EVENTS,
  data,
});

export const setFooterMagazines = (data) => ({
  type: SET_FOOTER_MAGAZINES,
  data,
});

export const setFooterLists = (data) => ({
  type: SET_FOOTER_LIST,
  data,
});

export const setFooterConfig = (data) => ({
  type: SET_FOOTER_CONFIG,
  data,
});

export const addLoadedImage = (data) => ({
  type: ADD_LOADEDIMAGE,
  data,
});
