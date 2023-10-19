import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
  type NoSerialize,
} from "@builder.io/qwik";
import { configureMonaco } from "./helpers";
import type { IStandaloneCodeEditor } from "./types";

interface MonacoEditorProps {
  value: string | undefined;
}

export default component$((prop: MonacoEditorProps) => {
  const editorRef = useSignal<HTMLElement>();
  const hasInitialized = useSignal<boolean>(false);

  const content = useSignal<string | undefined>(prop.value ?? "");

  const store = useStore<{
    monacoInstance: NoSerialize<IStandaloneCodeEditor>;
  }>({
    monacoInstance: undefined,
  });

  // mount visible task
  useVisibleTask$(
    async ({ track }) => {
      track(() => prop.value);
      if (hasInitialized.value) {
        const monacoEditor = store.monacoInstance;
        if (prop.value !== monacoEditor?.getModel()?.getValue())
          monacoEditor?.getModel()?.setValue(prop.value ?? "");
      } else {
        const monaco = await configureMonaco();
        editorRef.value!.innerHTML = "";

        const monacoEditor = monaco.editor.create(editorRef.value!, {
          readOnly: true,
          value: content.value,
          language: "html",
        });

        store.monacoInstance = noSerialize(monacoEditor);
        hasInitialized.value = true;
      }
    },
    { strategy: "document-ready" },
  );

  return (
    <div class="relative">
      <div ref={editorRef} class="h-[20rem]">
        loading
      </div>
    </div>
  );
});
