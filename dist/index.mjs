import{fileURLToPath as __sdk_f}from'node:url';import{dirname as __sdk_d}from'node:path';const __filename=__sdk_f(import.meta.url);const __dirname=__sdk_d(__filename);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../zero_addon_sdk/src/types.ts
function isCanonicalType(t) {
  return CONTENT_TYPES.includes(t);
}
function isCanonicalResource(r) {
  return RESOURCES.includes(r);
}
var CONTENT_TYPES, RESOURCES;
var init_types = __esm({
  "../zero_addon_sdk/src/types.ts"() {
    "use strict";
    CONTENT_TYPES = [
      "movie",
      "series",
      "season",
      "episode",
      "video",
      // standalone online video (YouTube etc.)
      "channel",
      // a video channel / uploader
      "music",
      // generic music entry point (prefer the finer aliases below)
      "artist",
      "album",
      "track",
      // a single audio track ("music/audio")
      "playlist",
      "image",
      "adult",
      "person",
      "collection"
    ];
    RESOURCES = [
      /** List/browse/paginate items of a type (rows, libraries, discover shelves). */
      "catalog",
      /** Full detail for one id (title, images, people, children…). */
      "meta",
      /** Candidate streams for one id (NOT yet playable — see resolve). */
      "stream",
      /** Turn one chosen stream candidate into a playable URL (two-phase play). */
      "resolve",
      /** Free-text search within a type. */
      "search",
      /** Subtitle candidates for one id. */
      "subtitles",
      /** Playback-session helpers (HLS proxying, remux hints…). */
      "playback",
      /** Images for one id (poster/background/logo/thumb/banner). */
      "artwork",
      /** Lyrics for one track. */
      "lyrics",
      /** Trailer / preview clips for one id. */
      "trailers",
      /** Intro / recap / credits / chapter markers for one video. */
      "markers",
      /** The catalogs on offer right now, when they depend on settings or on
       *  what the addon discovered (`{ catalogs }`); without it, manifest
       *  `catalogs` is the list. */
      "catalogs",
      /** Run one of the addon's declared automations (manifest
       *  zero.automations) — the server's scheduler calls it; id = automation
       *  id. Answers { ok, message? }. */
      "automation",
      /** Draw one of the addon's own spaces (zero.spaces with render "addon"):
       *  type "view" (id = path) → { view }, type "play" (id = item) → { play }.
       *  See spaces.ts. */
      "space"
    ];
  }
});

// ../zero_addon_sdk/src/capabilities.ts
function isCategory(v) {
  return typeof v === "string" && CATEGORIES.includes(v);
}
function isRole(v) {
  return typeof v === "string" && ROLES.includes(v);
}
function providesFor(provides, role, category) {
  return !!provides?.[role]?.includes(category);
}
function requiredResources(provides) {
  const out = /* @__PURE__ */ new Set();
  for (const role of Object.keys(provides ?? {})) {
    if (isRole(role) && provides[role].length > 0) {
      for (const r of ROLE_RESOURCES[role].required) out.add(r);
    }
  }
  return [...out];
}
var CATEGORIES, ROLES, ROLE_RESOURCES;
var init_capabilities = __esm({
  "../zero_addon_sdk/src/capabilities.ts"() {
    "use strict";
    CATEGORIES = [
      "movies",
      "series",
      "anime",
      "music",
      "videos",
      "books",
      "photos",
      "tv",
      "radio",
      "adult"
    ];
    ROLES = [
      /** Items to browse, search and play: catalogs, search, streams, resolve. */
      "content",
      /** Descriptive data for one item: title, overview, year, people, genres… */
      "metadata",
      /** Images for one item: poster, background, logo, thumbnail, banner. */
      "artwork",
      /** Song lyrics, plain or time-synced. */
      "lyrics",
      /** Subtitle files for a video. */
      "subtitles",
      /** Trailer / preview clips for an item. */
      "trailers",
      /** Time markers inside a video: intro, recap, credits, chapters. */
      "markers"
    ];
    ROLE_RESOURCES = {
      content: { required: ["stream"], optional: ["catalog", "catalogs", "search", "meta", "resolve", "playback"] },
      // A metadata source may also publish browse lists (trending, bestsellers…).
      metadata: { required: ["meta"], optional: ["search", "catalog", "catalogs"] },
      artwork: { required: ["artwork"], optional: [] },
      lyrics: { required: ["lyrics"], optional: [] },
      subtitles: { required: ["subtitles"], optional: [] },
      trailers: { required: ["trailers"], optional: [] },
      markers: { required: ["markers"], optional: [] }
    };
  }
});

// ../zero_addon_sdk/src/responses.ts
function checkResponse(resource, body) {
  const keys = RESPONSE_KEYS[resource];
  if (!keys) return null;
  if (typeof body !== "object" || body === null) return `${resource}: response must be an object`;
  const b2 = body;
  for (const key of keys) {
    if (!(key in b2)) return `${resource}: missing "${key}" (got ${Object.keys(b2).join(", ") || "nothing"})`;
    if (ARRAY_KEYS.has(key) && !Array.isArray(b2[key])) return `${resource}: "${key}" must be an array`;
  }
  if (keys.includes("metas")) {
    for (const m2 of b2.metas) {
      const meta2 = m2;
      if (typeof meta2?.id !== "string" || typeof meta2?.type !== "string" || typeof meta2?.name !== "string") {
        return `${resource}: every meta needs string id, type and name`;
      }
    }
  }
  if (keys.includes("streams")) {
    for (const s of b2.streams) {
      const d = s?.display;
      if (d !== void 0 && (typeof d !== "object" || d === null || typeof d.title !== "string")) {
        return `${resource}: a stream's "display" needs a string title`;
      }
    }
  }
  if (resource === "resolve" && b2.url !== null && typeof b2.url !== "string") {
    return 'resolve: "url" must be a string or null';
  }
  if (resource === "artwork" && (typeof b2.artwork !== "object" || b2.artwork === null)) {
    return 'artwork: "artwork" must be an object';
  }
  return null;
}
var RESPONSE_KEYS, ARRAY_KEYS;
var init_responses = __esm({
  "../zero_addon_sdk/src/responses.ts"() {
    "use strict";
    RESPONSE_KEYS = {
      catalog: ["metas"],
      catalogs: ["catalogs"],
      search: ["metas"],
      meta: ["meta"],
      stream: ["streams"],
      resolve: ["url"],
      artwork: ["artwork"],
      lyrics: ["lyrics"],
      subtitles: ["subtitles"],
      trailers: ["trailers"],
      markers: ["markers"],
      automation: ["ok"]
    };
    ARRAY_KEYS = /* @__PURE__ */ new Set(["metas", "streams", "subtitles", "trailers", "markers", "catalogs"]);
  }
});

// ../zero_addon_sdk/src/settings.ts
function isUiText(v) {
  if (typeof v === "string") return v.length > 0;
  return typeof v === "object" && v !== null && !Array.isArray(v) && Object.values(v).every((x2) => typeof x2 === "string");
}
function validateSettings(raw) {
  if (!Array.isArray(raw)) throw new Error("zero.settings must be an array");
  const seen = /* @__PURE__ */ new Set();
  for (const [i, f] of raw.entries()) {
    const at = `zero.settings[${i}]`;
    if (typeof f !== "object" || f === null) throw new Error(`${at} must be an object`);
    if (typeof f.key !== "string" || !KEY_RE.test(f.key)) throw new Error(`${at}.key must match ${KEY_RE}`);
    if (seen.has(f.key)) throw new Error(`${at}.key "${f.key}" is declared twice`);
    seen.add(f.key);
    if (!SETTING_TYPES.includes(String(f.type))) {
      throw new Error(`${at}.type must be one of ${SETTING_TYPES.join(", ")}`);
    }
    if (!isUiText(f.label)) throw new Error(`${at}.label is required`);
    if (f.type === "select" && (!Array.isArray(f.options) || f.options.length === 0)) {
      throw new Error(`${at}: a select needs options`);
    }
    if (f.default !== void 0) {
      const why = checkSettingValue(f, f.default);
      if (why) throw new Error(`${at}.default: ${why}`);
    }
  }
  for (const f of raw) {
    if (f.showIf && !seen.has(f.showIf.key)) throw new Error(`zero.settings "${f.key}".showIf names unknown key "${f.showIf.key}"`);
  }
  return raw;
}
function checkSettingValue(field, value) {
  switch (field.type) {
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) return "must be a number";
      if (field.min !== void 0 && value < field.min) return `must be at least ${field.min}`;
      if (field.max !== void 0 && value > field.max) return `must be at most ${field.max}`;
      return null;
    case "toggle":
      return typeof value === "boolean" ? null : "must be true or false";
    case "list":
      return Array.isArray(value) && value.every((x2) => typeof x2 === "string") ? null : "must be a list of strings";
    case "select":
      return typeof value === "string" && !!field.options?.some((o) => o.value === value) ? null : "must be one of the options";
    case "url":
      if (typeof value !== "string") return "must be text";
      return value === "" || /^https?:\/\/\S+$/.test(value) ? null : "must be an http(s) link";
    default:
      return typeof value === "string" ? null : "must be text";
  }
}
function resolveSettings(fields, stored) {
  const out = {};
  for (const f of fields) {
    const v = stored[f.key];
    if (v !== void 0 && checkSettingValue(f, v) === null) out[f.key] = v;
    else if (f.default !== void 0) out[f.key] = f.default;
  }
  return out;
}
function parseSettingInput(field, raw) {
  let value = raw;
  if (field.type === "number" && typeof raw === "string") value = raw.trim() === "" ? NaN : Number(raw);
  if (field.type === "toggle" && typeof raw === "string") value = raw === "true" || raw === "1" || raw === "on";
  if (field.type === "list" && typeof raw === "string") value = raw.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
  const why = checkSettingValue(field, value);
  if (why) throw new Error(`${typeof field.label === "string" ? field.label : field.key}: ${why}`);
  if (field.required && (value === "" || Array.isArray(value) && value.length === 0)) {
    throw new Error(`${typeof field.label === "string" ? field.label : field.key} is required`);
  }
  return value;
}
function uiText(text, locale = "en") {
  if (text === void 0) return "";
  if (typeof text === "string") return text;
  return text[locale] ?? text.en ?? Object.values(text)[0] ?? "";
}
var SETTING_TYPES, KEY_RE;
var init_settings = __esm({
  "../zero_addon_sdk/src/settings.ts"() {
    "use strict";
    SETTING_TYPES = [
      "text",
      /** Masked on screen and never sent back to the browser once saved. */
      "secret",
      "url",
      "number",
      "toggle",
      "select",
      "textarea",
      /** A list of short strings (hosts, tags, ids…). */
      "list"
    ];
    KEY_RE = /^[a-z][a-z0-9_]{0,63}$/;
  }
});

// ../zero_addon_sdk/src/ui.ts
function validateUi(raw, settingKeys, actionIds) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw new Error("zero.ui must be an object");
  const ui = raw;
  const needAction = (id, at) => {
    if (typeof id !== "string" || !actionIds.has(id)) throw new Error(`${at}: action "${String(id)}" is not declared in zero.actions`);
  };
  const needFields = (keys, at) => {
    if (!Array.isArray(keys) || keys.length === 0) throw new Error(`${at}.fields must list setting keys`);
    for (const k2 of keys) if (!settingKeys.has(k2)) throw new Error(`${at}: "${String(k2)}" is not a key in zero.settings`);
  };
  const checkSections = (sections, at) => {
    if (!Array.isArray(sections)) throw new Error(`${at} must be an array of sections`);
    const ids = /* @__PURE__ */ new Set();
    for (const [i, s] of sections.entries()) {
      const sat = `${at}[${i}]`;
      if (!SECTION_KINDS.includes(s?.kind)) throw new Error(`${sat}.kind must be one of ${SECTION_KINDS.join(", ")}`);
      if (typeof s.id !== "string" || !ID_RE.test(s.id)) throw new Error(`${sat}.id must match ${ID_RE}`);
      if (ids.has(s.id)) throw new Error(`${sat}.id "${s.id}" is used twice`);
      ids.add(s.id);
      if (s.kind === "form") needFields(s.fields, sat);
      if (s.kind === "table") {
        needAction(s.rows, `${sat}.rows`);
        if (!Array.isArray(s.columns) || s.columns.length === 0) throw new Error(`${sat}.columns must not be empty`);
        for (const b2 of s.rowButtons ?? []) needAction(b2.action, `${sat}.rowButtons`);
        if (s.add) {
          needAction(s.add.action, `${sat}.add`);
          validateSettings(s.add.fields);
        }
      }
      if (s.kind === "status") needAction(s.source, `${sat}.source`);
      if (s.kind === "buttons") {
        if (!Array.isArray(s.buttons) || s.buttons.length === 0) throw new Error(`${sat}.buttons must not be empty`);
        for (const b2 of s.buttons) needAction(b2.action, `${sat}.buttons`);
      }
    }
  };
  const tabIds = /* @__PURE__ */ new Set();
  for (const [i, tab] of (ui.tabs ?? []).entries()) {
    const at = `zero.ui.tabs[${i}]`;
    if (typeof tab.id !== "string" || !ID_RE.test(tab.id)) throw new Error(`${at}.id must match ${ID_RE}`);
    if (tabIds.has(tab.id)) throw new Error(`${at}.id "${tab.id}" is used twice`);
    tabIds.add(tab.id);
    if (tab.group !== void 0 && !UI_TAB_GROUPS.includes(tab.group)) {
      throw new Error(`${at}.group must be one of ${UI_TAB_GROUPS.join(", ")}`);
    }
    if (!Array.isArray(tab.sections) || tab.sections.length === 0) throw new Error(`${at}.sections must not be empty`);
    checkSections(tab.sections, `${at}.sections`);
  }
  if (ui.card !== void 0) checkSections(ui.card, "zero.ui.card");
  if (ui.metadata !== void 0) needFields(ui.metadata.fields, "zero.ui.metadata");
  return ui;
}
function uiActionIds(ui) {
  const out = /* @__PURE__ */ new Set();
  const walk = (sections) => {
    for (const s of sections ?? []) {
      if (s.kind === "table") {
        out.add(s.rows);
        for (const b2 of s.rowButtons ?? []) out.add(b2.action);
        if (s.add) out.add(s.add.action);
      }
      if (s.kind === "status") out.add(s.source);
      if (s.kind === "buttons") for (const b2 of s.buttons) out.add(b2.action);
    }
  };
  for (const t of ui?.tabs ?? []) walk(t.sections);
  walk(ui?.card);
  return out;
}
var UI_TAB_GROUPS, ID_RE, SECTION_KINDS;
var init_ui = __esm({
  "../zero_addon_sdk/src/ui.ts"() {
    "use strict";
    init_settings();
    UI_TAB_GROUPS = ["content", "streaming", "system"];
    ID_RE = /^[a-z][a-z0-9-]{0,40}$/;
    SECTION_KINDS = ["form", "table", "status", "buttons", "notice"];
  }
});

// ../zero_addon_sdk/src/storage.ts
async function migrate(db2, steps) {
  const row = await db2.get("PRAGMA user_version");
  const current = row?.user_version ?? 0;
  for (let v = current + 1; v <= steps.length; v += 1) {
    await db2.transaction(async () => {
      await db2.exec(steps[v - 1]);
      await db2.exec(`PRAGMA user_version = ${v}`);
    });
  }
  return steps.length;
}
var init_storage = __esm({
  "../zero_addon_sdk/src/storage.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/services.ts
function validateServices(raw) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw new Error("manifest.zero.services must be { provides?, uses? }");
  const s = raw;
  for (const key of ["provides", "uses"]) {
    const v = s[key];
    if (v === void 0) continue;
    if (!Array.isArray(v) || v.some((x2) => typeof x2 !== "string" || !SERVICE_RE.test(x2))) {
      throw new Error(`manifest.zero.services.${key} must be service names matching ${SERVICE_RE}`);
    }
  }
  return s;
}
var ServiceUnavailableError, SERVICE_RE;
var init_services = __esm({
  "../zero_addon_sdk/src/services.ts"() {
    "use strict";
    ServiceUnavailableError = class extends Error {
      constructor(service) {
        super(`No installed add-on provides the "${service}" service`);
        this.service = service;
        this.name = "ServiceUnavailableError";
      }
    };
    SERVICE_RE = /^[a-z][a-z0-9-]{1,31}$/;
  }
});

// ../zero_addon_sdk/src/spaces.ts
function validateSpaces(raw) {
  if (!Array.isArray(raw)) throw new Error("manifest.zero.spaces must be an array");
  const ids = /* @__PURE__ */ new Set();
  raw.forEach((s, i) => {
    const at = `manifest.zero.spaces[${i}]`;
    if (typeof s?.id !== "string" || !SPACE_ID_RE.test(s.id)) throw new Error(`${at}.id must match ${SPACE_ID_RE}`);
    if (ids.has(s.id)) throw new Error(`${at}.id "${s.id}" is declared twice`);
    ids.add(s.id);
    if (!s.name) throw new Error(`${at}.name is required`);
    if (!SPACE_LAYOUTS.includes(s.layout)) throw new Error(`${at}.layout must be one of ${SPACE_LAYOUTS.join(", ")}`);
    if (s.render !== void 0 && s.render !== "catalogs" && s.render !== "addon") throw new Error(`${at}.render must be "catalogs" or "addon"`);
    if ((s.render ?? "catalogs") === "catalogs" && (!Array.isArray(s.types) || s.types.length === 0)) {
      throw new Error(`${at}.types must list the content types of its home catalogs`);
    }
  });
  return raw;
}
var SPACE_LAYOUTS, SPACE_ID_RE;
var init_spaces = __esm({
  "../zero_addon_sdk/src/spaces.ts"() {
    "use strict";
    SPACE_LAYOUTS = ["video", "music"];
    SPACE_ID_RE = /^[a-z][a-z0-9-]{0,31}$/;
  }
});

// ../zero_addon_sdk/src/manifest.ts
function validateManifest(raw) {
  if (typeof raw !== "object" || raw === null) throw new Error("manifest must be an object");
  const m2 = raw;
  for (const field of ["id", "name", "version"]) {
    if (typeof m2[field] !== "string" || m2[field].length === 0) {
      throw new Error(`manifest.${field} must be a non-empty string`);
    }
  }
  for (const field of ["resources", "types", "idPrefixes"]) {
    const v = m2[field];
    if (v !== void 0 && (!Array.isArray(v) || v.some((x2) => typeof x2 !== "string"))) {
      throw new Error(`manifest.${field} must be an array of strings`);
    }
  }
  if (m2.provides !== void 0) validateProvides(m2.provides);
  const zero = m2.zero;
  if (typeof zero !== "object" || zero === null) throw new Error("manifest.zero block is required");
  if (typeof zero.kind !== "string" || zero.kind.length === 0) {
    throw new Error("manifest.zero.kind must be a non-empty string");
  }
  if (zero.repo !== void 0 && !/^[\w.-]+\/[\w.-]+$/.test(String(zero.repo))) {
    throw new Error('manifest.zero.repo must look like "owner/name"');
  }
  if (zero.builtin !== true && zero.repo === void 0 && zero.bundleUrl === void 0) {
    throw new Error("manifest.zero needs `repo` (preferred) or `bundleUrl` \u2014 nothing to install otherwise");
  }
  if (zero.sdk !== void 0 && (typeof zero.sdk !== "number" || !Number.isInteger(zero.sdk) || zero.sdk < 1)) {
    throw new Error("manifest.zero.sdk must be a protocol number");
  }
  if (zero.sdk !== void 0 && zero.sdk >= 3) validateProtocol3(zero);
  return raw;
}
function validateProtocol3(zero) {
  for (const legacy of ["tabs", "configKeys", "features", "install"]) {
    if (zero[legacy] !== void 0) throw new Error(`manifest.zero.${legacy} is protocol \u2264 2 \u2014 see PROTOCOL.md "Protocol 3"`);
  }
  const settings2 = zero.settings === void 0 ? [] : validateSettings(zero.settings);
  const actionIds = /* @__PURE__ */ new Set();
  for (const [i, a] of (zero.actions ?? []).entries()) {
    if (typeof a?.id !== "string" || !ACTION_ID_RE.test(a.id)) throw new Error(`manifest.zero.actions[${i}].id must match ${ACTION_ID_RE}`);
    if (actionIds.has(a.id)) throw new Error(`manifest.zero.actions: "${a.id}" is declared twice`);
    actionIds.add(a.id);
  }
  const routeIds = /* @__PURE__ */ new Set();
  const routeKeys = /* @__PURE__ */ new Set();
  for (const [i, r] of (zero.routes ?? []).entries()) {
    const at = `manifest.zero.routes[${i}]`;
    if (typeof r?.id !== "string" || !ACTION_ID_RE.test(r.id)) throw new Error(`${at}.id must match ${ACTION_ID_RE}`);
    if (routeIds.has(r.id)) throw new Error(`${at}.id "${r.id}" is declared twice`);
    routeIds.add(r.id);
    if (typeof r.path !== "string" || !r.path || !r.path.split("/").every((seg) => ROUTE_SEGMENT_RE.test(seg))) {
      throw new Error(`${at}.path must be segments like "hls/:token"`);
    }
    if (!Array.isArray(r.methods) || r.methods.length === 0 || r.methods.some((m2) => !METHODS.includes(m2))) {
      throw new Error(`${at}.methods must list HTTP methods (${METHODS.join(", ")})`);
    }
    if (!["public", "user", "admin"].includes(r.access)) throw new Error(`${at}.access must be public, user or admin`);
    const shape = r.path.replace(/:[a-zA-Z0-9]+/g, ":");
    for (const m2 of r.methods) {
      if (routeKeys.has(`${m2} ${shape}`)) throw new Error(`${at}: another route already answers ${m2} ${r.path}`);
      routeKeys.add(`${m2} ${shape}`);
    }
  }
  if (zero.spaces !== void 0) validateSpaces(zero.spaces);
  if (zero.services !== void 0) validateServices(zero.services);
  if (zero.ui !== void 0) validateUi(zero.ui, new Set(settings2.map((f) => f.key)), actionIds);
}
function validateProvides(raw) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("manifest.provides must be an object of role \u2192 categories");
  }
  for (const [role, cats] of Object.entries(raw)) {
    if (!isRole(role)) throw new Error(`manifest.provides: unknown role "${role}" (roles: ${ROLES.join(", ")})`);
    if (!Array.isArray(cats) || cats.length === 0) {
      throw new Error(`manifest.provides.${role} must be a non-empty array of categories`);
    }
    for (const c of cats) {
      if (!isCategory(c)) {
        throw new Error(`manifest.provides.${role}: unknown category "${String(c)}" (categories: ${CATEGORIES.join(", ")})`);
      }
    }
  }
}
function bundleUrlAt(manifest2, ref) {
  const { repo, branch, bundlePath, bundleUrl } = manifest2.zero;
  if (!repo) {
    if (!bundleUrl) throw new Error("manifest has neither zero.repo nor zero.bundleUrl");
    return bundleUrl;
  }
  const at = ref || branch || DEFAULT_BRANCH;
  return `https://raw.githubusercontent.com/${repo}/${at}/${bundlePath || DEFAULT_BUNDLE_PATH}`;
}
var SDK_PROTOCOL_VERSION, DEFAULT_BRANCH, DEFAULT_BUNDLE_PATH, ACTION_ID_RE, ROUTE_SEGMENT_RE, METHODS;
var init_manifest = __esm({
  "../zero_addon_sdk/src/manifest.ts"() {
    "use strict";
    init_services();
    init_spaces();
    init_capabilities();
    init_settings();
    init_ui();
    SDK_PROTOCOL_VERSION = 3;
    DEFAULT_BRANCH = "release";
    DEFAULT_BUNDLE_PATH = "dist/index.mjs";
    ACTION_ID_RE = /^[a-z][a-zA-Z0-9-]{0,60}$/;
    ROUTE_SEGMENT_RE = /^(?::[a-zA-Z][a-zA-Z0-9]*|[a-z0-9][a-z0-9._-]*)$/;
    METHODS = ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"];
  }
});

