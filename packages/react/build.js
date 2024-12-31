const fs = require("node:fs");
const babel = require("@babel/core");
const {icons} = require("../../icons.json");

// convert string to pascal case
const pascalCase = str => {
    return str.match(/[a-zA-Z0-9]+/g).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join("");
};

const build = () => {
    const code = [
        `import React from "react";`,
        `export const Icon = ({size = "1em", color = "currentColor", stroke = "2", path = ""}) => (`,
        `    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">`,
        `        <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke}>`,
        `            <path d={path} />`,
        `        </g>`,
        `    </svg>`,
        `);`,
        // `Icon.defaultProps = {`,
        // `    path: "",`,
        // `    size: "1em",`,
        // `    color: "currentColor",`,
        // `    stroke: 2,`,
        // `};`,
        ...icons.map(icon => {
            return `export const ${pascalCase(icon.name)}Icon = props => (<Icon {...props} path={"${icon.path}"} />);`;
        }),
        `const ICONS = {`,
        ...icons.map(icon => {
            return `"${icon.name}": ${pascalCase(icon.name)}Icon,`;
        }),
        `};`,
        `export const renderIcon = name => React.createElement(ICONS[name], {});`,
    ];
    // convert jsx to react.createElement calls
    const output = babel.transformSync(code.join("\n"), {
        presets: [
            "@babel/preset-react",
        ],
    });
    // write output
    fs.writeFileSync("./index.js", output, "utf8");
};

build();
