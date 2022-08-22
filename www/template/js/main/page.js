function page( sUrl, oData ){
  var sUrlClear = ''
  // Если есть параметры в урле, сохраняем их
  if (typeof sUrl != 'undefined' && sUrl.indexOf('?') + 1) {
    var arrUrl = sUrl.split('?')
    sUrlClear = arrUrl[0]
    if ( arrUrl[1] ) {
      var arrParams = arrUrl[1].split('&')
      $.each(arrParams, function(index, param){
        var arrParam = param.split('=')
        arrPageParams[arrParam[0]] = arrParam[1]
      })
    }

    oData = $.extend( oData, arrPageParams )
  }
  else sUrlClear = sUrl

  // Добавляем преедаваемые параметры в параметры страницы
  if ( oData ) arrPageParams = $.extend( oData, arrPageParams )


  oDataGet = {
    'action': 'contents',
    'form': 'show',
    'path': sUrlClear,
  }

  oDataGet = $.extend( oData, oDataGet )

  $.when(
    content_download( oDataGet, 'json', false )
  ).then( function( oData ){
    if ( oData.success ) {
      // Подставляем адрес в url
      // history.pushState(null, null, sUrl)
      u0life.pathname = sUrl

      // Вставляем контент
      var oMainHtml = $('<div/>').html(oData.success)
      $(document).find('main').html( oMainHtml )

      // Обновляем меню
      block_nav()
      // block_nav_update()

      // чистим url
      history.pushState(null, null, '/')
    }
  })
}
