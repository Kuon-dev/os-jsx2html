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
import { defaultReactMonaco } from "~/integrations/monaco/constant";

export default component$(() => {
  // the page that is currently selected

  const codeContent = useSignal<string>(defaultReactMonaco);
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
      toast.success("Successfully generated html code")
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
          <h2 class="text-3xl font-bold tracking-tight my-4">Transform JSX to HTML</h2>
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
          <div class="flex xl:flex-row flex-col gap-20">
            <div class="basis-1/2">
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
            <div class="basis-1/2">
              <h2 class="text-3xl font-bold tracking-tight">Rendered HTML</h2>
              <div class="my-3 py-2">
                <HTMLMonacoEditor value={renderedHTML.value} />
              </div>
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
      name: "description",
      content: "Convert JSX to HTML instantly with our free online tool. Paste your JSX code and get the HTML output in real-time.",
    },
    {
      name: "keywords",
      content: "JSX, HTML, Converter, Online Converter, JSX to HTML, Code Converter",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content: "JSX to HTML Converter - Convert JSX Code Online",
    },
    {
      property: "og:description",
      content: "Convert JSX to HTML instantly with our free online tool. Paste your JSX code and get the HTML output in real-time.",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "JSX to HTML Converter - Convert JSX Code Online",
    },
    {
      name: "twitter:description",
      content: "Convert JSX to HTML instantly with our free online tool. Paste your JSX code and get the HTML output in real-time.",
    },
    {
      name: "twitter:image",
      content: "https://www.example.com/image.jpg",
    },
  ],
};
