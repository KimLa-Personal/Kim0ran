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

		navOffsetTop: 0,  // グロナビの初期位置
		contentsOffsetArray: []  // 各セクションの縦位置

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
				render();
				setEvents();
				return this;
			};
			var setEl = function(el) {
				$el = $(el);
				$loadbar = $el.find('.js-loadbar');
				return this;
			};
			var render = function() {
				isLoading = true;
				$el.show();
				$loadbar.width(0);
				pageLoad();
				return this;
			};
			var pageLoad = function() {
				$loadbar.animate({
					width: '30%'
				});
				$(window).load(function() {
					$loadbar.animate({
						width: '100%'
					}, loadbarSpeed, function() {
						onAfterLoad();
					});
				});
				return this;
			};
			var onAfterLoad = function() {
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
		 * ページ
		 */
		PageView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$anchor = {};
				this.$imgBtn = {};
				this.isScroll = false;
				this.isResize = false;
				this.scrollSpeed = 500;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(el) {
				this.setEl(el);
				this.onBeforeRender();
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$anchor = this.$el.find('a[href^="#"]');
				this.$imgBtn = this.$el.find('.btn');
				return this;
			};
			proto.onBeforeRender = function() {

				/* プリローダー */
				var preloader = App.ui.preloader();
				preloader.init({
					el: '.js-loader'
				});

				return this;
			};
			proto.render = function() {

				/* メイン */
				var mainView = new App.views.MainView();
				mainView.init({
					el: '#MainView',
					scrollAdjust: 100
				});

				/* ヘッダ */
				var headerView = new App.views.HeaderView();
				headerView.init({
					el: '#HeaderView'
				});

				/* フッタ */
				var footerView = new App.views.FooterView();
				footerView.init({
					el: '#FooterView'
				});

				return this;
			};
			proto.setEvents = function() {
				var that = this;
				$(window).resize(function() {
					if(!this.isResize) {
						that.onResizeRender();
						that.isResize = false;
					}
				});
				this.$anchor.off('click').on('click', function() {
					if(!that.isScroll) {
						that.smoothScroll($(this).attr('href'));
						that.isScroll = false;
					}
					return false;
				});
				this.$imgBtn.hover(function() {
					that.imageRollover(this);
				}, function() {
					that.imageRollover(this);
				});
				return this;
			};
			proto.onResizeRender = function() {
				this.isResize = true;
				this.render();
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
				var $that = $(that);
				var imgSrc = $that.attr('src');
				var imgPath = imgSrc.split('/');
				var imgFile = imgPath[imgPath.length -1];
				$that.attr('src', (imgFile.indexOf('_on') == -1) ? imgSrc.replace(/(\.)(gif|jpg|png)/i, '_on$1$2') : imgSrc.replace(/(\_on)(.)(gif|jpg|png)/i, '$2$3'));
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
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$nav = this.$el.find('.js-globalNav');
				return this;
			};
			proto.render = function() {
				this.adjustViewHeight();

				/* グローバルナビ */
				var globalNavView = new App.views.GlobalNavView();
				globalNavView.init({
					el: '#GlobalNavView'
				});

				return this;
			};
			proto.adjustViewHeight = function() {
				var navHeight = this.$nav.outerHeight();
				App.global.navOffsetTop = $(window).height() - navHeight;
				this.$el.css({
					height: App.global.navOffsetTop,
					paddingBottom: navHeight
				});
				return this;
			};
			proto.setEvents = function() {
				return this;
			};
			return constructor;
		})(),

		/**
		 * グローバルナビ
		 */
		GlobalNavView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$nav = {};
				this.$child = {};
				this.currentNum = 0;
				this.isScroll = false;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$nav = this.$el.find('ul');
				this.$child = this.$nav.children();
				return this;
			};
			proto.render = function() {
				return this;
			};
			proto.setEvents = function() {
				var that = this;
				$(window).scroll(function() {
					if(!that.isScroll) {
						that.onScrollRender($(window).scrollTop());
						that.isScroll = false;
					}
				});
				return this;
			};
			proto.onScrollRender = function(scrollTop) {
				this.isScroll = true;
				this.getContentNum(scrollTop);
				this.setStylePosition(scrollTop);
				this.setCurrentClass();
				return this;
			};
			proto.getContentNum = function(scrollTop) {
				for(var i=0; i<App.global.contentsOffsetArray.length; i++) {
					if(scrollTop > App.global.contentsOffsetArray[i] && scrollTop < App.global.contentsOffsetArray[i+1]) {
						this.currentNum = i;
						break;
					}
				}
				return this;
			};
			proto.setCurrentClass = function() {
				this.$child.removeClass('current');
				if(this.currentNum > 0) {
					this.$child.eq(this.currentNum-1).addClass('current');
				}
				return this;
			};
			proto.setStylePosition = function(scrollTop) {
				if(scrollTop > App.global.navOffsetTop) {
					this.$el.addClass('fixed');
				} else {
					this.$el.removeClass('fixed');
				}
				return this;
			};
			return constructor;
		})(),

		/**
		 * メイン
		 */
		MainView: (function() {
			var constructor = function() {
				this.$el = {};
				this.$section = {};
				this.scrollAdjust = 0;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.scrollAdjust = args.scrollAdjust;
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$section = this.$el.find('.section');
				return this;
			};
			proto.render = function() {
				this.getContentsOffsetArray();
				return this;
			};
			proto.getContentsOffsetArray = function() {
				var that = this;
				var offsetArray = [];
				offsetArray.push(0);
				this.$section.each(function() {
					offsetArray.push($(this).offset().top - that.scrollAdjust);
				});
				offsetArray.push(offsetArray[offsetArray.length-1]+this.$el.outerHeight());
				App.global.contentsOffsetArray = offsetArray;
				return this;
			};
			proto.setEvents = function() {
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
				this.isScroll = false;
				return this;
			};
			var proto = constructor.prototype;
			proto.init = function(args) {
				this.setEl(args.el);
				this.render();
				this.setEvents();
				return this;
			};
			proto.setEl = function(el) {
				this.$el = $(el);
				this.$btnPagetop = this.$el.find('.js-btnPagetop');
				return this;
			};
			proto.render = function() {
				this.$btnPagetop.hide();
				return this;
			};
			proto.setEvents = function() {
				var that = this;
				$(window).scroll(function() {
					if(!that.isScroll) {
						that.onScrollRender($(window).scrollTop());
						that.isScroll = false;
					}
				});
				return this;
			};
			proto.onScrollRender = function(scrollTop) {
				this.isScroll = true;
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
