"use strict";

class Session {
    constructor(src, saveHandler = null) {
        this.saveHandler = saveHandler;
        this.saveName = `session-${pad(Math.floor(Math.random() * 1000), 4)}`;

        if (typeof (src) === "string") {
            this.saveName = `session-${src}`;
            src = getCookie(this.saveName);
            if (src === "") {
                src = {};
            } else {
                src = JSON.parse(src);
            }
        }

        let firstNoteValue = getCookie("markdown-note1");
        if (firstNoteValue === "")
            firstNoteValue = "Test ends at --:--";
        let secondNoteValue = getCookie("markdown-note2");
        if (secondNoteValue === "")
            secondNoteValue = note2cont;

        this.description = {
            clock: {
                fontSize: "auto"
            },
            notes: [
                {
                    markdown: firstNoteValue,
                    theme: "dark",
                    display: true
                },
                {
                    markdown: secondNoteValue,
                    theme: "light",
                    display: true
                }
            ]
        };

        Object.assign(this.description, src);

        this.notes = [];

        const session = this;

        for (let noteDesc of this.description.notes) {
            let a = new Note(noteDesc, false);
            this.notes.push(a);
            a.onMajorEditListeners.push(function(name){session.handleMajorEdit(name)});
            a.onMinorEditListeners.push(function(name){session.handleMinorEdit(name)});
        }

        // this.notes.push(Note.Create(firstNoteValue, "dark"));
        // notes.push(Note.Create(secondNoteValue, "light"));
    }

    startPresent() {
        currPresent?.stopPresent();
        for (let l of this.notes) {
            l.addSelf();
        }
        currPresent = this;
    }

    stopPresent() {
        if (currPresent === this) {
            for (let l of this.notes) {
                l.removeSelf();
            }
            currPresent = null;
        }
    }

    getDescription() {
        let newNotesDesc = [];
        for (let n of this.notes) {
            newNotesDesc.push(n.getDescription());
        }
        this.description.notes = newNotesDesc;
        return this.description;
    }

    save() {
        //debugger;
        if (this.saveHandler != null) {
            this.saveHandler(this);
            return;
        }
        let desc = this.getDescription();
        let descString = JSON.stringify(desc);
        setCookie(this.saveName, descString, 36500);
    }

    handleMinorEdit(name) {
        //console.log(`Minor edit: ${name}`);
    }

    handleMajorEdit(name) {
        //console.log(`Major edit: ${name}`);
        this.save();
    }
}
