export const APP_NAME = "Decision Making Tool";

export const LS_PREFIX = "radomskaia--decision-making-tool--";

// Common constants
export const HASH_SYMBOL = "#";
export const EMPTY_STRING = "";
export const ZERO = 0;
export const FIRST_INDEX = 0;
export const NOT_FOUND_INDEX = -1;
export const LAST_INDEX = -1;
export const REMOVE_ONE_ITEM = 1;
export const MINIMUM_OPTIONS_COUNT = 2;
export const PASTE_SEPARATOR = {
  line: "\n",
  comma: ",",
};

// ID
export const INITIATION_ID = ZERO;
export const ID_PREFIX = HASH_SYMBOL;

// Keys
export const OPTION_KEYS = {
  ID: "id",
  TITLE: "title",
  WEIGHT: "weight",
} as const;
export const OPTION_LIST_KEYS = {
  LAST_ID: "lastId",
  LIST: "list",
} as const;

//File settings
export const FILE_CONFIG = {
  TYPE: "application/json",
  EXTENSION: ".json",
  NAME: "option-list.json",
} as const;

// Buttons
export const BUTTON_TEXT = {
  HOME: "Back to the start page",
  START: "Start",
  ADD_OPTION: "Add Option",
  CLEAR_LIST: "Clear List",
  PASTE_LIST: "Paste List",
  SAVE_LIST: "Save List to file",
  LOAD_LIST: "Load List from file",
  DELETE: "Delete",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  CLOSE: "Close",
  BACK: "Back",
} as const;
export const BUTTON_TITLE = {
  VOLUME: "Volume",
  ID: "ID",
  THEME: "Change theme",
} as const;
export const SVG_CONFIG = {
  NAMESPACE_SVG: "http://www.w3.org/2000/svg",
  NAMESPACE_XLINK: "http://www.w3.org/1999/xlink",
  QUALIFIED_NAME: "xlink:href",
} as const;
export const PAGE_PATH = {
  HOME: "/",
  DECISION_PICKER: "/decision-picker",
  NOT_FOUND: "404",
} as const;

const WHITE = 0;
const BLACK = 255;
const PRIMARY_LIGHT = "#ccc19f";
const PRIMARY_DARK = "#1c274d";

// Theme settings
export const DARK_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const DARK_THEME_ATTRIBUTE = "data-theme";
export const WHEEL_COLORS = {
  DARK_THEME: {
    thinner: WHITE,
    cursor: PRIMARY_DARK,
    stroke: PRIMARY_LIGHT,
  },
  LIGHT_THEME: {
    thinner: BLACK,
    cursor: PRIMARY_LIGHT,
    stroke: PRIMARY_DARK,
  },
};

export const END_SOUND_VOLUME = 0.7;

// <textarea> parameters
export const TEXTAREA_ROWS = 15;
export const TEXTAREA_COLS = 80;

const SHARED_PATH = "/src/shared/";
export const AUDIO_PATH = {
  END: SHARED_PATH + "end-sound.mp3",
  STRIKE: SHARED_PATH + "flint-strike.mp3",
} as const;

// Messages
export const MESSAGES = {
  NOT_EVENT: "No event provided",
  ID_NOT_FOUND: "Can't update input value. Didn't find ID in the List",
  INVALID_FILE: "Invalid file",
  INVALID_LIST: "Invalid option list",
  ROUTE_NOT_FOUND: "Route not found",
  NOT_INITIALIZED: "Class is not initialized",
  PLAYBACK: "Can't play audio ",
  PAGE_NOT_FOUND: "Sorry, page not found",
  VALIDATION: `Please add at least 2 valid options.
  
  
An option is considered valid if its title is not empty and its weight is greater than 0
  `,
} as const;

export const PLACEHOLDER = {
  TITLE: "Title",
  WEIGHT: "Weight",
  INSTRUCTION: `
Paste a list of new options in a CSV-like format:

title,weight(number)              -> | title                           |weight|
title,1                           -> | title                           | 1 |
title with whitespace,2           -> | title with whitespace           | 2 |
title , with , commas,3           -> | title , with , commas           | 3 |
title with &quot;quotes&quot;,4   -> | title with &quot;quotes&quot;   | 4 |
`,
} as const;
