const PACKAGE = require("mathjax-full/components/webpack.common.js");

module.exports = PACKAGE(
	"colorjax",
	"node_modules/mathjax-full/js",
	["components/src/core/lib", "components/src/input/tex-base/lib"],
	__dirname,
	__dirname + "/dist"
);
