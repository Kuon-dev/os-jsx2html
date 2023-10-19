import { type RequestHandler } from "@builder.io/qwik-city";

import * as babel from "@babel/core";
// import React from 'react';
// import ReactDOMServer from 'react-dom/server';

// export const onGet: RequestHandler = async ({ json }) => {
//   try {
//     const test = await jsxToHtml(problem5);
//     json(200, { hello: test });
//   } catch (err) {
//     console.log(err);
//     json(500, { error: err });
//   }
// };
//
export const onPost: RequestHandler = async ({ json, request }) => {
  try {
    const jsonBody = await request.json();
    const renderedHTML = await jsxToHtml(jsonBody.data);
    json(200, { data: renderedHTML });
  } catch (err) {
    console.log(err);
    json(500, { error: err });
  }
};

const jsxToHtml = async (jsxCode: string): Promise<any> => {
  try {
    // Transpile JSX to JavaScript using Babel
    const { code } = babel.transform(jsxCode, {
      presets: ["@babel/preset-react"],
      plugins: ["@babel/plugin-transform-modules-commonjs"],
    }) as babel.BabelFileResult;

    // Wrap the transpiled code in a function to be executed
    const func = new Function(
      "React",
      "ReactDOMServer",
      `
      ${code}
      return ReactDOMServer.renderToStaticMarkup(render());
    `,
    );

    // Dynamically import the necessary modules
    const [React, ReactDOMServer] = await Promise.all([
      import("react"),
      import("react-dom/server"),
    ]);

    // Execute the function with the imported modules
    return func(React, ReactDOMServer);
  } catch (error) {
    // Log the error for debugging purposes
    // You could re-throw the error, or return a default error object/message
    // to indicate an error occurred during the transformation process.
    throw new Error("Failed to transform JSX to HTML");
  }
};

const problem5 = `
    const Item = ({ value }) => <div>Item: {value}</div>;
    
    const List = ({ items }) => {
        return items.map((item, index) => <Item key={index} value={item} />);
    };
    
    const render = () => <List items={[1, 2, 3]} />;
`;