// ../zero_addon_sdk/src/host.ts
function consoleLogger(prefix = "addon") {
  const line = (level, category, message) => console.log(`[${prefix}:${level}] ${category}: ${message}`);
  return {
    info: (c, m2) => line("info", c, m2),
    success: (c, m2) => line("ok", c, m2),
    warn: (c, m2) => line("warn", c, m2),
    error: (c, m2, e) => console.error(`[${prefix}:error] ${c}: ${m2}`, e ?? "")
  };
}
var init_host = __esm({
  "../zero_addon_sdk/src/host.ts"() {
    "use strict";
  }
});

// ../zero_addon_sdk/src/addon.ts
function defineAddon(def) {
  return {
    manifest: def.manifest,
    async register(host) {
      const { resources: resources2 = {}, actions = {}, routes = {}, services = {}, api } = await def.setup(host);
      const sdk = def.manifest.zero.sdk ?? Math.min(2, SDK_PROTOCOL_VERSION);
      return { sdk, manifest: def.manifest, resources: resources2, actions, routes, services, ...api !== void 0 ? { api } : {} };
    }
  };
}
function isAddonInstance(value) {
  return typeof value === "object" && value !== null && typeof value.sdk === "number" && typeof value.manifest === "object";
}
var init_addon = __esm({
  "../zero_addon_sdk/src/addon.ts"() {
    "use strict";
    init_manifest();
  }
});

// ../zero_addon_sdk/src/router.ts
function parseResourcePath(segments, extra = {}) {
  if (segments.length < 3) return null;
  const [resource, type, ...idParts] = segments;
  const idRaw = idParts.join("/");
  const id = decodeURIComponent(idRaw.replace(/\.json$/i, ""));
  if (!resource || !type || !id) return null;
  return { resource, type, id, extra };
}
async function routeResourceRequest(addon2, segments, extra = {}, context) {
  if (segments.length === 1 && /^manifest\.json$/i.test(segments[0])) {
    return { status: 200, body: addon2.manifest };
  }
  const parsed = parseResourcePath(segments, extra);
  const req = parsed && context ? { ...parsed, context } : parsed;
  if (!req) {
    return { status: 400, body: { error: "expected <resource>/<type>/<id>.json" } };
  }
  const handler = addon2.resources[req.resource];
  if (!handler) {
    return {
      status: 404,
      body: { error: `addon does not serve resource "${req.resource}"`, resources: Object.keys(addon2.resources) }
    };
  }
  try {
    const body = await handler(req) ?? {};
    const why = checkResponse(req.resource, body);
    if (why) return { status: 502, body: { error: `addon response does not conform: ${why}` } };
    return { status: 200, body };
  } catch (err) {
    return { status: 502, body: { error: err.message || "addon handler failed" } };
  }
}
async function runAction(addon2, id, input, context) {
  const declared = (addon2.manifest.zero.actions ?? []).some((a) => a.id === id);
  const handler = addon2.actions[id];
  if (!declared || !handler) return { ok: false, message: `unknown action "${id}"` };
  try {
    const result = await handler(input, context);
    if (typeof result !== "object" || result === null || typeof result.ok !== "boolean") {
      return { ok: false, message: `action "${id}" answered without { ok }` };
    }
    if (result.rows !== void 0 && !Array.isArray(result.rows)) return { ok: false, message: `action "${id}": rows must be an array` };
    if (result.items !== void 0 && !Array.isArray(result.items)) return { ok: false, message: `action "${id}": items must be an array` };
    return result;
  } catch (err) {
    return { ok: false, message: err.message || `action "${id}" failed` };
  }
}
function matchRoute(addon2, method, path) {
  const segs = path.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
  let best = null;
  for (const route of addon2.manifest.zero.routes ?? []) {
    if (!route.methods.includes(method)) continue;
    const parts = route.path.split("/");
    if (parts.length !== segs.length) continue;
    const params = {};
    let score = 0;
    let ok = true;
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].startsWith(":")) params[parts[i].slice(1)] = segs[i];
      else if (parts[i] === segs[i]) score += 1;
      else {
        ok = false;
        break;
      }
    }
    if (ok && (!best || score > best.score)) best = { route, params, score };
  }
  const handler = best && addon2.routes[best.route.id];
  return best && handler ? { route: best.route, handler, params: best.params } : null;
}
var init_router = __esm({
  "../zero_addon_sdk/src/router.ts"() {
    "use strict";
    init_responses();
  }
});

// ../zero_addon_sdk/src/projection.ts
function detectProjection(rawTitle, opts = {}) {
  const t = ` ${rawTitle.toLowerCase().replace(/[._\-]+/g, " ")} `;
  const has = (re) => re.test(t);
  let stereo = "mono";
  if (has(/\bmono\b/)) {
    stereo = "mono";
  } else if (has(/\b(tb|ou|htab|hou|3dv|over[- ]?under|top[- ]?bottom)\b/)) {
    stereo = "tb";
  } else if (has(/\b(sbs|lr|hsbs|fsbs|3dh|half[- ]?sbs|full[- ]?sbs|side[- ]?by[- ]?side)\b/)) {
    stereo = "sbs";
  }
  if (has(/\bmkx220\b/)) return immersive("mkx220", 220, stereo);
  if (has(/\bmkx200\b/)) return immersive("mkx200", 200, stereo);
  if (has(/\bvrca220\b/)) return immersive("vrca220", 220, stereo);
  if (has(/\brf52\b/)) return immersive("rf52", 190, stereo);
  if (has(/\bfisheye190\b/) || has(/\bfisheye\b/)) {
    const fov = has(/\b220\b/) ? 220 : has(/\b200\b/) ? 200 : 190;
    return immersive("fisheye", fov, stereo);
  }
  if (has(/\b360\b/)) return immersive("sphere", 360, stereo);
  if (has(/\b180\b/) || has(/\b180x180\b/)) return immersive("dome", 180, stereo);
  if (opts.assumeVrWhenHinted && VR_HINT.test(t)) return immersive("dome", 180, stereo);
  if (has(/\b(sbs|hsbs|fsbs|half[- ]?sbs|full[- ]?sbs|halfsbs|fullsbs|hou|htab|h[- ]?ou|half[- ]?ou|full[- ]?ou|over[- ]?under|top[- ]?bottom|side[- ]?by[- ]?side|3dh|3dv)\b/)) {
    const s3d = stereo === "mono" ? "sbs" : stereo;
    return { is3d: true, isVr: false, stereo: s3d, screenType: "flat", fov: 0 };
  }
  return { ...FLAT_2D };
}
function immersive(screenType, fov, stereo) {
  const s = stereo === "mono" ? "sbs" : stereo;
  return { is3d: true, isVr: true, stereo: s, screenType, fov };
}
var FLAT_2D, VR_HINT;
var init_projection = __esm({
  "../zero_addon_sdk/src/projection.ts"() {
    "use strict";
    FLAT_2D = {
      is3d: false,
      isVr: false,
      stereo: "mono",
      screenType: "flat",
      fov: 0
    };
    VR_HINT = /\bvr\b|vrporn|czechvr|wankzvr|badoinkvr|vrbangers|vrhush|vrcosplay|vrconk|sexbabesvr|realjamvr|milfvr|18vr|vrallure|vrlatina|tmwvrnet|virtualreal|naughtyamericavr|\bslr\b/;
  }
});

// ../zero_addon_sdk/src/conformance.ts
function checkAddon(addon2) {
  const problems = [];
  try {
    validateManifest(addon2.manifest);
  } catch (err) {
    return [err.message];
  }
  const m2 = addon2.manifest;
  const declared = new Set(m2.resources ?? []);
  const handled = new Set(Object.keys(addon2.resources));
  if (!m2.provides || Object.keys(m2.provides).length === 0) {
    problems.push("manifest.provides is empty \u2014 the server will never offer this addon to a library");
  }
  for (const [role, cats] of Object.entries(m2.provides ?? {})) {
    if (!isRole(role) || !cats?.length) continue;
    for (const r of ROLE_RESOURCES[role].required) {
      if (!handled.has(r)) problems.push(`provides.${role} needs a "${r}" handler`);
      if (!declared.has(r)) problems.push(`provides.${role} needs "${r}" in manifest.resources`);
    }
  }
  for (const r of declared) {
    if (!handled.has(r)) problems.push(`manifest.resources lists "${r}" but there is no handler`);
  }
  for (const r of handled) {
    if (!declared.has(r)) problems.push(`handler "${r}" is not listed in manifest.resources`);
  }
  const reachable = new Set(requiredResources(m2.provides));
  for (const role of Object.keys(m2.provides ?? {})) {
    if (isRole(role)) for (const r of ROLE_RESOURCES[role].optional) reachable.add(r);
  }
  for (const r of handled) {
    if (r !== "playback" && r !== "automation" && r !== "space" && !reachable.has(r)) {
      problems.push(`handler "${r}" belongs to no role in provides`);
    }
  }
  if ((m2.zero.sdk ?? 0) >= 3) problems.push(...checkProtocol3(addon2));
  return problems;
}
function checkProtocol3(addon2) {
  const problems = [];
  const z2 = addon2.manifest.zero;
  if (addon2.api !== void 0) problems.push("protocol 3 addons must not export `api` \u2014 use resources, actions and routes");
  const pair = (what, declared, handled) => {
    for (const id of declared) if (!handled.includes(id)) problems.push(`${what} "${id}" is declared but has no handler`);
    for (const id of handled) if (!declared.includes(id)) problems.push(`${what} handler "${id}" is not declared in manifest.zero`);
  };
  pair("action", (z2.actions ?? []).map((a) => a.id), Object.keys(addon2.actions));
  pair("route", (z2.routes ?? []).map((r) => r.id), Object.keys(addon2.routes));
  for (const id of uiActionIds(z2.ui)) {
    if (!addon2.actions[id]) problems.push(`the UI calls action "${id}" but there is no handler`);
  }
  if ((z2.spaces ?? []).some((s) => s.render === "addon") && !addon2.resources.space) {
    problems.push('a space with render "addon" needs a "space" handler');
  }
  pair("service", z2.services?.provides ?? [], Object.keys(addon2.services ?? {}));
  return problems;
}
async function probeAddon(addon2, requests) {
  const problems = [];
  for (const req of requests) {
    const label = `${req.resource}/${req.type}/${req.id}`;
    const handler = addon2.resources[req.resource];
    if (!handler) {
      problems.push(`${label}: no "${req.resource}" handler`);
      continue;
    }
    try {
      const body = await handler({ ...req, extra: req.extra ?? {} });
      const why = checkResponse(req.resource, body);
      if (why) problems.push(`${label}: ${why}`);
    } catch (err) {
      problems.push(`${label}: threw ${err.message}`);
    }
  }
  return problems;
}
var init_conformance = __esm({
  "../zero_addon_sdk/src/conformance.ts"() {
    "use strict";
    init_capabilities();
    init_manifest();
    init_responses();
    init_ui();
  }
});

// ../zero_addon_sdk/src/index.ts
var src_exports = {};
__export(src_exports, {
  CATEGORIES: () => CATEGORIES,
  CONTENT_TYPES: () => CONTENT_TYPES,
  DEFAULT_BRANCH: () => DEFAULT_BRANCH,
  DEFAULT_BUNDLE_PATH: () => DEFAULT_BUNDLE_PATH,
  RESOURCES: () => RESOURCES,
  RESPONSE_KEYS: () => RESPONSE_KEYS,
  ROLES: () => ROLES,
  ROLE_RESOURCES: () => ROLE_RESOURCES,
  SDK_PROTOCOL_VERSION: () => SDK_PROTOCOL_VERSION,
  SETTING_TYPES: () => SETTING_TYPES,
  SPACE_LAYOUTS: () => SPACE_LAYOUTS,
  ServiceUnavailableError: () => ServiceUnavailableError,
  UI_TAB_GROUPS: () => UI_TAB_GROUPS,
  bundleUrlAt: () => bundleUrlAt,
  checkAddon: () => checkAddon,
  checkResponse: () => checkResponse,
  checkSettingValue: () => checkSettingValue,
  consoleLogger: () => consoleLogger,
  defineAddon: () => defineAddon,
  detectProjection: () => detectProjection,
  isAddonInstance: () => isAddonInstance,
  isCanonicalResource: () => isCanonicalResource,
  isCanonicalType: () => isCanonicalType,
  isCategory: () => isCategory,
  isRole: () => isRole,
  matchRoute: () => matchRoute,
  migrate: () => migrate,
  parseResourcePath: () => parseResourcePath,
  parseSettingInput: () => parseSettingInput,
  probeAddon: () => probeAddon,
  providesFor: () => providesFor,
  requiredResources: () => requiredResources,
  resolveSettings: () => resolveSettings,
  routeResourceRequest: () => routeResourceRequest,
  runAction: () => runAction,
  uiActionIds: () => uiActionIds,
  uiText: () => uiText,
  validateManifest: () => validateManifest,
  validateServices: () => validateServices,
  validateSettings: () => validateSettings,
  validateSpaces: () => validateSpaces,
  validateUi: () => validateUi
});
var init_src = __esm({
  "../zero_addon_sdk/src/index.ts"() {
    "use strict";
    init_types();
    init_capabilities();
    init_responses();
    init_settings();
    init_ui();
    init_storage();
    init_manifest();
    init_host();
    init_addon();
    init_router();
    init_services();
    init_spaces();
    init_projection();
    init_conformance();
  }
});

// src/plugin.ts
init_src();
import { existsSync as existsSync7, readdirSync as readdirSync2 } from "node:fs";
import { join as join5 } from "node:path";

// src/cookies.ts
import { createHash } from "node:crypto";
import { existsSync, promises as fs } from "node:fs";
import { dirname } from "node:path";

// src/host.ts
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
var _host = null;
var _fallbackDir = null;
function setConduitHost(host) {
  _host = host;
}
function hasConduitHost() {
  return _host !== null;
}
function getConduitHost() {
  if (!_host) throw new Error("Conduit host not configured \u2014 call setConduitHost() first");
  return _host;
}
var log = {
  info: (c, m2) => _host ? _host.logger.info(c, m2) : console.log(`[conduit] ${c}: ${m2}`),
  success: (c, m2) => _host ? _host.logger.success(c, m2) : console.log(`[conduit] ${c}: ${m2}`),
  warn: (c, m2) => _host ? _host.logger.warn(c, m2) : console.warn(`[conduit] ${c}: ${m2}`),
  error: (c, m2, e) => _host ? _host.logger.error(c, m2, e) : console.error(`[conduit] ${c}: ${m2}`, e ?? "")
};
function dataDir() {
  if (_host) return _host.dataDir;
  _fallbackDir ??= mkdtempSync(join(tmpdir(), "conduit-"));
  return _fallbackDir;
}
async function settings() {
  if (!_host) return {};
  try {
    return await _host.settings.get();
  } catch {
    return {};
  }
}
function egress(hostname) {
  return _host ? _host.services.egress(hostname) : { mode: "direct" };
}

// src/cookies.ts
function countYoutubeRows(content) {
  return content.split("\n").filter((l) => /youtube\.com/i.test(l) && !l.trimStart().startsWith("#")).length;
}
function cookiesProblem(content) {
  const text = content.replace(/\r\n/g, "\n").trim();
  if (!text) return null;
  const looksLikeCookies = /^#\s*(Netscape|HTTP) Cookie File/im.test(text) || countYoutubeRows(text) > 0;
  return looksLikeCookies ? null : "That doesn't look like a cookies.txt \u2014 no youtube.com cookies found.";
}
var lastHash = null;
async function syncCookies(file) {
  const raw = String((await settings()).youtube_cookies ?? "").replace(/\r\n/g, "\n").trim();
  const usable = raw && !cookiesProblem(raw) ? raw : "";
  const hash = createHash("sha256").update(usable).digest("hex");
  if (hash === lastHash && (usable ? existsSync(file) : !existsSync(file))) return;
  if (usable) {
    await fs.mkdir(dirname(file), { recursive: true });
    await fs.writeFile(file, `${usable}
`, { mode: 384 });
  } else {
    await fs.rm(file, { force: true });
  }
  lastHash = hash;
}
async function cookiesStatus() {
  const raw = String((await settings()).youtube_cookies ?? "");
  const problem = cookiesProblem(raw);
  const rows = problem ? 0 : countYoutubeRows(raw);
  return { present: rows > 0, rows, problem };
}

