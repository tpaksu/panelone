;
(function($, window, document, undefined) {
    var defaults = {
        location: "left",
        container: "body",
        theme: "light",
        panelWidths: {
            'desktop': "300px",
            'small-desktop': "300px",
            'tablet': "300px",
            'phone-portrait': "80vw",
            'phone-landscape': "80vh"
        }
    };

    function panelOne_instance(options) {
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this.init();
    }

    panelOne_instance.prototype = {
        init: function() {
            this.appendButtonHolder();
            this.appendPanelHolder();
            this.appendDeviceIndicator();
            this.bindEvents();
            this.checkContainerStatus();
        },
        appendButtonHolder: function() {
            this.buttons = $("<div class='panelone-buttons'></div>").appendTo(this.options.container);
            this.buttons.wrapAll("<div class='panelone-buttons-wrapper panelone-buttons-"+this.options.theme+" panelone-buttons-" + this.options.location + "'></div>");
        },
        appendPanelHolder: function() {
            this.panels = $("<div class='panelone-panels'></div>").appendTo(this.options.container);
            this.panels.wrapAll("<div class='panelone-panels-wrapper panelone-panels-"+this.options.theme+" panelone-panels-" + this.options.location + "'></div>");
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
            return states[index] || 'desktop';
        },
        bindEvents: function() {
            var that = this;
            $(window).on("resize.panelone", function() {
                $(".panelone-panel").width(that.options.panelWidths[that.getDeviceState()]);
            });
        },
        createPanel: function(icon, content) {
            var that = this;
            var panel = $("<div class='panelone-panel panelone-panel-"+this.options.theme+" panelone-panel-" + this.options.location + "' data-index=" + (this.panels.find(".panelone-panel").length + 1) +
            " style='width: " + this.options.panelWidths[this.getDeviceState()] + ";'></div>");
            panel.html(content).appendTo(this.panels);
            var button = $("<div class='panelone-button'>" + icon + "</div>").appendTo(this.buttons);
            this.checkContainerStatus();
            var panelClose = $("<div class='panelone-close'>Close</div>").prependTo(panel);
            panelClose.on("click", function() {
                panel.trigger("panelone:hide");
            });
            panel.on("panelone:show", function() {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass("panelone-show");
                    that.bringToFront(that.panels.find(".panelone-panel").index($this));
                }, 0);
            }).on("panelone:hide", function() {
                var $this = $(this);
                $this.removeClass("panelone-show").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    var index = that.panels.find(".panelone-panel").index($this);
                    var dataIndex = $this.attr("data-index");
                    that.panels.find(".panelone-panel").eq(index).remove();
                    that.buttons.find(".panelone-button").eq(index).remove();
                    // set last visible active
                    that.panels.find(".panelone-panel").filter(function(){
                        return $(this).attr("data-index") > dataIndex;
                    }).each(function(){
                        $(this).attr("data-index", +$(this).attr("data-index") - 1);
                    });
                    if(that.panels.find(".panelone-panel").length > 0){
                        var newActive = that.panels.find(".panelone-panel[data-index=1]");
                        dataIndex = that.panels.find(".panelone-panel").index(newActive);
                        newActive.addClass("panelone-active");
                        that.buttons.find(".panelone-button").removeClass("panelone-button-active").eq(dataIndex).addClass("panelone-button-active");
                    }
                    that.checkContainerStatus();
                });
            });
            button.on("click", function(){
                var index = that.buttons.find(".panelone-button").index($(this));
                that.bringToFront(index);
            });
            panel.trigger("panelone:show");
            return panel;
        },
        bringToFront: function(index){
            this.panels.find(".panelone-panel").removeClass("panelone-active").eq(index).addClass("panelone-active");
            this.buttons.find(".panelone-button").removeClass("panelone-button-active").eq(index).addClass("panelone-button-active");
            var dataIndex = this.panels.find(".panelone-active").attr("data-index");
            this.panels.find(".panelone-panel").filter(function(){
                return $(this).attr("data-index") < dataIndex;
            }).each(function(){
                $(this).attr("data-index", +$(this).attr("data-index") + 1);
            });
            this.panels.find(".panelone-active").attr("data-index", 1);
        },
        checkContainerStatus: function(){
            if(this.panels.find(".panelone-panel").length > 0){
                if(this.buttons.closest(".panelone-buttons-wrapper").hasClass("panelone-buttons-hidden")){
                    this.buttons.closest(".panelone-buttons-wrapper").removeClass("panelone-buttons-hidden");
                }
            }else{
                if(!this.buttons.closest(".panelone-buttons-wrapper").hasClass("panelone-buttons-hidden")){
                    this.buttons.closest(".panelone-buttons-wrapper").addClass("panelone-buttons-hidden");
                }
            }
        }
    };

    $.panelOne = function(options){
        return new panelOne_instance(options);
    };

})(jQuery, window, document);
