// Отличие от того что в админке, загружается при скролле
// Последовательная загрузка
$.fn.content_loader = function( sEvent ) {
  arrPageParams.table = this.data().content_loader_table// Таблица для загрузки данных
  arrPageParams.form = this.data().content_loader_form // Запрос для вывода данных
  arrPageParams.from = this.data().content_loader_from // Запрос для вывода данных
  arrPageParams.limit = this.data().content_loader_limit // Лимит
  arrPageParams.sort = this.data().content_loader_sort // Сортировка
  arrPageParams.sortdir = this.data().content_loader_sortdir // Направление сортировки
  arrPageParams.scroll_block = this.data().content_loader_scroll_block // Лимит
  arrPageParams.scroll_nav = this.data().content_loader_scroll_nav // Куда добавлять данные, 0 - начало 1 - конец
  arrPageParams.parents = this.data().content_loader_parents // Родитель
  arrPageParams.filter = this.data().content_loader_filter // Фильтр
  arrPageParams.content_selector = '#' + this.attr('id') // Куда загружать данные при скролле
  arrPageParams.elem_show_class = this.data().content_loader_show_class // Класс показа
  arrPageParams.elem_template_path = this.data().content_loader_template // Путь до шаблона, как должны выглядеть элементы
  arrPageParams.elem_template_selector = this.data().content_loader_template_selector // Селектор шаблона, как должны выглядеть элементы

  arrPageContent.arrayObjects = [] // Вложенные лементы для дальшей обработки
  content_loader_init( sEvent )
}

// Запуск функции
function content_loader_init( sEvent ) {
  arrPageContent.scroll_block_height = $(document).find(arrPageContent.scroll_block).prop('scrollHeight')
  arrPageContent.from = 0
  if ( parseInt(arrPageParams.from) ) arrPageContent.from = arrPageParams.from
  if ( arrPageParams.scroll_block ) arrPageContent.scroll_block = arrPageParams.scroll_block
  // if ( ! arrPageContent.scroll_block ) arrPageContent.scroll_block = $(window).width() >= 920 ? '#main_block_content' : 'html, body'
  if ( parseInt(arrPageParams.parents) ) arrPageContent.parents = arrPageParams.parents
  if ( parseInt(arrPageParams.id) ) arrPageContent.id = arrPageParams.id
  arrPageContent.scroll_nav = arrPageParams.scroll_nav ? arrPageParams.scroll_nav : 0
  arrPageContent.full = false
  arrPageContent.table = arrPageParams.table // Таблица для загрузки данных
  arrPageContent.sort = arrPageParams.sort // Сортировка
  arrPageContent.sortdir = arrPageParams.sortdir // Направление соритровки
  arrPageContent.filter = arrPageParams.filter // Данные для фильтрации
  arrPageContent.form = arrPageParams.form // Запрос для вывода данных
  arrPageContent.limit = arrPageParams.limit ? arrPageParams.limit : 10 // Запрос для вывода данных
  arrPageContent.elem_show_class = arrPageParams.elem_show_class // Путь до шаблона, как должны выглядеть элементы
  arrPageContent.content_selector = arrPageParams.content_selector // Куда загружать данные при скролле
  arrPageContent.elem_template_path = arrPageParams.elem_template_path // Путь до шаблона, как должны выглядеть элементы
  arrPageContent.elem_template_selector = arrPageParams.elem_template_selector // Класс шаблона, как должны выглядеть элементы
  arrPageContent.oTemplate = {} // Объект шаблона
  // '#chronology'

  // Отображаем загрузку
  $(document).find(arrPageContent.content_selector).html('<small class="_loading"><i class="fa-solid fa-spinner fa-spin"></i></small>')

  // Загружаем шаблон и данные
  content_loader_template()
}

// Загрузка шаблона
function content_loader_template() {
  if ( arrPageContent.elem_template_path ) {
    $.get('/templates/' + arrPageContent.elem_template_path)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + arrPageContent.elem_template_path})
    })
    .done(function(data){
      if ( data ) {
        arrPageContent.oTemplate = $('<div/>').html(data)
        // Вставляем данные и настраиваем загрузку при прокрутке
        arrPageContent.from = 0
        arrPageParams.from = 0
        content_loader_load( 'start' )
        content_loader_scroll_init()
      }
    })
  }
  else {
    if ( arrPageContent.elem_template_selector ) {
      arrPageContent.oTemplate = $(document).find(arrPageContent.elem_template_selector)
      arrPageContent.from = 0
      arrPageParams.from = 0
      content_loader_load( 'start' )
      content_loader_scroll_init()
    }
  }
}

