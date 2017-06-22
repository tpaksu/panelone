; (function ($, window, document, undefined) {
    var defaults = {
        location: "left"
    };

    function panelone(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this.init();
    }

    panelone.prototype = {
        init: function () {

        },
    };

    $.fn["panelone"] = function (options) {
        return this.each(function () {
            if (!$.data(this, "panelone")) {
                $.data(this, "panelone",
                    new panelone(this, options));
            }
        });
    };
})(jQuery, window, document);
