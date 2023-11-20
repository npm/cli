
const { deepStrictEqual } = require("assert");

//Object.entries
const resultFromObjectEntriesFn = Object.entries(process.env).filter(item => item[0].includes("_package_config_"));

//Object.fromEntries
const resultFromEntriesFn = Object.fromEntries(resultFromObjectEntriesFn);

//compare using deepStrictEqual - > comp
deepStrictEqual(resultFromEntriesFn, {
  npm_package_config_array_0: "item1",
  npm_package_config_array_1: "item2",
  npm_package_config_array_2: "item3"
})
