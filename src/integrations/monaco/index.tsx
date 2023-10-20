import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
  type NoSerialize,
  type PropFunction,
} from "@builder.io/qwik";
// import { initVimMode } from "monaco-vim";
import { useDebounce } from "~/hooks/useDebounce";
import { enabledLanguages, selfClosingTags } from "./constant";
import { configureMonaco } from "./helpers";
import type { IKeyboardEvent, IStandaloneCodeEditor } from "./types";

// VimMode.Vim.defineEx('write', 'w', function() {
//   // your own implementation on what you want to do when :w is pressed
//   localStorage.setItem('editorvalue', editor.getValue());
// });

interface MonacoEditorProps {
  value: string | undefined;
  onValueChange$: PropFunction<(val: string) => void>;
}

export default component$((prop: MonacoEditorProps) => {
  const editorRef = useSignal<HTMLElement>();
  const hasInitialized = useSignal<boolean>(false);

  const content = useSignal<string | undefined>(prop.value ?? "");
  const debouncedValue = useDebounce(content);

  const store = useStore<{
    monacoInstance: NoSerialize<IStandaloneCodeEditor>;
  }>({
    monacoInstance: undefined,
  });

  // debounce callback to update value
  useVisibleTask$(({ track }) => {
    track(() => debouncedValue.value);
    prop.onValueChange$(debouncedValue.value);
  });

  // track instance, used for event handling
  useVisibleTask$(async ({ track, cleanup }) => {
    track(() => store.monacoInstance);
    if (!store.monacoInstance) return;
    const monacoEditor = store.monacoInstance;
    const monaco = await configureMonaco();

    // initVimMode(
    //   store.monacoInstance,
    //   document.getElementById("my-statusbar")!,
    // );
    // autotag feature
    monacoEditor.onKeyDown((event: IKeyboardEvent) => {
      // select enabled languages,
      const model = monacoEditor.getModel();
      if (!model || !enabledLanguages.includes(model.getLanguageId())) {
        return;
      }

      const isSelfClosing = (tag: string): boolean =>
        selfClosingTags.includes(tag);

      const currentSelections = monacoEditor.getSelections();
      // when the user enters '>'
      if (event.browserEvent.key === ">" && currentSelections) {
        const edits: any[] = [];
        const newSelections: any[] = [];

        // potentially insert the ending tag at each of the selections
        for (const selection of currentSelections) {
          // shift the selection over by one to account for the new character
          newSelections.push(
            new monaco.Selection(
              selection.selectionStartLineNumber,
              selection.selectionStartColumn + 1,
              selection.endLineNumber,
              selection.endColumn + 1,
            ),
          );

          // grab the content before the cursor
          const contentBeforeChange = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn,
          });

          // if ends with an HTML tag we are currently closing
          const match = contentBeforeChange.match(
            /<([\w-]+)(?![^>]*\/>)[^>]*$/,
          );
          if (!match) {
            continue;
          }

          const [fullMatch, tag] = match;

          // skip self-closing tags like <br> or <img>
          if (isSelfClosing(tag) || fullMatch.trim().endsWith("/")) {
            continue;
          }

          // add in the closing tag
          edits.push({
            range: new monaco.Range(
              selection.endLineNumber,
              selection.endColumn + 1, // add 1 to offset for the inserting '>' character
              selection.endLineNumber,
              selection.endColumn + 1,
            ),
            text: `</${tag}>`,
          });
        }

        // wait for next tick to avoid it being an invalid operation
        setTimeout(() => {
          monacoEditor.executeEdits(model.getValue(), edits, newSelections);
        }, 100);
      }
    });

    monacoEditor.onKeyUp(() => {
      content.value = monacoEditor.getModel()?.getValue() as string;
    });

    cleanup(() => monacoEditor.dispose());
  });

  // mount visible task
  useVisibleTask$(
    async ({ track, cleanup }) => {
      if (hasInitialized.value) return;
        const monaco = await configureMonaco();
        const ts = monaco.languages.typescript;

        ts.typescriptDefaults.setCompilerOptions({
          allowJs: true,
          allowNonTsExtensions: true,
          esModuleInterop: true,
          isolatedModules: true,
          jsx: ts.JsxEmit.ReactJSX,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          noEmit: true,
          skipLibCheck: true,
          target: ts.ScriptTarget.Latest,
          typeRoots: ["node_modules/@types"],
          jsxFactory: "react",
          // jsx: 1,
        });

        ts.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });
        ts.javascriptDefaults.workerOptions;

        editorRef.value!.innerHTML = "";

        const monacoEditor = monaco.editor.create(editorRef.value!, {
          // automaticLayout: true,
          // lineDecorationsWidth: 5,
          // lineNumbersMinChars: 3,
          minimap: { enabled: false },
          roundedSelection: false,
          scrollBeyondLastLine: false,
          tabSize: 2,
          value: content.value,
          language: "typescript",
        });
        // ts.typescriptDefaults.setEagerModelSync(true);
        // Monaco is not serializable, so we can't serialize it as part of SSR
        // We can however instantiate it on the client after the component is visible
        store.monacoInstance = noSerialize(monacoEditor);

        // custom vim mode
        // cleanup(() => vimMode.dispose());
        monacoEditor?.getModel()?.setValue(prop.value ?? "");
        hasInitialized.value = true;
      cleanup(() => monacoEditor.dispose())
    },
    { strategy: "document-ready" },

  );

  return (
    <div class="relative">
      <div ref={editorRef} class="h-[40rem]">
        loading
      </div>
      <div id="my-statusbar"></div>
    </div>
  );
});
