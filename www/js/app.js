var $chapterLinks = null;

var onChapterClick = function() {
	var target = $(this).attr('href');
	$.scrollTo($(target), { duration: 350 });
}

var setupChapterAffix = function() {
	if (Modernizr.mq('only screen and (min-width: 992px)')){
		$('.chapter-nav ul').affix({
			offset: {
				top: function () {
					return (this.top = $('.chapter-nav').offset().top + 11)
				}
			}
		})
	}
}

$(function() {
	$chapterLinks = $('.chapter-nav a');

	$chapterLinks.on('click', onChapterClick);

	setupChapterAffix();
});
