var $window = $(window);
var $document = $(document);
var $body = null;
var $chapterLinks = null;
var $toggleLinks = null;
var $documentLinks = null;
var $bill = null;
var $annotations = null;
var $annotationsContent = null;
var $fullTextButton = null;
var $annotationTitles = null;
var $billTitles = null;
var $shareModal = null;
var $scrollDownButton = null;
var $chapterNav = null;
var $staticNav = null;
var $fixedNav = null;
var $spy = null;

var mode = 'annotations';
var previousPosition = '#bill';
var previousOffset = 71;
var firstShare = true;
var trackedMarks = [];

var subResponsiveImages = function() {
    /*
    * Replaces large images with small ones for tiny devices.
    * Contains a test for non-tablet devices.
    */

    // MOBILE
    if ($window.width() < 768 && Modernizr.touch === true) {
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

    $('header').css('opacity', 1);
};

var onChapterClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	var offset = $(target).position()['top'] + $chapterNav.height() + parseFloat($(target).css('margin-top')) + parseFloat($(target).css('padding-top')) + 71;

	if (Modernizr.mq('only screen and (min-width: 992px)')){
		offset = $(target).position()['top'] + parseFloat($(target).css('margin-top')) + parseFloat($(target).css('padding-top')) + 60;
	}

	$bill.animate({ scrollTop: offset });
}

var onToggleClick = function(e){
	e.preventDefault();

	var $this = $(this);

	if ($this.hasClass('active')){
		// previousPosition = false;

		if ($this.hasClass('bill')){
			$bill.animate({ scrollTop: 0 });
		} else {
			$annotations.animate({ scrollTop: 0 });
		}
		return;
	}

	hasher.setHash(previousPosition);
};

var onDocumentLinkClick = function(e){
	e.preventDefault();

	previousOffset = $(this).offset().top;
	previousOffset = Math.floor(previousOffset);

	hasher.setHash($(this).attr('href'));
}

var onScrollDownClick = function(){
	$('header + .contributors').velocity("scroll", {
		duration: 500,
		container: $annotations,
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

/*
 * Track scroll depth for completion events.
 *
 * After: https://github.com/robflaherty/jquery-scrolldepth
 */
var onScroll = _.throttle(function(e) {
    if (mode != 'annotations') {
        return;
    }

    var docHeight = $annotationsContent.height();
    var winHeight = window.innerHeight ? window.innerHeight : $window.height();
    var scrollDistance = $annotations.scrollTop() + winHeight;

    var marks = {
        '25%' : parseInt(docHeight * 0.25),
        '50%' : parseInt(docHeight * 0.50),
        '75%' : parseInt(docHeight * 0.75),
        '100%': docHeight - 5
    };

    $.each(marks, function(mark, px) {
        if (trackedMarks.indexOf(mark) == -1 && scrollDistance >= px) {
            _gaq.push(['_trackEvent', APP_CONFIG.PROJECT_SLUG, 'completion', mark]);
            trackedMarks.push(mark);
        }
    });
}, 500);

/*
 * Show/hide title based on scroll position.
 */
var onDocumentScroll = function() {
	var scrollPercentage = $(window).scrollTop() / $(window).height();

	if (mode === 'annotations' && scrollPercentage > 1){
		$body.addClass('show-title');
	} else {
		$body.removeClass('show-title');
	}
}

/*
 * Swap modes on hash changes.
 */
var onHashChange = function(newHash, oldHash) {
	if (newHash.indexOf('bill') == 0) {
		showCitedText('#' + newHash);
	} else if (newHash.indexOf('annotation') == 0) {
		showAnnotation('#' + newHash);
	}
}

var showAnnotation = function(target) {
	mode = 'annotations';

	$('.mode .toggle').removeClass('active');
	$('.toggle.annotations').addClass('active');
	$body.removeClass('fulltext-active').addClass('annotations-active');
	resetChapterNav();

	$.waypoints('disable');
	$annotations.scrollTop(0);
	var position = $(target).offset()['top'] - previousOffset;
	$annotations.scrollTop(position);
	$.waypoints('enable');

	$annotations.velocity({
	    translateX: "0"
	}, {
		duration: 200
	});

	$bill.velocity({
	    translateX: "100%"
	}, {
		duration: 200
	});

	if (target !== '#annotations'){
		previousPosition = '#bill-' + target.split('-')[1];
	}
}

var showCitedText = function(target){
	mode = 'fullText';

	$('.mode .toggle').removeClass('active');
	$('.toggle.bill').addClass('active');
	$chapterNav.css('opacity', 0);

	$body.removeClass().addClass('fulltext-active');

	$.waypoints('disable');
	$bill.scrollTop(0);
	positionChapterNav();
	var position = $(target).offset()['top'] - previousOffset;
	$.waypoints('enable');

	$bill.scrollTop(position);

	$(target).blur();

	$bill.velocity({
	    translateX: "0"
	}, {
		duration: 200,
		complete: function() {
			showChapterNav();
		}
	});

	$annotations.velocity({
	    translateX: "-100%"
	}, {
		duration: 200
	});

	if (target !== '#bill'){
		previousPosition = '#annotation-' + target.split('-')[1];
	}
}

var positionChapterNav = function() {
	var $chapterLinks = $chapterNav.find('a');

	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$chapterNav.remove()
			.css('opacity', 0)
			.appendTo($fixedNav)
		    .addClass('affix');

		$bill.scrollTop(0);
		$spy = $bill.scrollspy({ target: '#chapter-nav-fixed', offset: 150 });
		$spy.scrollspy('refresh');
	} else {
		$chapterNav.remove()
			.appendTo($staticNav);
		$chapterNav.css('opacity', 1);
	}

	$chapterNav.find('a').on('click', onChapterClick);
}

var showChapterNav = function() {
	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$chapterNav.velocity('fadeIn', {
			delay: 200
		});
	}
}

var resetChapterNav = function() {
	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$chapterNav.remove()
			.appendTo($staticNav)
			.css('opacity', 0);
	}
}

