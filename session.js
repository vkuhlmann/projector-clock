"use strict";

class Session {
    static GetAllCookieNames() {
        let pairs = document.cookie.split(';');
        let dict = {};

        let reg = /^\s*(session-([^\s=]*))\s*=\s*([^\s]*)\s*$/;
        for (let p of pairs) {
            let m = p.match(reg);
            if (m == null)
                continue;
            dict[m[1]] = m[3];
        }
        return Object.keys(dict);
    }

    constructor(src, saveHandler = null) {
        this.saveHandler = saveHandler;
        this.saveName = `session-${pad(Math.floor(Math.random() * 1000), 4)}`;
        this.isStored = false;

        if (typeof (src) === "string") {
            this.saveName = `session-${src}`;
            src = getCookie(this.saveName);
            if (src == null) {
                src = {};
            } else {
                src = JSON.parse(src);
                this.isStored = true;
            }
        }
        //this.friendlyName = this.saveName;

        // let firstNoteValue = getCookie("markdown-note1");
        // if (firstNoteValue === "")
        //     firstNoteValue = "Test ends at --:--";
        // let secondNoteValue = getCookie("markdown-note2");
        // if (secondNoteValue === "")
        //     secondNoteValue = note2cont;

        this.description = {
            clock: {
                fontSize: "auto"
            },
            notes: [
                {
                    markdown: "Test ends at --:--",
                    theme: "dark",
                    display: true
                },
                {
                    markdown: defaultVoorbladNotes,
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

        this.friendlyName = friendlyNames[this.saveName] ?? this.friendlyName ?? this.saveName ?? "Untitled";

        setCurrentSessionName(this.friendlyName);

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
