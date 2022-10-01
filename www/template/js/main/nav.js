function block_nav_init(){
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

  block_nav_show()
}

function block_nav_show(){
  $.get('/templates/nav.htm')
  .fail(function(data){
    status({'error': 'Шаблон не найден: /templates/nav.htm'})
  })
  .done(function(data){
    var
      oTemplate = $('<div/>').html(data),
      arrThisPath = u0life.pathname.split('/')

    // Показываем корневые элементы
    // ________
    $.each(u0life.oNav, function( iPath, oElem ){
      if ( oElem.menu_hide ) return

      // Подсвет
      if ( oElem.url == '/' + arrThisPath[1] + '/'  ) oElem.active = '_active_'
      if ( oElem.url == u0life.pathname  ) oElem.active = '_active_'

      // Добавление
      $(document).find('#block_nav ._main').append( content_loader_elem_html( oElem, oTemplate ) )

      // Подстановка в меню на мобиле
      if ( oElem.active ) block_nav_mobile_main( oElem )

      // Если есть вложенность
      // Вложенность
      if ( oElem.subs && parseInt( oElem.subs.length ) != 0 && oElem.active ) {
        var iPathSubIndex = 0
        $.each(oElem.subs, function( iPathSub, oElemSub ){
          if ( oElemSub.menu_hide ) return

          // Подсвет
          oElemSub.active = ''
          if ( oElemSub.url == '/' + arrThisPath[2] + '/'  ) oElemSub.active = '_active_'
          if ( oElemSub.url == u0life.pathname  ) oElemSub.active = '_active_'

          // Добавляем
          $(document).find('#block_nav ._subs').append( content_loader_elem_html( oElemSub, oTemplate ) )
          iPathSubIndex++
          setTimeout(function () {
            $(document).find('#block_nav ._subs a[href="' + oElemSub.url + '"]').parents('.nav-item').addClass('_show_')

            // Подстановка в меню на мобиле
            if ( oElemSub.active ) block_nav_mobile_subs( oElemSub )
          }, 300 * iPathSubIndex / 2)
        })
      }

      // Показываем меню если есть пункты
      if ( u0life.oNav.length >= iPath - 1 ) {
        if ( $(document).find('#block_nav ._main a').length ) $(document).find('#block_nav_mobile_main').addClass('_showed_')
        else if ( $(document).find('#block_nav_mobile_main').hasClass('_showed_') ) $(document).find('#block_nav_mobile_main').removeClass('_showed_')

        if ( $(document).find('#block_nav ._subs a').length ) {
          $(document).find('#block_nav_mobile_subs').addClass('_showed_')
          $(document).find('#block_nav ._subs').addClass('_active_')
        }
      }
    })
  })
}

// Показ активного пункта основного меню
function block_nav_mobile_main( oElem ){
  setTimeout(function () {
    if ( ! $(document).find('#block_nav ._main a[href="' + oElem.url + '"]').hasClass('_active_') ) {
      $(document).find('#block_nav ._main .nav-item._active_').removeClass('_active_')
      $(document).find('#block_nav ._main .nav-link._active_').removeClass('_active_')

      $(document).find('#block_nav ._main a[href="' + oElem.url + '"]').addClass('_active_')
      $(document).find('#block_nav ._main a[href="' + oElem.url + '"]').parents('.nav-item').addClass('_active_')
    }

    $(document).find('#block_nav_mobile_main ._icon ._new').html( oElem.icon )
    $(document).find('#block_nav_mobile_main ._name ._new').html( oElem.name )
    $(document).find('#block_nav_mobile_main ._icon').addClass('__new')
    $(document).find('#block_nav_mobile_main ._name').addClass('__new')
  }, 500)
}

