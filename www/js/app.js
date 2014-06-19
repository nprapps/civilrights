var $chapterLinks = null;
var $modeToggleButtons = null;
var $tabPanes = null;

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

var onModeToggleClick = function() {
	var $this = $(this);
	var target = $this.attr('href');
	var parentActive = $this.parent().hasClass('active');

	if(!parentActive){
		$this.parent().addClass('active');
		$this.parent().siblings().removeClass('active');
	}

	$tabPanes.removeClass('show');
	$(target).addClass('show');

	if (target === "#bill"){
		$('body').scrollspy({ target: '.chapter-nav' })
		$('[data-spy="scroll"]').each(function () {
		  var $spy = $(this).scrollspy('refresh')
		});
	}

	return false;
}

$(function() {
	$chapterLinks = $('.chapter-nav a');
	$modeToggleButtons = $('.mode-toggle a');
	$tabPanes = $('.tab-pane');

	$chapterLinks.on('click', onChapterClick);
	$modeToggleButtons.on('click', onModeToggleClick);

	setupChapterAffix();
});
