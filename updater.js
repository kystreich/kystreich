const fs = require("fs");
const path = require("path");

const tollURL =
	"https://data.techforpalestine.org/api/v2/casualties_daily.json";

let readMePath = path.join(__dirname, "./README.MD");

const fileData = fs.readFileSync(readMePath, "utf-8");

console.log(fileData);

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
	let newData = fileData.replace(
		/<span id="toll">.*/g,
		`<span id="toll">${toll}</span> dead, individuals in Gaza desperately need internet connections to share the horrors of Israel's attacks against Palestine.</h4></l1>`
	);

	fs.writeFileSync(readMePath, newData);
	return;
}

getToll().then((toll) => {
	updateFile(toll);
});
