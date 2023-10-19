import type { Monaco, MonacoContext, NodeModuleDep } from "./types";

// refering to Qwik's implementation of monaco instance
const getCdnUrl = (pkgName: string, pkgVersion: string, pkgPath: string) => {
  return `https://cdn.jsdelivr.net/npm/${pkgName}@${pkgVersion}${pkgPath}`;
};

const monacoCtx: MonacoContext = {
  deps: [],
  loader: null,
  tsWorker: null,
};

const MONACO_VERSION = "0.44.0";
const MONACO_VS_URL = getCdnUrl("monaco-editor", MONACO_VERSION, "/min/vs");
const MONACO_LOADER_URL = `${MONACO_VS_URL}/loader.js`;

export const fetchDep = async (cache: Cache, dep: NodeModuleDep) => {
  const url = getCdnUrl(dep.pkgName, dep.pkgVersion, dep.pkgPath);
  const req = new Request(url);
  const cachedRes = await cache.match(req);
  if (cachedRes) {
    return cachedRes.clone().text();
  }
  const fetchRes = await fetch(req);
  if (fetchRes.ok) {
    if (!req.url.includes("localhost")) {
      await cache.put(req, fetchRes.clone());
    }
    return fetchRes.clone().text();
  }
  throw new Error(`Unable to fetch: ${url}`);
};

export const getMonaco = async (): Promise<Monaco> => {
  if (!monacoCtx.loader) {
    // lazy-load the monaco AMD script ol' school
    monacoCtx.loader = new Promise<Monaco>((resolve, reject) => {
      const script = document.createElement("script");
      script.addEventListener("error", reject);
      script.addEventListener("load", () => {
        require.config({ paths: { vs: MONACO_VS_URL } });

        // https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs/editor/editor.main.js
        require(["vs/editor/editor.main"], () => {
          resolve((globalThis as any).monaco);
        });
      });
      script.async = true;
      script.src = MONACO_LOADER_URL;
      document.head.appendChild(script);
    });
  }
  return monacoCtx.loader;
};

export const getUri = (monaco: Monaco, filePath: string) => {
  return new monaco.Uri().with({ path: filePath });
};

// export const initMonacoWorkers = async () => {
//   const editorWorker = await import(
//     "monaco-editor/esm/vs/editor/editor.worker?worker"
//   );
//   const jsonWorker = await import(
//     "monaco-editor/esm/vs/language/json/json.worker?worker"
//   );
//   const cssWorker = await import(
//     "monaco-editor/esm/vs/language/css/css.worker?worker"
//   );
//   const htmlWorker = await import(
//     "monaco-editor/esm/vs/language/html/html.worker?worker"
//   );
//   const tsWorker = await import(
//     "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
//   );
//
//
//   self.MonacoEnvironment = {
//     getWorker(_, label) {
//       if (label === "json") {
//         return new jsonWorker.default();
//       }
//       if (label === "css" || label === "scss" || label === "less") {
//         return new cssWorker.default();
//       }
//       if (
//         label === "html" ||
//         label === "handlebars" ||
//         label === "razor"
//       ) {
//         return new htmlWorker.default();
//       }
//       if (label === "typescript" || label === "javascript") {
//         return new tsWorker.default();
//       }
//       return new editorWorker.default();
//     },
//   };
// }
//
export const configureMonaco = async () => {
  // await initMonacoWorkers()
  const monaco = await getMonaco();
  const theme = await import("monaco-themes/themes/Dracula.json");
  monaco.editor.defineTheme("dracula", theme as any);
  monaco.editor.setTheme("dracula");
  return monaco;
};

declare const require: any;


