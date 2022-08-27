$.fn.content_actions = function( oParams ) {
  oBlockActions = $(this)
  content_actions_init( oBlockActions, oParams )
}

function content_actions_init( oBlockActions, oParams ) {
  if ( ! oBlockActions.length ) oBlockActions = $(document).find('#footer_actions')

  // Убираем то что было
  content_actions_clear( oBlockActions )

  // Если нет что загружать, на этом всё
  if ( ! oParams.action ) return false

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

    oBlockActions.html( sResultHtml ).removeClass('animate__bounceOutDown')
    oBlockActions.html( sResultHtml ).addClass('_active_ animate__bounceInUp')
  })
}

function content_actions_clear( oBlockActions ) {
  if ( ! oBlockActions.length ) oBlockActions = $(document).find('#footer_actions')
  oBlockActions.removeClass('_active_ animate__bounceInUp')
  oBlockActions.addClass('animate__bounceOutDown')
}
