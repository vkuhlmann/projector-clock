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

        this.setRaw(content, false);

        if (isDark)
            this.setDark();
        this.bindListeners();

        this.isVisible = true;
        this.isEditMode = false;

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

        $("[data-id=\"selectNoteThemeLight\"]", this.edit.el)[0].addEventListener("click", function (e) {
            that.setLight();
        });

        $("[data-id=\"selectNoteThemeDark\"]", this.edit.el)[0].addEventListener("click", function (e) {
            that.setDark();
        });
    }

    startEdit() {
        currentEditNote?.stopEdit();
        currentEditNote = this;

        this.isEditMode = true;
        this.edit.raw.el.value = this.edit.raw.value;
        this.edit.el.classList.remove("hide");
        autoExpand(this.edit.raw.el, this.edit.heightKeeper.el);
    }

    stopEdit() {
        this.edit.el.classList.add("hide");

        this.isEditMode = false;
        if (currentEditNote === this)
            currentEditNote = null;
    }

    save() {
        this.setRaw(this.edit.raw.value, true);
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
        if (this.card.currentStyle !== newStyle) {
            this.card.el.classList.add(`${newStyle}card`);
            if (this.card.currentStyle != null)
                this.card.el.classList.remove(`${this.card.currentStyle}card`);
        }
        this.card.currentStyle = newStyle;
        let friendlyName = this.card.currentStyle;
        if (friendlyName === "light")
            friendlyName = "Light";
        if (friendlyName === "dark")
            friendlyName = "Dark";
        $("[data-id=\"noteThemeSelected\"]", this.edit.el)[0].innerHTML = friendlyName;
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

function resetNotes() {
    trySetVoorbladNotesContent(defaultVoorbladNotes, false);
    let cookieVal = getCookie("notes2");
    if (cookieVal !== "")
        setCookie("notes2", "", -1);
}