// manifest.json
var manifest_default = {
  id: "zero.conduit",
  name: "Conduit",
  version: "2.0.1",
  description: "yt-dlp online video for Zero Media \u2014 content, metadata and artwork for videos and music (YouTube search + playback, YouTube Music), plus homepage trailer playback. Provisions the yt-dlp binary on the server at install. Local videos/music libraries do not need this addon.",
  resources: [
    "catalog",
    "catalogs",
    "meta",
    "stream",
    "search",
    "artwork"
  ],
  types: [
    "video",
    "channel",
    "trailer",
    "music",
    "track",
    "album",
    "artist",
    "playlist",
    "genre"
  ],
  idPrefixes: [
    "yt:",
    "yt_id:",
    "yb:",
    "UC",
    "https://www.youtube.com/",
    "https://youtube.com/",
    "https://m.youtube.com/",
    "https://music.youtube.com/",
    "https://youtu.be/"
  ],
  provides: {
    content: [
      "videos",
      "music"
    ],
    metadata: [
      "videos",
      "music"
    ],
    artwork: [
      "videos",
      "music"
    ]
  },
  zero: {
    kind: "videos",
    sdk: 3,
    repo: "j4ckgrey/zero_videos",
    branch: "main",
    bundlePath: "dist/index.mjs",
    bundleUrl: "https://raw.githubusercontent.com/j4ckgrey/zero_videos/release/dist/index.mjs",
    settings: [
      {
        key: "music_enabled",
        type: "toggle",
        label: "YouTube Music",
        description: "Music spaces, search and playback from YouTube Music.",
        default: true
      },
      {
        key: "videos_enabled",
        type: "toggle",
        label: "YouTube videos",
        description: "Video spaces, channels, search and playback from YouTube.",
        default: true
      },
      {
        key: "youtubio_url",
        type: "url",
        label: "YouTubio catalogue",
        description: "Optional. A Stremio-style YouTube catalogue (its manifest URL) for the rows on the videos home.",
        placeholder: "https://\u2026/manifest.json"
      },
      {
        key: "youtube_cookies",
        type: "secret",
        multiline: true,
        label: "YouTube cookies (cookies.txt)",
        description: "From a throwaway Google account. YouTube asks datacenter IPs to \u201Cconfirm you\u2019re not a bot\u201D; signed-in cookies get past it. Paste the whole cookies.txt."
      }
    ],
    actions: [
      {
        id: "status"
      },
      {
        id: "rt-list"
      },
      {
        id: "rt-toggle"
      },
      {
        id: "rt-discover"
      },
      {
        id: "update-ytdlp"
      }
    ],
    ui: {
      tabs: [
        {
          id: "youtube",
          label: "YouTube",
          icon: "film",
          group: "content",
          description: "YouTube videos, YouTube Music and the Rotten Tomatoes trailer rows, through yt-dlp.",
          sections: [
            {
              kind: "status",
              id: "status",
              title: "Status",
              source: "status"
            },
            {
              kind: "form",
              id: "features",
              title: "What Conduit serves",
              fields: [
                "music_enabled",
                "videos_enabled",
                "youtubio_url"
              ]
            },
            {
              kind: "form",
              id: "cookies",
              title: "Sign-in cookies",
              fields: [
                "youtube_cookies"
              ]
            },
            {
              kind: "table",
              id: "rt",
              title: "Rotten Tomatoes trailers",
              description: "Each enabled playlist becomes a trailer row on the home screen.",
              rows: "rt-list",
              columns: [
                {
                  key: "title",
                  label: "Playlist"
                },
                {
                  key: "videos",
                  label: "Videos",
                  format: "number"
                },
                {
                  key: "enabled",
                  label: "Shown",
                  format: "bool"
                }
              ],
              rowButtons: [
                {
                  action: "rt-toggle",
                  label: "Show / hide"
                }
              ],
              empty: "No playlists yet \u2014 press Discover playlists."
            },
            {
              kind: "buttons",
              id: "tools",
              title: "Tools",
              buttons: [
                {
                  action: "rt-discover",
                  label: "Discover playlists"
                },
                {
                  action: "update-ytdlp",
                  label: "Update yt-dlp"
                }
              ]
            }
          ]
        }
      ]
    },
    spaces: [
      {
        id: "music",
        name: {
          en: "Music",
          de: "Musik",
          fr: "Musique",
          it: "Musica",
          es: "M\xFAsica",
          nl: "Muziek",
          pt: "M\xFAsica",
          zh: "\u97F3\u4E50"
        },
        icon: "music",
        layout: "music",
        types: [
          "track",
          "album",
          "artist",
          "playlist",
          "genre"
        ]
      },
      {
        id: "videos",
        name: {
          en: "Videos",
          de: "Videos",
          fr: "Vid\xE9os",
          it: "Video",
          es: "V\xEDdeos",
          nl: "Video's",
          pt: "V\xEDdeos",
          zh: "\u89C6\u9891"
        },
        icon: "video",
        layout: "video",
        types: [
          "video",
          "channel",
          "playlist"
        ]
      }
    ]
  },
  catalogs: [
    {
      id: "made-for-you",
      type: "track",
      name: "Made for you",
      names: {
        en: "Made for you",
        de: "F\xFCr dich",
        es: "Hecho para ti",
        fr: "Pour vous",
        it: "Per te",
        nl: "Voor jou",
        pt: "Feito para voc\xEA",
        zh: "\u4E3A\u4F60\u63A8\u8350"
      },
      extra: [
        "seeds"
      ]
    },
    {
      id: "trending",
      type: "track",
      name: "Trending",
      names: {
        en: "Trending",
        de: "Angesagt",
        es: "Tendencias",
        fr: "Tendances",
        it: "Di tendenza",
        nl: "Trending",
        pt: "Em alta",
        zh: "\u70ED\u95E8"
      },
      extra: [
        "genre"
      ]
    },
    {
      id: "new-releases",
      type: "album",
      name: "New releases",
      names: {
        en: "New releases",
        de: "Neuerscheinungen",
        es: "Novedades",
        fr: "Nouveaut\xE9s",
        it: "Nuove uscite",
        nl: "Nieuwe releases",
        pt: "Lan\xE7amentos",
        zh: "\u65B0\u53D1\u884C"
      },
      extra: [
        "genre"
      ]
    },
    {
      id: "popular",
      type: "artist",
      name: "Popular artists",
      names: {
        en: "Popular artists",
        de: "Beliebte K\xFCnstler",
        es: "Artistas populares",
        fr: "Artistes populaires",
        it: "Artisti popolari",
        nl: "Populaire artiesten",
        pt: "Artistas populares",
        zh: "\u70ED\u95E8\u827A\u4EBA"
      },
      extra: [
        "genre"
      ]
    },
    {
      id: "community",
      type: "playlist",
      name: "Community playlists",
      names: {
        en: "Community playlists",
        de: "Community-Playlists",
        es: "Listas de la comunidad",
        fr: "Playlists de la communaut\xE9",
        it: "Playlist della community",
        nl: "Community-playlists",
        pt: "Playlists da comunidade",
        zh: "\u793E\u533A\u6B4C\u5355"
      },
      extra: [
        "genre"
      ]
    },
    {
      id: "moods",
      type: "playlist",
      name: "Moods & moments",
      names: {
        en: "Moods & moments",
        de: "Stimmungen",
        es: "Estados de \xE1nimo",
        fr: "Humeurs",
        it: "Mood e momenti",
        nl: "Stemmingen",
        pt: "Climas e momentos",
        zh: "\u5FC3\u60C5\u4E0E\u65F6\u523B"
      }
    },
    {
      id: "genres",
      type: "genre",
      name: "Genres",
      names: {
        en: "Genres",
        de: "Genres",
        es: "G\xE9neros",
        fr: "Genres",
        it: "Generi",
        nl: "Genres",
        pt: "G\xEAneros",
        zh: "\u6D41\u6D3E"
      }
    }
  ]
};

// src/ytdlpVideos.ts
var ytdlpVideos_exports = {};
__export(ytdlpVideos_exports, {
  APPROX_DATE_OPTS: () => APPROX_DATE_OPTS,
  CHANNEL_SEARCH_SP: () => CHANNEL_SEARCH_SP,
  entryToChannelMeta: () => entryToChannelMeta,
  entryToVideoMeta: () => entryToVideoMeta,
  formatSeconds: () => formatSeconds,
  formatYtdlpDate: () => formatYtdlpDate,
  isoDateFromEpoch: () => isoDateFromEpoch,
  ytdlp: () => ytdlp
});

// src/ytdlpBinary.ts
import { existsSync as existsSync6, readdirSync } from "node:fs";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { join as join4 } from "node:path";

