"use strict";

// Source: https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

// Source: https://www.w3schools.com/js/js_cookies.asp
// Modified
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    let cookieString = cname + "=" + window.btoa(cvalue) + ";" + expires + ";samesite=lax;path=/";
    //console.log("setting cookie: " + cookieString);
    document.cookie = cookieString;
    //cname + "=" + cvalue + ";" + expires + ";SameSite:strict;path=/";
}

// Source: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            //console.log("decoding " + c.substring(name.length, c.length));
            return window.atob(c.substring(name.length, c.length));
        }
    }
    return null;
}

let instantiationIndex = 0;

function createTemplateInstance(template, container, activeOnAdd = false) {
    let el;
    if (typeof (template) == "string") {
        el = $(`#${template}`)[0].cloneNode(true);
    } else {
        el = template.cloneNode(true);
    }

    let modifyNodes = $("[id]", el).toArray();
    if (el.hasAttribute("id"))
        modifyNodes.push(el);

    for (let modifyNode of modifyNodes) {
        let origID = modifyNode.getAttribute("id");
        modifyNode.setAttribute("data-id", origID);
        let newID = origID + "-" + instantiationIndex.toString();
        instantiationIndex += 1;
        modifyNode.setAttribute("id", newID);
        modifyNode.id = newID;

        $(`[marker-end=\"url(#${origID})\"]`).attr("marker-end", `url(#${newID})`);
        $(`[href=\"#${origID}\"]`).attr("href", `#${newID}`);
        $(`[for=\"${origID}\"]`).attr("for", `${newID}`);
    }

    if (!activeOnAdd)
        el.classList.add("template-staging");
    el.classList.remove("template");
    if (container != null)
        container.appendChild(el);
    return el;
}

function activateTemplateInstance(el) {
    el.classList.remove("template-staging");
}


// Source: https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/
// Modified
var autoExpand = function (field, heightHolder) {
    if (heightHolder != null)
        heightHolder.style.height = field.style.height;

    // Reset field height
    field.style.height = 'inherit';

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';

    if (heightHolder != null)
        heightHolder.style.height = "0px";
};

// Source: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
// by Mark Amery
/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
