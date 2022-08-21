$.fn.content_actions = function( oParams ) {
  oBlockActions = $(this)
  content_actions_init( oBlockActions, oParams )
}

function content_actions_init( oBlockActions, oParams ) {
  if ( ! oBlockActions.length ) oBlockActions = $(document).find('#footer_actions')
  // Получаем данные
  $.when(
    content_download( {
      'action': oParams.action,
      'form': 'actions',
    }, 'text', false )
  ).then( function( resultData ){
    if ( ! resultData ) return false
    var oData = $.parseJSON( resultData )
    var sResultHtml = ''

    sResultHtml = oData

    oBlockActions.html( sResultHtml ).addClass('_active_  animate__bounce')
  })
}