// node_modules/ytdlp-nodejs/dist/index.mjs
import { fileURLToPath as Pe } from "url";
import ve from "path";
import { spawn as Z, spawnSync as ye } from "child_process";
import * as X from "fs";
import Ye from "path";
import { Blob as qe } from "buffer";
import { PassThrough as Qe } from "stream";
import Q from "path";
import N from "fs";
import * as Se from "https";
import * as _e from "http";
import { URL as oe } from "url";
import * as b from "fs";
import * as ue from "fs";
import * as D from "path";
import * as g from "fs";
import * as T from "path";
import Be from "crypto";
import { EventEmitter as $e } from "node:events";
import pe from "node:fs";
import { spawn as je } from "node:child_process";
import { PassThrough as Me } from "node:stream";
import { spawn as We } from "node:child_process";
import { PassThrough as ze } from "node:stream";
import { spawn as be } from "node:child_process";
var Fe = () => Pe(import.meta.url);
var Ae = () => ve.dirname(Fe());
var h = Ae();
function V(e) {
  let r = [];
  if (e.printHelp && r.push("--help"), e.printVersion && r.push("--version"), e.update && r.push("--update"), e.noUpdate && r.push("--no-update"), e.updateTo && r.push("--update-to", e.updateTo), e.ignoreErrors && r.push("--ignore-errors"), e.noAbortOnError && r.push("--no-abort-on-error"), e.abortOnError && r.push("--abort-on-error"), e.dumpUserAgent && r.push("--dump-user-agent"), e.listExtractors && r.push("--list-extractors"), e.extractorDescriptions && r.push("--extractor-descriptions"), e.useExtractors && e.useExtractors.length > 0 && r.push("--use-extractors", e.useExtractors.join(",")), e.defaultSearch && r.push("--default-search", e.defaultSearch), e.ignoreConfig && r.push("--ignore-config"), e.noConfigLocations && r.push("--no-config-location"), e.configLocations && e.configLocations.length > 0 && r.push("--config-locations", ...e.configLocations), e.pluginDirs && e.pluginDirs.length > 0) for (let s of e.pluginDirs) r.push("--plugin-dirs", s);
  e.noPluginDirs && r.push("--no-plugin-dirs"), e.flatPlaylist && r.push("--flat-playlist"), e.noFlatPlaylist && r.push("--no-flat-playlist"), e.liveFromStart && r.push("--live-from-start"), e.noLiveFromStart && r.push("--no-live-from-start"), e.waitForVideo && r.push("--wait-for-video", e.waitForVideo.toString()), e.noWaitForVideo && r.push("--no-wait-for-video"), e.markWatched && r.push("--mark-watched"), e.noMarkWatched && r.push("--no-mark-watched"), e.color && r.push("--color", e.color), e.compatOptions && e.compatOptions.length > 0 && r.push("--compat-options", e.compatOptions.join(",")), e.aliases && e.aliases.length > 0 && r.push("--alias", ...e.aliases);
  let t = e.jsRuntime ?? "node";
  if (t && r.push("--js-runtime", t), e.proxy && r.push("--proxy", e.proxy), e.socketTimeout && r.push("--socket-timeout", e.socketTimeout.toString()), e.sourceAddress && r.push("--source-address", e.sourceAddress), e.impersonate && e.impersonate.length > 0 && r.push("--impersonate", e.impersonate.join(",")), e.listImpersonateTargets && r.push("--list-impersonate-targets"), e.forceIpv4 && r.push("--force-ipv4"), e.forceIpv6 && r.push("--force-ipv6"), e.enableFileUrls && r.push("--enable-file-urls"), e.geoVerificationProxy && r.push("--geo-verification-proxy", e.geoVerificationProxy), e.xff && r.push("--xff", e.xff), e.playlistItems && r.push("--playlist-items", e.playlistItems), e.minFilesize && r.push("--min-filesize", e.minFilesize), e.maxFilesize && r.push("--max-filesize", e.maxFilesize), e.date && r.push("--date", e.date), e.dateBefore && r.push("--datebefore", e.dateBefore), e.dateAfter && r.push("--dateafter", e.dateAfter), e.matchFilter && r.push("--match-filter", e.matchFilter), e.noMatchFilters && r.push("--no-match-filters"), e.breakMatchFilters && r.push("--break-match-filters", e.breakMatchFilters), e.noBreakMatchFilters && r.push("--no-break-match-filters"), e.noPlaylist && r.push("--no-playlist"), e.yesPlaylist && r.push("--yes-playlist"), e.ageLimit && r.push("--age-limit", e.ageLimit.toString()), e.downloadArchive && r.push("--download-archive", e.downloadArchive), e.noDownloadArchive && r.push("--no-download-archive"), e.maxDownloads && r.push("--max-downloads", e.maxDownloads.toString()), e.breakOnExisting && r.push("--break-on-existing"), e.noBreakOnExisting && r.push("--no-break-on-existing"), e.breakPerInput && r.push("--break-per-input"), e.noBreakPerInput && r.push("--break-per-input"), e.skipPlaylistAfterErrors && r.push("--skip-playlist-after-errors", e.skipPlaylistAfterErrors.toString()), e.concurrentFragments && r.push("--concurrent-fragments", e.concurrentFragments.toString()), e.limitRate && r.push("--limit-rate", e.limitRate), e.throttledRate && r.push("--throttled-rate", e.throttledRate), e.retries && r.push("--retries", e.retries.toString()), e.fileAccessRetries && r.push("--file-access-retries", e.fileAccessRetries.toString()), e.fragmentRetries && r.push("--fragment-retries", e.fragmentRetries.toString()), e.retrySleep && r.push("--retry-sleep", e.retrySleep.toString()), e.retrySleepByType) for (let [s, i] of Object.entries(e.retrySleepByType)) r.push("--retry-sleep", `${s}:${i}`);
  if (e.skipUnavailableFragments && r.push("--skip-unavailable-fragments"), e.abortOnUnavailableFragment && r.push("--abort-on-unavailable-fragment"), e.keepFragments && r.push("--keep-fragments"), e.noKeepFragments && r.push("--no-keep-fragments"), e.bufferSize && r.push("--buffer-size", e.bufferSize), e.resizeBuffer && r.push("--resize-buffer"), e.noResizeBuffer && r.push("--no-resize-buffer"), e.httpChunkSize && r.push("--http-chunk-size", e.httpChunkSize), e.playlistRandom && r.push("--playlist-random"), e.lazyPlaylist && r.push("--lazy-playlist"), e.noLazyPlaylist && r.push("--no-lazy-playlist"), e.xattrSetFilesize && r.push("--xattr-set-filesize"), e.hlsUseMpegts && r.push("--hls-use-mpegts"), e.noHlsUseMpegts && r.push("--no-hls-use-mpegts"), e.downloadSections && r.push("--download-sections", e.downloadSections.toString()), e.downloader && r.push("--downloader", e.downloader), e.downloaderArgs && r.push("--downloader-args", e.downloaderArgs), e.batchFile && r.push("--batch-file", e.batchFile), e.noBatchFile && r.push("--no-batch-file"), e.paths) if (typeof e.paths == "string") r.push("--paths", e.paths);
  else for (let [s, i] of Object.entries(e.paths)) r.push("--paths", `${s}:${i}`);
  if (e.output && r.push("-o", e.output), e.outputNaPlaceholder && r.push("--output-na-placeholder", e.outputNaPlaceholder), e.restrictFilenames && r.push("--restrict-filenames"), e.noRestrictFilenames && r.push("--no-restrict-filenames"), e.windowsFilenames && r.push("--windows-filenames"), e.noWindowsFilenames && r.push("--no-windows-filenames"), e.trimFileNames && r.push("--trim-file-names", e.trimFileNames.toString()), e.noOverwrites && r.push("--no-overwrites"), e.forceOverwrites && r.push("--force-overwrites"), e.noForceOverwrites && r.push("--no-force-overwrites"), e.continue && r.push("--continue"), e.noContinue && r.push("--no-continue"), e.part && r.push("--part"), e.noPart && r.push("--no-part"), e.mtime && r.push("--mtime"), e.noMtime && r.push("--no-mtime"), e.writeDescription && r.push("--write-description"), e.noWriteDescription && r.push("--no-write-description"), e.writeInfoJson && r.push("--write-info-json"), e.noWriteInfoJson && r.push("--no-write-info-json"), e.writePlaylistMetafiles && r.push("--write-playlist-metafiles"), e.noWritePlaylistMetafiles && r.push("--no-write-playlist-metafiles"), e.cleanInfoJson && r.push("--clean-info-json"), e.noCleanInfoJson && r.push("--no-clean-info-json"), e.writeComments && r.push("--write-comments"), e.noWriteComments && r.push("--no-write-comments"), e.loadInfoJson && r.push("--load-info-json", e.loadInfoJson.toString()), e.cookies && r.push("--cookies", e.cookies), e.noCookies && r.push("--no-cookies"), e.cookiesFromBrowser && r.push("--cookies-from-browser", e.cookiesFromBrowser), e.noCookiesFromBrowser && r.push("--no-cookies-from-browser"), e.cacheDir && r.push("--cache-dir", e.cacheDir), e.noCacheDir && r.push("--no-cache-dir"), e.rmCacheDir && r.push("--rm-cache-dir"), e.writeThumbnail && r.push("--write-thumbnail"), e.noWriteThumbnails && r.push("--no-write-thumbnails"), e.writeAllThumbnails && r.push("--write-all-thumbnails"), e.listThumbnails && r.push("--list-thumbnails"), e.writeLink && r.push("--write-link"), e.writeUrlLink && r.push("--write-url-link"), e.writeWeblocLink && r.push("--write-webloc-link"), e.writeDesktopLink && r.push("--write-desktop-link"), e.quiet && r.push("--quiet"), e.noQuiet && r.push("--no-quiet"), e.noWarnings && r.push("--no-warnings"), e.simulate && r.push("--simulate"), e.noSimulate && r.push("--no-simulate"), e.ignoreNoFormatsError && r.push("--ignore-no-formats-error"), e.noIgnoreNoFormatsError && r.push("--no-ignore-no-formats-error"), e.skipDownload && r.push("--skip-download"), e.print && r.push("--print", e.print), e.printToFile && r.push("--print-to-file", e.printToFile), e.dumpJson && r.push("--dump-json"), e.dumpSingleJson && r.push("--dump-single-json"), e.forceWriteArchive && r.push("--force-write-archive"), e.newline && r.push("--newline"), e.noProgress && r.push("--no-progress"), e.progress && r.push("--progress"), e.consoleTitle && r.push("--console-title"), e.progressTemplate && r.push("--progress-template", e.progressTemplate), e.progressDelta && r.push("--progress-delta", e.progressDelta.toString()), e.verbose && r.push("--verbose"), e.dumpPages && r.push("--dump-pages"), e.writePages && r.push("--write-pages"), e.printTraffic && r.push("--print-traffic"), e.encoding && r.push("--encoding", e.encoding), e.legacyServerConnect && r.push("--legacy-server-connect"), e.noCheckCertificates && r.push("--no-check-certificates"), e.preferInsecure && r.push("--prefer-insecure"), e.addHeaders) for (let [s, i] of Object.entries(e.addHeaders)) r.push("--add-header", `${s}:${i}`);
  if (e.headers) for (let [s, i] of Object.entries(e.headers)) r.push("--add-header", `${s}:${i}`);
  if (e.bidiWorkaround && r.push("--bidi-workaround"), e.sleepRequests && r.push("--sleep-requests", e.sleepRequests.toString()), e.sleepInterval && r.push("--sleep-interval", e.sleepInterval.toString()), e.maxSleepInterval && r.push("--max-sleep-interval", e.maxSleepInterval.toString()), e.sleepSubtitles && r.push("--sleep-subtitles", e.sleepSubtitles.toString()), e.format && r.push("-f", e.format), e.formatSort && e.formatSort.length > 0 && r.push("--format-sort", e.formatSort.join(",")), e.formatSortForce && r.push("--format-sort-force"), e.noFormatSortForce && r.push("--no-format-sort-force"), e.videoMultiStreams && r.push("--video-multistreams"), e.noVideoMultiStreams && r.push("--no-video-multistreams"), e.audioMultiStreams && r.push("--audio-multistreams"), e.noAudioMultiStreams && r.push("--no-audio-multistreams"), e.preferFreeFormats && r.push("--prefer-free-formats"), e.noPreferFreeFormats && r.push("--no-prefer-free-formats"), e.checkFormats && r.push("--check-formats"), e.checkAllFormats && r.push("--check-all-formats"), e.noCheckFormats && r.push("--no-check-formats"), e.listFormats && r.push("--list-formats"), e.mergeOutputFormat && r.push("--merge-output-format", e.mergeOutputFormat), e.writeSubs && r.push("--write-subs"), e.noWriteSubs && r.push("--no-write-subs"), e.writeAutoSubs && r.push("--write-auto-subs"), e.writeAllSubs && r.push("--all-subs"), e.listSubs && r.push("--list-subs"), e.subFormat && r.push("--sub-format", e.subFormat), e.subLangs && e.subLangs.length > 0 && r.push("--sub-langs", e.subLangs.join(",")), e.username && r.push("--username", e.username), e.password && r.push("--password", e.password), e.twoFactor && r.push("--twofactor", e.twoFactor), e.netrc && r.push("--netrc"), e.videoPassword && r.push("--video-password", e.videoPassword), e.apMso && r.push("--ap-mso", e.apMso), e.apUsername && r.push("--ap-username", e.apUsername), e.apPassword && r.push("--ap-password", e.apPassword), e.netrcLocation && r.push("--netrc-location", e.netrcLocation), e.netrcCmd && r.push("--netrc-cmd", e.netrcCmd), e.apListMso && r.push("--ap-list-mso"), e.clientCertificate && r.push("--client-certificate", e.clientCertificate), e.clientCertificateKey && r.push("--client-certificate-key", e.clientCertificateKey), e.clientCertificatePassword && r.push("--client-certificate-password", e.clientCertificatePassword), e.extractorRetries !== void 0 && r.push("--extractor-retries", e.extractorRetries.toString()), e.allowDynamicMpd && r.push("--allow-dynamic-mpd"), e.ignoreDynamicMpd && r.push("--ignore-dynamic-mpd"), e.hlsSplitDiscontinuity && r.push("--hls-split-discontinuity"), e.noHlsSplitDiscontinuity && r.push("--no-hls-split-discontinuity"), e.extractorArgs) for (let [s, i] of Object.entries(e.extractorArgs)) r.push("--extractor-args", `${s}:${i.join(" ")}`);
  if (e.playlistStart !== void 0 && r.push("--playlist-start", e.playlistStart.toString()), e.playlistEnd !== void 0 && r.push("--playlist-end", e.playlistEnd.toString()), e.matchTitle && r.push("--match-title", e.matchTitle), e.rejectTitle && r.push("--reject-title", e.rejectTitle), e.includeAds && r.push("--include-ads"), e.breakOnReject && r.push("--break-on-reject"), e.noDownload && r.push("--no-download"), e.playlistReverse && r.push("--playlist-reverse"), e.geoBypass && r.push("--geo-bypass"), e.geoBypassCountry && r.push("--geo-bypass-country", e.geoBypassCountry), e.geoBypassIpBlock && r.push("--geo-bypass-ip-block", e.geoBypassIpBlock), e.convertThumbnails && r.push("--convert-thumbnails", e.convertThumbnails), e.writeLink && r.push("--write-link"), e.writeUrlLink && r.push("--write-url-link"), e.writeWeblocLink && r.push("--write-webloc-link"), e.writeLnkLink && r.push("--write-lnk-link"), e.referer && r.push("--referer", e.referer), e.userAgent && r.push("--user-agent", e.userAgent), e.extractAudio && r.push("--extract-audio"), e.audioFormat && r.push("--audio-format", e.audioFormat), e.audioQuality && r.push("--audio-quality", e.audioQuality), e.remuxVideo && r.push("--remux-video", e.remuxVideo), e.recodeVideo && r.push("--recode-video", e.recodeVideo), e.postprocessorArgs) for (let [s, i] of Object.entries(e.postprocessorArgs)) r.push("--postprocessor-args", `${s}:${i.join(" ")}`);
  if (e.keepVideo && r.push("--keep-video"), e.noKeepVideo && r.push("--no-keep-video"), e.postOverwrites && r.push("--post-overwrites"), e.noPostOverwrites && r.push("--no-post-overwrites"), e.embedSubs && r.push("--embed-subs"), e.noEmbedSubs && r.push("--no-embed-subs"), e.embedThumbnail && r.push("--embed-thumbnail"), e.noEmbedThumbnail && r.push("--no-embed-thumbnail"), e.embedMetadata && r.push("--embed-metadata"), e.noEmbedMetadata && r.push("--no-embed-metadata"), e.embedChapters && r.push("--embed-chapters"), e.noEmbedChapters && r.push("--no-embed-chapters"), e.embedInfoJson && r.push("--embed-info-json"), e.noEmbedInfoJson && r.push("--no-embed-info-json"), e.parseMetadata) for (let [s, i] of Object.entries(e.parseMetadata)) r.push("--parse-metadata", `${s}:${i}`);
  if (e.replaceInMetadata) for (let [s, [i, n]] of Object.entries(e.replaceInMetadata)) r.push("--replace-in-metadata", `${s} ${i} ${n}`);
  if (e.xattrs && r.push("--xattrs"), e.concatPlaylist && r.push("--concat-playlist", e.concatPlaylist), e.fixup && r.push("--fixup", e.fixup), e.ffmpegLocation && r.push("--ffmpeg-location", e.ffmpegLocation), e.exec && r.push("--exec", e.exec), e.noExec && r.push("--no-exec"), e.convertSubs && r.push("--convert-subs", e.convertSubs), e.convertThumbnails && r.push("--convert-thumbnails", e.convertThumbnails), e.splitChapters && r.push("--split-chapters"), e.noSplitChapters && r.push("--no-split-chapters"), e.removeChapters && r.push("--remove-chapters", e.removeChapters), e.noRemoveChapters && r.push("--no-remove-chapters"), e.forceKeyframesAtCuts && r.push("--force-keyframes-at-cuts"), e.noForceKeyframesAtCuts && r.push("--no-force-keyframes-at-cuts"), e.usePostProcessor && e.usePostProcessor.length > 0) for (let s of e.usePostProcessor) r.push("--use-postprocessor", s);
  return e.sponsorblockMark && e.sponsorblockMark.length > 0 && r.push("--sponsorblock-mark", e.sponsorblockMark.join(",")), e.sponsorblockRemove && e.sponsorblockRemove.length > 0 && r.push("--sponsorblock-remove", e.sponsorblockRemove.join(",")), e.sponsorblockChapterTitle && r.push("--sponsorblock-chapter-title", e.sponsorblockChapterTitle), e.noSponsorblock && r.push("--no-sponsorblock"), e.sponsorblockApi && r.push("--sponsorblock-api", e.sponsorblockApi), e.additionalOptions && e.additionalOptions.length > 0 && r.push(...e.additionalOptions), e.rawArgs && e.rawArgs.length > 0 && r.push(...e.rawArgs), r;
}
var te = { "2160p": "bv*[height<=2160]", "1440p": "bv*[height<=1440]", "1080p": "bv*[height<=1080]", "720p": "bv*[height<=720]", "480p": "bv*[height<=480]", "360p": "bv*[height<=360]", "240p": "bv*[height<=240]", "144p": "bv*[height<=133]", highest: "bv*", lowest: "wv*" };
var se = ["audioonly", "videoonly", "audioandvideo", "mergevideo"];
function B(e) {
  let r, t, s;
  if (!e) return [];
  if (typeof e == "string" && !se.includes(e)) return ["-f", e];
  if (typeof e == "string" && se.includes(e) && (r = e), Object.keys(e).length === 0 || !e || typeof e != "object") return ["-f", "bv*+ba"];
  typeof e == "object" && (r = e.filter, t = e.type, s = e.quality);
  let i = [];
  return r === "audioonly" && (i = ["-x", "--audio-format", t || "mp3", "--audio-quality", s ? s.toString() : "5"]), r === "videoonly" && (i = ["-f", (s ? te[s] : "bv*") + "[acodec=none]"]), r === "audioandvideo" && (i = ["-f", (s == "lowest" ? "w*" : "b*") + "[vcodec!=none][acodec!=none][ext=" + (t || "mp4") + "]"]), r === "mergevideo" && (i = ["-f", `${s ? te[s] : "bv*"}+ba`], t && i.push("--merge-output-format", t)), i;
}
function U(e) {
  if (!e || typeof e == "string") return "video/mp4";
  let { filter: r, type: t } = e;
  switch (r) {
    case "videoonly":
    case "audioandvideo":
      switch (t) {
        case "mp4":
          return "video/mp4";
        case "webm":
          return "video/webm";
        default:
          return "video/mp4";
      }
    case "audioonly":
      switch (t) {
        case "aac":
          return "audio/aac";
        case "flac":
          return "audio/flac";
        case "mp3":
          return "audio/mp3";
        case "m4a":
          return "audio/mp4";
        case "opus":
          return "audio/opus";
        case "vorbis":
          return "audio/vorbis";
        case "wav":
          return "audio/wav";
        case "alac":
          return "audio/mp4";
        default:
          return "audio/mpeg";
      }
    case "mergevideo":
      switch (t) {
        case "webm":
          return "video/webm";
        case "mkv":
          return "video/x-matroska";
        case "ogg":
          return "video/ogg";
        case "flv":
          return "video/x-flv";
        default:
          return "video/mp4";
      }
  }
}
function z(e) {
  if (!e || typeof e == "string") return "mp4";
  let { filter: r, type: t } = e;
  return t || (r === "audioonly" ? "mp3" : "mp4");
}
function ie(e) {
  if (!e?.extractAudio) return null;
  switch (e.audioFormat || "mp3") {
    case "aac":
      return "audio/aac";
    case "flac":
      return "audio/flac";
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      return "audio/mp4";
    case "opus":
      return "audio/opus";
    case "vorbis":
      return "audio/vorbis";
    case "wav":
      return "audio/wav";
    case "alac":
      return "audio/mp4";
    default:
      return "audio/mpeg";
  }
}
function ne(e) {
  return e?.extractAudio ? e.audioFormat || "mp3" : null;
}
var C = "~ytdlp-progress-%(progress)#j";
function J(e, r = 2) {
  let t = Number(e);
  if (t === 0 || isNaN(t)) return t + " Bytes";
  let s = 1024, i = r < 0 ? 0 : r, n = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], o = Math.floor(Math.log(t) / Math.log(s));
  return parseFloat((t / Math.pow(s, o)).toFixed(i)) + " " + n[o];
}
function ke(e, r, t) {
  let s = Math.pow(t || 10, r);
  return Math.round(e * s) / s;
}
function De(e) {
  e = Number(e);
  let r = Math.floor(e / 3600), t = Math.floor(e % 3600 / 60), s = Math.floor(e % 3600 % 60), i = r > 0 ? r + (r == 1 ? " hour, " : " hours, ") : "", n = t > 0 ? t + (t == 1 ? " minute, " : " minutes, ") : "", o = s >= 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return i + n + o;
}
function m(e) {
  try {
    if (!e.includes("~ytdlp-progress-")) throw new Error();
    let r = e.trim().replace("~ytdlp-progress-", "");
    if (!r) throw new Error();
    let t = JSON.parse(r), s = (l) => {
      if (l == null || l === "NA") return;
      let f = Number(l);
      return isNaN(f) ? void 0 : f;
    }, i = s(t.downloaded_bytes), n = s(t.total_bytes) ?? s(t.total_bytes_estimate), o = s(t.speed), a = s(t.eta), u = i !== void 0 && n !== void 0 && n > 0 ? ke(100 * i / n, 2) : void 0;
    return { filename: t.filename, status: t.status, downloaded: i, downloaded_str: i !== void 0 ? J(i) : void 0, total: n, total_str: n !== void 0 ? J(n) : void 0, speed: o, speed_str: o !== void 0 ? J(o) + "/s" : void 0, eta: a, eta_str: a !== void 0 ? De(a) : void 0, percentage: u, percentage_str: u !== void 0 ? u + "%" : void 0 };
  } catch {
    return;
  }
}
function Y(e, r = {}) {
  return new Promise((t, s) => {
    let o = (new oe(e).protocol === "https:" ? Se : _e).get(e, r, (a) => {
      if (a.statusCode >= 300 && a.statusCode < 400 && a.headers.location) {
        let u = new oe(a.headers.location, e).toString();
        Y(u, r).then(t).catch(s);
        return;
      }
      t(a);
    });
    o.on("error", s), o.setTimeout(3e4, () => {
      o.destroy(), s(new Error("Request timed out"));
    });
  });
}
async function k(e, r) {
  try {
    let t = b.createWriteStream(r), s = await Y(e);
    if (s.statusCode !== 200) throw t.close(), b.unlinkSync(r), new Error(`Failed to download file: ${s.statusCode} ${s.statusMessage}`);
    let i = parseInt(s.headers["content-length"] || "0", 10), n = 0;
    return s.on("data", (o) => {
      n += o.length;
      let a = n / i * 100;
      process.stdout.write(`Progress: ${Math.round(a)}%\r`);
    }), s.pipe(t), new Promise((o, a) => {
      t.on("finish", () => {
        t.close(), console.log(`
Download complete!`), o();
      }), t.on("error", (u) => {
        t.close(), b.unlinkSync(r), a(u);
      }), s.on("error", (u) => {
        t.close(), b.unlinkSync(r), a(u);
      });
    });
  } catch (t) {
    throw b.existsSync(r) && b.unlinkSync(r), t;
  }
}
async function ae(e, r = {}) {
  let t = await Y(e, r);
  if (t.statusCode !== 200) throw new Error(`Failed to fetch text: ${t.statusCode} ${t.statusMessage}`);
  return new Promise((s, i) => {
    let n = "";
    t.setEncoding("utf8"), t.on("data", (o) => {
      n += o;
    }), t.on("end", () => s(n)), t.on("error", i);
  });
}
function Ee(e) {
  let r = e;
  for (; ; ) {
    if (ue.existsSync(D.join(r, "package.json"))) return r;
    let t = D.dirname(r);
    if (t === r) return e;
    r = t;
  }
}
var le = Ee(h);
var w = D.join(le, "bin");
var dr = D.join(le, "package.json");
var Re = "https://github.com/iqbal-rashed/ytdlp-nodejs/releases/download/ffmpeg-latest";
var q = { win32: { x64: ["win-x64-ffmpeg.exe", "win-x64-ffprobe.exe"], ia32: ["win-ia32-ffmpeg.exe", "win-ia32-ffprobe.exe"], arm64: ["win-arm64-ffmpeg.exe", "win-arm64-ffprobe.exe"] }, linux: { x64: ["linux-x64-ffmpeg", "linux-x64-ffprobe"], arm64: ["linux-arm64-ffmpeg", "linux-arm64-ffprobe"] }, darwin: { x64: ["macos-x64-ffmpeg", "macos-x64-ffprobe"], arm64: ["macos-arm64-ffmpeg", "macos-arm64-ffprobe"] }, android: { arm64: ["linux-arm64-ffmpeg", "linux-arm64-ffprobe"] } };
function fe() {
  let e = process.platform, r = process.arch;
  if (!q[e] || !q[e][r]) throw new Error(`No FFmpeg build available for platform: ${e}, architecture: ${r}`);
  return q[e][r];
}
async function G(e) {
  let r = e || w, t = F();
  if (t) return t;
  try {
    let s = fe();
    if (!s.length) throw new Error();
    let i = s.map((o) => `${Re}/${o}`), n = s.map((o) => Q.join(r, String(o.split("-").pop())));
    N.existsSync(r) || N.mkdirSync(r, { recursive: true }), console.log("Downloading FFmpeg and FFprobe...");
    for (let o = 0; o < s.length; o++) {
      let a = i[o], u = n[o];
      console.log("Downloading...", Q.basename(a)), await k(a, u);
    }
    if (process.platform !== "win32") for (let o of n) N.chmodSync(o, 493);
    return F();
  } catch (s) {
    throw console.error(`Download failed: ${s}`), s;
  }
}
function F() {
  try {
    let e = fe();
    if (!e.length) throw new Error();
    let r = Q.join(w, String(e[0].split("-").pop()));
    if (!N.existsSync(r)) throw new Error("FFmpeg binary not found. Please download it first.");
    return r;
  } catch {
    return;
  }
}
var de = "https://github.com/yt-dlp/yt-dlp/releases/latest/download";
var $ = { win32: { x64: "yt-dlp.exe", ia32: "yt-dlp_x86.exe" }, linux: { x64: "yt-dlp", armv7l: "yt-dlp_linux_armv7l", aarch64: "yt-dlp_linux_aarch64", arm64: "yt-dlp" }, darwin: { x64: "yt-dlp_macos", arm64: "yt-dlp_macos" }, android: { arm64: "yt-dlp" } };
function Te() {
  let e = process.platform, r = process.arch;
  if (!$[e] || !$[e][r]) throw new Error(`No yt-dlp build available for ${e} ${r}`);
  return $[e][r];
}
async function L(e) {
  let r = e || w, t = Te(), s = `${de}/${t}`, i = T.join(r, t);
  if (g.existsSync(i)) return i;
  console.log("Downloading yt-dlp...", s), g.existsSync(r) || g.mkdirSync(r, { recursive: true });
  try {
    return await k(s, i), console.log(`yt-dlp downloaded successfully to: ${i}`), process.platform !== "win32" && g.chmodSync(i, 493), i;
  } catch (o) {
    throw console.error(`Download failed: ${o}`), o;
  }
}
async function Ie(e) {
  return new Promise((r, t) => {
    let s = Be.createHash("sha256"), i = g.createReadStream(e);
    i.on("data", (n) => s.update(n)), i.on("end", () => r(s.digest("hex"))), i.on("error", t);
  });
}
async function Oe(e) {
  try {
    let s = (await ae(`${de}/SHA2-256SUMS`)).split(/\r?\n/).find((n) => n.includes(e));
    if (!s) return;
    let [i] = s.trim().split(/\s+/);
    return i || void 0;
  } catch {
    return;
  }
}
async function H(e) {
  let r = await L(e), t = T.basename(r), s = await Oe(t);
  if (!s) return { path: r, verified: false };
  let i = await Ie(r);
  if (i.toLowerCase() !== s.toLowerCase()) throw new Error(`Checksum mismatch for ${t}. Expected ${s}, got ${i}`);
  return { path: r, verified: true, checksum: s };
}
function I() {
  let e = process.platform, r = process.arch;
  try {
    let t = $[e][r], s = T.join(w, t);
    if (!g.existsSync(s)) throw new Error("Ytdlp binary not found. Please download it first.");
    return s;
  } catch {
    return;
  }
}
function j(e) {
  return e.replace(/~ytdlp-progress-\{[\s\S]*?\}\n?/g, "").split(/\r?\n/).map((r) => r.trim()).filter((r) => r.length > 0).filter((r) => !r.includes("__YTDLP_FILEPATH__:")).filter((r) => !r.includes("__YTDLP_VIDEO_INFO__:")).filter((r) => !r.includes("__YTDLP_BEFORE_DL__:")).join(`
`);
}
function K(e) {
  let r = [], t = e.split(/\r?\n/);
  for (let s of t) {
    let i = s.trim();
    if (i.startsWith("__YTDLP_VIDEO_INFO__:")) {
      let n = i.replace("__YTDLP_VIDEO_INFO__:", "").trim();
      try {
        let o = n.replace(/:"N\/A"/g, ":null").replace(/:"NA"/g, ":null").replace(/:""/g, ':"NA"'), a = JSON.parse(o), u = {};
        for (let [l, f] of Object.entries(a)) if (f === "NA") u[l] = null;
        else if (typeof f == "string" && f === "N/A") u[l] = null;
        else if ((l.includes("_count") || l.includes("_timestamp") || l === "autonumber" || l === "video_autonumber" || l === "n_entries" || l === "playlist_count" || l === "release_year" || l === "start_time" || l === "end_time" || l === "epoch" || l === "duration" || l === "age_limit") && typeof f == "string") {
          let d = Number(f);
          u[l] = isNaN(d) ? null : d;
        } else (l === "is_live" || l === "was_live" || l === "channel_is_verified") && typeof f == "string" ? u[l] = f === "true" || f === "True" : (l === "categories" || l === "tags" || l === "creators" || l === "cast") && typeof f == "string" ? f === "NA" || f === "N/A" || f === "" ? u[l] = null : u[l] = f.split(",").map((d) => d.trim()) : u[l] = f;
        r.push(u);
      } catch {
      }
    }
  }
  return r;
}
function y(e) {
  let r = e.trim();
  if (!r.startsWith("__YTDLP_BEFORE_DL__:")) return null;
  let t = r.replace("__YTDLP_BEFORE_DL__:", "").trim();
  try {
    let s = t.replace(/:"N\/A"/g, ":null").replace(/:"NA"/g, ":null").replace(/:""/, ':"NA"'), i = JSON.parse(s), n = {};
    for (let [o, a] of Object.entries(i)) if (a === "NA" || a === "N/A") n[o] = null;
    else if ((o.includes("_count") || o.includes("_timestamp") || o === "autonumber" || o === "video_autonumber" || o === "n_entries" || o === "playlist_count" || o === "release_year" || o === "start_time" || o === "end_time" || o === "epoch" || o === "duration" || o === "age_limit") && typeof a == "string") {
      let u = Number(a);
      n[o] = isNaN(u) ? null : u;
    } else (o === "is_live" || o === "was_live" || o === "channel_is_verified") && typeof a == "string" ? n[o] = a === "true" || a === "True" : (o === "categories" || o === "tags" || o === "creators" || o === "cast") && typeof a == "string" ? a === "NA" || a === "N/A" || a === "" ? n[o] = null : n[o] = a.split(",").map((u) => u.trim()) : n[o] = a;
    return n;
  } catch {
    return null;
  }
}
var Ve = /^ERROR:\s*(?:\[.+?\]\s*)?(.+)/m;
var Ce = [/ERROR:\s*\[.*?\]\s*.*?:\s*Sign in to confirm/i, /ERROR:\s*\[.*?\]\s*Unable to extract/i, /ERROR:\s*\[.*?\]\s*This video is unavailable/i, /ERROR:\s*\[.*?\]\s*Video unavailable/i, /ERROR:\s*\[.*?\]\s*Private video/i, /ERROR:\s*\[.*?\]\s*.*?requires premium/i, /ERROR:\s*\[.*?\]\s*This live event has ended/i, /ERROR:\s*\[.*?\]\s*.*?is not available/i, /ERROR:\s*No video formats found/i, /ERROR:\s*Unsupported URL/i];
function ce(e) {
  if (!e) return { hasError: false };
  let r = e.match(Ve);
  return r ? { hasError: true, message: r[1]?.trim(), fullError: r[0] } : { hasError: false };
}
function Ne(e) {
  return e ? Ce.some((r) => r.test(e)) : false;
}
function he(e, r) {
  let s = ce(e).message || "Unknown yt-dlp error";
  return r != null && r !== 0 && (s = `yt-dlp exited with code ${r}: ${s}`), new Error(s);
}
function A(e, r, t) {
  let { exitCodeOnly: s = false, fatalOnly: i = false } = t || {};
  if (r !== 0 && r !== null) return he(e, r);
  if (s) return;
  if (ce(e).hasError) return i && !Ne(e) ? void 0 : he(e);
}
function me({ url: e, options: r, ffmpegPath: t, withProgressTemplate: s, extra: i }) {
  let n = V(r || {});
  return t && n.push("--ffmpeg-location", t), s && n.push("--progress-template", C), i && i.length > 0 && n.push(...i), e && n.push("--", e), n;
}
var x = class extends $e {
  constructor(t, s) {
    super();
    this.binaryPath = "";
    this.videoUrl = "";
    this.extraArgs = {};
    this.rawArgs = [];
    this.videoUrl = t, this.binaryPath = s?.binaryPath || I() || "", this.ffmpegPath = s?.ffmpegPath || F(), (!this.binaryPath || !pe.existsSync(this.binaryPath)) && console.error(new Error("yt-dlp binary not found. Please install yt-dlp or specify correct binaryPath in options.")), this.ffmpegPath && !pe.existsSync(this.ffmpegPath) && console.error(new Error(`FFmpeg binary not found at: ${this.ffmpegPath}. Please install FFmpeg or specify correct ffmpegPath.`));
  }
  setBinaryPath(t) {
    return this.binaryPath = t, this;
  }
  setFfmpegPath(t) {
    return this.ffmpegPath = t, this;
  }
  format(t) {
    return this.formatValue = t, this;
  }
  filter(t) {
    let s = typeof this.formatValue == "object" ? this.formatValue : {};
    return this.formatValue = { ...s, filter: t }, this;
  }
  quality(t) {
    let s = typeof this.formatValue == "object" ? this.formatValue : {};
    return this.formatValue = { filter: this.formatValue, ...s, quality: t }, this;
  }
  type(t) {
    let s = typeof this.formatValue == "object" ? this.formatValue : {};
    return this.formatValue = { filter: this.formatValue, ...s, type: t }, this;
  }
  options(t) {
    return this.extraArgs = { ...this.extraArgs, ...t }, this;
  }
  rateLimit(t) {
    return this.extraArgs.limitRate = t, this;
  }
  cookies(t) {
    return this.extraArgs.cookies = t, this;
  }
  cookiesFromBrowser(t) {
    return this.extraArgs.cookiesFromBrowser = t, this;
  }
  proxy(t) {
    return this.extraArgs.proxy = t, this;
  }
  addOption(t, s) {
    return this.extraArgs[t] = s, this;
  }
  addArgs(...t) {
    return this.rawArgs.push(...t), this;
  }
  extractAudio(t) {
    return this.extraArgs.extractAudio = true, t && (this.extraArgs.audioFormat = t), this;
  }
  audioFormat(t) {
    return this.extraArgs.audioFormat = t, this;
  }
  audioQuality(t) {
    return this.extraArgs.audioQuality = t, this;
  }
  embedThumbnail() {
    return this.extraArgs.embedThumbnail = true, this;
  }
  embedSubs() {
    return this.extraArgs.embedSubs = true, this;
  }
  embedMetadata() {
    return this.extraArgs.embedMetadata = true, this;
  }
  writeSubs() {
    return this.extraArgs.writeSubs = true, this;
  }
  writeAutoSubs() {
    return this.extraArgs.writeAutoSubs = true, this;
  }
  subLangs(t) {
    return this.extraArgs.subLangs = t, this;
  }
  writeThumbnail() {
    return this.extraArgs.writeThumbnail = true, this;
  }
  username(t) {
    return this.extraArgs.username = t, this;
  }
  password(t) {
    return this.extraArgs.password = t, this;
  }
  playlistStart(t) {
    return this.extraArgs.playlistStart = t, this;
  }
  playlistEnd(t) {
    return this.extraArgs.playlistEnd = t, this;
  }
  playlistItems(t) {
    return this.extraArgs.playlistItems = t, this;
  }
  buildFormatArgs() {
    return this.formatValue ? B(this.formatValue) : [];
  }
  buildBaseArgs(t = []) {
    if (!this.videoUrl) throw new Error("URL is required.");
    let s = this.buildFormatArgs();
    return me({ url: this.videoUrl, options: this.extraArgs, ffmpegPath: this.ffmpegPath, withProgressTemplate: true, extra: [...s, ...t, ...this.rawArgs] });
  }
  debugPrint(t = true) {
    return this.extraArgs.debugPrintCommandLine = t, this;
  }
  getCommand() {
    let t = this.buildArgs();
    return `${this.binaryPath} ${t.join(" ")}`;
  }
  getArguments() {
    return this.buildArgs();
  }
  toString() {
    return this.getCommand();
  }
  printDebugCommandLine(t) {
    if (this.extraArgs.debugPrintCommandLine) {
      let s = `${this.binaryPath} ${t.join(" ")}`;
      console.error(`[ytdlp-nodejs] Command: ${s}`);
    }
  }
  validateBinaryPath() {
    if (!this.binaryPath) throw new Error("Binary path is required. Use .setBinaryPath() or pass it in constructor.");
  }
  kill(t) {
    return this.process?.kill(t) ?? false;
  }
  get pid() {
    return this.process?.pid;
  }
};
var ge = ["id", "title", "fulltitle", "ext", "alt_title", "description", "display_id", "uploader", "uploader_id", "uploader_url", "license", "creators", "creator", "timestamp", "upload_date", "release_timestamp", "release_date", "release_year", "modified_timestamp", "modified_date", "channel", "channel_id", "channel_url", "channel_follower_count", "channel_is_verified", "location", "duration", "duration_string", "view_count", "concurrent_view_count", "like_count", "dislike_count", "repost_count", "average_rating", "comment_count", "save_count", "age_limit", "live_status", "is_live", "was_live", "playable_in_embed", "availability", "media_type", "start_time", "end_time", "extractor", "extractor_key", "epoch", "autonumber", "video_autonumber", "n_entries", "playlist_id", "playlist_title", "playlist", "playlist_count", "playlist_index", "playlist_autonumber", "playlist_uploader", "playlist_uploader_id", "playlist_channel", "playlist_channel_id", "playlist_webpage_url", "webpage_url", "webpage_url_basename", "webpage_url_domain", "original_url", "categories", "tags", "cast", "filepath"];
function Le() {
  return `after_move:__YTDLP_VIDEO_INFO__:{${ge.map((r) => `"${r}":%(${r}|null)j`).join(",")}}`;
}
function S() {
  return `before_dl:__YTDLP_BEFORE_DL__:{${ge.map((r) => `"${r}":%(${r}|null)j`).join(",")}}`;
}
function M() {
  return ["--print", Le(), "--progress", "--newline"];
}
var _ = class extends x {
  constructor(r, t) {
    super(r, t), this.on("error", () => {
    });
  }
  on(r, t) {
    return super.on(r, t);
  }
  once(r, t) {
    return super.once(r, t);
  }
  emit(r, ...t) {
    return super.emit(r, ...t);
  }
  output(r) {
    return this.outputDir = r, this;
  }
  setOutputTemplate(r) {
    return this.outputPath = r, this;
  }
  skipDownload() {
    return this.extraArgs.skipDownload = true, this;
  }
  buildArgs() {
    let r = { ...this.extraArgs };
    this.outputDir && (r.output = `${this.outputDir}/%(title)s.%(ext)s`), this.outputPath && (r.output = this.outputPath);
    let t = this.extraArgs;
    this.extraArgs = r;
    let s = [...M()];
    this.listenerCount("beforeDownload") > 0 && s.unshift("--print", S());
    let i = this.buildBaseArgs(s);
    return this.extraArgs = t, i;
  }
  run() {
    return this.resultPromise ? this.resultPromise : (this.resultPromise = new Promise((r, t) => {
      try {
        this.validateBinaryPath();
        let s = this.buildArgs(), i = `${this.binaryPath} ${s.join(" ")}`;
        this.printDebugCommandLine(s), this.process = je(this.binaryPath, s), this.emit("start", i);
        let n = "", o = "";
        this.process.stdout?.on("data", (a) => {
          let u = a.toString();
          n += u, this.emit("stdout", u);
          let l = y(u);
          l && this.emit("beforeDownload", l);
          let f = m(u);
          f && this.emit("progress", f);
        }), this.process.stderr?.on("data", (a) => {
          let u = a.toString();
          o += u, this.emit("stderr", u);
          let l = m(u);
          l && this.emit("progress", l);
        }), this.process.on("error", (a) => {
          this.emit("error", a), t(a);
        }), this.process.on("close", (a) => {
          let u = A(o, a);
          if (u) {
            this.emit("error", u), t(u);
            return;
          }
          let l = j(n), f = K(n), d = { output: l, filePaths: f.map((p) => p?.filepath ?? "").filter(Boolean), info: f, stderr: o };
          this.emit("finish", d), r(d);
        });
      } catch (s) {
        t(s);
      }
    }), this.resultPromise);
  }
  then(r, t) {
    return this.run().then(r, t);
  }
  catch(r) {
    return this.run().catch(r);
  }
  finally(r) {
    return this.run().finally(r);
  }
};
var E = class extends x {
  constructor(t, s) {
    super(t, s);
    this.totalBytes = 0;
    this.started = false;
    this.on("error", () => {
    });
  }
  on(t, s) {
    return super.on(t, s);
  }
  once(t, s) {
    return super.once(t, s);
  }
  emit(t, ...s) {
    return super.emit(t, ...s);
  }
  buildArgs() {
    let t = ["-o", "-", "--no-playlist", "--progress", "--no-quiet"];
    return this.listenerCount("beforeDownload") > 0 && t.push("--print", S()), this.buildBaseArgs(t);
  }
  startStream() {
    if (this.started) return this.passThrough;
    this.validateBinaryPath(), this.started = true, this.passThrough = new Me();
    let t = this.buildArgs(), s = `${this.binaryPath} ${t.join(" ")}`;
    this.printDebugCommandLine(t), this.process = We(this.binaryPath, t, { shell: false }), this.emit("start", s), this.process.stdout?.on("data", (n) => {
      this.totalBytes += n.length, this.passThrough.write(n), this.emit("data", n);
    });
    let i = "";
    return this.process.stderr?.on("data", (n) => {
      let o = n.toString();
      i += o, this.emit("stderr", o);
      let a = y(o);
      a && this.emit("beforeDownload", a);
      let u = m(o);
      u && this.emit("progress", u);
    }), this.process.on("error", (n) => {
      this.emit("error", n), this.passThrough.destroy(n);
    }), this.process.on("close", (n) => {
      let o = A(i, n);
      o ? (this.emit("error", o), this.passThrough.destroy(o)) : (this.passThrough.end(), this.emit("end"));
    }), this.passThrough;
  }
  pipe(t, s) {
    let i = Date.now(), n = this.startStream();
    return new Promise((o, a) => {
      n.pipe(t, s), t.on("finish", () => {
        o({ bytes: this.totalBytes, duration: Date.now() - i });
      }), t.on("error", a), this.passThrough.on("error", a);
    });
  }
  pipeAsync(t, s) {
    return this.pipe(t, s);
  }
  async toBuffer() {
    let t = [];
    return new Promise((s, i) => {
      let n = this.startStream();
      n.on("data", (o) => {
        t.push(o);
      }), n.on("end", () => {
        s(Buffer.concat(t));
      }), n.on("error", i);
    });
  }
  getStream() {
    return this.startStream();
  }
};
var P = class extends x {
  constructor(t, s) {
    super(t, s);
    this.totalBytes = 0;
    this.started = false;
    this.output = "";
    this.on("error", () => {
    });
  }
  on(t, s) {
    return super.on(t, s);
  }
  once(t, s) {
    return super.once(t, s);
  }
  emit(t, ...s) {
    return super.emit(t, ...s);
  }
  buildArgs() {
    let t = [], s = [...M()];
    return this.listenerCount("beforeDownload") > 0 && s.unshift("--print", S()), this.listenerCount("afterDownload") > 0 && s.push("--print", "after_move:filepath"), this.buildBaseArgs([...t, ...s]);
  }
  startStream() {
    if (this.started) return this.passThrough;
    this.validateBinaryPath(), this.started = true, this.passThrough = new ze(), this.output = "";
    let t = this.buildArgs();
    t.includes("--no-playlist") || (t = ["--no-playlist", ...t]);
    let s = `${this.binaryPath} ${t.join(" ")}`;
    return this.printDebugCommandLine(t), this.process = be(this.binaryPath, t, { shell: false }), this.emit("start", s), this.process.stdout?.on("data", (i) => {
      this.totalBytes += i.length, this.passThrough.write(i), this.emit("data", i);
      let n = i.toString();
      this.emit("stdout", n);
      let o = y(n);
      o && (this.beforeDownloadInfo = o, this.emit("beforeDownload", this.beforeDownloadInfo));
      let a = m(n);
      a && this.emit("progress", a);
    }), this.process.stderr?.on("data", (i) => {
      let n = i.toString();
      this.emit("stderr", n), this.output += n;
      let o = y(n);
      o && (this.beforeDownloadInfo = o, this.emit("beforeDownload", this.beforeDownloadInfo));
      let a = m(n);
      a && (this.emit("progress", a), a.status === "finished" && this.beforeDownloadInfo && (this.afterDownloadInfo = { ...this.beforeDownloadInfo, filepath: a.filename }, this.emit("afterDownload", this.afterDownloadInfo)));
    }), this.process.on("error", (i) => {
      this.emit("error", i), this.passThrough.destroy(i);
    }), this.process.on("close", (i) => {
      let n = A(this.output, i);
      n ? (this.emit("error", n), this.passThrough.destroy(n)) : (this.passThrough.end(), this.emit("end"));
    }), this.passThrough;
  }
  pipe(t, s) {
    let i = Date.now(), n = this.startStream();
    return new Promise((o, a) => {
      n.pipe(t, s), t.on("finish", () => {
        o({ bytes: this.totalBytes, duration: Date.now() - i, info: this.afterDownloadInfo, output: this.output });
      }), t.on("error", a), this.passThrough.on("error", a);
    });
  }
  pipeAsync(t, s) {
    return this.pipe(t, s);
  }
  async toBuffer() {
    let t = [];
    return new Promise((s, i) => {
      let n = this.startStream();
      n.on("data", (o) => {
        t.push(o);
      }), n.on("end", () => {
        s(Buffer.concat(t));
      }), n.on("error", i);
    });
  }
  getStream() {
    return this.startStream();
  }
  exec() {
    return this.resultPromise ? this.resultPromise : (this.resultPromise = new Promise((t, s) => {
      try {
        this.validateBinaryPath();
        let i = this.buildArgs(), n = `${this.binaryPath} ${i.join(" ")}`;
        this.printDebugCommandLine(i), this.process = be(this.binaryPath, i, { shell: false }), this.emit("start", n);
        let o = "", a = "";
        this.process.stdout?.on("data", (u) => {
          let l = u.toString();
          o += l, this.emit("stdout", l);
          let f = y(l);
          f && (this.beforeDownloadInfo = f, this.emit("beforeDownload", this.beforeDownloadInfo)), this.emit("data", u);
          let d = m(l);
          d && (this.emit("progress", d), d.status === "finished" && this.beforeDownloadInfo && (this.afterDownloadInfo = { ...this.beforeDownloadInfo, filepath: d.filename }, this.emit("afterDownload", this.afterDownloadInfo)));
        }), this.process.stderr?.on("data", (u) => {
          let l = u.toString();
          a += l, this.emit("stderr", l);
          let f = y(l);
          f && (this.beforeDownloadInfo = f, this.emit("beforeDownload", this.beforeDownloadInfo));
          let d = m(l);
          d && (this.emit("progress", d), d.status === "finished" && this.beforeDownloadInfo && (this.afterDownloadInfo = { ...this.beforeDownloadInfo, filepath: d.filename }, this.emit("afterDownload", this.afterDownloadInfo)));
        }), this.process.on("error", (u) => {
          this.emit("error", u), s(u);
        }), this.process.on("close", (u) => {
          let l = A(a, u);
          if (l) {
            this.emit("error", l), s(l);
            return;
          }
          let f = j(o), d = K(o), p = { stdout: o, stderr: a, exitCode: u, command: n, info: d, output: f, filePaths: d.map((R) => R?.filepath ?? "").filter(Boolean) };
          this.emit("complete", p), this.emit("end"), t(p);
        });
      } catch (i) {
        s(i);
      }
    }), this.resultPromise);
  }
  run() {
    return this.exec();
  }
  then(t, s) {
    return this.exec().then(t, s);
  }
  catch(t) {
    return this.exec().catch(t);
  }
  finally(t) {
    return this.exec().finally(t);
  }
};
var we = class {
  constructor(r) {
    this.binaryPath = r?.binaryPath || I() || "", this.ffmpegPath = r?.ffmpegPath || F(), (!this.binaryPath || !X.existsSync(this.binaryPath)) && console.error(new Error("yt-dlp binary not found. Please install yt-dlp or specify correct binaryPath in options.")), this.ffmpegPath && !X.existsSync(this.ffmpegPath) && console.error(new Error(`FFmpeg binary not found at: ${this.ffmpegPath}. Please install FFmpeg or specify correct ffmpegPath.`));
  }
  async checkInstallationAsync(r) {
    return new Promise((t, s) => {
      if (r?.ffmpeg && !this.ffmpegPath) return s(new Error("FFmpeg path is not set"));
      let i = Z(this.binaryPath, ["--version"]), n = false, o = !r?.ffmpeg;
      i.on("error", () => n = false), i.on("exit", (a) => {
        if (n = a === 0, r?.ffmpeg) {
          let u = Z(this.ffmpegPath, ["-version"]);
          u.on("error", () => o = false), u.on("exit", (l) => {
            o = l === 0, t(n && o);
          });
        } else t(n);
      });
    });
  }
  checkInstallation(r) {
    if (r?.ffmpeg && !this.ffmpegPath) throw new Error("FFmpeg path is not set");
    let t = ye(this.binaryPath, ["--version"], { stdio: "ignore" }), s = r?.ffmpeg ? ye(this.ffmpegPath, ["-version"], { stdio: "ignore" }) : { status: 0 };
    return t.status === 0 && s.status === 0;
  }
  async getInfoAsync(r, t) {
    let s = await this.execAsync(r, { dumpSingleJson: true, flatPlaylist: true, ...t });
    return JSON.parse(s.output);
  }
  async execAsync(r, t) {
    let s = new P(r, { binaryPath: this.binaryPath, ffmpegPath: this.ffmpegPath }), { onData: i, onProgress: n, onBeforeDownload: o, pipeTo: a, ...u } = t || {};
    return u && s.options(u), i && s.on("stdout", i), n && s.on("progress", n), o && s.on("beforeDownload", o), a ? s.pipe(a) : s.exec();
  }
  exec(r, t) {
    let s = new P(r, { binaryPath: this.binaryPath, ffmpegPath: this.ffmpegPath });
    return t && s.options(t), s;
  }
  download(r, t) {
    let s = new _(r, { binaryPath: this.binaryPath, ffmpegPath: this.ffmpegPath }), { format: i, ...n } = t || {};
    return i && s.format(i), n && s.options(n), s;
  }
  async downloadAsync(r, t) {
    let { onProgress: s, beforeDownload: i, ...n } = t || {}, o = this.download(r, n);
    s && o.on("progress", s), i && o.on("beforeDownload", i);
    let a = await o.run();
    return { output: a.output, filePaths: a.filePaths, info: a.info };
  }
  stream(r, t) {
    let s = new E(r, { binaryPath: this.binaryPath, ffmpegPath: this.ffmpegPath }), { format: i, ...n } = t || {};
    return i && s.format(i), n && s.options(n), s;
  }
  execBuilder(r, t) {
    let s = new P(r, { binaryPath: this.binaryPath, ffmpegPath: this.ffmpegPath }), { format: i, ...n } = t || {};
    return i && s.format(i), n && s.options(n), s;
  }
  async downloadAudio(r, t = "mp3", s) {
    let i = ["aac", "flac", "mp3", "m4a", "opus", "vorbis", "wav", "alac"];
    if (!i.includes(t)) throw new Error(`Invalid audio format: ${t}. Supported: ${i.join(", ")}`);
    return this.downloadAsync(r, { ...s, extractAudio: true, audioFormat: t });
  }
  async downloadVideo(r, t = "best", s) {
    let i = ["best", "2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p", "highest", "lowest"];
    if (!i.includes(t)) throw new Error(`Invalid video quality: ${t}. Supported: ${i.join(", ")}`);
    let n = t === "best" ? "bestvideo+bestaudio/best" : `bestvideo[height<=${parseInt(t) || 1080}]+bestaudio/best[height<=${parseInt(t) || 1080}]`;
    return this.downloadAsync(r, { ...s, format: n });
  }
  async getSubtitles(r, t) {
    return (await this.execAsync(r, { ...t, listSubs: true, skipDownload: true })).output ? [] : [];
  }
  async getComments(r, t = 20, s) {
    let i = await this.execAsync(r, { ...s, writeComments: true, dumpSingleJson: true, skipDownload: true, extractorArgs: { youtube: [`max_comments=${t}`, "player_skip=webpage"] } });
    try {
      return JSON.parse(i.output).comments || [];
    } catch {
      return [];
    }
  }
  async getDirectUrlsAsync(r, t) {
    return (await this.getInfoAsync(r, t)).formats.map((i) => i.url);
  }
  async getFormatsAsync(r, t) {
    let s = await this.getInfoAsync(r, t);
    return { source: "json", info: s, formats: s.formats };
  }
  async getThumbnailsAsync(r) {
    return (await this.getInfoAsync(r)).thumbnails;
  }
  async getTitleAsync(r) {
    return (await this.execAsync(r, { print: "title" })).output.trim();
  }
  async getVersionAsync() {
    return (await this.execAsync("", { printVersion: true })).output.trim();
  }
  async downloadFFmpeg() {
    return G();
  }
  async getFileAsync(r, t) {
    let s, { onBeforeDownload: i, onProgress: n, filename: o, metadata: a, format: u, ...l } = t || {}, f = [], d = new Qe();
    d.on("data", (v) => f.push(Buffer.from(v)));
    let p = B(u), R = { ...l };
    if (p.length >= 2 && p[0] === "-f" && (R.format = p[1]), p.includes("--merge-output-format")) {
      let v = p.indexOf("--merge-output-format");
      R.mergeOutputFormat = p[v + 1];
    }
    await this.execAsync(r, { ...R, noPlaylist: true, pipeTo: d, onProgress: n, onBeforeDownload: (v) => {
      s = v, i?.(v);
    }, output: "-" });
    let O, W;
    u && typeof u == "object" ? (O = U(u), W = z(u)) : (O = ie(l) || "video/mp4", W = ne(l) || "mp4");
    let xe = new qe(f, { type: O }), ee = { name: o || `${s?.title || "download"}.${W}`, type: O, size: xe.size, ...a };
    return new File([Buffer.concat(f)], ee.name, { type: ee.type });
  }
  async getUrlsAsync(r, t) {
    return (await this.execAsync(r, { ...t, print: "urls" })).output.split(`
`).filter(Boolean);
  }
  async updateYtDlpAsync(r) {
    if (r?.preferBuiltIn !== false && this.binaryPath) try {
      await this.execAsync("", { update: true });
      let a = await this.getVersionAsync().catch(() => {
      });
      return { method: "built-in", binaryPath: this.binaryPath, version: a };
    } catch {
    }
    let s = r?.outDir || (this.binaryPath ? Ye.dirname(this.binaryPath) : void 0);
    if (r?.verifyChecksum !== false) {
      let a = await H(s), u = await this.getVersionAsyncUsingBinary(a.path).catch(() => {
      });
      return { method: "download", binaryPath: a.path, version: u, verified: a.verified };
    }
    let n = await L(s), o = await this.getVersionAsyncUsingBinary(n).catch(() => {
    });
    return { method: "download", binaryPath: n, version: o, verified: false };
  }
  async getVersionAsyncUsingBinary(r) {
    return new Promise((t, s) => {
      let i = Z(r, ["--version"]), n = "", o = "";
      i.stdout?.on("data", (a) => {
        n += a.toString();
      }), i.stderr?.on("data", (a) => {
        o += a.toString();
      }), i.on("close", (a) => {
        a === 0 ? t(n.trim()) : s(new Error(`Failed to get version: ${o}`));
      }), i.on("error", s);
    });
  }
};

