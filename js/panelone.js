; (function ($, window, document, undefined) {
    var defaults = {
        location: "left",
        container: "body",
        openPanels: [],
        panelWidth: "80vw"
    };

    function panelone(element, options) {
        this.options = $.extend({}, defaults, options);
        this.options.trigger = $(element);
        this._defaults = defaults;
        this.init();
    }

    panelone.prototype = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            var that = this;
            this.options.trigger.off("click.panelone").on("click.panelone", function () {
                if (that.options.openPanels.length == 0) {
                    var panel = that.createPanel();
                    that.options.openPanels.push(panel);
                    panel.appendTo(that.options.container);
                    panel.trigger("panelone:show");
                } else {
                    var panel = that.options.openPanels.pop();
                    panel.trigger("panelone:hide");
                }
            });
        },
        createPanel: function () {
            var that = this;
            var panel = $("<div class='panelone-panel' style='width: " + this.options.panelWidth + ";'>Panel #" + this.options.openPanels.length + "</div>");
            var panelClose = $("<div class='panelone-close'>Close</div>").appendTo(panel);
            panelClose.on("click", function(){
                panel.trigger("panelone:hide");
                that.options.openPanels.splice(that.options.openPanels.indexOf(panel), 1);
            });
            panel.on("panelone:show", function () {
                var $this = $(this);
                setTimeout(function () {
                    $this.addClass("panelone-show");
                }, 0);
            }).on("panelone:hide", function () {
                var $this = $(this);
                $this.removeClass("panelone-show").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                    $this.remove();
                });
            }).appendTo(this.options.container);

            return panel;
        }
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
