export const SET_HEADER_CATEGORIES = "general/SET_HEADER_CATEGORIES";
export const SET_LIST_CATEGORIES = "general/SET_LIST_CATEGORIES";

export const SET_HOME_FEATURED_ITEMS = "general/SET_HOME_FEATURED_ITEMS";
export const SET_HOME_EDITORS_PICK = "general/SET_HOME_EDITORS_PICK";
export const SET_HOME_POPULAR = "general/SET_HOME_POPULAR";

export const SET_FOOTER_EVENTS = "general/SET_FOOTER_EVENTS";
export const SET_FOOTER_MAGAZINES = "general/SET_FOOTER_MAGAZINES";
export const SET_FOOTER_LIST = "general/SET_FOOTER_LIST";
export const SET_FOOTER_CONFIG = "general/SET_FOOTER_CONFIG";

export const ADD_LOADEDIMAGE = "general/ADD_LOADEDIMAGE";

const initialState = {
  headerCategories: [],
  listCategories: [],
  homeFeaturedItems: [],
  homeEditorsPick: [],
  homePopular: [],
  footerEvents: [],
  footerMagazines: [],
  footerLists: [],
  loadedImages: [],
  footerConfig: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_HEADER_CATEGORIES: {
      return {
        ...state,
        headerCategories: action.data,
      };
    }
    case SET_LIST_CATEGORIES: {
      return {
        ...state,
        listCategories: action.data,
      };
    }
    case SET_HOME_FEATURED_ITEMS: {
      return {
        ...state,
        homeFeaturedItems: action.data,
      };
    }
    case SET_HOME_EDITORS_PICK: {
      return {
        ...state,
        homeEditorsPick: action.data,
      };
    }
    case SET_HOME_POPULAR: {
      return {
        ...state,
        homePopular: action.data,
      };
    }
    case SET_FOOTER_EVENTS: {
      return {
        ...state,
        footerEvents: action.data,
      };
    }
    case SET_FOOTER_MAGAZINES: {
      return {
        ...state,
        footerMagazines: action.data,
      };
    }
    case SET_FOOTER_LIST: {
      return {
        ...state,
        footerLists: action.data,
      };
    }
    case SET_FOOTER_CONFIG: {
      return {
        ...state,
        footerConfig: action.data,
      };
    }
    case ADD_LOADEDIMAGE: {
      return {
        ...state,
        loadedImages: [...state.loadedImages, action.data],
      };
    }

    default:
      return state;
  }
};
