"use strict";

class Note {
    constructor(name, content, isDark = false, defaultContent = null) {
        this.name = name;
        this.el = createTemplateInstance("noteComponent", $("#componentContainer")[0], false);

        this.defaultContent = defaultContent ?? content ?? "Empty";
        if ((content == null || content === "") && this.name != null)
            content = getCookie(`markdown-${this.name}`);

        if (content == null || content === "")
            content = this.defaultContent;

        this.display = {};
        this.display.el = $("[data-id=\"noteDisplay\"]", this.el)[0];
        //this.display.raw = content;
        //this.display.el.innerHTML = this.display.raw;

        this.edit = {};
        this.edit.el = $("[data-id=\"noteEdit\"]", this.el)[0];
        this.edit.raw = {}
        //this.edit.raw.value = this.display.raw;
        this.edit.raw.el = $("[data-id=\"noteEditRaw\"]", this.edit.el)[0];

        this.edit.heightKeeper = {};
        this.edit.heightKeeper.el = $("[data-id=\"noteEditHeightKeeper\"]", this.edit.el)[0];

        this.card = {};
        this.card.el = $("[data-id=\"noteCard\"]", this.el)[0];
        this.card.currentStyle = "light";

        this.setRaw(content);

        if (isDark)
            this.setDark();
        this.bindListeners();

        this.isVisible = true;
        activateTemplateInstance(this.el);
    }

    bindListeners() {
        const that = this;

        this.display.el.addEventListener("click", function () {
            that.startEdit();
        });

        this.edit.raw.el.addEventListener("input", function () {
            autoExpand(that.edit.raw.el, that.edit.heightKeeper.el);
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
        autoExpand(this.edit.raw.el, this.edit.heightKeeper.el);
    }

    stopEdit() {
        this.edit.el.classList.add("hide");
        isEditing = false;
    }

    setRaw(val, save = true) {
        try {
            let newDisplay = marked(val);
            this.edit.raw.value = val;
            this.display.raw = this.edit.raw.value;
            this.display.el.innerHTML = newDisplay;

            if (save !== false && this.name != null)
                setCookie(`markdown-${this.name}`, this.edit.raw.value, 36500);

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

    show() {
        this.el.classList.remove("hide");
        this.isVisible = true;
    }

    hide() {
        this.el.classList.add("hide");
        this.isVisible = false;
    }

    toggleVisible() {
        if (this.isVisible)
            this.hide();
        else
            this.show();
    }
}

function showVoorbladNotes(style) {
    return;

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
    return;

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
    autoExpand($("#voorbladNotesEditContent")[0], $("#afterVoorbladNotesEditContent")[0]);
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


