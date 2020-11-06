"use strict";


let clockUpdateLoop;
let isShowSeconds;
let clockEvents;
clockEvents = {};

let lastEventCheckTime = "";

function checkForClockEvents() {
	let d = new Date();
	let timeString = pad(d.getHours(), 2) + ":"
		+ pad(d.getMinutes(), 2) + ":" + pad(d.getSeconds(), 2);
	let eventEntries = Object.entries(clockEvents).sort((a, b) => (a > b) ? 1 : ((a < b) ? -1 : 0));
	let i = 0;
	for (; i < eventEntries.length; i++) {
		if (eventEntries[i][0] > lastEventCheckTime)
			break;
	}

	for (; i < eventEntries.length; i++) {
		if (eventEntries[i][0] > timeString)
			break;
		eventEntries[i][1]();
	}
	lastEventCheckTime = timeString;
}

function updateClock() {
	let d = new Date();
	let timeString = pad(d.getHours(), 2) + ":"
		+ pad(d.getMinutes(), 2);
	if (isShowSeconds) {
		timeString += ":" + pad(d.getSeconds(), 2);
	}

	$("#clockValue")[0].innerText = timeString;
	checkForClockEvents();
}

function setClockFontsize(points) {
	$("#clockValue")[0].style.fontSize = `${points}pt`;
}

function startClock() {
	stopClock();
	clockUpdateLoop = setInterval(updateClock, 200);
}

function stopClock() {
	if (clockUpdateLoop != null) {
		clearInterval(clockUpdateLoop);
		clockUpdateLoop = null;
	}
}

function showSeconds() {
	isShowSeconds = true;
}

function hideSeconds() {
	isShowSeconds = false;
}