// Инициализация поля загрузки
function content_loader_scroll_init() {
  if ( arrPageContent.scroll_block ) $( document ).find(arrPageContent.scroll_block).on('scroll', content_loader_scroll_load)
  else {
    if ( ! arrPageContent.scroll_block ) arrPageContent.scroll_block = $(window).width() >= 920 ? '#main_block_content' : 'html, body'
    if ( $(window).width() >= 920  ) $( document ).find('#main_block_content').on('scroll', content_loader_scroll_load)
    else $( window ).bind('scroll', content_loader_scroll_load)
  }
}

// Догрузка элементов при скроле, определение позиции
function content_loader_scroll_load() {
  if ( arrPageContent.scroll_block_disabled ) return false
  if ( arrPageContent.full ) return false

  if ( arrPageContent.scroll_nav ) {
    if ( $(document).find(arrPageContent.scroll_block).scrollTop() == 0 ) {
      // - Прибавляем шаг
      arrPageContent.from = parseInt(arrPageContent.from) + parseInt(arrPageContent.limit)
      // - Загружаем сообщения
      content_loader_load( 'continue' )
    }
  }
  else {
    if ( ( parseInt($(document).find(arrPageContent.scroll_block).height()) + parseInt($(document).find(arrPageContent.scroll_block).scrollTop()) ) >= ( $(document).find(arrPageContent.scroll_block).prop('scrollHeight') - 100 ) ) {
      // - Прибавляем шаг
      arrPageContent.from = parseInt(arrPageContent.from) + parseInt(arrPageContent.limit)
      // - Загружаем сообщения
      content_loader_load( 'continue' )
    }
  }
}

// Загрузка элементов хронологии
function content_loader_load( sEvent ){
  arrPageContent.scroll_block_disabled = true
  $(document).find(arrPageContent.scroll_block).addClass('_no_scroll_')
  // Получаем данные
  $.when(
    content_download( {
      'action': arrPageContent.table,
      'form': arrPageContent.form,
      'parents': arrPageContent.parents,
      'from': arrPageContent.from,
      'sort': arrPageContent.sort,
      'sortdir': arrPageContent.sortdir,
      'limit': arrPageContent.limit,
      'filter': arrPageContent.filter,
    }, 'text', false )
  ).fail(function( xhr, textStatus, errorThrown ){
    $(document).find( arrPageContent.content_selector ).html( '<small class="_error_result"><span>Error: ' + xhr.statusText +  '(' + xhr.status + ')</span><i class="fa-solid fa-triangle-exclamation"></i></small>' )

  }).then( function( resultData ){
    if ( ! resultData || resultData == '[]' ) {
      var sClearText = ''
      if ( localStorage.getItem('lang') == 'ru' ) sClearText = 'Тут пока что пусто'
      else sClearText = 'It`s empty for now'
      if ( sEvent == 'start' ) $(document).find( arrPageContent.content_selector ).html( '<small class="_not_result"><span>' + sClearText + '</span><i class="fa-solid fa-face-smile"></i></small>' )
      return false
    }
    else {
      if ( sEvent == 'start' ) $(document).find( arrPageContent.content_selector ).html( '' )
    }
    var oContentLoadElems = $.parseJSON( resultData )
    var sResultHtml = ''

    // Есть элементы хронологии
    if ( oContentLoadElems.length ) {
      // Парсим и вставляем данные
      if ( arrPageParams.scroll_nav ) oContentLoadElems = oContentLoadElems.reverse()

      $.each(oContentLoadElems, function( iIndex, oContentLoadElem ){
        sResultHtml += content_loader_elem_html(oContentLoadElem)
      })

      if ( arrPageParams.scroll_nav ) {
        $(document).find( arrPageContent.content_selector ).prepend( sResultHtml )
        oContentLoadElems = oContentLoadElems.reverse()
      }
      else {
        $(document).find( arrPageContent.content_selector ).append( sResultHtml )
      }

      var iIndexTimerShow = 0
      $.each(oContentLoadElems, function( iIndex, oContentLoadElem ){
        setTimeout(function(){
          if ( arrPageContent.elem_show_class ) $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass(arrPageContent.elem_show_class)
          else $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass('_show_')
        }, 150 * iIndexTimerShow / 2)
        // Если последний элемент, обработка размеров, для плавности скролла
        if ( oContentLoadElems.length == iIndexTimerShow + 1 ) content_loader_scroll_to( sEvent )
        iIndexTimerShow++
      })
      if ( oContentLoadElems.length < 10 ) {
        arrPageContent.full = true
        $(document).find(arrPageContent.scroll_block).removeClass('_no_scroll_')
        $(document).find(arrPageContent.scroll_block).removeClass('_scroll_')
      }
    }
    // Хронология польностью загруженна
    else {
      arrPageContent.full = true
      $(document).find(arrPageContent.scroll_block).removeClass('_no_scroll_')
      $(document).find(arrPageContent.scroll_block).removeClass('_scroll_')
    }
  })
}

