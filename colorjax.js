import { Configuration } from "./node_modules/mathjax-full/js/input/tex/Configuration.js";

function modifyAST(state, node) {
	for (const childNode of node.childNodes.slice()) {
		modifyAST(state, childNode);
	}

	if (node.childNodes.length === 1 && node.childNodes[0].childNodes.length === 0) {
		const d = node.childNodes[0];
		if (node.kind === "mi" && typeof d.text === "string") {
			if (d.text.length === 1) {
				if (state.dollar) {
					node.attributes.attributes["style"] = "color: #fd971f;";
					const dollarElement = state.dollar.parent;
					const siblings = dollarElement.parent.childNodes;
					siblings.splice(siblings.indexOf(dollarElement), 1);
				} else {
					node.attributes.attributes["style"] = "color: #ae81ff;";
				}
			} else {
				node.attributes.attributes["style"] = "color: #f92672;";
				state.fn = node;
			}
		} else if (state.fn) {
			if (node.kind === "mo" && d.text === "(") {
				state.fn.attributes.attributes["style"] = "color: #a6e22e;";
			} else if (node.parent && node.parent.kind !== "msup" && node.parent.kind !== "msub" && d.text !== "\u2061") {
				state.fn = undefined;
			}
		}
		state.dollar = undefined;
	}

	if (node.kind === "mo" || node.kind === "msqrt" || node.kind === "mfrac") {
		node.attributes.attributes["style"] = "color: #f92672;";
	} else if (node.kind === "mn") {
		node.attributes.attributes["style"] = "color: #ae81ff;";
	} else if (node.kind === "inferredMrow" && node.childNodes.length === 1) {
		const d = node.childNodes[0];
		if (
			d.kind === "mi" &&
			d.attributes.attributes.mathvariant === "normal" &&
			d.childNodes.length === 1 &&
			d.childNodes[0].text === "d"
		) {
			d.attributes.attributes["style"] = "color: #f92672;";
		} else if (d.kind === "mo" && d.childNodes.length === 1 && d.childNodes[0].text === "$") {
			state.dollar = node;
		}
	}
}

Configuration.create("mml", {
	postprocessors: [
		function (math) {
			modifyAST({}, math.data.root);
		}
	]
});
