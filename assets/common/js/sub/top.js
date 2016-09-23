/*--------------------------------------------------------------------
 top.js
----------------------------------------------------------------------*/

(function() {

  var global = APP.global;
  var fn = APP.fn;
  var ui = APP.ui;
  var utils = APP.utils;
  var views = APP.views;

  /* グローバル変数 */
  global.sectionOffsetArray = [];  // 各セクション位置配列
  global.scrollAdjustHeight = 0;  // スクロール時調整用の高さ

  /**
   * ページビュー
   */
  var PageView = (function() {
    var constructor = function(el) {
      this.$section = {};
      this.headerView = {};
      this.globalNavView = {};
      this.footerView = {};
      this.init(el);
      return this;
    };
    var proto = constructor.prototype = new views.PageView();
    proto.init = function(el) {
      views.PageView.prototype.init.apply(this, [el]);
      this.setCustomEvents();
      return this;
    };
    proto.setEl = function(el) {
      views.PageView.prototype.setEl.apply(this, [el]);
      this.$section = this.$el.find('.section');
      return this;
    };
    proto.onLoadFunction = function() {

      /* プリローダー */
      var preloader = ui.preloader();
      preloader.init({ el: '.js-loader' });

      this.getSectionOffsetArray();
      this.setSectionViewInstance();
      return this;
    };
    proto.getSectionOffsetArray = function() {
      var that = this;
      global.scrollAdjustHeight = Math.floor($(window).height()/2);
      var sectionOffsetArray = [];
      this.$section.each(function() {
        sectionOffsetArray.push($(this).offset().top);
      });
      sectionOffsetArray.push(sectionOffsetArray[sectionOffsetArray.length-1] + this.$section.eq(this.$section.length-1).outerHeight());
      global.sectionOffsetArray = sectionOffsetArray;
      return this;
    };
    proto.setChildViewInstance = function() {

      /* ヘッダ */
      this.headerView = new HeaderView();
      this.headerView.init({ el: '#HeaderView' });

      /* グローバルナビ */
      this.globalNavView = new GlobalNavView();
      this.globalNavView.init({ el: '#GlobalNavView' });

      /* フッタ */
      this.footerView = new FooterView();
      this.footerView.init({ el: '#FooterView' });

      return this;
    };
    proto.setSectionViewInstance = function() {

      /* プロフィール */
      var profileView = new ProfileView();
      profileView.init({ el: '#ProfileView' });

      /* コンセプト */
      var conceptView = new ConceptView();
      conceptView.init({ el: '#ConceptView' });

      /* ギャラリー */
      var galleryView = new GalleryView();
      galleryView.init({ el: '#GalleryView' });

      /* ブログ */
      var blogView = new BlogView();
      blogView.init({ el: '#BlogView' });

      /* お問い合わせ */
      var contactView = new ContactView();
      contactView.init({ el: '#ContactView' });

      return this;
    };
    proto.onScroll = function(scrollTop) {
      this.isAnimate = true;
      this.globalNavView.onScroll(scrollTop);
      return this;
    };
    proto.onResize = function() {
      this.headerView.onResize();
      this.globalNavView.onResize();
      return this;
    };
    proto.setCustomEvents = function() {
      var that = this;
      return this;
    };
    return constructor;
  })();

  /**
   * ヘッダ
   */
  var HeaderView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.onLoadFunction = function() {
      this.setStyle();
      return this;
    };
    proto.setStyle = function() {
      this.$el.css({ height: $(window).height() });
      return this;
    };
    proto.onResize = function() {
      this.setStyle();
      return this;
    };
    return constructor;
  })();

  /**
   * グローバルナビ
   */
  var GlobalNavView = (function() {
    var constructor = function() {
      this.$list = {};
      this.$listChild = {};
      this.$anchor = {};
      this.$btnSlideToggle = {};
      this.classNavCurrent = 'current';
      this.isAnimate = false;
      this.isOpen = false;
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$list = this.$el.find('.js-globalNavList');
      this.$nav = this.$el.find('.globalNav-nav-list');
      this.$navChild = this.$nav.children();
      this.$anchor = this.$el.find('a[href^="#"]');
      this.$btnSlideToggle = this.$el.find('.js-globalNavBtn');
      return this;
    };
    proto.onLoadFunction = function() {
      this.$list.hide();
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      this.$btnSlideToggle.on('click', function() {
        if(!that.isAnimate) {
          that.animateSlideNav();
          that.isAnimate = false;
        }
      });
      this.$anchor.on('click', function() {
        if(!that.isAnimate) {
          that.animateSlideNav();
          that.isAnimate = false;
        }
      });
      return this;
    };
    proto.animateSlideNav = function() {
      this.isAnimate = true;
      this.$list.slideToggle();
      this.isOpen = this.isOpen ? false : true;
      return this;
    };
    proto.onScroll = function(scrollTop) {
      this.$nav.find('.' + this.classNavCurrent).removeClass(this.classNavCurrent);
      scrollTop = scrollTop + global.scrollAdjustHeight;
      for(var i=0; i<global.sectionOffsetArray.length; i++) {
        if(scrollTop > global.sectionOffsetArray[i] && scrollTop < global.sectionOffsetArray[i+1]) {
          this.$navChild.eq(i).addClass(this.classNavCurrent);
          break;
        }
      }
      return this;
    };
    proto.onResize = function() {
      return this;
    };
    return constructor;
  })();

  /**
   * フッタ
   */
  var FooterView = (function() {
    var constructor = function() {
      this.$btnPagetop = {};
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$btnPagetop = this.$el.find('.js-btnPagetop');
      return this;
    };
    return constructor;
  })();

  /**
   * セクション
   */
  var SectionView = (function() {
    var constructor = function() {
      this.$inner = {};
      this.offsetTop = 0;
      this.offsetBottom = 0;
      return this;
    };
    var proto = constructor.prototype = new views.BaseView();
    proto.setEl = function(el) {
      views.BaseView.prototype.setEl.apply(this, [el]);
      this.$inner = this.$el.find('.inner');
      return this;
    };
    proto.onLoadFunction = function() {
      this.getElOffset();
      this.setStyle();
      return this;
    };
    proto.getElOffset = function() {
      var index = 0;
      var top = this.$el.offset().top;
      for(var i=0; i<global.sectionOffsetArray.length; i++) {
        if(top === global.sectionOffsetArray[i]) {
          index = i;
          break;
        }
      }
      this.offsetTop = global.sectionOffsetArray[index] - global.scrollAdjustHeight;
      this.offsetBottom = global.sectionOffsetArray[index+1] - global.scrollAdjustHeight;
      return this;
    };
    proto.setStyle = function() {
      this.$inner.css({
        position: 'relative',
        top: 20,
        opacity: 0
      });
      return this;
    };
    proto.setEvents = function() {
      var that = this;
      $(window).on('scroll', function() {
        that.onScroll($(window).scrollTop());
      });
      return this;
    };
    proto.onScroll = function(scrollTop) {
      if(scrollTop > this.offsetTop && scrollTop < this.offsetBottom) {
        this.$inner.animate({
          top: 0,
          opacity: 1
        });
      }
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
    proto.setChildViewInstance = function() {

      /* 切り替えコンテンツ */
      var switchView = new ui.switchView();
      switchView.init({ el: '.js-switchView' });

      return this;
    };
    return constructor;
  })();

  /**
   * コンセプト
   */
  var ConceptView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /**
   * ギャラリー
   */
  var GalleryView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /**
   * ブログ
   */
  var BlogView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /**
   * お問い合わせ
   */
  var ContactView = (function() {
    var constructor = function() {
      return this;
    };
    var proto = constructor.prototype = new SectionView();
    return constructor;
  })();

  /* ページ */
  new PageView('#PageView');

})();