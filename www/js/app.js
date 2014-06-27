var $body = null;
var $chapterLinks = null;
var $documentLinks = null;
var $toggleLinks = null;
var $bill = null;
var $annotations = null;
var $fullTextButton = null;
var $annotationTitles = null;
var $billTitles = null;
var $shareModal = null;
var $scrollDownButton = null;
var $w = $(window);

var mode = 'annotations';
var previousPosition = false;
var firstShare = true;

var subResponsiveImages = function() {
    /*
    * Replaces large images with small ones for tiny devices.
    * Contains a test for non-tablet devices.
    */

    // MOBILE
    if ($w.width() < 769 && Modernizr.touch === true) {
        _.each($('header,.section-header'), function(sectionHeader) {
            var imageUrl = $(sectionHeader).attr('data-image').replace('.', '-sq-m.');
            $(sectionHeader).css('background-image', 'url(\'' + imageUrl + '\')');
        });
    // DESKTOP
    } else {
        _.each($('header,.section-header'), function(sectionHeader) {
            var imageUrl = $(sectionHeader).attr('data-image');
            $(sectionHeader).css('background-image', 'url(\'' + imageUrl + '\')');
        });
    }
};

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
	$('.mode .toggle').removeClass('active');
	$('.toggle.annotations').addClass('active');

	if (mode !=='annotations'){
		$body.removeClass().addClass('annotations-active show-title');
		$annotations.velocity("fadeIn", { duration: 300 });
	}

	$bill.velocity("fadeOut", {
		duration: 300,
		complete: function(){
			$(target).velocity("scroll", {
				duration: 500,
				offset: -71,
				easing: "ease-in-out",
				complete: function(){
					$.waypoints('destroy');
					$billLinks.waypoint({
						handler: setWaypoint,
						offset: 150
					});
				}
			});
		}
	});

	if (target !== '#annotations'){
		previousPosition = '#bill-' + target.split('-')[1];
	} else {
		previousPosition = false;
	}

	mode = 'annotations';
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
					$.waypoints('destroy');
					$annotationLinks.waypoint({
						handler: setWaypoint,
						offset: 150
					});
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

var setWaypoint = function(){
	previousPosition = $(this).attr('href');
}

var onScrollDownClick = function(){
	$('header + .contributors').velocity("scroll", {
		duration: 500,
		easing: "ease-in-out"
	});
}

/*
 * Share modal opened.
 */
var onShareModalShown = function(e) {
    _gaq.push(['_trackEvent', APP_CONFIG.PROJECT_SLUG, 'open-share-discuss']);
    
    if (firstShare) {
        loadComments();

        firstShare = false;
    }
}

/*
 * Share modal closed.
 */
var onShareModalHidden = function(e) {
    _gaq.push(['_trackEvent', APP_CONFIG.PROJECT_SLUG, 'close-share-discuss']);
}

/*
 * Text copied to clipboard.
 */
var onClippyCopy = function(e) {
    alert('Copied to your clipboard!');

    _gaq.push(['_trackEvent', APP_CONFIG.PROJECT_SLUG, 'summary-copied']);
}

$(function() {
	$body = $('body');
	$chapterLinks = $('.chapter-nav a');
	$documentLinks = $('.annotation-link, .bill-link');
	$annotationLinks = $documentLinks.filter('.annotation-link');
	$billLinks = $documentLinks.filter('.bill-link');
	$toggleLinks = $('.toggle');
	$bill = $('#bill');
	$annotations = $('#annotations');
	$fullTextButton = $('.bill-link.toggle');
	$shareModal = $('#share-modal');
	$scrollDownButton = $('.scroll-down-button');


	$chapterLinks.on('click', onChapterClick);
	$documentLinks.on('click', onDocumentLinkClick);
	$toggleLinks.on('click', onToggleClick);
	$scrollDownButton.on('click', onScrollDownClick);

	$(window).on('resize', _.throttle(onWindowResize, 300));
	$(document).on('scroll', _.throttle(onDocumentScroll, 300));

	$shareModal.on('shown.bs.modal', onShareModalShown);
    $shareModal.on('hidden.bs.modal', onShareModalHidden);

    var clippy = new ZeroClipboard($(".clippy"));

    clippy.on('ready', function(readyEvent) {
        clippy.on('aftercopy', onClippyCopy);
    });

	onWindowResize();
	subResponsiveImages();

	$billLinks.waypoint({
		handler: setWaypoint,
		offset: 150
	});
});
