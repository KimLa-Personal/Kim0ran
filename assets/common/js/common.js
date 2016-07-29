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
    preloader: (function() {
      var constructor = function(args) {
        this.$el = {};
        this.$loadber = {};
        this.callback = {};
        this.loadberSpeed = 500;
        this.fadeSpeed = 500;
        this.isLoading = false;
        this.init(args);
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.callback = args.callback || null;
        this.setEl(args.el);
        this.onLoadFunction();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$loadber = this.$el.find('.js-loadbar');
        return this;
      };
      proto.onLoadFunction = function() {
        this.isLoading = true;
        this.$el.show();
        this.$loadber.css({ width: 0 });
        this.pageLoad();
        return this;
      };
      proto.pageLoad = function() {
        var that = this;
        this.$loadber.animate({ width: '30%' });
        $(window).load(function() {
          that.$loadber.animate({
            width: '100%'
          }, that.loadberSpeed, function() {
            that.onLoad();
          });
        });
        return this;
      };
      proto.onLoad = function() {
        var that = this;
        this.$el.fadeOut(this.fadeSpeed, function() {
          if(that.callback !== null) {
            that.callback();
          }
          that.isLoading = false;
        });
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        $(window).on('scroll', function(e) {
          if(that.isLoading) {
            e.preventDefault();
            that.onScroll();
          }
        });
        return this;
      };
      proto.onScroll = function() {
        $(window).scrollTop(0);
        return this;
      };
      return constructor;
    })(),

    /**
     * モーダル
     */
    modal: (function() {
      var constructor = function(args) {
        this.$el = {};
        this.$clone = {};
        this.$modal = {};
        this.$modalBtnOpen = {};
        this.$modalBtnClose = {};
        this.$modalMain = {};
        this.fadeSpeed = 500;
        this.isOpen = true;
        this.isAnimate = false;
        this.init(args);
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.setEl(args.el);
        this.render();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$modalBtnOpen = this.$el.find('.js-modalBtnOpen');
        this.$clone = this.$el.find('.js-modalClone');
        return this;
      };
      proto.render = function() {
        var that = this;
        var tmpl = [];
        tmpl.push('<div class="modal js-modal">');
        tmpl.push('  <div class="modal-inner">');
        tmpl.push('    <div class="modal-btnClose js-modalBtnClose">閉じる</div>');
        tmpl.push('    <div class="modal-main js-modalMain"></div>');
        tmpl.push('  </div>');
        tmpl.push('</div>');
        $('body').append(tmpl.join('')).promise().done(function() {
          that.onRender();
        });
        return this;
      };
      proto.onRender = function() {
        this.onRenderSetEl();
        this.setClone();
        return this;
      };
      proto.onRenderSetEl = function() {
        this.$modal = $('.js-modal');
        this.$modalBtnClose = this.$modal.find('.js-modalBtnClose');
        this.$modalMain = this.$modal.find('.js-modalMain');
        return this;
      };
      proto.setClone = function() {
        var that = this;
        this.$modalMain.append(this.$clone.clone()).promise().done(function() {
          that.open();
          that.isAnimate = false;
          that.isOpen = true;
        });
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        this.$btnClose.off('click').on('click', function() {
          if(that.isOpen) {
            that.close();
            that.isAnimate = false;
            that.isOpen = false;
          }
        });
        return this;
      };
      proto.open = function() {
        var that = this;
        this.isAnimate = true;
        this.$modal.fadeIn(this.fadeSpeed);
        return this;
      };
      proto.close = function() {
        var that = this;
        this.isAnimate = true;
        this.$modal.fadeOut(this.fadeSpeed, function() {
          that.$modal.remove();
        });
        return this;
      };
      return constructor;
    })(),

    /**
     * 切り替えコンテンツ
     */
    switchContents: (function() {
      var constructor = function(el) {
        this.$el = {};
        this.$nav = {};
        this.$navChild = {};
        this.$contents = {};
        this.isShowNum = 0;
        this.fadeSpeed = 500;
        this.isAnimate = false;
        this.init(el);
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(el) {
        this.setEl(el);
        this.onLoadFunction();
        this.setEvents();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$nav = this.$el.find('.js-switchContentsNav');
        this.$navChild = this.$nav.children();
        this.$contents = this.$el.find('.js-switchContentsMain');
        return this;
      };
      proto.onLoadFunction = function() {

        /* 子要素の高さを合わせる */
        App.utils.matchHeight('.js-matchHeight');

        this.$contents.hide();
        this.$navChild.eq(this.isShowNum).addClass('active');
        this.$contents.eq(this.isShowNum).show();
        return this;
      };
      proto.setEvents = function() {
        var that = this;
        this.$navChild.off('click').on('click', function() {
          if(!that.isAnimate) {
            that.onClickNav(this);
            that.isAnimate = false;
          }
        });
        return this;
      };
      proto.onClickNav = function(that) {
        this.isAnimate = true;
        this.hideContents();
        this.isShowNum = $(that).index();
        this.showContents();
        return this;
      };
      proto.showContents = function() {
        var that = this;
        this.$contents.eq(this.isShowNum).fadeIn(this.fadeSpeed, function() {
          that.$navChild.eq(that.isShowNum).addClass('active');
        });
        return this;
      };
      proto.hideContents = function() {
        var that = this;
        this.$contents.eq(this.isShowNum).fadeOut(this.fadeSpeed, function() {
          that.$nav.find('.active').removeClass('active');
        });
        return this;
      };
      return constructor;
    })()

  };


