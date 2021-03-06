// Element.closest polyfill
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = initTabs;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (e) {
    e.closest || assign();
    function assign() {
        e.closest = function closest(_x2) {
            var _this = this;

            var _again = true;

            _function: while (_again) {
                var css = _x2;
                _again = false;
                if (_this.parentNode) {
                    if (_this.matches(css)) {
                        return _this;
                    } else {
                        _x2 = css;
                        _again = true;
                        continue _function;
                    }
                } else {
                    return null;
                }
            }
        };
    }
})(Element.prototype);

var Tab = (function () {
    /**
     * @param  {Tabs}   tabs   Instance of Tabs which contains this tab
     * @param  {Dom}    toggle toggle button
     * @param  {Dom}    tab    block to hide or show
     */

    function Tab(tabs, toggle, tab) {
        _classCallCheck(this, Tab);

        this.tabs = tabs;
        this.toggle = toggle;
        this.tab = tab;
        this.src = this.tab.getAttribute('data-src');
        if (this.src !== null) {
            this.hasToBeLoaded = true;
        }

        if (this.toggle.classList.contains(this.tabs.activeToggleClassName)) {
            this.open();
        } else {
            this.close();
        }
        this.init();
    }

    _createClass(Tab, [{
        key: 'init',
        value: function init() {
            this.open = this.open.bind(this); // needed for removeEventListener
            this.toggle.addEventListener('click', this.open);
        }
    }, {
        key: 'load',
        value: function load() {
            var _this2 = this;

            // @todo: use fetch() function
            var xhr = new XMLHttpRequest();
            this.hasToBeLoaded = false;
            xhr.open('GET', encodeURI(this.src));
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 304) {
                    _this2.tab.innerHTML = xhr.responseText;
                } else {
                    _this2.hasToBeLoaded = true;
                }
            };
            xhr.onerror = function (error) {
                console.error(error);
            };
            xhr.send();
        }
    }, {
        key: 'open',
        value: function open() {
            if (this.tabs.active === this) {
                // already open
                return;
            }
            if (this.hasToBeLoaded) {
                this.load();
            }
            if (this.tabs.active) {
                this.tabs.active.close();
            }
            this.tabs.active = this;
            this.tab.style.display = 'block';
            this.toggle.classList.add(this.tabs.activeToggleClassName);
        }
    }, {
        key: 'close',
        value: function close() {
            this.tab.style.display = 'none';
            this.toggle.classList.remove(this.tabs.activeToggleClassName);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.toggle.removeEventListener('click', this.open);
        }
    }]);

    return Tab;
})();

var Tabs = (function () {
    function Tabs(container) {
        var blockClassName = arguments.length <= 1 || arguments[1] === undefined ? 'tabs' : arguments[1];

        _classCallCheck(this, Tabs);

        this.container = container;
        this.setClassNames(blockClassName);
        this.init();
    }

    /**
     * iterates through all matched blocks and initializes tabs classes
     * @param  {String} config selector for tabs
     * @param  {Object} config {
     *                             selector: selector for tabs
     *                             blockClassName: block className (read more about _bem)
     *                         }
     */

    _createClass(Tabs, [{
        key: 'init',
        value: function init() {
            var _this3 = this;

            var filter = function filter(element) {
                return element.closest('.' + _this3.blockClassName) === _this3.container;
            };
            this.toggles = Array.from(this.container.querySelectorAll(this.toggleSelector)).filter(filter);
            this.tabs = Array.from(this.container.querySelectorAll(this.tabSelector)).filter(filter);
            this.initedTabs = [];
            if (!this.isEverythingOk()) {
                return;
            }

            for (var index = 0; index < this.toggles.length; index++) {
                var tab = new Tab(this, this.toggles[index], this.tabs[index]);
                this.initedTabs.push(tab);
            }
        }

        /**
         * Initializes classes and selectors for blocks
         * @param {String} blockClassName 'tabs' by default
         */
    }, {
        key: 'setClassNames',
        value: function setClassNames(blockClassName) {
            this.blockClassName = blockClassName;
            this.toggleSelector = '.' + blockClassName + '__toggle';
            this.tabSelector = '.' + blockClassName + '__tab';
            this.activeToggleClassName = blockClassName + '__toggle_active';
        }
    }, {
        key: 'isEverythingOk',
        value: function isEverythingOk() {
            if (this.toggles.length !== this.tabs.length) {
                console.warn('Tabs toggles and tabs amounts are not matching');
                return false;
            } else if (this.toggles.length === 0) {
                console.warn('There\'s no toggles for tabs');
                return false;
            } else if (this.tabs.length === 0) {
                console.warn('There\'s no content tabs');
                return false;
            }
            return true;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var tab;
            while (tab = this.initedTabs.pop()) {
                tab.destroy();
            }
        }
    }]);

    return Tabs;
})();

exports.Tabs = Tabs;

function initTabs(config) {
    var selector;
    if (typeof config === 'string') {
        selector = config;
    } else {
        var selector = config.selector;
        var blockClassName = config.blockClassName;
        // doesn't work without 'var'
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = document.querySelectorAll(selector)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var container = _step.value;

            var tabs = new Tabs(container, blockClassName);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}