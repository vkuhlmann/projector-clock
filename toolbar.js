"use strict";

class Toolbar {
    static init() {
        Toolbar.isVisible = true;
        Toolbar.el = $("#toolbar")[0];

        $("#toggletoolbar").click(() => {
            Toolbar.toggle();
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
}
