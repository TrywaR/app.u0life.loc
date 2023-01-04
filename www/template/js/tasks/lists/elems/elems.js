// Запуск работы списков
$.fn.list_elems = function( oListData ) {
  var u0ListElems = new List_elems( oListData, this, '/templates/tasks/lists/elems/elems.htm' )
}

// Параметры теста
function List_elems( oListData, oBlockElem, sTemplate, bInit )
{
  this.sTemplate = sTemplate // Путь к шаблону списка
  this.oBlockWrap = oBlockElem // Блок с элементом (Родитель)
  this.oBlockListElems = {} // Блок с элементом (Родитель)
  this.oListData = oListData // Данные

  // Инициализация нажатия кнопок
  this.init = function () {
    var u0ListsElemsCurrent = this

    // Загружаем шаблон элементов
    $.get(u0ListsElemsCurrent.sTemplate)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + u0ListsElemsCurrent.sTemplate})
    })
    .done(function( data ){
      if ( ! data ) return false

      // Вставляем шаблон
      $.when(
        u0ListsElemsCurrent.oBlockWrap.html( content_loader_elem_html( u0ListsElemsCurrent.oListData, $('<div/>').html(data) ) )

      ).done(function(){
        u0ListsElemsCurrent.oBlockListElems = u0ListsElemsCurrent.oBlockWrap.find('.block_lists')

        // Загружаем списки элементов
        $.when(
          content_download( {
            'action': 'tasks_lists_elems',
            'form': 'show',
            'filter': {
              0: {
                'name': 'list_id',
                'value': u0ListsElemsCurrent.oListData.id,
              }
            },
          }
          , 'json', false )
        ).then( function( oData ){
          $.each(oData,function( iIndex, oListElem ){
            // Добавляем элемент
            u0ListsElemsCurrent.oBlockWrap.find('._elems_data').list_elem( oListElem )

            if ( iIndex == oData.length - 1 ) {
              // Сортировка перетягиванием
              u0ListsElemsCurrent.oBlockWrap.find('._elems_data').sortable({
                handle: '.__elem_sort',
                stop: function(){
                  u0ListsElemsCurrent.sort()
                }
              })
            }
          })

        })

        // КНОПКИ
        // Добавления элемента
        u0ListsElemsCurrent.oBlockWrap.find('.__elem_add').on ('click', function(){
          // Сортировка
          var iSortLast = parseInt( u0ListsElemsCurrent.oBlockWrap.find('._elems_data .block_list_elem:last').attr('data-sort') )
          if ( iSortLast > u0ListsElemsCurrent.oBlockWrap.find('._elems_data .block_list_elem').length ) iSortLast++
          else iSortLast = u0ListsElemsCurrent.oBlockWrap.find('._elems_data .block_list_elem').length + 1

          // Добавляем элемент
          $.when(
    			  content_download( {
              'action': 'tasks_lists_elems',
              'form': 'add',
              'sort': iSortLast,
              'list_id': u0ListsElemsCurrent.oListData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData.data ) return false

            // Добавляем элемент
            u0ListsElemsCurrent.oBlockWrap.find('._elems_data').list_elem( oData.data, 'add' )
          })
        })
      })
    })
  }

  // Сортировка
  this.sort = function () {
    var u0ListsElemsCurrent = this

    u0ListsElemsCurrent.oBlockWrap.find('._elems_data .block_list_elem').each(function( iIndex, oElem ){
      // Меняем индекс
      $(oElem).attr('data-sort', iIndex)
      // Сохраняем
      content_download( {
        'action': 'tasks_lists_elems',
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
