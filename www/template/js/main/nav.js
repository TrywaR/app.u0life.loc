function block_nav() {
  // Style showers
  if ( typeof u0life.block_nav_fuller != 'undefined' ) {
    if ( u0life.block_nav_fuller ) {
      $(document).find('#block_nav_fuller').addClass('_full_')
      $(document).find('#block_nav').addClass('_full_')
      $(document).find('header').addClass('_full_')
    }
    else {
      $(document).find('#block_nav_fuller').removeClass('_full_')
      $(document).find('#block_nav').removeClass('_full_')
      $(document).find('header').removeClass('_full_')
    }
  }
  else {
    $(document).find('#block_nav_fuller').addClass('_full_')
    $(document).find('#block_nav').addClass('_full_')
    $(document).find('header').addClass('_full_')
  }

  // load menu
  $.when(
    content_download( {
      'app':'app',
      'action':'navs',
      'form':'show',
    }, 'json', false )
  ).then( function( oData ){
    $.get('templates/nav.htm')
    .fail(function(data){
      status({'error': 'Шаблон не найден: templates/nav.htm'})
    })
    .done(function(data){
      var
        oTemplate = $('<div/>').html(data),
        arrThisPath = location.pathname.split('/')

      $(document).find('#block_nav ._subs').removeClass('_active_')

      $.each(oData, function( iPath, oElem ){
        // Подсвет
        if ( oElem.url == '/' + arrThisPath[1] + '/'  ) oElem.active = '_active_'
        if ( oElem.url == location.pathname  ) oElem.active = '_active_'

        // Подстановка в меню на мобиле
        if ( oElem.active ) block_nav_mobile_main( oElem )

        // Шаблон
        var oElemHtml = content_loader_elem_html( oElem, oTemplate )
        // Добавление
        if ( ! oElem.menu_hide ) $(document).find('#block_nav ._main').append( oElemHtml )
        // Вложенность
        if ( oElem.subs && parseInt( oElem.subs.length ) != 0 && oElem.active ) {
          $(document).find('#block_nav_mobile_subs').addClass('_showed_')
          $(document).find('#block_nav ._subs').addClass('_active_')

          $.each(oElem.subs, function( iPathSub, oElemSub ){
            // Подсвет
            if ( oElemSub.url == '/' + arrThisPath[2] + '/'  ) oElemSub.active = '_active_'
            if ( oElemSub.url == location.pathname  ) oElemSub.active = '_active_'

            // Подстановка в меню на мобиле
            if ( oElemSub.active ) block_nav_mobile_subs( oElemSub )

            // Шаблон
            var oElemSubHtml = content_loader_elem_html( oElemSub, oTemplate )
            // Добавление
            if ( ! oElem.menu_hide ) $(document).find('#block_nav ._subs').append( oElemSubHtml )
          })
        }
      })

      if ( $(document).find('#block_nav ._main a').length ) $(document).find('#block_nav_mobile_main').addClass('_showed_')
      else $(document).find('#block_nav_mobile_main').removeClass('_showed_')
    })
  })
}

function block_nav_mobile_main( oElem ){
  if ( typeof oElem != 'undefined' && oElem.active ) {
    $(document).find('#block_nav_mobile_main ._icon').addClass('__new')
    $(document).find('#block_nav_mobile_main ._icon ._new').html( oElem.icon )
    $(document).find('#block_nav_mobile_main ._name').addClass('__new')
    $(document).find('#block_nav_mobile_main ._name ._new').html( oElem.name )
  }
  else {
    $.each('#block_nav ._main a', function( iIndex, oElem ){
      if ( oElem.attr('href') == location.pathname ) {
        $(document).find('#block_nav_mobile_main ._icon').addClass('__new')
        $(document).find('#block_nav_mobile_main ._icon ._new').html( oElem.find('._icon').html() )
        $(document).find('#block_nav_mobile_main ._name').addClass('__new')
        $(document).find('#block_nav_mobile_main ._name ._new').html( oElem.find('._name').html() )
      }
    })
  }
}
function block_nav_mobile_subs( oElem ){
  if ( typeof oElem != 'undefined' && oElem.active ) {
    $(document).find('#block_nav_mobile_subs ._icon').addClass('__new')
    $(document).find('#block_nav_mobile_subs ._icon ._new').html( oElem.icon )
    $(document).find('#block_nav_mobile_subs ._name').addClass('__new')
    $(document).find('#block_nav_mobile_subs ._name ._new').html( oElem.name )
  }
  else {
    $.each('#block_nav ._subs a', function( iIndex, oElem ){
      if ( oElem.attr('href') == location.pathname ) {
        $(document).find('#block_nav_mobile_subs ._icon').addClass('__new')
        $(document).find('#block_nav_mobile_subs ._icon ._new').html( oElem.find('._icon').html() )
        $(document).find('#block_nav_mobile_subs ._name').addClass('__new')
        $(document).find('#block_nav_mobile_subs ._name ._new').html( oElem.find('._name').html() )
      }
    })
  }

  // if ( $(document).find('#block_nav ._subs a').length ) $(document).find('#block_nav_mobile_subs').addClass('_showed_')
  // else $(document).find('#block_nav_mobile_subs').removeClass('_showed_')
}

function block_nav_update(){
  block_nav_mobile_main()
  block_nav_mobile_subs()
}
