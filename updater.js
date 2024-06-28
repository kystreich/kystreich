const fs = require("fs");
const path = require("path");

const tollURL =
	"https://data.techforpalestine.org/api/v2/casualties_daily.json";

const readMeRaw =
	"https://raw.githubusercontent.com/kystreich/kystreich/master/README.md";

async function getReadMe() {
	let responseData = await fetch(readMeRaw);

	let responseText = await responseData.text();

	let newLineReplaced = responseText.replace(/(?:\r\n|\r|\n)/g, "\\n");

	return newLineReplaced;
}

async function getToll() {
	let responseData = await fetch(tollURL);
	let eventArray = await responseData.json();

	let killedTotal = 0;

	eventArray.forEach((event) => {
		if (typeof event.killed === "number") {
			killedTotal += event.killed;
		}
	});

	return killedTotal;
}

async function updateFile(toll) {
	let fileData = await getReadMe();

	let newData = fileData.replace(
		/<span id="toll">.*/g,
		`<span id="toll">${toll}</span> dead, individuals in Gaza desperately need internet connections to share the horrors of Israel's attacks against Palestine.</h4></l1>`
	);

	fs.writeFileSync("./README.md", newData.replaceAll("\\n", "\n"));
	return;
}

getToll().then((toll) => {
	updateFile(toll);
});
