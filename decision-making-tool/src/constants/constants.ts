export const LS_PREFIX = "radomskaia--decision-making-tool--";
export const ID_PREFIX = "#";
export const OPTION_KEYS = {
  ID: "id",
  TITLE: "title",
  WEIGHT: "weight",
} as const;
export const OPTION_LIST_KEYS = {
  LAST_ID: "lastId",
  LIST: "list",
} as const;
export const ERROR_MESSAGES = {
  NOT_EVENT: "No event provided",
  ID_NOT_FOUND: "Can't update input value. Didn't find ID in the List",
  INVALID_FILE: "Invalid file",
  INVALID_LIST: "Invalid option list",
  NOT_INITIALIZED: "Class is not initialized",
  PLAYBACK: "Can't play audio",
  PAGE_NOT_FOUND: "Sorry, page not found",
  VALIDATION: `Please add at least 2 valid options.
  
  
An option is considered valid if its title is not empty and its weight is greater than 0
  `,
} as const;
export const FILE_CONFIG = {
  TYPE: "application/json",
  EXTENSION: ".json",
  NAME: "option-list.json",
} as const;
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
} as const;
export const BUTTON_TITLE = {
  VOLUME: "Volume",
  ID: "ID",
  THEME: "Change theme",
} as const;
export const PAGE_PATH = {
  HOME: "/",
  SECOND: "/decision-picker",
} as const;
export const SVG_CONFIG = {
  NAMESPACE_SVG: "http://www.w3.org/2000/svg",
  NAMESPACE_XLINK: "http://www.w3.org/1999/xlink",
  QUALIFIED_NAME: "xlink:href",
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

export const INITIATION_ID = 0;
export const DARK_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const DARK_THEME_ATTRIBUTE = "data-theme";
export const APP_NAME = "Decision Making Tool";
export const TEXTAREA_ROWS = 15;
export const TEXTAREA_COLS = 80;
export const PASTE_SEPARATOR = {
  line: "\n",
  comma: ",",
};
export const MINIMUM_OPTIONS_COUNT = 2;