// src/ytdlpBinary.ts
var YTDLP_RELEASE_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
var POT_PLUGIN_URL = "https://github.com/Brainicism/bgutil-ytdlp-pot-provider/releases/latest/download/bgutil-ytdlp-pot-provider.zip";
var binDir = () => join4(dataDir(), "bin");
var ytdlpBinaryPath = () => join4(binDir(), "yt-dlp");
var cookiesFile = () => join4(dataDir(), "cookies.txt");
var pluginDir = () => join4(binDir(), "yt-dlp-plugins");
async function download(url, dest, mode) {
  const res = await fetch(url, { signal: AbortSignal.timeout(18e4), redirect: "follow" });
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf, mode ? { mode } : void 0);
  if (mode) await chmod(dest, mode);
  return buf.length;
}
var provisioning = null;
function ensureYtDlp() {
  provisioning ??= (async () => {
    await mkdir(binDir(), { recursive: true });
    if (!existsSync6(ytdlpBinaryPath())) {
      const size = await download(YTDLP_RELEASE_URL, ytdlpBinaryPath(), 493);
      log.success("yt-dlp", `Fetched yt-dlp (${(size / 1e6).toFixed(1)} MB)`);
    }
    const conf = join4(binDir(), "yt-dlp.conf");
    if (!existsSync6(conf)) await writeFile(conf, "--js-runtimes node\n");
    if (!existsSync6(pluginDir()) || readdirSync(pluginDir()).length === 0) {
      await mkdir(pluginDir(), { recursive: true });
      try {
        await download(POT_PLUGIN_URL, join4(pluginDir(), "bgutil-ytdlp-pot-provider.zip"));
        log.success("yt-dlp", "Fetched the PO-token provider plugin");
      } catch (err) {
        log.warn("yt-dlp", `PO-token plugin not fetched: ${err.message}`);
      }
    }
  })().catch((err) => {
    provisioning = null;
    throw err;
  });
  return provisioning;
}
async function updateYtDlp() {
  await mkdir(binDir(), { recursive: true });
  const size = await download(YTDLP_RELEASE_URL, ytdlpBinaryPath(), 493);
  instances.forEach((reset) => reset());
  return `yt-dlp updated (${(size / 1e6).toFixed(1)} MB)`;
}
var YT_EGRESS_HOST = "www.youtube.com";
function ytCommonOptions() {
  const opts = {};
  if (existsSync6(cookiesFile())) opts.cookies = cookiesFile();
  const plan = egress(YT_EGRESS_HOST);
  if (plan.mode === "blocked") throw new Error("VPN kill switch is on and the tunnel is down \u2014 refusing to run yt-dlp direct.");
  if (plan.mode === "tunnel" && plan.sourceAddress) opts.sourceAddress = plan.sourceAddress;
  return opts;
}
var instances = [];
function makeYtDlp() {
  let real = null;
  instances.push(() => {
    real = null;
  });
  const get = () => real ??= new we({ binaryPath: ytdlpBinaryPath() });
  return new Proxy({}, {
    get(_target, prop) {
      if (prop === "getInfoAsync") {
        return async (url, opts) => {
          await ensureYtDlp();
          await syncCookies(cookiesFile());
          const inst2 = get();
          return inst2.getInfoAsync(url, { ...ytCommonOptions(), ...opts ?? {} });
        };
      }
      const inst = get();
      const value = inst[prop];
      return typeof value === "function" ? value.bind(inst) : value;
    }
  });
}

