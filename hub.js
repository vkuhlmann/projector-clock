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
let currPresent;

function addSessionChoice(src, friendlyName) {
    let el = htmlToElement(`\
    <button class="dropdown-item" data-id="selectSession" data-value="${(src instanceof Session) ? "" : src}">
        ${friendlyName}
    </button>\
    `);

    $("#sessionSelections")[0].insertAdjacentElement("beforeend", el);
    el.addEventListener("click", function () {
        setSession(src);
    });

    //     $("#sessionSelections")[0].insertAdjacentHTML("beforeend",
    //         `\
    // <button class="dropdown-item" data-id="selectSession" data-value="${name}">
    //     ${friendlyName}
    // </button>`
    //     );
}

function setSession(src) {
    if (!(src instanceof Session))
        src = new Session(src);

    sess = src;
    if (sess != null)
        sess.startPresent();
}

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
                sess.stopPresent();
                //resetNotes();
            } else if (e.key === "t") {
                sess.startPresent();
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
    let sess1 = new Session("1");
    let sess2 = new Session("2");
    let sess3 = new Session("3");
    sess1.notes = [Note.Create("Hey!"), Note.Create("Daar!")];
    sess2.notes = [Note.Create("Hier maar een enkel kader.")];

    addSessionChoice(sess1, "Session 1");
    addSessionChoice(sess2, "Session 2");
    addSessionChoice(sess3, "Session 3");

    sess = new Session("demo");

    sess.startPresent();

    updateClock();
    startClock();
}
