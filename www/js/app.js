var $body = null;
var $chapterLinks = null;
var $documentLinks = null;
var $toggleLinks = null;
var $bill = null;
var $annotations = null;
var $fullTextButton = null;
var $annotationTitles = null;
var $billTitles = null;
var mode = 'annotations';
var previousPosition = false;

var onChapterClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	$(target).velocity("scroll", { duration: 500, offset: -60});
}

var onDocumentLinkClick = function(e) {
	e.preventDefault();

	var $this = $(this);
	var target = $this.attr('href');

	if ($this.hasClass('bill-link')){
		showCitedText(target);
	} else {
		showAnnotation(target);
	}
}

var onToggleClick = function(e){
	e.preventDefault();

	var $this = $(this);

	if ($this.hasClass('active')){
		previousPosition = false;
		$body.velocity("scroll", { duration: 500, offset: -60, easing: "ease-in-out" });
		return;
	}

	if ($this.hasClass('bill')){
		showCitedText(previousPosition||'#bill');
	}

	if ($this.hasClass('annotations')){
		showAnnotation(previousPosition||'#annotations');
	}
};

var showAnnotation = function(target){
	mode = 'annotations';

	if (target !== '#annotations'){
		previousPosition = '#bill-' + target.split('-')[1];
	}

	$body.removeClass().addClass('annotations-active');
	$('.mode .toggle').removeClass('active');
	$('.toggle.annotations').addClass('active');

	$annotations.velocity("fadeIn", { duration: 300 });
	$bill.velocity("fadeOut", {
		duration: 300,
		complete: function(){
			$(target).velocity("scroll", {
				duration: 500,
				offset: -71,
				easing: "ease-in-out",
				complete: function(){
					// $.waypoints('destroy');
					// $annotationTitles.waypoint({
					// 	handler: setBillWaypoint,
					// 	offset: 71
					// });
				}
			});
		}
	});
}

var showCitedText = function(target){
	mode = 'fullText';

	if (target !== '#bill'){
		previousPosition = '#annotation-' + target.split('-')[1];
	}

	$body.removeClass().addClass('fulltext-active');
	$('.mode .toggle').removeClass('active');
	$('.toggle.bill').addClass('active');

	$bill.velocity("fadeIn", { duration: 300 });
	$annotations.velocity("fadeOut", {
		duration: 300,
		complete: function(){
			onWindowResize();

			$(target).velocity("scroll", {
				duration: 500,
				offset: -71,
				easing: "ease-in-out",
				complete: function(){
					// $.waypoints('destroy');
					// $billTitles.waypoint({
					// 	handler: setAnnotationWaypoint,
					// 	offset: 71
					// });
				}
			});
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
	$('body').scrollspy({ target: '.chapter-nav', offset: 71 });

	if (mode === 'fullText' ) {
		setupChapterAffix();
	}
}

var onDocumentScroll = function() {
	var scrollPercentage = $(window).scrollTop() / $(window).height();

	if (mode === 'annotations' && scrollPercentage > 1){
		$body.addClass('show-title');
	} else {
		$body.removeClass('show-title');
	}
}

var setBillWaypoint = function(){
	previousPosition = '#fulltext-' + $(this).attr('id').replace('annotation-','');
	console.log(previousPosition);
}

var setAnnotationWaypoint = function(element){
	previousPosition = '#annotation-' + $(this).attr('id').replace('fulltext-','');
	console.log(previousPosition);
}

$(function() {
	$body = $('body');
	$chapterLinks = $('.chapter-nav a');
	$documentLinks = $('.annotation-link, .bill-link');
	$toggleLinks = $('.toggle');
	$bill = $('#bill');
	$annotations = $('#annotations');
	$fullTextButton = $('.bill-link.toggle');
	// $annotationTitles = $annotations.find('.section-header');
	// $billTitles = $bill.find('.fulltext > div');

	$chapterLinks.on('click', onChapterClick);
	$documentLinks.on('click', onDocumentLinkClick);
	$toggleLinks.on('click', onToggleClick);

	$(window).on('resize', _.throttle(onWindowResize, 300));
	$(document).on('scroll', _.throttle(onDocumentScroll, 300));

	// $annotationTitles.waypoint({
	// 	handler: setBillWaypoint,
	// 	offset: 71
	// });

	onWindowResize();
});