// Добавление элемента
function content_loader_add ( oContentLoadElem ){
  var sResultHtml = content_loader_elem_html(oContentLoadElem)
  if ( arrPageParams.scroll_nav ) $(document).find( arrPageContent.content_selector ).append( sResultHtml )
  else $(document).find( arrPageContent.content_selector ).prepend( sResultHtml )
  setTimeout(function(){
    if ( arrPageContent.elem_show_class ) $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass(arrPageContent.elem_show_class)
    else $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass('_show_')
  }, 150 )
}

// Обновление элемента
function content_loader_update ( oContentLoadElem ){
  var sResultHtml = content_loader_elem_html(oContentLoadElem)
  $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass('_update_').after(sResultHtml)
  $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]._update_').remove()
  setTimeout(function(){
    if ( arrPageContent.elem_show_class ) $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass(arrPageContent.elem_show_class)
    else $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').addClass('_show_')
  }, 150 )
}

// Удаление
function content_loader_del ( oContentLoadElem ){
  $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').hide('slow')
  setTimeout(function(){
    $(document).find( arrPageContent.content_selector ).find('._elem[data-id="' + oContentLoadElem.id + '"]').remove()
  }, 150 )
}

// Прокручивание страницы до нужного места
function content_loader_scroll_to( sEvent ) {
  // Определяем на сколько увеличилось пространство для сролла
  var
  // arrPageContent.scroll_block_height - Столько было
  sScrollBlockHeightNew = $(document).find(arrPageContent.scroll_block).prop('scrollHeight'), // - Столько стало
  sScrollBlockHeightValue = sScrollBlockHeightNew - arrPageContent.scroll_block_height // - Новый контент занял столько места
  // Сохраняем новый размер
  arrPageContent.scroll_block_height = sScrollBlockHeightNew
  // Передвигаем скролл
  $(document).find(arrPageContent.scroll_block).removeClass('_no_scroll_')
  arrPageContent.scroll_block_disabled = false
  // Если первая загрузка, то в самый конец, чтобы увидеть все записи
  if ( sEvent == 'start' )
    if ( arrPageContent.scroll_nav )
      $(document).find( arrPageContent.content_selector ).on('load', scroll_to(0, sScrollBlockHeightNew, 180, $(document).find(arrPageContent.scroll_block)))
    else
      $(document).find( arrPageContent.content_selector ).on('load', scroll_to(0, 0, 180, $(document).find(arrPageContent.scroll_block)))
  // Если подгрузка элементов, то скролим к последнему показанному перез догрузкой
  if ( sEvent == 'continue' ) {
    scroll_to(0, sScrollBlockHeightValue, 0, $(document).find(arrPageContent.scroll_block))
  }
}

// Шаблон элемента
function content_loader_elem_html( oContentLoadElem, oTemplate ){
  // arrPageContent.oTemplate - объект шаблона
	// oContentLoadElem - данные для шаблона

  oTemplate = oTemplate ? oTemplate : arrPageContent.oTemplate
  if ( typeof oTemplate === 'undefined' ) return false

  var
  oElemHtml = $(oTemplate),
  replaceKeyArray = [],
  replaceValueArray = [],
  sElemHtml = oElemHtml[0].innerHTML

  // Подставляем значения
  for (var key in oContentLoadElem ) {
    replaceKeyArray.push( key )
    replaceValueArray.push( oContentLoadElem[key] )
    // Вложенные элементы
    if ( typeof oContentLoadElem[key] === 'object' ) {
      // Сохраняем для дальнейшей обработки
      if ( arrPageContent.arrayObjects ) {
        if ( ! arrPageContent.arrayObjects[oContentLoadElem.id] ) arrPageContent.arrayObjects[oContentLoadElem.id] = []
        arrPageContent.arrayObjects[oContentLoadElem.id][key] = oContentLoadElem[key]
      }

      for (var keySub in oContentLoadElem[key] ) {
        replaceKeyArray.push( key + '.' + keySub )
        replaceValueArray.push( oContentLoadElem[key][keySub] )
      }
    }
  }
  for(var i = 0; i < replaceKeyArray.length; i++) {
    if ( sElemHtml != '' ) {
      if ( sElemHtml != '' && replaceKeyArray[i] && replaceValueArray[i] )
      if ( sElemHtml.indexOf('{{' + replaceKeyArray[i] + '}}') )
      sElemHtml = sElemHtml.split('{{' + replaceKeyArray[i] + '}}').join(replaceValueArray[i])
    }
  }

  // Убираем пустые поля
  sElemHtml = sElemHtml.replace(/{{(.*?)}}/g, '')


  return sElemHtml
}

