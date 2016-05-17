/*--------------------------------------------------------------------
 common.js
----------------------------------------------------------------------*/

(function(window, undefined) {

	var App = {
		global: {},
		fn: {},
		utils: {},
		views: {}
	};
	window.APP = App;

})(window);

(function(App, window, decument, undefined) {


/* global
------------------------------------------------------------*/

	App.global = {

		isMobile: false,  // モバイル判定
		mobileWidth: 320  // モバイル端末の判定幅

	};


/* fn
------------------------------------------------------------*/

	App.fn = {

		/**
		 * モバイル判定
		 */
		uaMobile: function() {
			App.global.isMobile = $(window).outerWidth() <= App.global.mobileWidth ? true : false;
			return this;
		}

	};


/* utils
------------------------------------------------------------*/

	App.utils = {

	    /**
	     * カルーセル
	     */
	    bxCarousel: function() {
	        var $el = {};
	        var options = {
	            slideSpeed: 500,
	            intervalTime: 3000,
	            autoSlide: true
	        };
	        var init = function(args) {
	            options = {
	                slideSpeed: args.slideSpeed || options.slideSpeed,
	                intervalTime: args.intervalTime || options.intervalTime,
	                autoSlide: args.autoSlide !== undefined ? args.autoSlide : options.autoSlide
	            };
	            setEl(args.el);
	            render();
	            return this;
	        };
	        var setEl = function(el) {
	            $el = $(el);
	            return this;
	        };
	        var render = function() {
	            setBxSlider();
	            return this;
	        };
	        var setBxSlider = function() {
	            $el.bxSlider({
	                speed: options.slideSpeed,
	                pause: options.intervalTime,
	                auto: options.autoSlide
	            });
	            return this;
	        };
	        return { init: init };
	    },
/* インスタンス化
var topVisual = new bxCarousel();
topVisual.init({
    el: '.js-carouselImageList',
    slideSpeed: 300,
    intervalTime: 1000,
    autoSlide: true
});
*/

	    /**
	     * カルーセル
	     */
	    carousel: function() {
	        var c = {};
	        var $el = {};
	        var $imageList = {};
	        var $btnList = {};
	        var autoSlide = {};
	        var itemLength = 0;
	        var slideWidth = 0;
	        var viewNum = 1;
	        var slideSpeed = 500;
	        var intervalTime = 5000;
	        var isAnimate = false;
	        var isAuto = true;
	        var slideAuto = true;
	        var init = function(args) {
	            c = {
	                el: args.el,
	                active: args.btnActive
	            };
	            slideSpeed = args.slideSpeed || slideSpeed;
	            intervalTime = args.intervalTime || intervalTime;
	            slideAuto = args.slideAuto !== undefined ? args.slideAuto : slideAuto;
	            setEl();
	            render();
	            setCarousel();
	            setEvents();
	            return this;
	        };
	        var setEl = function() {
	            $el = $(c.el);
	            $imageList = $el.find('.js-carouselImageList');
	            $btnList = $el.find('.js-carouselBtnList');
	            return this;
	        };
	        var render = function() {
	            renderImageList();
	            renderThumbList();
	            $btnList.children().eq(viewNum-1).addClass(c.active.slice(1));
	            return this;
	        };
	        var renderImageList = function() {
	            var $item = $imageList.children();
	            itemLength = $item.length;
	            slideWidth = $item.first().width();
	            $el.css({
	                position: 'relative',
	                height: $item.first().height()
	            });
	            $imageList.css({
	                position: 'absolute',
	                top: 0,
	                left: 0,
	                width: slideWidth * itemLength
	            });
	            return this;
	        };
	        var renderThumbList = function() {
	            var tmpl = [];
	            for(var i=0; i<itemLength; i++) {
	                tmpl.push('<li data-num="' + (i+1) + '">●</li>');
	            }
	            $btnList.append(tmpl.join(''));
	            return this;
	        };
	        var setCarousel = function() {
	            if(slideAuto) {
	                if(isAuto) {
	                    autoSlide = setInterval(function() {
	                        viewNum = viewNum < itemLength ? viewNum+1 : 1;
	                        animateSlide();
	                        isAnimate = false;
	                    }, intervalTime);
	                } else {
	                    clearInterval(autoSlide);
	                    isAuto = true;
	                }
	            }
	            return this;
	        };
	        var animateSlide = function() {
	            isAnimate = true;
	            $imageList.animate({
	                left: -(slideWidth * (viewNum-1))
	            }, slideSpeed, function() {
	                activeControlBtn();
	            });
	            return this;
	        };
	        var activeControlBtn = function() {
	            $btnList.children(c.active).removeClass(c.active.slice(1));
	            $btnList.children().eq(viewNum-1).addClass(c.active.slice(1));
	            return this;
	        };
	        var setEvents = function() {
	            $btnList.find('li').off('click').on('click', function() {
	                if(!isAnimate) {
	                    onClickControlBtn(this);
	                }
	            });
	            return this;
	        };
	        var onClickControlBtn = function(that) {
	            isAuto = false;
	            setCarousel();
	            viewNum = Number($(that).data('num'));
	            animateSlide();
	            isAnimate = false;
	            setCarousel();
	            return this;
	        };
	        return { init: init };
	    },
/* インスタンス化
var topVisual = new carousel();
topVisual.init({
    el: '.mainVisual',
    btnActive: '.active',
    slideSpeed: 300,
    intervalTime: 3000,
    slideAuto: false
});
<div class="mainVisual">
    <ul class="js-carouselImageList">
        <li><img src="" alt="" /></li>
    </ul>
    <ul class="js-carouselBtnList">
    </ul>
</div>
*/

		/**
		 * アコーディオン
		 */
		accordion: function() {
			var c = {};
			var $el = {};
			var $btn = {};
			var $main = {};
			var isOpen = false;
			var isAnimate = false;
			var init = function(args) {
				c = {
					el: args.el,
					active: args.btnActiveClass
				};
				isOpen = args.defaultOpen || isOpen;
				setEl();
				render();
				setEvents();
				return this;
			};
			var setEl = function() {
				$el = $(c.el);
				$btn = $el.find('.js-accordBtn');
				$main = $el.find('.js-accordMain');
				return this;
			};
			var render = function() {
				if(isOpen) {
					$btn.addClass(c.active);
				} else {
					$main.hide();
				}
				return this;
			};
			var setEvents = function() {
				$btn.off('click').on('click', function() {
					if(!isAnimate) {
						onToggleAnimate();
						isAnimate = false;
					}
					return false;
				});
				return this;
			};
			var onToggleAnimate = function() {
				isAnimate = true;

				return this;
			};
			return { init: init };
		}
/* インスタンス化
var accordion = new utils.accordion();
accordion.init({
    el: '.js-accordion',
    btnActiveClass: 'opened',
    defaultOpen: false
});
*/

	};


/* views
------------------------------------------------------------*/

	App.views = {

		WindowView: (function() {
			var $el = $(window);
			var init = function() {
				App.global.isMobile = App.fn.uaMobile();
				render();
				setEvents();
				return this;
			};
			var render = function() {

				return this;
			};
			var setEvents = function() {
				$el.resize(function() {
					App.global.isMobile = App.fn.uaMobile();
				});
				return this;
			};
			init();
		})(),

		/**
		 * ベース
		 */
		BaseView: (function() {
			var constructor = function() {
				this.$el = {};
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
				return this;
			};
			proto.render = function() {
				return this;
			};
			proto.setEvents = function() {
				return this;
			};
			return constructor;
		})()

	};

})(APP, window, document);