// src/ytdlpVideos.ts
var ytdlp = makeYtDlp();
var APPROX_DATE_OPTS = {
  extractorArgs: { youtubetab: ["approximate_date"] }
};
var CHANNEL_SEARCH_SP = "EgIQAg%3D%3D";
function formatYtdlpDate(raw) {
  if (typeof raw !== "string") return void 0;
  const m2 = /^(\d{4})(\d{2})(\d{2})$/.exec(raw);
  return m2 ? `${m2[1]}-${m2[2]}-${m2[3]}` : void 0;
}
function isoDateFromEpoch(raw) {
  const secs = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(secs) || secs <= 0) return void 0;
  const d = new Date(secs * 1e3);
  return Number.isNaN(d.getTime()) ? void 0 : d.toISOString().slice(0, 10);
}
function formatSeconds(raw) {
  const secs = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(secs) || secs <= 0) return void 0;
  const total = Math.round(secs);
  const h2 = Math.floor(total / 3600);
  const m2 = Math.floor(total % 3600 / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h2 > 0 ? `${h2}:${pad(m2)}:${pad(s)}` : `${m2}:${pad(s)}`;
}
function httpsThumb(url) {
  if (typeof url !== "string" || !url) return void 0;
  return url.startsWith("//") ? `https:${url}` : url;
}
function entryToVideoMeta(entry) {
  const thumbnail = entry.thumbnail && String(entry.thumbnail).startsWith("http") ? entry.thumbnail : `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`;
  const releaseInfo = isoDateFromEpoch(entry.timestamp) ?? formatYtdlpDate(entry.upload_date);
  const runtime = formatSeconds(entry.duration);
  const channelName = entry.uploader || entry.channel;
  const channelUrl = entry.uploader_url || entry.channel_url;
  return {
    id: `yt_id:${entry.id}`,
    type: "video",
    name: entry.title,
    description: entry.description || "",
    poster: thumbnail,
    posterShape: "landscape",
    subtitle: channelName ?? null,
    duration: typeof entry.duration === "number" ? entry.duration : null,
    releaseInfo,
    runtime,
    links: [
      ...channelName ? [
        {
          name: channelName,
          category: "Directors",
          url: channelUrl || `https://www.youtube.com/watch?v=${entry.id}`
        }
      ] : [],
      {
        name: "YouTube",
        category: "stream",
        url: `https://www.youtube.com/watch?v=${entry.id}`
      }
    ]
  };
}
function entryToChannelMeta(entry) {
  const thumbs = Array.isArray(entry.thumbnails) ? entry.thumbnails : [];
  const avatar = httpsThumb(thumbs.length ? thumbs[thumbs.length - 1].url : "");
  return {
    id: entry.channel_id || entry.id,
    name: entry.channel || entry.title || "",
    avatar,
    subscribers: typeof entry.channel_follower_count === "number" ? entry.channel_follower_count : null,
    verified: !!entry.channel_is_verified,
    description: entry.description || "",
    url: entry.channel_url || entry.url || ""
  };
}

