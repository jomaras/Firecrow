/**
 * User: Jomaras
 * Date: 04.06.13.
 * Time: 11:41
 */
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

const NEW_SOURCE_IGNORED_URLS = ["debugger eval code", "self-hosted"];
const NEW_SOURCE_DISPLAY_DELAY = 200; // ms
const FETCH_SOURCE_RESPONSE_DELAY = 50; // ms