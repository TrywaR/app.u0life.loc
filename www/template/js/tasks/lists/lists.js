// Показ списков
function lists_show( oElem ){

  if ( $(this).hasClass('__list_show') ) {
    oElem.html( '' )
    $(this).removeClass('__list_show')
  }
  else {
    $(this).addClass('__list_show')
    oElem.html( u0life.oLoadingHtm )
    oElem.lists( oElem.data() )
  }
}

// Запуск работы списков
$.fn.lists = function( oListsData ) {
  var u0Lists = new Lists( oListsData, this, '/templates/tasks/lists/lists.htm' )
}

// Параметры теста
function Lists( oListsData, oBlockElem, sTemplate, bInit )
{
  this.sTemplate = sTemplate // Путь к шаблону списка
  this.oBlockWrap = oBlockElem // Блок с элементом (Родитель)
  this.oBlockLists = {} // Блок с элементом (Родитель)
  this.oListsData = oListsData // Данные

  // Инициализация нажатия кнопок
  this.init = function () {
    var u0ListsCurrent = this

    // Загружаем шаблон списка
    $.get(u0ListsCurrent.sTemplate)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + u0ListsCurrent.sTemplate})
    })
    .done(function( data ){
      if ( ! data ) return false

      // Вставляем шаблон
      $.when(
        u0ListsCurrent.oBlockWrap.html( content_loader_elem_html( u0ListsCurrent.oListsData, $('<div/>').html(data) ) )

      ).done(function(){
        u0ListsCurrent.oBlockLists = u0ListsCurrent.oBlockWrap.find('.block_lists')

        // Загружаем списки задачи
        $.when(
          content_download( {
            'action': 'tasks_lists',
            'form': 'show',
            'filter': {
              0: {
                'name': 'task_id',
                'value': u0ListsCurrent.oListsData.task_id,
              }
            },
          }
          , 'json', false )
        ).then( function( oData ){
          $.each(oData,function( iIndex, oElem ){
            // Добавляем список
            u0ListsCurrent.oBlockWrap.find('._lists_data').list( oElem )

            if ( iIndex == oData.length - 1 ) {
              // Сортировка перетягиванием
              u0ListsCurrent.oBlockWrap.find('._lists_data').sortable({
                handle: '.__list_sort',
                stop: function(){
                  u0ListsCurrent.sort()
                }
              })
            }
          })
        })

        // КНОПКИ
        // Добавления списка
        u0ListsCurrent.oBlockLists.find('.__list_add').on ('click', function(){
          // Сортировка
          var iSortLast = parseInt( u0ListsCurrent.oBlockWrap.find('._lists_data .block_list:last').attr('data-sort') )
          if ( iSortLast > u0ListsCurrent.oBlockWrap.find('._lists_data .block_list').length ) iSortLast++
          else iSortLast = u0ListsCurrent.oBlockWrap.find('._lists_data .block_list').length + 1

          // Добавляем список
          $.when(
    			  content_download( {
              'action': 'tasks_lists',
              'form': 'add',
              'sort': iSortLast,
              'task_id': u0ListsCurrent.oListsData.task_id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData.data ) return false

            // Добавляем список
            u0ListsCurrent.oBlockWrap.find('._lists_data').list( oData.data )
          })
        })
      })
    })
  }

  // Сортировка
  this.sort = function () {
    var u0ListsCurrent = this

    u0ListsCurrent.oBlockWrap.find('._lists_data .block_list').each(function( iIndex, oElem ){
      // Меняем индекс
      $(oElem).attr('data-sort', iIndex)
      // Сохраняем
      content_download( {
        'action': 'tasks_lists',
        'form': 'sort',
        'sort': iIndex,
        'id': $(oElem).attr('data-id'),
      }
      , 'json', false )
    })
  }

  // Запуск работы
  this.init()
}
