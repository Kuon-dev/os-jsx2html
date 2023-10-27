export const defaultReactMonaco = `
const HelloWorld = () => <div>Hello World</div>

const Root = () => {
    return (
      <HelloWorld />
    )
}

// this code is mandatory otherwise react doesn't know what to render as root
// you may change the name of the "Root" component
const render = () => <Root />
`;

export const enabledLanguages: string[] = [
  "html",
  "markdown",
  "javascript",
  "typescript",
];

export const selfClosingTags = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "use",
]
