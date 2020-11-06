"use strict";

class Note {
    constructor(content, isDark = false) {
        this.el = createTemplateInstance("noteComponent", $("#componentContainer")[0], false);

        this.display = {};
        this.display.el = $("[data-id=\"noteDisplay\"]", this.el)[0];
        this.display.raw = content;
        this.display.el.innerHTML = this.display.raw;

        this.edit = {};
        this.edit.el = $("[data-id=\"noteEdit\"]", this.el)[0];
        this.edit.raw = {}
        this.edit.raw.value = this.display.raw;
        this.edit.raw.el = $("[data-id=\"noteEditRaw\"]", this.edit.el)[0];

        this.card = {};
        this.card.el = $("[data-id=\"noteCard\"]", this.el)[0];
        this.card.currentStyle = "light";

        if (isDark)
            this.setDark();
        this.bindListeners();
        activateTemplateInstance(this.el);
    }

    bindListeners() {
        const that = this;

        this.display.el.addEventListener("click", function () {
            that.startEdit();
        });

        this.edit.raw.el.addEventListener("input", function () {
            autoExpand(that.edit.raw.el);
            that.setRaw(that.edit.raw.el.value);
        });

        $("[data-id=\"noteEditClose\"]", this.edit.el)[0].addEventListener("click", function (e) {
            that.stopEdit();
        });
    }

    startEdit() {
        isEditing = true;
        this.edit.raw.el.value = this.edit.raw.value;
        this.edit.el.classList.remove("hide");
        autoExpand(this.edit.raw.el);
    }

    stopEdit() {
        this.edit.el.classList.add("hide");
        //console.log($("#voorbladNotesEdit")[0].classList);
        isEditing = false;
    }

    setRaw(val, save = true) {
        try {
            let newDisplay = marked(val);
            this.edit.raw.value = val;
            this.display.raw = this.edit.raw.value;
            this.display.el.innerHTML = newDisplay;

            if (save !== false)
                setCookie("placeholdername", this.edit.raw.value, 1);//36500);

            return true;
        } catch (err) {
            return false;
        }
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


