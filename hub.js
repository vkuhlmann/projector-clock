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

let sess;
let currPresent;

let friendlyNames = {};
let sessionList = [];

function addSessionChoice(src, friendlyName = null) {
    if (friendlyName == null) {
        if (src instanceof Session)
            friendlyName = friendlyNames[src?.saveName] ?? src?.saveName ?? "Untitled";
        else
            friendlyName = friendlyNames[src] ?? src;
    }

    let el = htmlToElement(`\
<button class="dropdown-item" data-id="selectSession" data-value="${(src instanceof Session) ? src.saveName : src}">
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

function removeSessionChoice(src) {
    if (src instanceof Session)
        src = src.saveName;
    let el = $(`#sessionSelections [data-id=\"selectSession\"][data-value=\"${src}\"]`).toArray();
    if (el.length == 0)
        return false;
    el[0].remove();
    return true;
}

function removeAllSessionChoices() {
    let els = $(`#sessionSelections [data-id=\"selectSession\"]`).toArray();
    for (let el of els) {
        el.remove();
    }
}

function setSession(src) {
    if (!(src instanceof Session))
        src = new Session(src);

    sess = src;
    if (sess != null) {
        sess.startPresent();
        setCookie("lastSession", sess.saveName ?? "", 36500, true);
    }
}

function setCurrentSessionName(n) {
    $("#selectedSession")[0].innerText = n;
}

function createSession() {
    let num = 1;
    let cookieNames = Session.GetAllCookieNames();

    for (; num < 1000; num++) {
        if (!(`session-${num}` in friendlyNames) && !(cookieNames.includes(`session-${num}`)))
            break;
    }

    let newSession = new Session(`session-${num}`);

    //    sess2.notes = [Note.Create("Hey!"), Note.Create("Daar!")];
    //    sess3.notes = [Note.Create("Hier maar een enkel kader.")];

    //    friendlyNames[sess1.saveName] = "Session 1";
    //    friendlyNames[sess2.saveName] = "Session 2";
    //    friendlyNames[sess3.saveName] = "Session 3";

    friendlyNames[newSession.saveName] = `Session ${num}`;
    addSessionChoice(newSession);
    setSession(newSession);

    saveSessionList();
}

function saveSessionList() {
    saveObject("sessionList", sessionList);
    saveObject("friendlyNames", friendlyNames);
}

function loadSessionList() {
    sessionList = loadObject("sessionList") ?? [];

    Object.assign(friendlyNames, loadObject("friendlyNames") ?? {});

    for (let cookieName of Session.GetAllCookieNames()) {
        if (!(sessionList.includes(cookieName)))
            sessionList.push(cookieName);
        friendlyNames[cookieName] = friendlyNames[cookieName] ?? cookieName;
    }

    removeAllSessionChoices();
    for (let s of sessionList) {
        addSessionChoice(s);
    }
}

function onFullscreenChange(event) {
    Toolbar.onFullsceenChange();
}

function onFullscreenError(event) {
    alert("Browser doesn't allow switching into fullscreen =/");
}

function onDOMReady() {
    clockUpdateLoop = null;
    isShowSeconds = false;
    //clockEvents["13:29:30"] = function () { showSeconds(); };
    //clockEvents["13:30:00"] = function () { hideSeconds(); };
    //clockEvents["13:32:00"] = function () { hideVoorbladNotes(); };
    //clockEvents["22:00:00"] = function () { showVoorbladNotes(); };

    document.onfullscreenchange = onFullscreenChange;
    document.onfullscreenerror = onFullscreenError;

    $("body")[0].addEventListener("keydown", function (e) {
        if (currentEditNote == null) {
            if (e.key === "f") {
                Toolbar.toggleFullscreen();
                // $("body")[0].requestFullscreen();
                // e.preventDefault();
                // e.stopPropagation();
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
            // } else if (e.key === "r") {
            //     sess.stopPresent();
            //     //resetNotes();
            // } else if (e.key === "t") {
            //     sess.startPresent();
            } else if (e.key === "h") {
                Toolbar.toggle();
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

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

    // let demoSess = new Session("session-demo");
    // if (demoSess.isStored) {
    //     friendlyNames[demoSess.saveName] = "Demo session";
    //     addSessionChoice(demoSess);
    // }

    // let sess1 = new Session("session-1");
    // // let sess2 = new Session("2");
    // // let sess3 = new Session("3");
    // // sess2.notes = [Note.Create("Hey!"), Note.Create("Daar!")];
    // // sess3.notes = [Note.Create("Hier maar een enkel kader.")];

    // friendlyNames[sess1.saveName] = "Session 1";
    // // friendlyNames[sess2.saveName] = "Session 2";
    // // friendlyNames[sess3.saveName] = "Session 3";

    //addSessionChoice(sess1);
    // addSessionChoice(sess2);
    // addSessionChoice(sess3);

    loadSessionList();
    let reloadSessions = false;

    let legacyNotes2 = getCookie("notes2");

    if (legacyNotes2 != null) {
        let legacySess = new Session("session-legacy1");
        friendlyNames[legacySess.saveName] = "Legacy 1";
        legacySess.notes = [Note.Create("Test ends at --:--", "dark"), Note.Create(legacyNotes2, "light")];
        legacySess.save();
        reloadSessions = true;
    }

    let legacyMarkdown1 = getCookie("markdown-note1");
    let legacyMarkdown2 = getCookie("markdown-note2");

    if (legacyMarkdown1 != null || legacyMarkdown2 != null) {
        let legacySess = new Session("session-legacy2");
        friendlyNames[legacySess.saveName] = "Legacy 2";
        legacySess.notes = [Note.Create(legacyMarkdown1 ?? "Test ends at --:--", "dark"), Note.Create(legacyMarkdown2, "light")];
        legacySess.save();
        reloadSessions = true;
    }

    if (sessionList.length == 0)
        createSession();

    let lastSession = getCookie("lastSession");
    if (lastSession != null && sessionList.includes(lastSession))
        setSession(lastSession);
    else
        setSession(sessionList[0]);

    if (sessionList.includes("session-demo"))
        friendlyNames["session-demo"] = friendlyNames["session-demo"] ?? "Demo session";

    saveSessionList();
    if (reloadSessions)
        loadSessionList();

    $("#createSession").click(createSession);

    //sess1.startPresent();

    updateClock();
    startClock();

    Toolbar.init();
}