// Показ активного пункта вложенного меню
function block_nav_mobile_subs( oElem ){
  setTimeout(function (){
    $(document).find('#block_nav_mobile_subs ._icon ._new').html( oElem.icon )
    $(document).find('#block_nav_mobile_subs ._name ._new').html( oElem.name )
    $(document).find('#block_nav_mobile_subs ._icon').addClass('__new')
    $(document).find('#block_nav_mobile_subs ._name').addClass('__new')
  }, 500)
}

function block_nav_update(){
  // Сброс корневой иконки
  if ( $(document).find('#block_nav_mobile_main ._icon').hasClass('__new') ) {
    $(document).find('#block_nav ._main .nav-link._active_').removeClass('_active_')
    $(document).find('#block_nav_mobile_main ._icon').removeClass('__new')
    $(document).find('#block_nav_mobile_main ._icon ._old').html( '<i class="fa-solid fa-bars"></i>' )
    $(document).find('#block_nav_mobile_main ._name').removeClass('__new')
    $(document).find('#block_nav_mobile_main ._name ._old').html( $(document).find('#block_nav_mobile_main ._name ._new').data().deftext )
  }

  // Сброс вложенной иконки и вложенного меню
  // if ( ! $(document).find('#block_nav_mobile_subs').hasClass('_showed_') ) {
    $(document).find('#block_nav_mobile_subs ._icon').removeClass('__new')
    $(document).find('#block_nav_mobile_subs ._icon ._old').html( '<i class="fa-solid fa-ellipsis"></i>' )
    $(document).find('#block_nav_mobile_subs ._name').removeClass('__new')
    $(document).find('#block_nav_mobile_subs ._name ._old').html( $(document).find('#block_nav_mobile_subs ._name ._new').data().deftext )
  // }

  $(document).find('#block_nav ._subs').html('')
  $(document).find('#block_nav ._subs').removeClass('_active_')
  $(document).find('#block_nav_mobile_subs').removeClass('_showed_')

  $.get('/templates/nav.htm')
  .fail(function(data){
    status({'error': 'Шаблон не найден: /templates/nav.htm'})
  })
  .done(function(data){
    var
      oTemplate = $('<div/>').html(data),
      arrThisPath = u0life.pathname.split('/')

    // Показ по корневому
    $.each(u0life.oNav, function( iPath, oElem ){
      if ( oElem.menu_hide ) return

      // Подсвет
      oElem.active = ''
      if ( oElem.url == '/' + arrThisPath[1] + '/'  ) oElem.active = '_active_'
      if ( oElem.url == u0life.pathname  ) oElem.active = '_active_'

      // Подстановка в меню на мобиле
      if ( oElem.active ) block_nav_mobile_main( oElem )

      // Вложенность
      if ( oElem.subs && parseInt( oElem.subs.length ) != 0 && oElem.active ) {
        var iPathSubIndex = 0
        $.each(oElem.subs, function( iPathSub, oElemSub ){
          if ( oElemSub.menu_hide ) return

          // Подсвет
          oElemSub.active = ''
          if ( oElemSub.url == '/' + arrThisPath[2] + '/'  ) oElemSub.active = '_active_'
          if ( oElemSub.url == u0life.pathname  ) oElemSub.active = '_active_'

          // добавляем
          $(document).find('#block_nav ._subs').append( content_loader_elem_html( oElemSub, oTemplate ) )
          iPathSubIndex++
          setTimeout(function () {
            $(document).find('#block_nav ._subs a[href="' + oElemSub.url + '"]').parents('.nav-item').addClass('_show_')

            // Подстановка в меню на мобиле
            if ( oElemSub.active ) block_nav_mobile_subs( oElemSub )
          }, 300 * iPathSubIndex / 2)
        })
      }

      if ( u0life.oNav.length >= iPath - 1 ) {
        if ( $(document).find('#block_nav ._subs a').length ) {
          $(document).find('#block_nav_mobile_subs').addClass('_showed_')
          $(document).find('#block_nav ._subs').addClass('_active_')
        }
      }
    })
  })
}
