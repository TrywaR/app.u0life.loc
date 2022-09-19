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

  // select2
  oFilter.find('select').each(function( iIndex, oElem ){
    $(oElem).select2({
      selectionCssClass: ':all:',
      templateSelection: function( data ){
        if (!data.id) {
          return data.text;
        }

        if (data.element) {
          if ( $(data.element).data().color ) {
            var $state = $(
              '<span class="_color" style="background:' + $(data.element).data().color + ';"></span><span class="_text">' + data.text + '</span>'
            )
            return $state
          }
        }

        return data.text;
      },
      templateResult: function (data, container) {
        if (data.element) {
          if ( $(data.element).data().color ) {
            var $state = $(
              '<span class="_color" style="background:' + $(data.element).data().color + ';"></span><span class="_text">' + data.text + '</span>'
            )
            return $state
          }
        }
        return data.text
      }
    })
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
    switch ( $(this).attr('type') ) {
      case 'checkbox':
        if ( $(this).prop("checked") ) {
          $(this).addClass('_active_')
          iVals++
        }
        else {
          $(this).removeClass('_active_')
        }
        break
      default:
        // Подцветка активных
        if ( parseInt( $(this).val() ) || $(this).val().length > 1 ) {
          $(this).addClass('_active_')
          iVals++
        }
        else {
          $(this).removeClass('_active_')
        }
        break
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
    switch ( $(this).attr('type') ) {
      case 'checkbox':
        if ( $(this).prop("checked") ) {
          $(this).addClass('_active_')
          iVals++
        }
        else {
          $(this).removeClass('_active_')
        }
        break
      default:
        // Подцветка активных
        if ( parseInt( $(this).val() ) || $(this).val().length > 1 ) {
          $(this).addClass('_active_')
          iVals++
        }
        else {
          $(this).removeClass('_active_')
        }
        break
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

function content_filter_get_param( sFilterParam ) {
  var p={};
 location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,sFilterParam,v){p[sFilterParam]=v})
 return sFilterParam?p[sFilterParam]:p;
}

$(function(){
  // Кнопки учитывающие параметры фильтра (подтягивает в url для ссылки параметры из фильтра)
  $(document).on('click','.content_filter_in_url',function(){
    var
      arrParams = content_filter_get_param(),
      oFilterButton = $(this)

    $.each(arrParams, function( sKey, sValue ){
      var sBaseUrl = ''

      if ( oFilterButton.attr('href').indexOf(':') < 0 )
        sBaseUrl = window.location.protocol + "//" + window.location.host

      var oUrl = new URL( sBaseUrl + oFilterButton.attr('href') )
      oUrl.searchParams.set(sKey, sValue)

      oFilterButton.attr( 'href', oUrl )
    })

    return
  })
})
