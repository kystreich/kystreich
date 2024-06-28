const fs = require("fs");

const tollURL =
	"https://data.techforpalestine.org/api/v2/casualties_daily.json";

const fileData = fs.readFileSync("./README.MD", "utf-8");

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
		`<span id="toll">${toll}</span> dead, individuals in Gaza desperately need internet connections to share the horrors of Israel's attacks against Palestine.`
	);

	fs.writeFileSync("./README.MD", newData);
	return;
}

getToll().then((toll) => {
	updateFile(toll);
});
