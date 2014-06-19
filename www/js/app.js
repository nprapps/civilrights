var $chapterLinks = null;

var onChapterClick = function() {
	var target = $(this).attr('href');
	$.scrollTo($(target), { duration: 350 });

	return false;
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
	$modeToggleButtons = $('.mode-toggle a');
	$tabPanes = $('.tab-pane');

	$chapterLinks.on('click', onChapterClick);

	setupChapterAffix();
	$('body').scrollspy({ target: '.chapter-nav' })

});
