/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/

(function() {

  var global = APP.global;
  var fn = APP.fn;
  var ui = APP.ui;
  var utils = APP.utils;
  var views = APP.views;

  /**
   * ページ
   */
  var PageView = (function() {
    var constructor = function(el) {
      return this;
    };
    var proto = constructor.prototype = new views.PageView();
    proto.onLoadFunction = function() {

      /* プリローダー */
      new ui.preloader({ el: '.js-loader' });

      views.PageView.prototype.onLoadFunction.apply(this);
      return this;
    };
    proto.setChildViewInstance = function() {
      views.PageView.prototype.setChildViewInstance.apply(this);

      /* プロフィール */
      var profileView = new ProfileView();
      profileView.init('#ProfileView');

      /* コンセプト */
      var conceptView = new SectionView();
      conceptView.init('#ConceptView');

      /* ギャラリー */
      var galleryView = new SectionView();
      galleryView.init('#GalleryView');

      /* ブログ */
      var blogView = new SectionView();
      blogView.init('#BlogView');

      /* お問い合わせ */
      var contactView = new SectionView();
      contactView.init('#ContactView');

      return this;
    };
    return constructor;
  })();

  /**
   * セクション
   */
  var SectionView = (function() {
    var constructor = function() {
      this.$el = {};
      this.$child = {};
      this.offsetTop = 0;
      this.fadeSpeed = 500;
      this.isShow = false;
      this.isAnimate = false;
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
      this.$child = this.$el.children();
      return this;
    };
    proto.onLoadFunction = function() {
      this.offsetTop = this.$el.offset().top - $(window).height()/2;
      this.$child.hide();
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      $(window).on('scroll', function() {
        if(!that.isShow && !that.isAnimate) {
          that.onScroll($(window).scrollTop());
        }
      });
      return this;
    };
    proto.onScroll = function(scrollTop) {
      var that = this;
      if(scrollTop > this.offsetTop) {
        this.showChild();
        this.isAnimate = false;
        this.isShow = true;
      }
      return this;
    };
    proto.showChild = function() {
      this.isAnimate = true;
      this.$child.fadeIn(this.fadeSpeed);
      return this;
    };
    return constructor;
  })();

  /**
   * プロフィール
   */
  var ProfileView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    proto.onLoadFunction = function() {
      SectionView.prototype.onLoadFunction.apply(this);

      /* 切り替えコンテンツ */
      new ui.switchContents('.js-switchContents');

      return this;
    };
    return constructor;
  })();

  /* ページ */
  var pageView = new PageView();
  pageView.init('#PageView');

})();
