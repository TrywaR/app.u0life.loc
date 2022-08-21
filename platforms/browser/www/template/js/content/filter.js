$.fn.content_filter = function() {
  arrPageParams.content_filter_action = this.data().content_filter_action
  arrPageParams.content_filter_block = this.data().content_filter_block
  arrPageParams.content_filter_item = this.data().content_filter_item
  arrPageParams.content_filter_status = this.data().content_filter_status
  arrPageParams.content_filter_button = this.data().content_filter_button
  arrPageParams.content_filter_active = false
  oFilter = $(this)

  content_filter_init( oFilter )
}

function content_filter_init( oFilter ) {
  // Вставляем значения из урл
  var
    urlParams = new URLSearchParams(window.location.search),
    iValsCount = oFilter.find('input,select').length - 1

  // Перебираем фильтр
  oFilter.find('input,select').each(function( iIndex, oElem ){
    // Вставляем значения из url если есть
    var sVal = urlParams.get( $(this).attr('name') )
    if ( sVal ) $(this).val( sVal )

    if ( iValsCount == iIndex ) {
      setTimeout(function(){
        content_filter_active( oFilter )
      }, 300)
    }
  })

  // Нажатие на фильр
  oFilter.on('submit', function(){
    // Вставляем значение в лоадер
    $(document).find( arrPageParams.content_filter_block ).addClass('animate__animated animate__headShake')

    // Сохранение в url
    var oUrl = new URL(window.location)
    $.each(oFilter.serializeArray(), function( iIndex, oElem ){
      oUrl.searchParams.set(oElem.name, oElem.value)
      history.pushState(null, null, oUrl)
    })

    // ЗАпускаем фильтр
    content_filter_active( oFilter )

    // Скрываем окно фильтра
    oFilter.parents('._block_content').removeClass('_show_')

    return false
  })
}

function content_filter_active( oFilter ) {
  var
    iVals = 0,
    iValsCount = oFilter.find('input,select').length - 1

  // Сбрасываем значения фильтра
  arrPageParams.content_filter_active = false
  oFilter.removeClass('_active_')
  if ( arrPageParams.content_filter_status ) $(document).find(arrPageParams.content_filter_status).removeClass('__on')

  // Перебираем фильтр
  oFilter.find('input,select').each(function( iIndex, oElem ){
    // Подцветка активных
    if ( parseInt( $(this).val() ) || $(this).val().length > 1 ) {
      $(this).addClass('_active_')
      iVals++
    }
    else {
      $(this).removeClass('_active_')
    }

    // Вконце подсвечивам сам фильтр и применяем
    if ( iValsCount == iIndex ) {
      if ( iVals ) {
        arrPageParams.content_filter_active = true
        if ( arrPageParams.content_filter_status ) $(document).find(arrPageParams.content_filter_status).addClass('__on')
        oFilter.addClass('_active_')
      }

      $(document).find( arrPageParams.content_filter_block ).data('content_loader_filter', oFilter.serializeArray())

      setTimeout(function(){
        $(document).find( arrPageParams.content_filter_block ).html('')
        $(document).find( arrPageParams.content_filter_block ).content_loader()
      }, 300)
    }
  })
}
