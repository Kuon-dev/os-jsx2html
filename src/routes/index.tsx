import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  // routeLoader$,
  type DocumentHead,
  // routeAction$,
} from "@builder.io/qwik-city";
import { SdnButton } from "~/integrations/qwik-ui/button";
import HTMLMonacoEditor from "~/integrations/monaco/readonly-index";
import MonacoEditor from "~/integrations/monaco/index";

import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "~/icons/spinner";

export default component$(() => {
  // the page that is currently selected

  const codeContent = useSignal<string>("");
  const renderedHTML = useSignal<string>("");

  const isProcessing = useSignal<boolean>(false);

  const handleCodeChange = $((e: string) => {
    codeContent.value = e;
  });

  const handleCompare = $(async () => {
    isProcessing.value = true;
    try {
      // tansform bable code
      const transformToStatic = await axios
        .post("/api/babel/jsx-to-html", {
          data: codeContent.value,
        })
        .then((res) => res.data);

      // save react code
      renderedHTML.value = transformToStatic.data;
    } catch (e) {
      toast("An error has occured");
    } finally {
      isProcessing.value = false;
    }
  });

  return (
    <>
      <div class="hidden flex-col md:flex">
        <div class="container flex-1 space-y-4 p-8 pt-6">
          <div class="flex items-center justify-between space-y-2">
            <div class="flex items-center space-x-2">
              <SdnButton
                onClick$={() => {
                  handleCompare();
                }}
              >
                Transform JSX to HTML {isProcessing.value ? <Spinner class="ml-2" /> : null}
              </SdnButton>
            </div>
          </div>
          <div class="flex flex-col gap-20">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">JSX</h2>
              <div class="my-3 py-2">
                <MonacoEditor
                  value={codeContent.value}
                  onValueChange$={(e) => {
                    handleCodeChange(e);
                  }}
                />
              </div>
            </div>
            <div>
              <h2 class="text-3xl font-bold tracking-tight">Rendered HTML</h2>
              <HTMLMonacoEditor value={renderedHTML.value} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "JSX to HTML",
  meta: [
    {
      name: "JSX2HTML",
      content: "Transform JSX to HTML",
    },
  ],
};