var onWindowResize = function(){
	$('header').css({
		'height': $(window).height(),
		'min-height': 0
	});

	if (mode === 'fullText' ) {
		positionChapterNav();
		showChapterNav();
	}
}

var onDocumentScroll = function() {
	var scrollPercentage = $(this).scrollTop() / $(window).height();

	if (mode === 'annotations' && scrollPercentage > 1){
		$body.addClass('show-title');
	} else {
		$body.removeClass('show-title');
	}
}

var setWaypoint = function() {
	previousPosition = $(this).attr('href');
	previousOffset = $(this).offset()['top'];
}

$(function() {
	$body = $('body');
	$chapterLinks = $('#toc a');
	$annotationLinks = $('.annotation-link');
	$billLinks = $('.bill-link');
	$documentLinks = $('.bill-link, .annotation-link');
	$toggleLinks = $('.toggle');
	$bill = $('#bill');
	$annotations = $('#annotations');
	$annotationsContent = $('.annotations-content');
	$fullTextButton = $('.bill-link.toggle');
	$shareModal = $('#share-modal');
	$scrollDownButton = $('.scroll-down-button');
	$chapterNav = $('#toc');
	$staticNav = $('.chapter-nav');
	$fixedNav = $('#chapter-nav-fixed');

	$chapterLinks.on('click', onChapterClick);
	$toggleLinks.on('click', onToggleClick);
	$documentLinks.on('click', onDocumentLinkClick);
	$scrollDownButton.on('click', onScrollDownClick);

	$window.on('resize', _.throttle(onWindowResize, 300));
	$('#bill, #annotations').on('scroll', _.throttle(onDocumentScroll, 300));

	$shareModal.on('shown.bs.modal', onShareModalShown);
    $shareModal.on('hidden.bs.modal', onShareModalHidden);

    ZeroClipboard.config({ swfPath: 'js/lib/ZeroClipboard.swf' });
    var clippy = new ZeroClipboard($(".clippy"));

    clippy.on('ready', function(readyEvent) {
        clippy.on('aftercopy', onClippyCopy);
    });

	onWindowResize();
	subResponsiveImages();

	$('#annotations .bill-link').waypoint({
		context: $annotations,
		handler: setWaypoint,
		offset: 150
	});

	$('#bill .annotation-link').waypoint({
		context: $bill,
		handler: setWaypoint,
		offset: 150
	});

	$bill.velocity({
	    translateX: "100%"
	}, {
		duration: 0
	});

    $annotations.on('scroll', onScroll);

    hasher.changed.add(onHashChange);
    hasher.initialized.add(onHashChange);
    hasher.prependHash = '/';
    hasher.init();

    $document.on("touchstart", function() {}); // Enable :active pseudo-class in mobile safari ¯\_(ツ)_/¯
});
