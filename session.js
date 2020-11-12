"use strict";

class Session {
    constructor(src) {
        if (typeof (src) === "string") {
            src = getCookie(`session-${src}`);
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

        for (let noteDesc of this.description.notes) {
            let a = new Note(noteDesc);
            this.notes.push(a);
            a.onMajorEditListeners += this.handleMajorEdit;
            a.onMinorEditListeners += this.handleMinorEdit;
        }

        // this.notes.push(Note.Create(firstNoteValue, "dark"));
        // notes.push(Note.Create(secondNoteValue, "light"));
    }

    handleMinorEdit(name) {
        console.log(`Minor edit: ${name}`);
    }

    handleMajorEdit() {
        console.log(`Major edit: ${name}`);
    }

}
