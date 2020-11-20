"use strict";

class Toolbar {
    static init() {
        Toolbar.isVisible = true;
        Toolbar.isFullscreen = false;
        Toolbar.el = $("#toolbar")[0];

        $("#toggletoolbar").click(() => {
            Toolbar.toggle();
        });

        $("#toggleFullscreen").click(() => {
            Toolbar.toggleFullscreen();
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
