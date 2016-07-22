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
		proto.setChildViewInstance = function() {
			views.PageView.prototype.setChildViewInstance.apply(this);

			/* プロフィール */
			var profileView = new ProfileView();
			profileView.init('#profile');

			/* コンセプト */
			var conceptView = new SectionView();
			conceptView.init('#concept');

			/* ギャラリー */
			var galleryView = new SectionView();
			galleryView.init('#gallery');

			/* ブログ */
			var blogView = new SectionView();
			blogView.init('#blog');

			/* お問い合わせ */
			var contactView = new SectionView();
			contactView.init('#contact');

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
			return this;
		};
		proto.onLoadFunction = function() {

			return this;
		};
		proto.setEvents = function() {

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

			/* 切り替えコンテンツ */
			new ui.switchContents('.js-switchContents');

			SectionView.prototype.onLoadFunction.apply(this);
			return this;
		};
		return constructor;
	})();

	/* ページ */
	var pageView = new PageView();
	pageView.init('#PageView');

})();
