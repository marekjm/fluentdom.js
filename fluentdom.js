/** This Javascript code is free software.
 *  It is release under dual license GNU Affero Public License.
 *
 *  I, the author, do not require disclosure of the code that uses the FluentDOM library even if
 *  that would be required by the GNU Affero license.
 *  I do, however, require disclosure of all modifications made to the FluentDOM itself.
 *
 *  Copyright (c) 2014-2015 Marek Marecki
 *
 */
function FluentDOM () {
    var node = undefined;       // main node to use
    var spawned = new Array();  // array of spawned elements, if .appendChild() is called without any arguments - child is last spawned element
    var to_spawned = false;     // if this is true - instead of operating on main node, methods operate on last spawned element

    this.create = function (name) {
        /* Create element and return it.
         */
        return document.createElement(name);
    };

    this.withNode = function (nd) {
        /* Set main node to <nv>.
         */
        node = nd;
        return this;
    };

    this.toSpawned = function () {
        /* Switch context of operation from main node to last spawned element.
         */
        to_spawned = true;
        return this;
    };

    this.toNode = function () {
        /* Switch context of operation from last spawned element to main node.
         */
        to_spawned = false;
        return this;
    };

    this.spawn = function (name) {
        /* Create element with tag type <name> and push it to top of spawned elements array.
         * Changes context of operation if .toSpawned() has been called earlier.
         */
        spawned.push(document.createElement(name));
        return this;
    };

    this.appendChild = function (child) {
        /* Appends child depending on parameter and conext of operation.
         *
         * If not <child> is given and .toSpawned() has been called earlier,
         * will append last spawned element to last-but-one spawned element.
         * In such case, it can change context of operation.
         */
        if (child === undefined) {
            child = spawned.pop(spawned.length-1);
        }

        if (to_spawned) {
            spawned[spawned.length-1].appendChild(child);
        }
        else {
            node.appendChild(child);
        }
        return this;
    };

    this.appendText = function (text) {
        /* Creates and appends text node.
         * The parameter is a String.
         */
        text = document.createTextNode(text);
        if (to_spawned) {
            spawned[spawned.length-1].appendChild(text);
        }
        else {
            node.appendChild(text);
        }
        return this;
    };

    this.removeChildren = function (elem) {
        if (elem === undefined) elem = node;
        while (elem.firstChild) elem.removeChild(elem.firstChild);
        return this;
    };

    this.setClass = function (class_name) {
        if (to_spawned) spawned[spawned.length-1].className = class_name;
        else node.className = class_name;
        return this;
    };

    this.setAttr = function (key, value) {
        if (to_spawned) spawned[spawned.length-1].setAttribute(key, value);
        else node.setAttribute(key, value);
        return this;
    };

    this.setStyleRule = function (key, value) {
        var to;
        if (to_spawned) to = spawned[spawned.length-1].style;
        else to = node.style;

        to[key] = value;

        return this;
    };

    this.addEventListener = function (ev, callback) {
        var to;
        if (to_spawned) to = spawned[spawned.length-1];
        else to = node;

        to.addEventListener(ev, callback);

        return this;
    };

    this.forEach = function (array, callback) {
        array.forEach(callback.bind(this));
        return this;
    };

    this.forEachOf = function (object, callback) {
        var callback_this = callback.bind(this);
        Object.keys(object).forEach(function (key, index, array) {
            callback_this(object[key], key, object, index);
        });
        return this;
    };

    this.callIf = function (condition, call_if_true, call_if_false) {
        var callback = undefined;
        if ((callback = (condition ? call_if_true : call_if_false))) {
            callback.bind(this)();
        }
        return this;
    };

    this.setValue = function (text) {
        if (to_spawned) spawned[spawned.length-1].value = text;
        else node.value = text;
        return this;
    };

    this.clear = function () {
        /* Clear context of operation, i.e. switch it back to undefined.
         */
        node = undefined;
        spawned = new Array();
        return this;
    };

    return this;
}
