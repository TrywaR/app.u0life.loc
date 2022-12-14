function block_nav_init(){
  $(document).find('#block_nav ._main').html('')
  $(document).find('#block_nav ._subs').html('')
  $(document).find('#block_nav ._subs').removeClass('_active_')
  $(document).find('#block_nav_mobile_subs').removeClass('_showed_')

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

  block_nav_load()
}

// Загрузка меню
function block_nav_load(){
  console.log('block_nav_load')
  // load menu
  $.when(
    content_download( {
      'app':'app',
      'action':'navs',
      'form':'show',
    }, 'json', false )
  ).then( function( oData ){
    u0life.oNav = oData
    u0life.save()
  })
}

// Показ основного меню
function block_nav_main_show(){
  console.log('block_nav_main_show')
  $.get('templates/nav.htm')
  .fail(function(data){
    status({'error': 'Шаблон не найден: templates/nav.htm'})
  })
  .done(function(data){
    var
      oTemplate = $('<div/>').html(data),
      arrThisPath = u0life.pathname.split('/'),
      bMenuShow = false

    // Сброс корневой иконки
    if ( $(document).find('#block_nav_mobile_main ._icon').hasClass('__new') ) {
      $(document).find('#block_nav_mobile_main ._icon').removeClass('__new')
      $(document).find('#block_nav_mobile_main ._icon ._old').html( '<i class="fa-solid fa-bars"></i>' )
      $(document).find('#block_nav_mobile_main ._name').removeClass('__new')
      $(document).find('#block_nav_mobile_main ._name ._old').html( $(document).find('#block_nav_mobile_main ._name ._new').data().deftext )
    }

    if ( ! $(document).find('#block_nav ._main a').length ) {
      $(document).find('#block_nav ._main').html('')
      $(document).find('#block_nav ._subs').html('')
      bMenuShow = true
    }

    $.each(u0life.oNav, function( iPath, oElem ){
      // Подсвет
      if ( oElem.url == '/' + arrThisPath[1] + '/'  ) oElem.active = '_active_'
      if ( oElem.url == u0life.pathname  ) oElem.active = '_active_'

      // Подстановка в меню на мобиле
      if ( oElem.active ) block_nav_mobile_main( oElem )

      // Если нужно добавить
      if ( bMenuShow ) {
        if ( ! oElem.menu_hide ) {
          // Шаблон
          var oElemHtml = content_loader_elem_html( oElem, oTemplate )
          // Добавление
          $(document).find('#block_nav ._main').append( oElemHtml )
        }
      }
    })

    if ( $(document).find('#block_nav ._main a').length ) $(document).find('#block_nav_mobile_main').addClass('_showed_')
    else $(document).find('#block_nav_mobile_main').removeClass('_showed_')
  })
}

// Вывод вложенных меню
function block_nav_subs_show(){
  console.log('block_nav_subs_show')
  $.get('templates/nav.htm')
  .fail(function(data){
    status({'error': 'Шаблон не найден: templates/nav.htm'})
  })
  .done(function(data){
    var
      oTemplate = $('<div/>').html(data),
      arrThisPath = u0life.pathname.split('/')

    $(document).find('#block_nav ._subs').html('')
    $(document).find('#block_nav ._subs').removeClass('_active_')
    $(document).find('#block_nav_mobile_subs').removeClass('_showed_')

    $.each(u0life.oNav, function( iPath, oElem ){
      // Подсвет
      if ( oElem.url == '/' + arrThisPath[1] + '/'  ) oElem.active = '_active_'
      if ( oElem.url == u0life.pathname  ) oElem.active = '_active_'

      // Вложенность
      if ( oElem.subs && parseInt( oElem.subs.length ) != 0 && oElem.active ) {
        $(document).find('#block_nav_mobile_subs').addClass('_showed_')
        $(document).find('#block_nav ._subs').addClass('_active_')

        $.each(oElem.subs, function( iPathSub, oElemSub ){
          // Подсвет
          if ( oElemSub.url == '/' + arrThisPath[2] + '/'  ) oElemSub.active = '_active_'
          if ( oElemSub.url == u0life.pathname  ) oElemSub.active = '_active_'

          // Подстановка в меню на мобиле
          if ( oElemSub.active ) block_nav_mobile_subs( oElemSub )

          // Шаблон
          var oElemSubHtml = content_loader_elem_html( oElemSub, oTemplate )

          // Добавление
          if ( ! oElem.menu_hide ) $(document).find('#block_nav ._subs').append( oElemSubHtml )
        })
      }

      // Сброс вложенной иконки
      if ( ! $(document).find('#block_nav_mobile_subs').hasClass('_showed_') ) {
        $(document).find('#block_nav_mobile_subs ._icon').removeClass('__new')
        $(document).find('#block_nav_mobile_subs ._icon ._old').html( '<i class="fa-solid fa-ellipsis"></i>' )
        $(document).find('#block_nav_mobile_subs ._name').removeClass('__new')
        $(document).find('#block_nav_mobile_subs ._name ._old').html( $(document).find('#block_nav_mobile_subs ._name ._new').data().deftext )
      }
    })
  })
}

// Показ активного пункта основного меню
function block_nav_mobile_main( oElem ){
  setTimeout(function () {
    if ( typeof oElem != 'undefined' && oElem.active ) {
      $(document).find('#block_nav_mobile_main ._icon').addClass('__new')
      $(document).find('#block_nav_mobile_main ._icon ._new').html( oElem.icon )
      $(document).find('#block_nav_mobile_main ._name').addClass('__new')
      $(document).find('#block_nav_mobile_main ._name ._new').html( oElem.name )
    }
  }, 500)
}

// Показ активного пункта вложенного меню
function block_nav_mobile_subs( oElem ){

  setTimeout(function (){
    $(document).find('#block_nav_mobile_subs').removeClass('_showed_')

    if ( typeof oElem != 'undefined' && oElem.active ) {
      $(document).find('#block_nav_mobile_subs ._icon').addClass('__new')
      $(document).find('#block_nav_mobile_subs ._icon ._new').html( oElem.icon )
      $(document).find('#block_nav_mobile_subs ._name').addClass('__new')
      $(document).find('#block_nav_mobile_subs ._name ._new').html( oElem.name )
      $(document).find('#block_nav_mobile_subs').addClass('_showed_')
    }
  }, 500)
}

// Обновление активного url при обновлении
function block_nav_update(){
  block_nav_main_show()
  block_nav_subs_show()
}
