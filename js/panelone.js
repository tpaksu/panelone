;
(function($, window, document, undefined) {
    var defaults = {
        location: "left",
        container: "body",
        panelWidths: {
            'desktop': "300px",
            'small-desktop': "300px",
            'tablet': "300px",
            'phone-portrait': "80vw",
            'phone-landscape': "80vh"
        }
    };

    function panelone(element, options) {
        this.openPanels = [];
        this.options = $.extend({}, defaults, options);
        this.options.trigger = $(element);
        this._defaults = defaults;
        this.init();
    }

    panelone.prototype = {
        init: function() {
            this.appendButtonHolder();
            this.appendDeviceIndicator();
            this.bindEvents();
        },
        appendButtonHolder: function() {
            this.buttons = $("<div class='panelone-buttons'></div>")
            .appendTo(this.options.container);
            this.buttons.wrapAll("<div class='panelone-buttons-wrapper panelone-buttons-" + this.options.location + "'></div>");
        },
        appendDeviceIndicator: function() {
            if ($(".panelone-state-indicator").length === 0) {
                $("body").append("<div class='panelone-state-indicator'></div>");
            }
        },
        getDeviceState: function() {
            var indicator = $(".panelone-state-indicator").get(0);
            var index = parseInt(window.getComputedStyle(indicator).getPropertyValue('z-index'), 10);
            var states = {
                2: 'small-desktop',
                3: 'tablet',
                4: 'phone-portrait',
                5: 'phone-landscape'
            };
            console.log(states[index] || 'desktop');
            return states[index] || 'desktop';
        },
        bindEvents: function() {
            var that = this,
                panel = null;
            this.options.trigger.off("click.panelone").on("click.panelone", function() {
                panel = that.createPanel();
                that.openPanels.push(panel);
                panel.appendTo(that.options.container);
                panel.trigger("panelone:show");
                that.fixPanelClasses();
            });
            $(window).on("resize.panelone", function() {
                $(".panelone-panel").width(that.options.panelWidths[that.getDeviceState()]);
            });
        },
        fixPanelClasses: function() {
            this.buttons.empty();
            for (var panelIndex = this.openPanels.length - 1; panelIndex >= 0; panelIndex--) {
                if (this.openPanels.hasOwnProperty(panelIndex)) {
                    var panel = this.openPanels[panelIndex];
                    this.buttons.prepend("<div class='panelone-button'>" + panelIndex + "</div>");
                    panel.removeClass(function(index, className) {
                        return (className.match(/panelone-back-\d+/g) || []).join(' ');
                    }).addClass("panelone-back-" + (this.openPanels.length - panelIndex - 1));
                }
            }
        },
        createPanel: function() {
            var that = this;
            var panel = $("<div class='panelone-panel panelone-panel-" + this.options.location + "' style='width: " + this.options.panelWidths[this.getDeviceState()] + ";'>Panel #" + this.openPanels.length + "</div>");
            this.buttons.append("<div class='panelone-button'>" + this.openPanels.length + "</div>");
            var panelClose = $("<div class='panelone-close'>Close</div>").appendTo(panel);
            panelClose.on("click", function() {
                panel.trigger("panelone:hide");
            });
            panel.on("panelone:show", function() {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass("panelone-show");
                }, 0);
            }).on("panelone:hide", function() {
                var $this = $(this);
                $this.removeClass("panelone-show").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    that.openPanels.splice(that.openPanels.indexOf($this), 1);
                    $this.remove();
                    that.fixPanelClasses();
                });
            }).appendTo(this.options.container);

            return panel;
        }
    };

    $.fn.panelone = function(options) {
        return this.each(function() {
            if (!$.data(this, "panelone")) {
                $.data(this, "panelone",
                    new panelone(this, options));
            }
        });
    };
})(jQuery, window, document);
