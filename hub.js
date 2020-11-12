"use strict";

let currentEditNote = null;

let defaultVoorbladNotes = `\
*Click this note to edit its content*
# Test on ...
- Put your phone on silent.
- Test starts at --:-- and ends at --:--.
- In the last 30 minutes everyone remains seated.
- Allowed material: --.

**Good luck!**`;

let note2cont;

let sess;

function onDOMReady() {
    clockUpdateLoop = null;
    isShowSeconds = false;
    //clockEvents["13:29:30"] = function () { showSeconds(); };
    //clockEvents["13:30:00"] = function () { hideSeconds(); };
    //clockEvents["13:32:00"] = function () { hideVoorbladNotes(); };
    //clockEvents["22:00:00"] = function () { showVoorbladNotes(); };

    $("body")[0].addEventListener("keydown", function (e) {
        if (currentEditNote == null) {
            if (e.key === "f") {
                $("body")[0].requestFullscreen();
                e.preventDefault();
                e.stopPropagation();
            } else if (e.key === "2") {
                if (1 in sess.notes) {
                    sess.notes[1].toggleVisible();
                    e.preventDefault();
                    e.stopPropagation();
                }

            } else if (e.key === "1") {
                if (0 in sess.notes) {
                    sess.notes[0].toggleVisible();
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else if (e.key === "r") {
                //resetNotes();
            }
        }
    });

    note2cont = getCookie("notes2");
    let isOldCookieExists = note2cont !== "";

    if (!isOldCookieExists)
        note2cont = defaultVoorbladNotes;

    //notes.push(new Note("note1", null, true, "Test ends at --:--"));
    //notes.push(new Note("note2", null, false, note2cont));

    // let firstNoteValue = getCookie("markdown-note1");
    // if (firstNoteValue === "")
    //     firstNoteValue = "Test ends at --:--";
    // let secondNoteValue = getCookie("markdown-note2");
    // if (secondNoteValue === "")
    //     secondNoteValue = note2cont;

    // notes.push(Note.Create(firstNoteValue, "dark"));
    // notes.push(Note.Create(secondNoteValue, "light"));

    // if (isOldCookieExists) {
    //     notes[1].save();
    //     setCookie("notes2", "", -1);
    // }

    //debugger;
    sess = new Session("demo");

    updateClock();
    startClock();
}
