// fttm_progress_bar
function fttm_progress_bar ( intProgress ) {
	var oProgressBar = $(document).find('.fttm_progress')

	if ( intProgress < 1 ) oProgressBar.addClass('_active_')
	else oProgressBar.removeClass('_active_')

	oProgressBar.attr('aria-valuenow', intProgress * 100 )
	oProgressBar.css('width', intProgress * 100 + '%' )
}
// fttm_progress_bar x