/* utils
------------------------------------------------------------*/

  App.utils = {

    /**
     * 子要素の高さを合わせる
     */
    matchHeight: function(el) {
      var $el = {};
      var $child = {};
      var maxHeight = 0;
      var init = function() {
        setEl();
        getHeight();
        setHeight();
        return this;
      };
      var setEl = function() {
        $el = $(el);
        $child = $el.children();
        return this;
      };
      var getHeight = function() {
        var array = [];
        $child.each(function() {
          array.push($(this).outerHeight());
        });
        array.sort(function(a, b) {
          if(a > b) return -1;
          if(a < b) return 1;
          return 0;
        });
        maxHeight = array[0];
        return this;
      };
      var setHeight = function() {
        $el.css({ height: maxHeight });
        return this;
      };
      init();
    }

  };


/* views
------------------------------------------------------------*/

  App.views = {

    /**
     * ページ
     */
    PageView: (function() {
      var constructor = function(el) {
        this.$el = {};
        this.$anchor = {};
        this.$btn = {};
        this.$section = {};
        this.sectionOffsetTopArray = [];
        this.headerView = {};
        this.footerView = {};
        this.isResize = false;
        this.isScroll = false;
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
        this.$imgBtn = this.$el.find('img.btn');
        this.$section = this.$el.find('.section');
        return this;
      };
      proto.onLoadFunction = function() {
        this.getSectionOffsetArray();
        return this;
      };
      proto.getSectionOffsetArray = function() {
        var that = this;
        this.sectionOffsetTopArray.push(0);
        this.$section.each(function() {
          that.sectionOffsetTopArray.push($(this).offset().top);
        });
        this.sectionOffsetTopArray.push(this.sectionOffsetTopArray[this.sectionOffsetTopArray.length-1] + this.$section.last().outerHeight());
        return this;
      };
      proto.setChildViewInstance = function() {

        /* ヘッダ */
        this.headerView = new App.views.HeaderView();
        this.headerView.init({
          el: '#HeaderView',
          sectionOffsetTopArray: this.sectionOffsetTopArray
        });

        /* フッタ */
        this.footerView = new App.views.FooterView();
        this.footerView.init('#FooterView');

        return this;
      };
      proto.setEvents = function() {
        var that = this;
        $(window).resize(function() {
          that.onResize();
          that.isResize = false;
        });
        $(window).scroll(function() {
          if(!that.isScroll) {
            that.onScroll($(window).scrollTop());
            that.isScroll = false;
          }
        });
        this.$anchor.off('click').on('click', function(e) {
          e.preventDefault();
          if(!that.isScroll) {
            that.smoothScroll($(this).attr('href'));
            that.isScroll = false;
          }
        });
        this.$imgBtn.hover(function() {
          that.imageRollover(this);
        }, function() {
          that.imageRollover(this);
        });
        return this;
      };
      proto.onResize = function() {
        this.isResize = true;
        return this;
      };
      proto.onScroll = function(scrollTop) {
        this.isScroll = true;
        this.headerView.onScroll(scrollTop);
        this.footerView.onScroll(scrollTop);
        return this;
      };
      proto.smoothScroll = function(href) {
        this.isScroll = true;
        var $target = $(href === '#' || href === '' ? 'html' : href);
        var position = $target.offset().top;
        $('html, body').animate({
          scrollTop: position
        }, this.scrollSpeed, 'swing');
        return this;
      };
      proto.imageRollover = function(that) {
        var $image = $(that);
        var imgSrc = $image.attr('src');
        var imgPath = imgSrc.split('/');
        var imgFile = imgPath[imgPath.length -1];
        $image.attr('src', (imgFile.indexOf('_on') == -1) ? imgSrc.replace(/(\.)(gif|jpg|png)/i, '_on$1$2') : imgSrc.replace(/(\_on)(.)(gif|jpg|png)/i, '$2$3'));
        return this;
      };
      return constructor;
    })(),

    /**
     * ヘッダ
     */
    HeaderView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$nav = {};
        this.$navBtn = {};
        this.sectionOffsetTopArray = [];
        this.navCurrentNum = 0;
        this.navOffsetTop = 0;
        this.isScroll = false;
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(args) {
        this.sectionOffsetTopArray = args.sectionOffsetTopArray;
        this.setEl(args.el);
        this.onLoadFunction();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$nav = this.$el.find('.js-globalNav');
        this.$navBtn = this.$nav.find('li');
        return this;
      };
      proto.onLoadFunction = function() {
        var navHeight = this.$nav.outerHeight();
        this.navOffsetTop = $(window).height() - navHeight;
        this.$el.css({
          height: $(window).height() - navHeight,
          paddingBottom: navHeight
        });
        return this;
      };
      proto.onScroll = function(scrollTop) {
        this.getSectionNum(scrollTop);
        this.setStyleNavFixed(scrollTop);
        this.setCurrentClass();
        return this;
      };
      proto.getSectionNum = function(scrollTop) {
        for(var i=0; i<this.sectionOffsetTopArray.length; i++) {
          if(scrollTop > this.sectionOffsetTopArray[i] && scrollTop < this.sectionOffsetTopArray[i+1]) {
            this.navCurrentNum = i;
            break;
          }
        }
        return this;
      };
      proto.setCurrentClass = function() {
        this.$nav.find('.current').removeClass('current');
        if(this.navCurrentNum > 0) {
          this.$navBtn.eq(this.navCurrentNum-1).addClass('current');
        }
        return this;
      };
      proto.setStyleNavFixed = function(scrollTop) {
        if(scrollTop > this.navOffsetTop) {
          this.$nav.addClass('fixed');
        } else {
          this.$nav.removeClass('fixed');
        }
        return this;
      };
      return constructor;
    })(),

    /**
     * フッタ
     */
    FooterView: (function() {
      var constructor = function() {
        this.$el = {};
        this.$btnPagetop = {};
        return this;
      };
      var proto = constructor.prototype;
      proto.init = function(el) {
        this.setEl(el);
        this.onLoadFunction();
        return this;
      };
      proto.setEl = function(el) {
        this.$el = $(el);
        this.$btnPagetop = this.$el.find('.js-btnPagetop');
        return this;
      };
      proto.onLoadFunction = function() {
        this.$btnPagetop.hide();
        return this;
      };
      proto.onScroll = function(scrollTop) {
        if(scrollTop > $(window).height()*1.5) {
          this.$btnPagetop.fadeIn();
        } else {
          this.$btnPagetop.fadeOut();
        }
        return this;
      };
      return constructor;
    })()

  };

})(APP, window, document);
