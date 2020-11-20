"use strict";

class Toolbar {
    static init() {
        Toolbar.isVisible = true;
        Toolbar.isFullscreen = false;
        Toolbar.el = $("#toolbar")[0];
        Toolbar.noteCount = 0;

        $("#toggletoolbar").click(() => {
            Toolbar.toggle();
        });

        $("#toggleFullscreen").click(() => {
            Toolbar.toggleFullscreen();
        });

        $("#toggleNote1").click(() => {
            sess.toggleNote(1);
        });

        $("#toggleNote2").click(() => {
            sess.toggleNote(2);
        });

        $("#createNote").click(() => {
            if (Toolbar.noteCount < 9)
                sess.toggleNote(9);
        });
    }

    static show() {
        Toolbar.el?.classList.remove("hide");
        Toolbar.isVisible = true;
    }

    static hide() {
        Toolbar.el?.classList.add("hide");
        Toolbar.isVisible = false;
    }

    static toggle() {
        if (Toolbar.isVisible) {
            Toolbar.hide();
        } else {
            Toolbar.show();
        }
    }

    static setNoteCount(count) {
        Toolbar.noteCount = count;
        let el = $("#createNoteButtonLabel")[0];
        if (count < 9)
            el.innerText = `Create note (${count + 1})`;
        else
            el.innerText = `[Max notes reached]`;
    }

    static onFullsceenChange() {
        if (document.fullscreenElement != null) {
            Toolbar.isFullscreen = true;
            $("#toggleFullscreen .bi-fullscreen").hide();
            $("#toggleFullscreen .bi-fullscreen-exit").show();
        } else {
            Toolbar.isFullscreen = false;
            $("#toggleFullscreen .bi-fullscreen-exit").hide();
            $("#toggleFullscreen .bi-fullscreen").show();
        }
    }

    static startFullscreen() {
        $("body")[0].requestFullscreen();
        Toolbar.isFullscreen = true;
    }

    static endFullscreen() {
        document.exitFullscreen();
        Toolbar.isFullscreen = false;
    }

    static toggleFullscreen() {
        if (Toolbar.isFullscreen) {
            Toolbar.endFullscreen();
        } else {
            Toolbar.startFullscreen();
        }
    }
}
