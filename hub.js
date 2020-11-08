"use strict";

let voorbladNotesContent;
let isEditing = false;
let voorbladNotesVisible = false;
let notesVisible = true;

let defaultVoorbladNotes = `\
*Click this note to edit its content*
# Test on ...
- Put your phone on silent.
- Test starts at --:-- and ends at --:--.
- In the last 30 minutes everyone remains seated.
- Allowed material: --.

**Good luck!**`;

function onDOMReady() {
	clockUpdateLoop = null;
	isShowSeconds = false;
	//clockEvents["13:29:30"] = function () { showSeconds(); };
	//clockEvents["13:30:00"] = function () { hideSeconds(); };
	//clockEvents["13:32:00"] = function () { hideVoorbladNotes(); };
	//clockEvents["22:00:00"] = function () { showVoorbladNotes(); };

	voorbladNotesContent = defaultVoorbladNotes;
	try {
		let notes2Content = getCookie("notes2");
		if (notes2Content !== "")
			voorbladNotesContent = notes2Content;
	} catch (err) {
		console.log("Error trying to read notes2");
	}

	trySetVoorbladNotesContent(voorbladNotesContent, false);

	showVoorbladNotes();
	showNotes();

	// $("#voorbladNotesDisplay").click(function () {
	// 	startEditVoorbladNotes();
	// });

	// $("#voorbladNotesEditContent")[0].addEventListener("input", function () {
	// 	autoExpand($("#voorbladNotesEditContent")[0], $("#afterVoorbladNotesEditContent")[0]);
	// 	trySetVoorbladNotesContent($("#voorbladNotesEditContent")[0].value);
	// });

	// $("#voorbladNotesEditClose")[0].addEventListener("click", function (e) {
	// 	stopEditVoorbladNotes();
	// });

	$("body")[0].addEventListener("keydown", function (e) {
		if (!isEditing) {
			if (e.key === "f") {
				$("body")[0].requestFullscreen();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.key === "2") {
				toggleVoorbladNotes();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.key === "1") {
				toggleNotes();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.key === "r") {
				//trySetVoorbladNotesContent(defaultVoorbladNotes);
				resetNotes();
			}
		}
	});

	new Note("note1", null, true, "Test ends at --:--");
	new Note("note2", null, false, defaultVoorbladNotes);

	// new Note("noteAA", null);
	// new Note("noteBB", null, true, "BB");

	updateClock();
	startClock();
}

