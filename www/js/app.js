var $body = null;
var $chapterLinks = null;
var $billLinks = null;
var $annotationLinks = null;
var $bill = null;
var $annotations = null;
var $fullTextButton = null;
var mode = 'annotations';

var onChapterClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	$(target).velocity("scroll", { duration: 500, offset: -60});
}

var onBillLinkClick = function(e) {
	e.preventDefault();


	if ($(this).hasClass('active')){
		$body.velocity("scroll", { duration: 500, offset: -60, easing: "ease-in-out" });
		return;
	}

	var target = $(this).attr('href');

	mode = 'fullText';
	$body.removeClass().addClass('fulltext-active');
	$('.mode .toggle').removeClass('active');
	$('.toggle.bill-link').addClass('active');

	$bill.velocity("fadeIn", { duration: 300 });
	$annotations.velocity("fadeOut", {
		duration: 300,
		complete: function(){
			setupChapterAffix();
			$(target).velocity("scroll", { duration: 500, offset: -60, easing: "ease-in-out" });
		}
	});

}

var onAnnotationLinkClick = function(e) {
	e.preventDefault();

	if ($(this).hasClass('active')){
		$body.velocity("scroll", { duration: 500, offset: -60, easing: "ease-in-out" });
		return;
	}

	var target = $(this).attr('href');
	mode = 'annotations';

	$body.removeClass().addClass('annotations-active');
	$('.mode .toggle').removeClass('active');
	$('.toggle.annotation-link').addClass('active');

	$annotations.velocity("fadeIn", { duration: 300 });
	$bill.velocity("fadeOut", {
		duration: 300,
		complete: function(){
			$(target).velocity("scroll", { duration: 500, offset: -60, easing: "ease-in-out" });
		}
	});
}

var setupChapterAffix = function() {
	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$('.chapter-nav ul').affix({
			offset: {
				top: function () {
					return (this.top = $('.chapter-nav').offset().top - 71)
				},
 				bottom: function () {
 					return (this.bottom = $(document).height() - $('footer').offset().top + 11)
  				}
			}
		})
	}
}

var onWindowResize = function(){
	$('header').css('height', $(window).height());
	$('body').scrollspy({ target: '.chapter-nav', offset: 60 });

	if ( $fullTextButton.hasClass('active') ) {
		setupChapterAffix();
	}
}

var onDocumentScroll = function() {
	var scrollPercentage = $(window).scrollTop() / $(window).height()

	if (mode === 'annotations' && scrollPercentage > 1){
		$body.addClass('show-title');
	} else {
		$body.removeClass('show-title');
	}
}

$(function() {
	$body = $('body');
	$chapterLinks = $('.chapter-nav a');
	$billLinks = $('.bill-link');
	$annotationLinks = $('.annotation-link');
	$bill = $('#bill');
	$annotations = $('#annotations');
	$fullTextButton = $('.bill-link.toggle');

	$chapterLinks.on('click', onChapterClick);
	$billLinks.on('click', onBillLinkClick);
	$annotationLinks.on('click', onAnnotationLinkClick);

	$(window).on('resize', _.throttle(onWindowResize, 300));
	$(document).on('scroll', _.throttle(onDocumentScroll, 300));

	onWindowResize();
});
