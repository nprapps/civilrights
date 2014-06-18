var $chapterLinks = null;

var onChapterClick = function(){
	var target = $(this).attr('href');
	$.scrollTo($(target), { duration: 350 });
}

$(function() {
	$chapterLinks = $('.chapter-nav a');

	$chapterLinks.on('click', onChapterClick);
});
