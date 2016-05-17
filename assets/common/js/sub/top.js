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
	 * 初期処理
	 */
	var pageInit = function() {

		/* トップ */
		var pageView = new PageView();
		pageView.init('#PageView');

	};

	/**
	 * トップ
	 */
	var PageView = (function() {
		var constructor = function() {
			return this;
		};
		var proto = constructor.prototype = new views.PageView();
		proto.render = function() {
			views.PageView.prototype.render.apply(this);

			/* コンテンツ1 */
			var contents1View = new SectionView();
			contents1View.init('#contents1');

			/* コンテンツ2 */
			var contents2View = new SectionView();
			contents2View.init('#contents2');

			/* コンテンツ3 */
			var contents3View = new SectionView();
			contents3View.init('#contents3');

			/* コンテンツ4 */
			var contents4View = new SectionView();
			contents4View.init('#contents4');

			/* コンテンツ5 */
			var contents5View = new SectionView();
			contents5View.init('#contents5');

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
			this.sectionIndex = 0;
			this.scrollAdjust = 0;
			this.fadeSpeed = 1500;
			this.isScroll = false;
			this.isShow = false;
			return this;
		};
		var proto = constructor.prototype;
		proto.init = function(el) {
			this.setEl(el);
			this.render();
			this.setEvents();
			return this;
		};
		proto.setEl = function(el) {
			this.$el = $(el);
			this.$child = this.$el.children();
			return this;
		};
		proto.render = function() {
			this.sectionIndex = this.$el.index();
			this.scrollAdjust = $(window).height()/2;
			this.$child.hide();
			return this;
		};
		proto.setEvents = function() {
			var that = this;
			$(window).scroll(function() {
				if(!that.isShow && !that.isScroll) {
					that.showChild($(window).scrollTop());
					that.isScroll = false;
				}
			});
			return this;
		};
		proto.showChild = function(scrollTop) {
			this.isScroll = true;
			if(scrollTop > global.contentsOffsetArray[this.sectionIndex + 1] - this.scrollAdjust) {
				this.$child.fadeIn(this.fadeSpeed);
				this.isShow = true;
			}
			return this;
		};
		return constructor;
	})();

	/* 初期処理 */
	pageInit();

})();
