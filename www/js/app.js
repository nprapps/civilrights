var $chapterLinks = null;
var $billLinks = null;
var $annotationLinks = null;

var onChapterClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	$.scrollTo($(target), { duration: 350 });
}

var onBillLinkClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	$('#tab-nav a[href="#bill"]').tab('show');
	$.scrollTo($(target), { duration: 350 });
}

var onAnnotationLinkClick = function(e) {
	e.preventDefault();

	var target = $(this).attr('href');
	$('#tab-nav a[href="#annotations"]').tab('show');
	$.scrollTo($(target), { duration: 350 });
}

var setupChapterAffix = function() {
	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$('.chapter-nav ul').affix({
			offset: {
				top: function () {
					return (this.top = $('.chapter-nav').offset().top + 11)
				},
 				bottom: function () {
 					return (this.bottom = $(document).height() - $('footer').offset().top + 11)
  				}
			}
		})
	}
}

$(function() {
	$chapterLinks = $('.chapter-nav a');
	$billLinks = $('.bill-link');
	$annotationLinks = $('.annotation-link');

	$chapterLinks.on('click', onChapterClick);
	$billLinks.on('click', onBillLinkClick);
	$annotationLinks.on('click', onAnnotationLinkClick);

	setupChapterAffix();
	$('body').scrollspy({ target: '.chapter-nav' })
});
