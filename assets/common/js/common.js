/*--------------------------------------------------------------------
 common.js
----------------------------------------------------------------------*/

(function(window, undefined) {

  var App = {
    global: {},
    fn: {},
    ui: {},
    utils: {},
    views: {}
  };
  window.APP = App;

})(window);

(function(App, window, decument, undefined) {


/* global
------------------------------------------------------------*/

  App.global = {

  };


/* fn
------------------------------------------------------------*/

  App.fn = {

  };


/* ui
------------------------------------------------------------*/

  App.ui = {

    /**
     * プリローダー
     */
    preloader: function() {
      var $el = {};
      var $loadbar = {};
      var loadbarSpeed = 1500;
      var fadeSpeed = 500;
      var callback = null;
      var isLoading = false;
      var init = function(args) {
        callback = args.callback || null;
        setEl(args.el);
        onLoadFunction();
        setEvents();
        return this;
      };
      var setEl = function(el) {
        $el = $(el);
        $loadbar = $el.find('.js-loadbar');
        return this;
      };
      var onLoadFunction = function() {
        isLoading = true;
        $el.show();
        $loadbar.width(0);
        pageLoading();
        return this;
      };
      var pageLoading = function() {
        $loadbar.animate({
          width: '30%'
        });
        $(window).load(function() {
          $loadbar.animate({
            width: '100%'
          }, loadbarSpeed, function() {
            onLoading();
          });
        });
        return this;
      };
      var onLoading = function() {
        $el.fadeOut(fadeSpeed, function() {
          if(callback !== null) {
            callback();
          }
          isLoading = false;
        });
        return this;
      };
      var setEvents = function() {
        $(window).on('scroll', function(e) {
          if(isLoading) {
            e.preventDefault();
            onScrollHidden();
          }
        });
        return this;
      };
      var onScrollHidden = function() {
        $(window).scrollTop(0);
        return this;
      };
      return { init: init };
    },

    /**
     * 切り替えコンテンツ
     */
    switchView: function() {
      var $el = {};
      var $nav = {};
      var $navChild = {};
      var $contents = {};
      var activeNum = 0;
      var classNavActive = 'active';
      var isAnimate = false;
      var init = function(args) {
        setEl(args.el);
        onLoadFunction();
        setEvents();
        return this;
      };
      var setEl = function(el) {
        $el = $(el);
        $nav = $el.find('.js-switchViewNav');
        $navChild = $nav.children();
        $contents = $el.find('.js-switchViewContents');
        return this;
      };
      var onLoadFunction = function() {
        $contents.hide();
        $contents.eq(activeNum).show();
        $navChild.eq(activeNum).addClass(classNavActive);
        return this;
      };
      var setEvents = function() {
        var that = this;
        $navChild.on('click', function() {
          if(!isAnimate) {
            onClickNav(this);
            isAnimate = false;
          }
        });
        return this;
      };
      var onClickNav = function(target) {
        isAnimate = true;
        $contents.eq(activeNum).fadeOut();
        $navChild.eq(activeNum).removeClass(classNavActive);
        activeNum = $(target).index();
        $contents.eq(activeNum).fadeIn();
        $navChild.eq(activeNum).addClass(classNavActive);
        return this;
      };
      return { init: init };
    }

  };


/* utils
------------------------------------------------------------*/

  App.utils = {

  };


/* views
------------------------------------------------------------*/

  App.views = {

    /**
     * ベース
     */
    BaseView: (function() {
      var constructor = function() {
        this.$el = {};
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.setEl(args.el);
        this.onLoadFunction();
        this.setChildViewInstance();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        return this;
      };
      proto.onLoadFunction = function() {
        return this;
      };
      proto.setChildViewInstance = function() {
        return this;
      };
      proto.setEvents = function() {
        return this;
      };
      return constructor;
    })(),

    /**
     * ページ
     */
    PageView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$anchor = {};
        this.isAnimate = false;
        this.scrollSpeed = 500;
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(el) {
        this.setEl(el);
        this.onLoadFunction();
        this.setChildViewInstance();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$anchor = this.$el.find('a[href^="#"]');
        return this;
      };
      proto.onLoadFunction = function() {
        return this;
      };
      proto.setChildViewInstance = function() {
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        $(window).on('scroll', function() {
          if(!that.isAnimate) {
            that.onScroll($(window).scrollTop());
            that.isAnimate = false;
          }
        });
        $(window).on('resize', function() {
          that.onResize();
        });
        this.$anchor.on('click', function(e) {
          e.preventDefault();
          if(!that.isAnimate) {
            that.smoothScroll($(this).attr('href'));
            that.isAnimate = false;
          }
        });
        return this;
      };
      proto.onScroll = function(scrollTop) {
        this.isAnimate = true;
        return this;
      };
      proto.onResize = function() {
        return this;
      };
      proto.smoothScroll = function(href) {
        this.isAnimate = true;
        var $target = $(href === '#' || href === '' ? 'html' : href);
        var position = $target.offset().top;
        $('html, body').animate({
          scrollTop: position
        }, this.scrollSpeed, 'swing');
        return this;
      };
      return constructor;
    })()

  };

})(APP, window, document);