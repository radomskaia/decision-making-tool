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
const SPRITE_PATH = "./sprite.svg#";
export const ICON_PATH = {
  SOUND: {
    ON: SPRITE_PATH + "sound-on",
    OFF: SPRITE_PATH + "sound-off",
  },
  THEME: {
    ON: SPRITE_PATH + "theme-light",
    OFF: SPRITE_PATH + "theme-dark",
  },
  ALARM: SPRITE_PATH + "alarm",
  DELETE: SPRITE_PATH + "delete",
  SAVE: SPRITE_PATH + "save",
  LOAD: SPRITE_PATH + "load",
  BACK: SPRITE_PATH + "back",
  PASTE: SPRITE_PATH + "paste",
  CLEAR: SPRITE_PATH + "clear",
  PLAY: SPRITE_PATH + "play",
  ADD: SPRITE_PATH + "add",
} as const;
export const ATTRIBUTES = {
  ariaLabel: "aria-label",
} as const;
export const BUTTON_TYPES = {
  BUTTON: "button",
} as const;