// src/rt.ts
var RT_CHANNEL_URL = "https://www.youtube.com/channel/UCi8e0iOVk1fEOogdfu4YgfA";
var MAX_VIDEOS_PER_PLAYLIST = 40;
var YTDLP_INFO_TIMEOUT_MS = 6e4;
function db() {
  return getConduitHost().storage;
}
var migrated = /* @__PURE__ */ new WeakMap();
function migrateStorage() {
  const storage = db();
  let done = migrated.get(storage);
  if (done) return done;
  done = (async () => {
    const { migrate: migrate2 } = await Promise.resolve().then(() => (init_src(), src_exports));
    await migrate2(storage, [
      `CREATE TABLE rt_playlists (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        video_count INTEGER NOT NULL DEFAULT 0,
        position INTEGER NOT NULL DEFAULT 0,
        enabled INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )`
    ]);
  })();
  migrated.set(storage, done);
  return done;
}
function withTimeout(p, what) {
  return Promise.race([p, new Promise((_2, reject) => setTimeout(() => reject(new Error(`${what} timed out`)), YTDLP_INFO_TIMEOUT_MS))]);
}
async function listRtPlaylists() {
  if (!hasConduitHost()) return [];
  await migrateStorage();
  const rows = await db().all(
    "SELECT id, title, video_count, position, enabled FROM rt_playlists ORDER BY position"
  );
  return rows.map((r) => ({ id: r.id, title: r.title, videoCount: r.video_count, position: r.position, enabled: r.enabled === 1 }));
}
async function setRtPlaylistEnabled(id, enabled2) {
  await migrateStorage();
  await db().run("UPDATE rt_playlists SET enabled = ? WHERE id = ?", [enabled2 ? 1 : 0, id]);
}
async function discoverRtPlaylists() {
  await migrateStorage();
  const info = await withTimeout(ytdlp.getInfoAsync(`${RT_CHANNEL_URL}/playlists`, { flatPlaylist: true }), "playlist discovery");
  const entries = info.entries ?? [];
  let n = 0;
  for (const [i, e] of entries.entries()) {
    if (!e?.id || !e?.title) continue;
    const id = e.id.startsWith("PL") ? e.id : (e.url ?? "").match(/list=([^&]+)/)?.[1] ?? e.id;
    await db().run(
      `INSERT INTO rt_playlists (id, title, video_count, position) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, video_count = excluded.video_count, position = excluded.position, updated_at = unixepoch()`,
      [id, e.title, e.playlist_count ?? 0, i]
    );
    n += 1;
  }
  log.info("rt-trailers", `Discovered ${n} Rotten Tomatoes playlists`);
  return n;
}
async function rtCatalogs() {
  return (await listRtPlaylists()).filter((p) => p.enabled).map((p) => ({ id: `rt:${p.id}`, type: "trailer", name: p.title, group: "rotten-tomatoes", groupNames: { en: "Rotten Tomatoes" } }));
}
async function rtCatalogItems(playlistId) {
  const info = await withTimeout(
    ytdlp.getInfoAsync(`https://www.youtube.com/playlist?list=${playlistId}`, { ...APPROX_DATE_OPTS, playlistEnd: MAX_VIDEOS_PER_PLAYLIST }),
    "playlist fetch"
  );
  const entries = info.entries ?? [];
  const out = [];
  for (const e of entries) {
    if (!e?.id || !e?.title) continue;
    const parsed = parseTrailerTitle(e.title);
    if (parsed.isCompilation) continue;
    const uploaded = e.upload_date ? `${e.upload_date.slice(0, 4)}-${e.upload_date.slice(4, 6)}-${e.upload_date.slice(6, 8)}` : null;
    out.push({
      id: `yt:${e.id}`,
      type: "trailer",
      name: parsed.name,
      // The title as shown on the card: the variant tells the uploads of one film apart.
      title: buildRtDisplayTitle(parsed.name, parsed.variant),
      year: parsed.year,
      variant: parsed.variant,
      releaseInfo: uploaded,
      duration: e.duration ?? null,
      poster: `https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`,
      posterShape: "landscape",
      description: e.title
    });
  }
  return out;
}
function parseTrailerTitle(raw) {
  if (/new\s+trailers\s+this\s+week/i.test(raw) || /\bweekly\b.*#\d+/i.test(raw) || /\bnew\s+(movie\s+)?trailers\s+\d{4}/i.test(raw)) {
    return { name: raw, year: null, variant: null, isCompilation: true };
  }
  let s = raw.trim();
  let year = null;
  const yearMatch = s.match(/\((\d{4})\)/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
    if (year < 1900 || year > 2100) year = null;
  } else {
    const yearEnd = s.match(/\b(20[1-9]\d)\s*$/);
    if (yearEnd) year = parseInt(yearEnd[1], 10);
  }
  s = s.replace(/\((\d{4})\)/g, " ").replace(/\s{2,}/g, " ").trim();
  const isBigGame = /\b(big\s+game|super\s*bowl)\b/i.test(s);
  let variant = null;
  const numMatch = s.match(/\btrailer\s*#?\s*(\d{1,2})\b/i) || s.match(/\bteaser\s*#\s*(\d{1,2})\b/i);
  if (numMatch) variant = `Trailer #${numMatch[1]}`;
  else if (/\bteaser\b/i.test(s)) variant = "Teaser";
  else if (/\bfinal\s+trailer\b/i.test(s)) variant = "Final Trailer";
  else if (/\bfeaturette\b/i.test(s)) variant = "Featurette";
  else if (/\btitle\s+reveal\b/i.test(s)) variant = "Title Reveal";
  else if (/\bannouncement\b/i.test(s)) variant = "Announcement";
  else if (isBigGame && /\bspot\b/i.test(s)) variant = "Super Bowl Spot";
  else if (isBigGame && /\btrailer\b/i.test(s)) variant = "Super Bowl Trailer";
  else if (/\bexclusive\b/i.test(s)) variant = "Exclusive Trailer";
  else if (/\btrailer\b/i.test(s)) variant = "Trailer";
  s = s.replace(/\|\s*.*/g, "").trim();
  s = s.replace(/(^|\s)['"‘’“”]+/g, "$1").replace(/['"‘’“”]+(\s|$)/g, "$1").trim();
  s = s.replace(
    /\s*[-–—|:]?\s*(big\s+game|super\s*bowl)\s+(spot|teaser|trailer|clip|first\s+look)\b.*$/i,
    ""
  ).trim();
  s = s.replace(/\b(big\s+game|super\s*bowl)\b/gi, " ").replace(/\s{2,}/g, " ").trim();
  const cutRe = /\s*[-–—|:]?\s*((official|exclusive|brand\s*new|new|first|last|full|final|international|red\s+band)\s+)*(teaser\s+trailer|teaser|official\s+trailer|trailer|featurette|title\s+reveal|announcement|sneak\s+peek|first\s+look|clip)\b.*$/i;
  s = s.replace(cutRe, "").trim();
  s = s.replace(/[\s\-–—|:,#]+$/, "").replace(/\s{2,}/g, " ").trim();
  return { name: s || raw, year, variant, isCompilation: false };
}
function buildRtDisplayTitle(baseTitle, variant) {
  const base2 = (baseTitle || "").trim();
  if (!variant || variant === "Trailer") return base2;
  return base2 ? `${base2} \u2014 ${variant}` : variant;
}

// src/youtubio.ts
var TTL = 30 * 60 * 1e3;
var cache = /* @__PURE__ */ new Map();
async function cachedJson(url) {
  const hit = cache.get(url);
  if (hit && hit.until > Date.now()) return hit.value;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15e3) });
    if (!res.ok) return null;
    const value = await res.json();
    cache.set(url, { value, until: Date.now() + TTL });
    if (cache.size > 500) cache.delete(cache.keys().next().value);
    return value;
  } catch {
    return null;
  }
}
async function base() {
  const url = String((await settings()).youtubio_url ?? "").trim();
  return url ? url.replace(/\/manifest\.json\s*$/, "").replace(/\/$/, "") : null;
}
async function manifestCatalogs() {
  const b2 = await base();
  if (!b2) return null;
  const m2 = await cachedJson(`${b2}/manifest.json`);
  return m2 ? { base: b2, catalogs: m2.catalogs ?? [] } : null;
}
async function youtubioCatalogs() {
  const m2 = await manifestCatalogs();
  if (!m2) return [];
  return m2.catalogs.filter((c) => !c.extra?.some((e) => e.isRequired)).slice(0, 12).map((c) => ({ id: `yb:${c.type}:${c.id}`, type: "video", name: c.name ?? c.id, group: "youtubio" }));
}
function toMeta(m2, fallbackType) {
  const links = Array.isArray(m2.links) ? m2.links : [];
  const channel = links.find((l) => l.category === "Directors")?.name;
  const rawId = String(m2.id);
  const id = rawId.startsWith("yt_id:") ? rawId : `yb:${String(m2.type || fallbackType)}|${rawId}`;
  return {
    ...m2,
    id,
    type: "video",
    name: String(m2.name ?? ""),
    subtitle: channel ?? m2.subtitle ?? null,
    posterShape: "landscape"
  };
}
async function youtubioCatalogItems(catalogId) {
  const b2 = await base();
  const [, type, ...rest] = catalogId.split(":");
  const id = rest.join(":");
  if (!b2 || !type || !id) return [];
  const data = await cachedJson(`${b2}/catalog/${encodeURIComponent(type)}/${encodeURIComponent(id)}.json`);
  return (data?.metas ?? []).map((m2) => toMeta(m2, type));
}
async function youtubioSearch(query) {
  const m2 = await manifestCatalogs();
  const cat = m2?.catalogs.find((c) => c.extra?.some((e) => e.name === "search" && e.isRequired));
  if (!m2 || !cat) return null;
  const data = await cachedJson(
    `${m2.base}/catalog/${encodeURIComponent(cat.type)}/${encodeURIComponent(cat.id)}/search=${encodeURIComponent(query)}.json`
  );
  return (data?.metas ?? []).map((x2) => toMeta(x2, cat.type));
}
async function youtubioStream(id) {
  const b2 = await base();
  const body = id.slice("yb:".length);
  const bar = body.indexOf("|");
  if (!b2 || bar < 0) return null;
  const data = await cachedJson(
    `${b2}/stream/${encodeURIComponent(body.slice(0, bar) || "video")}/${encodeURIComponent(body.slice(bar + 1))}.json`
  );
  const streams = data?.streams ?? [];
  const direct = streams.find((s) => s.url && !s.behaviorHints?.notWebReady) ?? streams.find((s) => s.url);
  if (direct?.url) return { url: direct.url, name: direct.name };
  const yt = streams.find((s) => s.ytId)?.ytId;
  return yt ? { ytId: yt } : null;
}

// src/ytdlpStream.ts
var ytdlp2 = makeYtDlp();
var YT_EXTRACTOR_ARGS = void 0;
function extractYouTubeId(input) {
  if (!input) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/
  ];
  for (const re of patterns) {
    const m2 = input.match(re);
    if (m2) return m2[1];
  }
  return null;
}
function parseStreamExpiry(url) {
  if (!url) return null;
  const m2 = url.match(/[?&]expire=(\d{9,11})/);
  if (!m2) return null;
  const secs = parseInt(m2[1], 10);
  return Number.isFinite(secs) ? secs * 1e3 : null;
}
var VIDEO_CODEC_RANK = [
  (c) => /^(avc1|h264|h\.264)/.test(c),
  // H.264 (universal)
  (c) => /^vp0?9/.test(c),
  // VP9 (broad)
  (c) => /^vp0?8/.test(c),
  // VP8 (broad)
  (c) => /^(av01|av1)/.test(c)
  // AV1 (modern only)
];
var AUDIO_CODEC_RANK = [
  (c) => c.startsWith("mp4a") || c === "aac",
  (c) => c === "opus",
  (c) => c === "vorbis"
];
function codecRank(codec, ranks) {
  if (!codec) return ranks.length;
  const lc = codec.toLowerCase();
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i](lc)) return i;
  }
  return ranks.length;
}
function sortFormats(formats, kind) {
  return [...formats].sort((a, b2) => {
    if (kind === "video") {
      const heightDiff = (b2.height ?? 0) - (a.height ?? 0);
      if (heightDiff !== 0) return heightDiff;
      return codecRank(a.vcodec, VIDEO_CODEC_RANK) - codecRank(b2.vcodec, VIDEO_CODEC_RANK);
    }
    const abrDiff = (b2.abr ?? 0) - (a.abr ?? 0);
    if (abrDiff !== 0) return abrDiff;
    return codecRank(a.acodec, AUDIO_CODEC_RANK) - codecRank(b2.acodec, AUDIO_CODEC_RANK);
  });
}
var MAX_PREFERRED_HEIGHT = 1080;
function matchesCodec(vcodec, ranks, tier) {
  if (!vcodec) return false;
  return ranks[tier](vcodec.toLowerCase());
}
function pickBestUrl(formatsIn, allowSeparateAudio) {
  if (!Array.isArray(formatsIn) || formatsIn.length === 0) return null;
  const formats = formatsIn.filter((f) => !!f.url && !f.protocol?.includes("m3u8"));
  const combined = sortFormats(
    formats.filter((f) => f.vcodec && f.vcodec !== "none" && f.acodec && f.acodec !== "none"),
    "video"
  );
  const videoOnly = sortFormats(
    formats.filter((f) => f.vcodec && f.vcodec !== "none" && (!f.acodec || f.acodec === "none")),
    "video"
  );
  const audioOnly = sortFormats(
    formats.filter((f) => f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")),
    "audio"
  );
  if (allowSeparateAudio && videoOnly.length > 0) {
    for (let tier = 0; tier < VIDEO_CODEC_RANK.length; tier++) {
      const candidate = videoOnly.find(
        (f) => matchesCodec(f.vcodec, VIDEO_CODEC_RANK, tier) && (f.height ?? 0) <= MAX_PREFERRED_HEIGHT
      );
      if (candidate) {
        return {
          url: candidate.url,
          audioUrl: audioOnly[0]?.url,
          quality: `${candidate.height ?? "?"}p`
        };
      }
    }
    const bestVideo = videoOnly[0];
    const combinedHeight = combined[0]?.height ?? 0;
    if ((bestVideo.height ?? 0) > combinedHeight) {
      return {
        url: bestVideo.url,
        audioUrl: audioOnly[0]?.url,
        quality: `${bestVideo.height ?? "?"}p`
      };
    }
  }
  if (combined.length > 0) {
    return { url: combined[0].url, quality: `${combined[0].height ?? "?"}p` };
  }
  if (videoOnly.length > 0) {
    return {
      url: videoOnly[0].url,
      audioUrl: audioOnly[0]?.url,
      quality: `${videoOnly[0].height ?? "?"}p`
    };
  }
  const any = formats.find((f) => f.url);
  return any ? { url: any.url, quality: "?" } : null;
}
function buildQualityLadder(formatsIn) {
  const formats = formatsIn.filter((f) => !!f.url && !f.protocol?.includes("m3u8"));
  const videoOnly = sortFormats(
    formats.filter((f) => f.vcodec && f.vcodec !== "none" && (!f.acodec || f.acodec === "none")),
    "video"
  );
  const audioOnly = sortFormats(
    formats.filter((f) => f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")),
    "audio"
  );
  const audioUrl = audioOnly[0]?.url;
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const f of videoOnly) {
    const h2 = f.height ?? 0;
    if (!h2 || seen.has(h2)) continue;
    seen.add(h2);
    result.push({
      height: h2,
      vcodec: (f.vcodec ?? "?").split(".")[0],
      videoUrl: f.url,
      audioUrl,
      label: `${h2}p`
    });
  }
  return result;
}
async function resolveYouTubeStream(videoId, opts = {}) {
  const allowSeparateAudio = opts.allowSeparateAudio !== false;
  const info = YT_EXTRACTOR_ARGS ? await ytdlp2.getInfoAsync(
    `https://www.youtube.com/watch?v=${videoId}`,
    { extractorArgs: YT_EXTRACTOR_ARGS }
  ) : await ytdlp2.getInfoAsync(`https://www.youtube.com/watch?v=${videoId}`);
  const formats = info.formats ?? [];
  const best = pickBestUrl(formats, allowSeparateAudio);
  if (!best) return null;
  const qualities = allowSeparateAudio ? buildQualityLadder(formats) : [];
  const title = info.title ?? "";
  const rawThumbs = info.thumbnails ?? [];
  const thumbnail = rawThumbs.length > 0 ? rawThumbs.sort((a, b2) => (b2.preference ?? 0) - (a.preference ?? 0))[0].url : info.thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return {
    url: best.url,
    audioUrl: best.audioUrl,
    title,
    thumbnail,
    quality: best.quality,
    qualities,
    urlExpiry: parseStreamExpiry(best.url)
  };
}

// src/ytmusic-innertube.ts
var INNERTUBE_KEY = "AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30";
var INNERTUBE_URL = `https://music.youtube.com/youtubei/v1/search?key=${INNERTUBE_KEY}&prettyPrint=false`;
var CLIENT_CONTEXT = {
  client: {
    clientName: "WEB_REMIX",
    clientVersion: "1.20240101.01.00",
    hl: "en",
    gl: "US"
  }
};
var FILTERS = {
  songs: "EgWKAQIIAWoKEAoQAxAEEAkQBQ%3D%3D",
  albums: "EgWKAQIYAWoKEAoQAxAEEAkQBQ%3D%3D",
  artists: "EgWKAQIgAWoKEAoQAxAEEAkQBQ%3D%3D"
};
async function callInnerTube(query, filter) {
  const res = await fetch(INNERTUBE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: CLIENT_CONTEXT,
      query,
      params: FILTERS[filter]
    })
  });
  if (!res.ok) {
    throw new Error(`YT Music InnerTube ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
function pickShelfItems(payload) {
  const sections = payload?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];
  const shelf = sections.find((s) => s.musicShelfRenderer)?.musicShelfRenderer;
  return shelf?.contents ?? [];
}
function colRuns(item, col) {
  return item?.flexColumns?.[col]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ?? [];
}
function colText(item, col) {
  return colRuns(item, col).map((r) => r.text || "").join("");
}
function upscaleThumb(url, size = 540) {
  if (!url) return url;
  const bump = (n) => String(Math.max(parseInt(n, 10) || 0, size));
  return url.replace(
    /=([a-z0-9-]+)$/i,
    (_m, params) => "=" + params.replace(/(^|-)w(\d+)/i, (_x, p, n) => `${p}w${bump(n)}`).replace(/(^|-)h(\d+)/i, (_x, p, n) => `${p}h${bump(n)}`).replace(/(^|-)s(\d+)/i, (_x, p, n) => `${p}s${bump(n)}`)
  );
}
function bestThumbnail(item) {
  const list = item?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails ?? [];
  return upscaleThumb(list[list.length - 1]?.url ?? list[0]?.url ?? "");
}
function durationStringToSeconds(input) {
  const parts = input.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
async function searchSongs(query, limit) {
  const data = await callInnerTube(query, "songs");
  const items = pickShelfItems(data);
  const hits = [];
  for (const it of items) {
    const r = it.musicResponsiveListItemRenderer;
    if (!r) continue;
    const titleRun = colRuns(r, 0)[0];
    const videoId = titleRun?.navigationEndpoint?.watchEndpoint?.videoId;
    if (!videoId || videoId.length !== 11) continue;
    const meta2 = colRuns(r, 1).map((x2) => x2.text || "");
    const parts = meta2.filter((s) => s && s !== " \u2022 ");
    const artist = parts[0] ?? "";
    let album = "";
    let duration = 0;
    const last = parts[parts.length - 1];
    if (last && /^\d+:\d{2}(?::\d{2})?$/.test(last)) {
      duration = durationStringToSeconds(last);
      album = parts.slice(1, -1).join(" ");
    } else {
      album = parts.slice(1).join(" ");
    }
    hits.push({
      id: videoId,
      title: colText(r, 0),
      artist,
      album,
      duration,
      thumbnail: bestThumbnail(r) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    });
    if (hits.length >= limit) break;
  }
  return hits;
}
async function searchAlbumsInnerTube(query, limit) {
  const data = await callInnerTube(query, "albums");
  const items = pickShelfItems(data);
  const hits = [];
  for (const it of items) {
    const r = it.musicResponsiveListItemRenderer;
    if (!r) continue;
    const browseId = r?.navigationEndpoint?.browseEndpoint?.browseId;
    if (!browseId || !browseId.startsWith("MPREb_")) continue;
    const meta2 = colRuns(r, 1).map((x2) => x2.text || "");
    const parts = meta2.filter((s) => s && s !== " \u2022 " && s !== "Album");
    const artist = parts[0] ?? "";
    const year = parts[1] ?? "";
    hits.push({
      id: browseId,
      title: colText(r, 0),
      artist,
      year,
      thumbnail: bestThumbnail(r)
    });
    if (hits.length >= limit) break;
  }
  return hits;
}
async function searchArtists(query, limit) {
  const data = await callInnerTube(query, "artists");
  const items = pickShelfItems(data);
  const hits = [];
  for (const it of items) {
    const r = it.musicResponsiveListItemRenderer;
    if (!r) continue;
    const browseId = r?.navigationEndpoint?.browseEndpoint?.browseId;
    if (!browseId || !browseId.startsWith("UC")) continue;
    const meta2 = colRuns(r, 1).map((x2) => x2.text || "");
    const parts = meta2.filter((s) => s && s !== " \u2022 " && s !== "Artist");
    const subscribers = parts[0] ?? "";
    hits.push({
      id: browseId,
      name: colText(r, 0),
      subscribers,
      thumbnail: bestThumbnail(r)
    });
    if (hits.length >= limit) break;
  }
  return hits;
}

// src/ytmusic.ts
var ytdlp3 = makeYtDlp();
var AUDIO_CODEC_RANK2 = [
  (c) => c.startsWith("mp4a") || c === "aac",
  (c) => c === "opus",
  (c) => c === "vorbis",
  (c) => c === "mp3"
];
function codecRank2(codec) {
  if (!codec) return AUDIO_CODEC_RANK2.length;
  const lc = codec.toLowerCase();
  for (let i = 0; i < AUDIO_CODEC_RANK2.length; i++) {
    if (AUDIO_CODEC_RANK2[i](lc)) return i;
  }
  return AUDIO_CODEC_RANK2.length;
}
function pickBestAudio(formats) {
  const audio = formats.filter(
    (f) => !!f.url && !f.protocol?.includes("m3u8") && f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")
  );
  if (audio.length === 0) return null;
  return [...audio].sort((a, b2) => {
    const abrDiff = (b2.abr ?? b2.tbr ?? 0) - (a.abr ?? a.tbr ?? 0);
    if (abrDiff !== 0) return abrDiff;
    return codecRank2(a.acodec) - codecRank2(b2.acodec);
  })[0];
}
function normalizeCodec(codec) {
  if (!codec) return void 0;
  if (codec.startsWith("mp4a")) return "aac";
  return codec;
}
function container(f) {
  const raw = f.container ?? f.ext;
  switch (raw) {
    case "m4a":
    case "mp4":
      return "mp4";
    case "opus":
    case "webm":
      return "webm";
    default:
      return raw ?? void 0;
  }
}
async function resolveAudioStream(videoId) {
  let info = await ytdlp3.getInfoAsync(`https://music.youtube.com/watch?v=${videoId}`).catch(() => null);
  let best = pickBestAudio(info?.formats ?? []);
  if (!best?.url) {
    info = await ytdlp3.getInfoAsync(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    best = pickBestAudio(info?.formats ?? []);
  }
  if (!best?.url) return null;
  return {
    url: best.url,
    title: info?.title ?? "",
    artist: info?.artist ?? info?.uploader ?? null,
    album: info?.album ?? null,
    track: info?.track ?? null,
    duration: typeof info?.duration === "number" ? info.duration : null,
    bitrate: best.abr ? Math.round(best.abr * 1e3) : best.tbr ? Math.round(best.tbr * 1e3) : null,
    codec: normalizeCodec(best.acodec) ?? null,
    container: container(best) ?? null,
    channels: typeof best.audio_channels === "number" ? best.audio_channels : null,
    sampleRate: typeof best.asr === "number" ? best.asr : null,
    thumbnail: bestThumbnail2(info)
  };
}
function bestThumbnail2(info) {
  const thumbnails = Array.isArray(info?.thumbnails) ? info.thumbnails : [];
  if (thumbnails.length > 0) {
    const best = [...thumbnails].filter((t) => typeof t?.url === "string" && t.url.length > 0).sort(
      (a, b2) => (b2.preference ?? 0) - (a.preference ?? 0) || (b2.width ?? 0) - (a.width ?? 0)
    )[0];
    if (best?.url) return best.url;
  }
  return typeof info?.thumbnail === "string" ? info.thumbnail : null;
}
async function searchTracks(query, limit) {
  const hits = await searchSongs(query, limit);
  return hits.map((h2) => ({
    id: h2.id,
    title: h2.title,
    artist: h2.artist,
    thumbnail: h2.thumbnail || `https://i.ytimg.com/vi/${h2.id}/hqdefault.jpg`,
    duration: h2.duration,
    url: `https://music.youtube.com/watch?v=${h2.id}`,
    album: h2.album
  }));
}
async function searchAlbums(query, limit) {
  const hits = await searchAlbumsInnerTube(query, limit);
  return hits.map((h2) => ({
    id: h2.id,
    title: h2.title,
    artist: h2.artist,
    thumbnail: h2.thumbnail,
    trackCount: 0,
    // not exposed in the search shelf; fetched per-album later
    url: `https://music.youtube.com/browse/${h2.id}`,
    year: h2.year
  }));
}
async function searchArtists2(query, limit) {
  const hits = await searchArtists(query, limit);
  return hits.map((h2) => ({
    id: h2.id,
    name: h2.name,
    subscribers: h2.subscribers,
    thumbnail: h2.thumbnail
  }));
}
async function fetchAlbum(albumId) {
  const url = albumId.startsWith("http") ? albumId : `https://music.youtube.com/browse/${albumId}`;
  const playlist = await ytdlp3.getInfoAsync(url, {
    flatPlaylist: true
  });
  if (!playlist) return null;
  const tracks = (playlist.entries ?? []).filter((e) => typeof e?.id === "string" && e.id.length === 11).map((e) => ({
    id: e.id,
    title: e.title ?? "",
    artist: e.uploader ?? e.channel ?? playlist.uploader ?? "",
    thumbnail: Array.isArray(e.thumbnails) && e.thumbnails[0]?.url || e.thumbnail || playlist.thumbnail || "",
    duration: typeof e.duration === "number" ? e.duration : 0,
    url: e.webpage_url ?? `https://www.youtube.com/watch?v=${e.id}`
  }));
  return {
    id: playlist.id ?? albumId,
    title: playlist.title ?? "",
    artist: playlist.uploader ?? playlist.channel ?? "",
    thumbnail: Array.isArray(playlist.thumbnails) && playlist.thumbnails[0]?.url || playlist.thumbnail || "",
    tracks
  };
}

// src/ytmusic-discover.ts
var INNERTUBE_KEY2 = "AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30";
var INNERTUBE_URL2 = `https://music.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY2}&prettyPrint=false`;
var CLIENT_CONTEXT2 = {
  client: {
    clientName: "WEB_REMIX",
    clientVersion: "1.20240101.01.00",
    hl: "en",
    gl: "US"
  }
};
async function callBrowse(browseId, params) {
  const res = await fetch(INNERTUBE_URL2, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: CLIENT_CONTEXT2,
      browseId,
      ...params ? { params } : {}
    })
  });
  if (!res.ok) {
    throw new Error(`YT Music browse ${browseId} \u2192 ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
function upscaleThumb2(url, size = 540) {
  if (!url) return url;
  const bump = (n) => String(Math.max(parseInt(n, 10) || 0, size));
  return url.replace(
    /=([a-z0-9-]+)$/i,
    (_m, params) => "=" + params.replace(/(^|-)w(\d+)/i, (_x, p, n) => `${p}w${bump(n)}`).replace(/(^|-)h(\d+)/i, (_x, p, n) => `${p}h${bump(n)}`).replace(/(^|-)s(\d+)/i, (_x, p, n) => `${p}s${bump(n)}`)
  );
}
function bestThumbnailFromList(list) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return upscaleThumb2(list[list.length - 1]?.url ?? list[0]?.url ?? "");
}
function bestThumbnail3(obj) {
  const lists = [
    obj?.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails,
    obj?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails,
    obj?.thumbnail?.thumbnails
  ];
  for (const list of lists) {
    if (Array.isArray(list) && list.length > 0) {
      return bestThumbnailFromList(list);
    }
  }
  return "";
}
function runsText(runs) {
  if (!Array.isArray(runs)) return "";
  return runs.map((r) => r?.text ?? "").join("");
}
function durationStringToSeconds2(input) {
  const parts = input.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
function extractAllShelves(payload) {
  const shelves = [];
  const tabs = payload?.contents?.singleColumnBrowseResultsRenderer?.tabs ?? payload?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
  for (const tab of tabs) {
    const sections = tab?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];
    for (const s of sections) {
      if (s.musicCarouselShelfRenderer) shelves.push(s.musicCarouselShelfRenderer);
      if (s.musicShelfRenderer) shelves.push(s.musicShelfRenderer);
      if (s.musicCardShelfRenderer) shelves.push(s.musicCardShelfRenderer);
    }
  }
  return shelves;
}
function shelfItems(shelf) {
  return shelf?.contents ?? [];
}
function readResponsiveTitle(row) {
  const fc = row?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer;
  const runs = fc?.text?.runs ?? [];
  const text = runs.map((r) => r?.text ?? "").join("");
  let videoId = null;
  let browseId = null;
  for (const r of runs) {
    const ne2 = r?.navigationEndpoint;
    if (ne2?.watchEndpoint?.videoId) {
      videoId = ne2.watchEndpoint.videoId;
      break;
    }
    if (ne2?.browseEndpoint?.browseId) {
      browseId = ne2.browseEndpoint.browseId;
      break;
    }
  }
  return { text, videoId, browseId };
}
function readResponsiveSubtitleParts(row) {
  const fc = row?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer;
  const runs = fc?.text?.runs ?? [];
  return runs.map((r) => r?.text ?? "").filter((s) => s && s !== " \u2022 " && s !== ", ");
}
function classifyItem(item) {
  const tworow = item?.musicTwoRowItemRenderer;
  if (tworow) {
    const watch = tworow?.navigationEndpoint?.watchEndpoint;
    const browse = tworow?.navigationEndpoint?.browseEndpoint;
    if (watch?.videoId)
      return { kind: "track", data: { node: tworow, layout: "tworow", watch } };
    if (browse?.browseId?.startsWith("MPREb_"))
      return { kind: "album", data: { node: tworow, layout: "tworow", browse } };
    if (browse?.browseId?.startsWith("UC"))
      return { kind: "artist", data: { node: tworow, layout: "tworow", browse } };
    if (browse?.browseId?.startsWith("VL") || browse?.browseId?.startsWith("OLAK") || browse?.browseId?.startsWith("FEmusic_detail"))
      return { kind: "playlist", data: { node: tworow, layout: "tworow", browse } };
    return { kind: null, data: null };
  }
  const row = item?.musicResponsiveListItemRenderer;
  if (row) {
    const playlistVideoId = row?.playlistItemData?.videoId;
    const titleInfo = readResponsiveTitle(row);
    const videoId = playlistVideoId || titleInfo.videoId;
    if (videoId && videoId.length === 11) {
      return {
        kind: "track",
        data: { node: row, layout: "row", watch: { videoId }, titleInfo }
      };
    }
    const topNav = row?.navigationEndpoint;
    const browseId = topNav?.browseEndpoint?.browseId || titleInfo.browseId || null;
    if (browseId) {
      const browse = { browseId };
      if (browseId.startsWith("MPREb_"))
        return { kind: "album", data: { node: row, layout: "row", browse, titleInfo } };
      if (browseId.startsWith("UC"))
        return { kind: "artist", data: { node: row, layout: "row", browse, titleInfo } };
      if (browseId.startsWith("VL") || browseId.startsWith("OLAK") || browseId.startsWith("FEmusic_detail"))
        return { kind: "playlist", data: { node: row, layout: "row", browse, titleInfo } };
    }
  }
  return { kind: null, data: null };
}
function pickPlaylist(node, browse, titleInfo) {
  if (!browse?.browseId) return null;
  let title = "";
  let subtitle = "";
  if (titleInfo) {
    title = titleInfo.text || "";
    const parts = readResponsiveSubtitleParts(node);
    subtitle = parts.join(" ").replace(/^Playlist\s*•?\s*/i, "");
  } else {
    title = runsText(node?.title?.runs);
    const subtitleRuns = node?.subtitle?.runs ?? [];
    subtitle = runsText(subtitleRuns).replace(/^Playlist\s*•?\s*/i, "");
  }
  if (!title) return null;
  return {
    id: browse.browseId,
    title,
    subtitle,
    thumbnail: bestThumbnail3(node)
  };
}
function pickTrack(node, watch, titleInfo) {
  if (!watch?.videoId || watch.videoId.length !== 11) return null;
  let title = "";
  let parts = [];
  if (titleInfo) {
    title = titleInfo.text || "";
    parts = readResponsiveSubtitleParts(node);
  } else {
    title = runsText(node?.title?.runs);
    const subtitleRuns = node?.subtitle?.runs ?? [];
    parts = subtitleRuns.map((r) => r?.text ?? "").filter((s) => s && s !== " \u2022 " && s !== ", ");
  }
  const artist = parts[0] ?? "";
  let album = "";
  let duration = 0;
  const last = parts[parts.length - 1];
  if (last && /^\d+:\d{2}(?::\d{2})?$/.test(last)) {
    duration = durationStringToSeconds2(last);
    album = parts.slice(1, -1).join(" ");
  } else {
    album = parts.slice(1).join(" ");
  }
  if (!title) return null;
  return {
    id: watch.videoId,
    title,
    artist,
    album,
    duration,
    thumbnail: bestThumbnail3(node) || `https://i.ytimg.com/vi/${watch.videoId}/hqdefault.jpg`
  };
}
function pickAlbum(node, browse, titleInfo) {
  if (!browse?.browseId) return null;
  let title = "";
  let parts = [];
  if (titleInfo) {
    title = titleInfo.text || "";
    parts = readResponsiveSubtitleParts(node).filter(
      (s) => s !== "Album" && s !== "Single" && s !== "EP"
    );
  } else {
    title = runsText(node?.title?.runs);
    const subtitleRuns = node?.subtitle?.runs ?? [];
    parts = subtitleRuns.map((r) => r?.text ?? "").filter((s) => s && s !== " \u2022 " && s !== "Album" && s !== "Single" && s !== "EP");
  }
  const artist = parts[0] ?? "";
  const year = parts.find((p) => /^\d{4}$/.test(p)) ?? "";
  if (!title) return null;
  return {
    id: browse.browseId,
    title,
    artist,
    year,
    thumbnail: bestThumbnail3(node)
  };
}
function pickArtist(node, browse, titleInfo) {
  if (!browse?.browseId) return null;
  let name = "";
  let subscribers = "";
  if (titleInfo) {
    name = titleInfo.text || "";
    const parts = readResponsiveSubtitleParts(node);
    subscribers = parts.join(" ");
  } else {
    name = runsText(node?.title?.runs);
    const subtitleRuns = node?.subtitle?.runs ?? [];
    subscribers = runsText(subtitleRuns);
  }
  if (!name) return null;
  return {
    id: browse.browseId,
    name,
    subscribers,
    thumbnail: bestThumbnail3(node)
  };
}
async function browseDiscover(browseId) {
  const data = await callBrowse(browseId);
  const shelves = extractAllShelves(data);
  const tracks = [];
  const albums = [];
  const artists = [];
  const playlists = [];
  const seenTracks = /* @__PURE__ */ new Set();
  const seenAlbums = /* @__PURE__ */ new Set();
  const seenArtists = /* @__PURE__ */ new Set();
  const seenPlaylists = /* @__PURE__ */ new Set();
  for (const shelf of shelves) {
    for (const it of shelfItems(shelf)) {
      const { kind, data: payload } = classifyItem(it);
      if (kind === "track") {
        const t = pickTrack(payload.node, payload.watch, payload.titleInfo);
        if (t && !seenTracks.has(t.id)) {
          seenTracks.add(t.id);
          tracks.push(t);
        }
      } else if (kind === "album") {
        const a = pickAlbum(payload.node, payload.browse, payload.titleInfo);
        if (a && !seenAlbums.has(a.id)) {
          seenAlbums.add(a.id);
          albums.push(a);
        }
      } else if (kind === "artist") {
        const a = pickArtist(payload.node, payload.browse, payload.titleInfo);
        if (a && !seenArtists.has(a.id)) {
          seenArtists.add(a.id);
          artists.push(a);
        }
      } else if (kind === "playlist") {
        const p = pickPlaylist(payload.node, payload.browse, payload.titleInfo);
        if (p && !seenPlaylists.has(p.id)) {
          seenPlaylists.add(p.id);
          playlists.push(p);
        }
      }
    }
  }
  return { tracks, albums, artists, playlists };
}
var DISCOVER_CACHE_TTL_MS = 60 * 60 * 1e3;
var discoverCache = /* @__PURE__ */ new Map();
async function cachedBrowse(browseId) {
  const now = Date.now();
  const cached = discoverCache.get(browseId);
  if (cached && cached.expiresAt > now) return cached.value;
  const value = await browseDiscover(browseId).catch(() => ({
    tracks: [],
    albums: [],
    artists: [],
    playlists: []
  }));
  discoverCache.set(browseId, { value, expiresAt: now + DISCOVER_CACHE_TTL_MS });
  return value;
}
async function fetchTrendingTracks(limit = 30) {
  const [charts, explore] = await Promise.all([
    cachedBrowse("FEmusic_charts"),
    cachedBrowse("FEmusic_explore")
  ]);
  const merged = [...charts.tracks, ...explore.tracks];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const t of merged) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}
async function fetchNewReleases(limit = 24) {
  const data = await cachedBrowse("FEmusic_new_releases");
  return data.albums.slice(0, limit);
}
async function fetchPopularArtists(limit = 24) {
  const [charts, explore] = await Promise.all([
    cachedBrowse("FEmusic_charts"),
    cachedBrowse("FEmusic_explore")
  ]);
  const merged = [...charts.artists, ...explore.artists];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const a of merged) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    out.push(a);
    if (out.length >= limit) break;
  }
  return out;
}
async function fetchMoodPlaylists(limit = 16) {
  const data = await cachedBrowse("FEmusic_moods_and_genres");
  return data.playlists.slice(0, limit);
}
async function fetchCommunityPlaylists(limit = 16) {
  const [charts, explore] = await Promise.all([
    cachedBrowse("FEmusic_charts"),
    cachedBrowse("FEmusic_explore")
  ]);
  const merged = [...charts.playlists, ...explore.playlists];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const p of merged) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}
