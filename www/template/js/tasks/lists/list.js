$.fn.list = function( oListData ) {
  var u0List = new List( oListData, this, '/templates/tasks/lists/list.htm' )
}

// Параметры теста
function List( oListData, oBlockElem, sTemplate, bInit )
{
  this.sTemplate = sTemplate // Путь к шаблону списка
  this.sTemplateElem = '/templates/tasks/lists/elems/elem.htm' // Путь к шаблону элемента списка
  this.oTemplateElem = {} // Загруженный шаблон элемента (чтобы не загружать по сто разов)
  this.oBlockWrap = oBlockElem // Блок с элементом (Родитель)
  this.oBlockList = {} // Блок со списком
  this.oListData = oListData // Данные

  // Инициализация нажатия кнопок
  this.init = function () {
    var u0ListCurrent = this

    // Загружаем шаблон элемента списка
    $.get(u0ListCurrent.sTemplateElem)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + u0ListCurrent.sTemplateElem})
    })
    .done(function( data ){
      if ( ! data ) return false

      u0ListCurrent.oTemplateElem = $('<div/>').html(data)
    })

    // Загружаем шаблон списка
    $.get(u0ListCurrent.sTemplate)
    .fail(function(data){
      status({'error': 'Шаблон не найден: ' + u0ListCurrent.sTemplate})
    })
    .done(function( data ){
      if ( ! data ) return false

      // Вставляем шаблон списка
      $.when(
        u0ListCurrent.oBlockWrap.append( content_loader_elem_html( u0ListCurrent.oListData, $('<div/>').html(data) ) )
      ).done(function(){
        u0ListCurrent.oBlockList = u0ListCurrent.oBlockWrap.find('.block_list[data-id="' + u0ListCurrent.oListData.id + '"]')

        // КНОПКИ
        // Редактирование
        u0ListCurrent.oBlockList.find('.__list_edit').on ('click', function(){
          $(this).parents('._list_head_actions').addClass('_active_')
        })

        // Применение изменений
        u0ListCurrent.oBlockList.find('.__list_editing').on ('click', function(){
          $(this).parents('._list_head_actions').removeClass('_active_')
        })

        // Удаление
        u0ListCurrent.oBlockList.find('.__list_del').on ('click', function(){
          // Удаляем список
          // Запрашиваем подтверждение
    			if ( ! confirm('Confirm delete') ) return false

          // Удаляем список
          $.when(
    			  content_download( {
              'action': 'tasks_lists',
              'form': 'del',
              'id': u0ListCurrent.oListData.id,
            }
            , 'json', false )
    			).then( function( oData ){
            if ( ! oData ) return false

            // Анимированно убираем html код списка, до свидания
            sAnimateClass = u0ListCurrent.oBlockList.data().animate_class ? u0ListCurrent.oBlockList.data().animate_class : 'animate__zoomOut'
            u0ListCurrent.oBlockList.removeClassWild("animate_*").addClass('animate__animated ' + sAnimateClass)
            setTimeout(function(){
              console.log('remove')
              u0ListCurrent.oBlockList.remove()
  					}, 500)
          })
        })
      })
    })
  }

  // Загрузка элементов списка
  this.load_elems = function () {
    var u0ListCurrent = this

    // this.oBlockList.find('._list_items').append()
  }

  // Шаблон элемента списка
  // this.elem_html = function () {
  //   var u0ListCurrent = this
  //
  //
  // }

  // Запуск работы
  this.init()
}