$(function(){
  // Кнопка показа формы
  $(document).on('click', '.content_loader_show', function(){
    var oData = {
      'action': $(this).data().action,
      'form': $(this).data().form,
      'parents': $(this).data().parents,
      'id': $(this).data().id,
    }

    // Подставляем данные в форму из ссылки
    oData.data = {}
    oElemSuccessClick = {}
    if ( $(this).data().success_click ) oElemSuccessClick = $(document).find($(this).data().success_click)
    if ( $(this).data().full ) oData.data = $(this).data()
    // Подставляем данные из фильтра (url)
    if ( $(this).data().filter ) {
      var url = window.location
      new URL(url).searchParams.forEach(function (val, key) {
        if (oData.data[key] !== undefined) { // Проверяем параметр на undefined
          /* Проверяем, имеется ли в объекте аналогичный urlParams[key]
          *  Если его нет, то добавляем его в объект
          */
          if ( ! Array.isArray(params[key]) ) {
              oData.data[key] = [params[key]]
          }
          oData.data[key].push(val)
        }
        else {
          oData.data[key] = val
        }
      })
    }

    $.when(
      content_download( oData, 'json', false )
    ).then( function( oData ) {
      if ( oElemSuccessClick.length ) oElemSuccessClick.click()

      if ( oData.event )
        switch ( oData.event ) {
          case 'add':
            content_loader_add( oData.data )
            break;
        }

      if ( oData.form ) {
        oModal.set_content_full( oData.form )
        oModal.show()
      }
    })

    return false
  })

  // Кнопка редактирования
  $(document).on( 'submit', 'form#content_loader_save', function() {
    var
      oForm = $(this),
      oData = $(this).serializeArray()

    $.when(
      content_download( oData, 'json' )
    ).then( function( oData ) {
      if ( oData.success ) {
        var iLocationTime = 500
        if ( oData.success.location_time ) iLocationTime = oData.success.location_time

        if ( oData.success.data && oData.success.event ) {
          switch (oData.success.event) {
            case 'reload':
            case 'save':
              var stest = content_loader_update( oData.success.data )
              break;
            case 'add':
              content_loader_add( oData.success.data )
              break;
            case 'del':
              content_loader_del( oData.success.data )
              break;
          }
        }

        if ( oForm.find('[name="success_click"]').length ) $(document).find(oForm.find('[name="success_click"]').val()).click()

        if ( oData.success.location ) {
          setTimeout(function(){
            $(location).attr('href',oData.success.location)
          }, iLocationTime )
        }
        if ( oData.success.location_reload ) {
          setTimeout(function(){
            location.reload()
          }, iLocationTime )
        }
      }

      if ( oData.location_reload ) {
        setTimeout(function(){
          location.reload()
        }, iLocationTime )
      }
    })

    return false
  })

  // Кнопка удаления
  $(document).on('click', '.content_loader_del', function(){
    if ( ! $(this).data().elem ) {
      status({'error':'No element selector to remove'})
      return false
    }
    var oElem = $(this).parents( $(this).data().elem )

    // Подтверждение
    if  ( ! confirm('Are you sure you want to delete this item?') ) return false

    $.when(
      content_download( {
        'action': $(this).data().action,
        'form': $(this).data().form,
        'id': $(this).data().id,
      }, 'json' )
    ).then( function( oData ){
      if ( oData.success ) oElem.remove()
      else $.fancybox.open( '<p class="error">' + oData.error + '</p>' )
    })

    return false
  })
})