async function fetchGenreTiles() {
  const now = Date.now();
  const cached = genreTilesCache;
  if (cached && cached.expiresAt > now) return cached.value;
  const data = await callBrowse("FEmusic_moods_and_genres").catch(() => null);
  if (!data) {
    const empty = { value: [], expiresAt: now + DISCOVER_CACHE_TTL_MS };
    genreTilesCache = empty;
    return [];
  }
  const tiles = [];
  const seen = /* @__PURE__ */ new Set();
  const sections = data?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];
  for (const s of sections) {
    const items = s?.gridRenderer?.items ?? [];
    for (const it of items) {
      const r = it?.musicNavigationButtonRenderer;
      if (!r) continue;
      const name = runsText(r?.buttonText?.runs) || r?.buttonText?.simpleText;
      const browse = r?.clickCommand?.browseEndpoint;
      const browseId = browse?.browseId;
      const params = browse?.params;
      if (!name || !browseId || !params) continue;
      const key = `${browseId}:${params}`;
      if (seen.has(key)) continue;
      seen.add(key);
      tiles.push({ name, browseId, params });
    }
  }
  genreTilesCache = { value: tiles, expiresAt: now + DISCOVER_CACHE_TTL_MS };
  return tiles;
}
var genreTilesCache = null;
async function fetchGenreContent(browseId, params) {
  const cacheKey = `genre:${browseId}:${params}`;
  const now = Date.now();
  const cached = discoverCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.value;
  const data = await callBrowse(browseId, params).catch(() => null);
  if (!data) {
    const empty = {
      tracks: [],
      albums: [],
      artists: [],
      playlists: []
    };
    discoverCache.set(cacheKey, { value: empty, expiresAt: now + DISCOVER_CACHE_TTL_MS });
    return empty;
  }
  const shelves = extractAllShelves(data);
  const tracks = [];
  const albums = [];
  const artists = [];
  const playlists = [];
  const seenTracks = /* @__PURE__ */ new Set();
  const seenAlbums = /* @__PURE__ */ new Set();
  const seenArtists = /* @__PURE__ */ new Set();
  const seenPlaylists = /* @__PURE__ */ new Set();
  for (const shelf of shelves) {
    for (const it of shelfItems(shelf)) {
      const { kind, data: payload } = classifyItem(it);
      if (kind === "track") {
        const t = pickTrack(payload.node, payload.watch, payload.titleInfo);
        if (t && !seenTracks.has(t.id)) {
          seenTracks.add(t.id);
          tracks.push(t);
        }
      } else if (kind === "album") {
        const a = pickAlbum(payload.node, payload.browse, payload.titleInfo);
        if (a && !seenAlbums.has(a.id)) {
          seenAlbums.add(a.id);
          albums.push(a);
        }
      } else if (kind === "artist") {
        const a = pickArtist(payload.node, payload.browse, payload.titleInfo);
        if (a && !seenArtists.has(a.id)) {
          seenArtists.add(a.id);
          artists.push(a);
        }
      } else if (kind === "playlist") {
        const p = pickPlaylist(payload.node, payload.browse, payload.titleInfo);
        if (p && !seenPlaylists.has(p.id)) {
          seenPlaylists.add(p.id);
          playlists.push(p);
        }
      }
    }
  }
  const out = { tracks, albums, artists, playlists };
  discoverCache.set(cacheKey, { value: out, expiresAt: now + DISCOVER_CACHE_TTL_MS });
  return out;
}
async function fetchPlaylistTracks(browseId, limit = 100) {
  const data = await callBrowse(browseId).catch(() => null);
  if (!data) return { title: "", thumbnail: "", tracks: [] };
  const header = data?.header?.musicDetailHeaderRenderer ?? data?.header?.musicEditablePlaylistDetailHeaderRenderer?.header?.musicDetailHeaderRenderer ?? data?.header?.musicResponsiveHeaderRenderer ?? {};
  const title = runsText(header?.title?.runs) || header?.title?.simpleText || runsText(data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.musicResponsiveHeaderRenderer?.title?.runs);
  const thumbnail = bestThumbnail3(header);
  const tabs = data?.contents?.singleColumnBrowseResultsRenderer?.tabs ?? data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
  let trackItems = [];
  for (const tab of tabs) {
    const sections = tab?.tabRenderer?.content?.sectionListRenderer?.contents ?? [];
    for (const s of sections) {
      const items = s?.musicPlaylistShelfRenderer?.contents;
      if (Array.isArray(items) && items.length > 0) {
        trackItems = items;
        break;
      }
    }
    if (trackItems.length > 0) break;
  }
  const tracks = [];
  const seen = /* @__PURE__ */ new Set();
  for (const it of trackItems) {
    const r = it?.musicResponsiveListItemRenderer;
    if (!r) continue;
    const titleRun = r?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0];
    const videoId = titleRun?.navigationEndpoint?.watchEndpoint?.videoId;
    if (!videoId || videoId.length !== 11 || seen.has(videoId)) continue;
    seen.add(videoId);
    const trackTitle = runsText(
      r?.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs
    );
    const subRuns = r?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ?? [];
    const parts = subRuns.map((x2) => x2?.text ?? "").filter((s) => s && s !== " \u2022 ");
    const artist = parts[0] ?? "";
    const album = parts.slice(1).join(" ");
    const durStr = r?.fixedColumns?.[0]?.musicResponsiveListItemFixedColumnRenderer?.text?.runs?.[0]?.text;
    const duration = durStr ? durationStringToSeconds2(durStr) : 0;
    const thumb = bestThumbnail3(r) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    tracks.push({
      id: videoId,
      title: trackTitle,
      artist,
      album,
      duration,
      thumbnail: thumb
    });
    if (tracks.length >= limit) break;
  }
  return { title: title || "", thumbnail, tracks };
}
async function fetchRelatedTracks(seedVideoId, limit = 10) {
  const NEXT_URL = `https://music.youtube.com/youtubei/v1/next?key=${INNERTUBE_KEY2}&prettyPrint=false`;
  try {
    const res = await fetch(NEXT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: CLIENT_CONTEXT2,
        videoId: seedVideoId,
        // RDAMVM<videoId> is the canonical "video radio" playlist; YT Music
        // builds the auto-play queue from it.
        playlistId: `RDAMVM${seedVideoId}`,
        params: "wAEB"
      })
    });
    if (!res.ok) return [];
    const data = await res.json();
    const queue = data?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.musicQueueRenderer?.content?.playlistPanelRenderer?.contents ?? [];
    const out = [];
    const seen = /* @__PURE__ */ new Set([seedVideoId]);
    for (const it of queue) {
      const r = it?.playlistPanelVideoRenderer;
      if (!r) continue;
      const videoId = r?.navigationEndpoint?.watchEndpoint?.videoId;
      if (!videoId || videoId.length !== 11) continue;
      if (seen.has(videoId)) continue;
      seen.add(videoId);
      const title = runsText(r?.title?.runs);
      const byLineRuns = r?.longBylineText?.runs ?? r?.shortBylineText?.runs ?? [];
      const parts = byLineRuns.map((x2) => x2?.text ?? "").filter((s) => s && s !== " \u2022 ");
      const artist = parts[0] ?? "";
      const album = parts[1] ?? "";
      const duration = durationStringToSeconds2(
        runsText(r?.lengthText?.runs) || ""
      );
      const thumbList = r?.thumbnail?.thumbnails ?? r?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails;
      out.push({
        id: videoId,
        title,
        artist,
        album,
        duration,
        thumbnail: bestThumbnailFromList(thumbList ?? []) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

// src/resources.ts
var SEARCH_LIMIT = 20;
var CHANNEL_LIMIT = 6;
function trackMeta(t) {
  return {
    id: t.id,
    type: "track",
    name: t.title,
    subtitle: t.artist || null,
    album: t.album || void 0,
    duration: t.duration || null,
    poster: t.thumbnail || videoThumb(t.id),
    posterShape: "square"
  };
}
function albumMeta(a) {
  return {
    id: a.id,
    type: "album",
    name: a.title,
    subtitle: a.artist || null,
    releaseInfo: a.year || null,
    poster: a.thumbnail || null,
    posterShape: "square",
    trackCount: a.trackCount
  };
}
function artistMeta(a) {
  return {
    id: a.id,
    type: "artist",
    name: a.name,
    subtitle: a.subscribers || null,
    poster: a.thumbnail || null,
    posterShape: "circle"
  };
}
function playlistMeta(p) {
  return {
    id: p.id,
    type: "playlist",
    name: p.title,
    subtitle: p.subtitle || null,
    poster: p.thumbnail || null,
    posterShape: "square"
  };
}
function channelMeta(c) {
  return {
    id: c.id,
    type: "channel",
    name: c.name,
    description: c.description,
    poster: c.avatar || null,
    posterShape: "circle",
    subscribers: c.subscribers,
    verified: c.verified,
    url: c.url
  };
}
function genreMeta(g2) {
  return { id: `genre:${g2.browseId}|${g2.params}`, type: "genre", name: g2.name };
}
function videoThumb(id) {
  const vid = extractYouTubeId(id.replace(/^yt(_id)?:/, ""));
  return vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : null;
}
function videoIdOf(id) {
  const bare = id.replace(/^yt(_id)?:/, "");
  return extractYouTubeId(bare) ?? bare;
}
var MUSIC_TYPES = /* @__PURE__ */ new Set(["track", "music", "album", "artist", "playlist", "genre"]);
var VIDEO_TYPES = /* @__PURE__ */ new Set(["video", "channel"]);
async function enabled(type) {
  const s = await settings();
  if (MUSIC_TYPES.has(type) && s.music_enabled === false) throw new Error("YouTube Music is switched off in Conduit's settings");
  if (VIDEO_TYPES.has(type) && s.videos_enabled === false) throw new Error("YouTube videos are switched off in Conduit's settings");
}
async function searchVideos(query) {
  const viaCatalogue = await youtubioSearch(query);
  if (viaCatalogue?.length) return viaCatalogue;
  const { ytdlp: ytdlp4, APPROX_DATE_OPTS: APPROX_DATE_OPTS2, entryToVideoMeta: entryToVideoMeta2 } = ytdlpVideos_exports;
  const info = await ytdlp4.getInfoAsync(
    `ytsearch${SEARCH_LIMIT}:${query}`,
    APPROX_DATE_OPTS2
  );
  return (info.entries || []).map(entryToVideoMeta2);
}
async function searchChannels(query) {
  const { ytdlp: ytdlp4, CHANNEL_SEARCH_SP: CHANNEL_SEARCH_SP2, entryToChannelMeta: entryToChannelMeta2 } = ytdlpVideos_exports;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=${CHANNEL_SEARCH_SP2}`;
  const info = await ytdlp4.getInfoAsync(url, { playlistEnd: CHANNEL_LIMIT });
  return (info.entries || []).slice(0, CHANNEL_LIMIT).map(entryToChannelMeta2).filter((c) => c.id && c.id.startsWith("UC")).map(channelMeta);
}
async function videoInfo(id) {
  const info = await ytdlp.getInfoAsync(`https://www.youtube.com/watch?v=${videoIdOf(id)}`);
  return info;
}
async function meta(type, id) {
  await enabled(type);
  switch (type) {
    case "video":
    case "trailer":
      return { meta: entryToVideoMeta(await videoInfo(id)) };
    case "track":
    case "music": {
      const info = await videoInfo(id);
      return {
        meta: trackMeta({
          id: videoIdOf(id),
          title: String(info.track ?? info.title ?? ""),
          artist: String(info.artist ?? info.uploader ?? info.channel ?? ""),
          album: info.album ? String(info.album) : void 0,
          duration: typeof info.duration === "number" ? info.duration : void 0,
          thumbnail: typeof info.thumbnail === "string" ? info.thumbnail : void 0
        })
      };
    }
    case "album": {
      const album = await fetchAlbum(id);
      if (!album) return { meta: null };
      return {
        meta: {
          ...albumMeta(album),
          items: album.tracks.map((t) => trackMeta({ ...t, album: album.title, artist: t.artist || album.artist, thumbnail: t.thumbnail || album.thumbnail }))
        }
      };
    }
    case "playlist": {
      const pl = await fetchPlaylistTracks(id, 150);
      return {
        meta: { ...playlistMeta({ id, title: pl.title, thumbnail: pl.thumbnail }), items: pl.tracks.map(trackMeta) }
      };
    }
    case "artist": {
      const [songs, albums, artists] = await Promise.all([
        searchTracks(id, 10).catch(() => []),
        searchAlbums(id, 20).catch(() => []),
        searchArtists2(id, 1).catch(() => [])
      ]);
      const lower = id.toLowerCase();
      const own = (x2) => String(x2.artist ?? "").toLowerCase().includes(lower);
      return {
        meta: {
          ...artistMeta({ id, name: artists[0]?.name ?? id, thumbnail: artists[0]?.thumbnail }),
          items: [...songs.filter(own).map(trackMeta), ...albums.filter(own).map(albumMeta)]
        }
      };
    }
    case "channel": {
      if (!/^UC[\w-]{20,}$/.test(id)) return { meta: null };
      const { ytdlp: ytdlp4, APPROX_DATE_OPTS: APPROX_DATE_OPTS2, entryToVideoMeta: entryToVideoMeta2 } = ytdlpVideos_exports;
      const info = await ytdlp4.getInfoAsync(`https://www.youtube.com/channel/${id}/videos`, {
        ...APPROX_DATE_OPTS2,
        playlistEnd: 40
      });
      return {
        meta: {
          id,
          type: "channel",
          name: String(info.title || "").replace(/ - Videos$/, ""),
          posterShape: "circle",
          items: (info.entries || []).map(entryToVideoMeta2)
        }
      };
    }
    default:
      throw new Error(`meta does not serve type "${type}"`);
  }
}
async function artwork(type, id) {
  await enabled(type);
  if (type === "video" || type === "trailer" || type === "track" || type === "music") {
    const thumb = videoThumb(id);
    return { artwork: { thumb, poster: thumb, background: type === "video" || type === "trailer" ? thumb : null } };
  }
  if (type === "album" || type === "playlist") {
    const { meta: m2 } = await meta(type, id);
    return { artwork: { poster: m2?.poster ?? null } };
  }
  if (type === "artist" || type === "channel") {
    const hits = await searchArtists2(id, 1).catch(() => []);
    const hit = hits.find((h2) => h2.id === id);
    return { artwork: { poster: hit?.thumbnail ?? null } };
  }
  throw new Error(`artwork does not serve type "${type}"`);
}
var genreCache = /* @__PURE__ */ new Map();
function genreContent(genre) {
  const hit = genreCache.get(genre);
  if (hit && hit.until > Date.now()) return hit.value;
  const body = genre.slice("genre:".length);
  const bar = body.indexOf("|");
  const value = fetchGenreContent(body.slice(0, bar), body.slice(bar + 1));
  genreCache.set(genre, { value, until: Date.now() + 30 * 60 * 1e3 });
  return value;
}
async function madeForYou(seedsRaw) {
  const seeds = String(seedsRaw ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  if (!seeds.length) return [];
  const lists = await Promise.all(seeds.map((id) => fetchRelatedTracks(videoIdOf(id), 12).catch(() => [])));
  const seen = new Set(seeds.map(videoIdOf));
  const out = [];
  for (let i = 0; out.length < 24 && lists.some((l) => l.length > i); i += 1) {
    for (const l of lists) {
      const t = l[i];
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        out.push(trackMeta(t));
      }
    }
  }
  return out;
}
async function catalog(type, id, extra) {
  if (id.startsWith("rt:")) return { metas: await rtCatalogItems(id.slice(3)) };
  await enabled(type);
  if (id.startsWith("yb:")) return { metas: await youtubioCatalogItems(id) };
  const genre = typeof extra.genre === "string" && extra.genre.startsWith("genre:") ? extra.genre : null;
  if (genre && ["track/trending", "album/new-releases", "artist/popular", "playlist/community"].includes(`${type}/${id}`)) {
    const g2 = await genreContent(genre);
    const pick = {
      track: g2.tracks.map(trackMeta),
      album: g2.albums.map(albumMeta),
      artist: g2.artists.map(artistMeta),
      playlist: g2.playlists.map(playlistMeta)
    };
    return { metas: pick[type] ?? [] };
  }
  switch (`${type}/${id}`) {
    case "track/made-for-you":
      return { metas: await madeForYou(extra.seeds) };
    case "track/trending":
      return { metas: (await fetchTrendingTracks(24)).map(trackMeta) };
    case "album/new-releases":
      return { metas: (await fetchNewReleases(24)).map(albumMeta) };
    case "artist/popular":
      return { metas: (await fetchPopularArtists(24)).map(artistMeta) };
    case "playlist/moods":
      return { metas: (await fetchMoodPlaylists(24)).map(playlistMeta) };
    case "playlist/community":
      return { metas: (await fetchCommunityPlaylists(24)).map(playlistMeta) };
    case "genre/genres":
      return { metas: (await fetchGenreTiles()).map(genreMeta) };
  }
  throw new Error(`catalog does not serve "${type}/${id}"`);
}
async function catalogs() {
  const s = await settings();
  const music = s.music_enabled === false ? [] : manifest_default.catalogs ?? [];
  const videos = s.videos_enabled === false ? [] : await youtubioCatalogs();
  return { catalogs: [...music, ...videos, ...await rtCatalogs()] };
}
async function search(type, query) {
  await enabled(type);
  switch (type) {
    case "video":
      return { metas: await searchVideos(query) };
    case "channel":
      return { metas: await searchChannels(query) };
    case "track":
    case "music":
      return { metas: (await searchTracks(query, 30)).map(trackMeta) };
    case "album":
      return { metas: (await searchAlbums(query, 12)).map(albumMeta) };
    case "artist":
      return { metas: (await searchArtists2(query, 8)).map(artistMeta) };
    default:
      throw new Error(`search does not serve type "${type}"`);
  }
}
var PROXY = {
  proxy: true,
  proxyChunkSize: 10 * 1024 * 1024,
  proxyHeaders: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Referer: "https://www.youtube.com/"
  }
};
async function stream(type, id, context) {
  await enabled(type);
  if (type === "track" || type === "music") {
    const s2 = await resolveAudioStream(videoIdOf(id));
    if (!s2?.url) return { streams: [] };
    const out = {
      id: videoIdOf(id),
      url: s2.url,
      name: s2.title,
      behaviorHints: PROXY,
      display: { title: s2.title || "Audio" },
      title: s2.track || s2.title,
      artist: s2.artist,
      album: s2.album,
      thumbnail: s2.thumbnail,
      duration: s2.duration
    };
    return { streams: [out] };
  }
  let videoId = null;
  if (id.startsWith("yb:")) {
    const own = await youtubioStream(id);
    if (own?.url) return { streams: [{ url: own.url, name: own.name, display: { title: own.name || "Video" } }] };
    videoId = own?.ytId ?? null;
  }
  videoId ??= videoIdOf(id);
  const s = await resolveYouTubeStream(videoId, { allowSeparateAudio: context?.client?.separateAudio !== false });
  if (!s) return { streams: [] };
  return {
    streams: [
      {
        id: videoId,
        url: s.url,
        audioUrl: s.audioUrl ?? null,
        name: s.title,
        behaviorHints: PROXY,
        qualities: s.qualities.map((q2) => ({ label: q2.label, height: q2.height, url: q2.videoUrl, audioUrl: q2.audioUrl ?? null })),
        display: { title: s.quality || "Video", height: s.qualities[0]?.height },
        thumbnail: s.thumbnail,
        quality: s.quality,
        urlExpiry: s.urlExpiry
      }
    ]
  };
}
var resources = {
  search: ({ type, id }) => search(type, id),
  catalog: ({ type, id, extra }) => catalog(type, id, extra),
  catalogs: () => catalogs(),
  meta: ({ type, id }) => meta(type, id),
  stream: ({ type, id, context }) => stream(type, id, context),
  artwork: ({ type, id }) => artwork(type, id)
};

// src/plugin.ts
async function status() {
  const [cookies, s, playlists] = await Promise.all([cookiesStatus(), settings(), listRtPlaylists()]);
  const pluginDir2 = join5(dataDir(), "bin", "yt-dlp-plugins");
  const item = (label, value, tone) => ({ label, value, tone });
  const shown = playlists.filter((p) => p.enabled).length;
  return {
    ok: true,
    items: [
      item("yt-dlp", existsSync7(ytdlpBinaryPath()) ? "Installed" : "Fetched on first use", existsSync7(ytdlpBinaryPath()) ? "success" : "info"),
      item("PO-token plugin", existsSync7(pluginDir2) && readdirSync2(pluginDir2).length > 0 ? "Installed" : "Fetched on first use", "info"),
      cookies.problem ? item("Cookies", cookies.problem, "error") : item("Cookies", cookies.present ? `${cookies.rows} YouTube cookies` : "None \u2014 datacenter IPs may be bot-checked", cookies.present ? "success" : "warning"),
      item("YouTubio catalogue", s.youtubio_url ? "Set" : "Not set", s.youtubio_url ? "success" : "info"),
      item("Rotten Tomatoes rows", playlists.length ? `${shown} of ${playlists.length} playlists shown` : "Not discovered yet", shown ? "success" : "info")
    ]
  };
}
var addon = defineAddon({
  manifest: manifest_default,
  async setup(host) {
    setConduitHost(host);
    await migrateStorage();
    void ensureYtDlp().catch((err) => host.logger.warn("yt-dlp", `Not ready yet: ${err.message}`));
    return {
      resources,
      actions: {
        status: async () => status(),
        "rt-list": async () => ({
          ok: true,
          rows: (await listRtPlaylists()).map((p) => ({ id: p.id, title: p.title, videos: p.videoCount, enabled: p.enabled }))
        }),
        "rt-toggle": async ({ row }) => {
          const r = row;
          if (!r?.id) return { ok: false, message: "No playlist given" };
          await setRtPlaylistEnabled(r.id, !r.enabled);
          return { ok: true, message: r.enabled ? "Hidden" : "Shown on the home screen" };
        },
        "rt-discover": async () => ({ ok: true, message: `Found ${await discoverRtPlaylists()} playlists` }),
        "update-ytdlp": async () => ({ ok: true, message: await updateYtDlp() })
      }
    };
  }
});
var manifest = addon.manifest;
var register = addon.register;
export {
  addon,
  manifest,
  register
};
