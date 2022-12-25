$.fn.list_elem = function( oListElemData ) {
  var u0ListElem = new List_elem( oListElemData, this, '/templates/tasks/lists/elems/elem.htm' )
}

// Параметры теста
function List_elem( oListElemData, oBlockListElem, sTemplate, bInit )
{
  this.sTemplate = sTemplate // Путь к шаблону списка
  this.oBlockWrap = oBlockListElem // Блок с элементом (Родитель)
  this.oBlockListElem = {} // Блок со списком
  this.oListElemData = oListElemData // Данные

  // Инициализация нажатия кнопок
  this.init = function () {
    var u0ListElemCurrent = this

    // Загружаем шаблон элемента
    $.get(u0ListElemCurrent.sTemplate)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + u0ListElemCurrent.sTemplate})
    })
    .done(function( data ){
      if ( ! data ) return false

      // Вставляем шаблон элемента
      $.when(
        u0ListElemCurrent.oBlockWrap.append( content_loader_elem_html( u0ListElemCurrent.oListElemData, $('<div/>').html(data) ) )
      ).done(function(){
        u0ListElemCurrent.oBlockListElem = u0ListElemCurrent.oBlockWrap.find('.block_list_elem[data-id="' + u0ListElemCurrent.oListElemData.id + '"]')

        // Отметка отмеченных задач
        if ( parseInt(u0ListElemCurrent.oListElemData.status) )
          u0ListElemCurrent.oBlockListElem.find('._elem_status').addClass('_active_')

        // КНОПКИ
        // Редактирование
        u0ListElemCurrent.oBlockListElem.find('.__elem_edit').on ('click', function(){
          $(this).parents('._elem_actions').addClass('_active_')
        })

        // Применение изменений
        u0ListElemCurrent.oBlockListElem.find('.__elem_editing').on ('click', function(){
          $(this).parents('._elem_actions').removeClass('_active_')

          $.when(
    			  content_download( {
              'action': 'tasks_lists_elems',
              'form': 'save',
              'sort': u0ListElemCurrent.oBlockListElem.attr('data-sort'),
              'title': u0ListElemCurrent.oBlockListElem.find('.__elem_title').val(),
              'id': u0ListElemCurrent.oListElemData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData ) return false

            if ( oData.success )
            if ( oData.success.data ) {
              u0ListElemCurrent.oBlockListElem.find('._elem_title').html( oData.success.data.title )
            }
          })
        })

        // Статусецкий
        u0ListElemCurrent.oBlockListElem.find('._elem_status .__ok').on ('click', function(){
          $(this).parents('._elem_status').addClass('_active_')
          // Зачитываем отметку
          $.when(
    			  content_download( {
              'action': 'tasks_lists_elems',
              'form': 'check',
              'status': '1',
              'id': u0ListElemCurrent.oListElemData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData ) return false

            // u0ListElemCurrent.oBlockListElem
          })
        })
        u0ListElemCurrent.oBlockListElem.find('._elem_status .__no_ok').on ('click', function(){
          $(this).parents('._elem_status').removeClass('_active_')
          // Отчитываем отметку
          $.when(
    			  content_download( {
              'action': 'tasks_lists_elems',
              'form': 'check',
              'status': '0',
              'id': u0ListElemCurrent.oListElemData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData ) return false

            // u0ListElemCurrent.oBlockListElem
          })
        })

        // Удаление списка
        u0ListElemCurrent.oBlockListElem.find('.__elem_del').on ('click', function(){
          // Удаляем список
          // Запрашиваем подтверждение
    			if ( ! confirm('Confirm delete') ) return false

          // Удаляем список
          $.when(
    			  content_download( {
              'action': 'tasks_lists_elems',
              'form': 'del',
              'id': u0ListElemCurrent.oListElemData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData ) return false

            // Анимированно убираем html код списка, до свидания
            sAnimateClass = u0ListElemCurrent.oBlockListElem.data().animate_class ? u0ListElemCurrent.oBlockListElem.data().animate_class : 'animate__zoomOut'
            u0ListElemCurrent.oBlockListElem.removeClassWild("animate_*").addClass('animate__animated ' + sAnimateClass)
            setTimeout(function(){
              u0ListElemCurrent.oBlockListElem.remove()
  					}, 500)
          })
        })
      })
    })
  }

  // Запуск работы
  this.init()
}
