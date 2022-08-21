// Работа сессий
function session_init() {
  // Проверка сессии
  var sSession = u0life.ajax_salt.session

  // Сессия есть, продолжаем
  if ( sSession ) {
    $.when(
      content_download( {
        'app':'app',
        'action':'sessions',
        'form':'continue',
        'session': sSession,
      }, 'json', false )
    ).done( function( oData ) {
      // Сессия ок
      if ( oData.success ) {
        if ( oData.success.user ) u0life.user = JSON.stringify(oData.success.user)
        if ( oData.success.session ) u0life.ajax_salt.session = oData.success.session

        u0life.save()
      }

      if ( oData.error ) {
        status( oData.error )
        localStorage.clear()
        location.reload()
      }

      u0life.init()
    })
  }

  // Сессии нет, создаём
  else {
    $.when(
      content_download( {
        'app':'app',
        'action':'sessions',
        'form':'new',
      }, 'json', false )
    ).done( function( oData ) {
      if ( oData.success && oData.success.session ) {
        u0life.ajax_salt.session = oData.success.session
        u0life.save()
      }
      if ( oData.error ) {
        localStorage.clear()
        location.reload()
      }

      u0life.init()
    })
  }
}
