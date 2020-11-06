"use strict";

class Note {
	constructor(content, isDark = false) {
		this.el = createTemplateInstance("noteComponent", $("#componentContainer")[0], false);
		this.content = {};
		this.content.el = $("[data-id=\"noteContent\"]", this.el)[0];
		this.content.raw = content;
		this.content.el.innerHTML = this.content.raw;

		this.card = {};
		this.card.el = $("[data-id=\"noteCard\"]", this.el)[0];
		this.card.currentStyle = "light";

		if (isDark)
			this.setDark();
		activateTemplateInstance(this.el);
	}

	setStyle(name) {
		let newStyle = name;
		this.card.el.classList.add(`${newStyle}card`);
		if (this.card.currentStyle != null)
			this.card.el.classList.remove(`${this.card.currentStyle}card`);
		this.card.currentStyle = newStyle;
	}

	setDark() {
		this.setStyle("dark");
	}

	setLight() {
		this.setStyle("light");
	}
}


function showNotes(style) {
	return;
	switch (style) {
		case "light": {
			$("#notesCard")[0].classList.add("lightcard");
			$("#notesCard")[0].classList.remove("darkcard");
			break;
		}
		case "dark": {
			$("#notesCard")[0].classList.add("darkcard");
			$("#notesCard")[0].classList.remove("lightcard");
			break;
		}

		default: {

		}
	}

	$("#notesComponent")[0].classList.remove("hide");
	notesVisible = true;
}

function hideNotes() {
	return;
	$("#notesComponent")[0].classList.add("hide");
	notesVisible = false;
}

function showVoorbladNotes(style) {
	switch (style) {
		case "light": {
			$("#voorbladNotesCard")[0].classList.add("lightcard");
			$("#voorbladNotesCard")[0].classList.remove("darkcard");
			break;
		}
		case "dark": {
			$("#voorbladNotesCard")[0].classList.add("darkcard");
			$("#voorbladNotesCard")[0].classList.remove("lightcard");
			break;
		}

		default: {

		}
	}

	$("#voorbladNotesComponent")[0].classList.remove("hide");
	voorbladNotesVisible = true;
}

function hideVoorbladNotes() {
	$("#voorbladNotesComponent")[0].classList.add("hide");
	voorbladNotesVisible = false;
}

function toggleVoorbladNotes() {
	if (voorbladNotesVisible)
		hideVoorbladNotes();
	else
		showVoorbladNotes();
}


function toggleNotes() {
	if (notesVisible)
		hideNotes();
	else
		showNotes();
}

function getNotes() {
	return $("#notes")[0].innerHTML;
}

function setNotes(value) {
	$("#notes")[0].innerHTML = value;
}

function resetNotes() {
	trySetVoorbladNotesContent(defaultVoorbladNotes, false);
	let cookieVal = getCookie("notes2");
	if (cookieVal !== "")
		setCookie("notes2", "", -1);
}

function startEditVoorbladNotes() {
	isEditing = true;
	$("#voorbladNotesEditContent")[0].value = voorbladNotesContent;
	$("#voorbladNotesEdit")[0].classList.remove("hide");
	autoExpand($("#voorbladNotesEditContent")[0]);
}

function stopEditVoorbladNotes() {
	$("#voorbladNotesEdit")[0].classList.add("hide");
	//console.log($("#voorbladNotesEdit")[0].classList);
	isEditing = false;
}

function trySetVoorbladNotesContent(val, save = true) {
	try {
		let newDisplay = marked(val);
		voorbladNotesContent = val;
		$("#voorbladNotesDisplay")[0].innerHTML = newDisplay;

		if (save !== false)
			setCookie("notes2", voorbladNotesContent, 36500);

		return true;
	} catch (err) {
		return false;
	}
}


