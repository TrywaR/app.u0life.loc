$(function(){
  // Нажатие на кнопку выбрать
  $(document).on('click', '.content_manager_switch', function(){
    // ПАРАМЕТРЫ
    // Показываем активность
    $(this).toggleClass('_active_')
    $(this).parents('._elem').toggleClass('content_manager_select')

    // Цепляем блок отвечающий за управление
    var
      oContentManager = $(this).parents('.block_content_loader, .block_elems'),
      oContentManagerButtons = $(document).find('.content_manager_buttons[data-content_manager_action="' + oContentManager.data().content_loader_table + '"]')

    // ПОКАЗ НУЖНЫХ БЛОКОВ
    // Ищем есть ли выбранные элементы
    if ( oContentManager.find('.content_manager_select').length ) {
      // Показываем блок управления
      oContentManagerButtons.removeClass('_hide_')
      oContentManagerButtons.removeClassWild("animate_*").addClass('animate__animated animate__backInRight')
    }
    // Нету, скрываем блок управления
    else {
      oContentManagerButtons.removeClassWild("animate_*").addClass('animate__animated animate__backOutRight')
      // Играем анимацию
      setTimeout(function(){
        // oContentManagerButtons
        oContentManagerButtons.addClass('_hide_')
      }, 300)
    }

    // СУММА
    var sAttrSum = oContentManagerButtons.attr('data-content_manager_sum')
    if (typeof sAttrSum !== typeof undefined && sAttrSum !== false) {
      if ( oContentManagerButtons.attr('data-content_manager_sum') != '' ) {
        var iContentManagerSum = 0
        oContentManager.find('.content_manager_select').each(function(){
          iContentManagerSum = iContentManagerSum + parseInt($(this).find(oContentManagerButtons.attr('data-content_manager_sum')).html())
        })

        if ( iContentManagerSum ) oContentManagerButtons.find('.content_manager_sum').addClass('_show_')
        else oContentManagerButtons.find('.content_manager_sum').removeClass('_show_')

        animation_number_to(oContentManagerButtons.find('.content_manager_sum'),parseInt(oContentManagerButtons.find('.content_manager_sum').html()),iContentManagerSum,500)
      }
      else oContentManagerButtons.find('.content_manager_sum').removeClass('_show_')
    }
  })

  // Кнопка удаления
  $(document).on('click', '.content_manager_buttons .del', function(){
		if ( ! confirm('Are you sure you want to delete all selections') ) return false

		var
			oContentManagerButtons = $(this).parents('.content_manager_buttons'),
			oContentManagerBlock = oContentManagerButtons.data().content_manager_block,
			oContentManagerAction = oContentManagerButtons.data().content_manager_action,
			oContentManagerItem = oContentManagerButtons.data().content_manager_item,
			sAnimateClass = oContentManagerButtons.data().animate_class ? oContentManagerButtons.data().animate_class : 'animate__zoomOut',
			oData = {
				'action' : oContentManagerAction,
				'form' : 'del'
			}

		$(document).find(oContentManagerBlock + ' ' + oContentManagerItem + '.content_manager_select').each(function(){
			var oElem = $(this)
      if ( oElem.data().id ) oData.id = oElem.data().id
			if ( oElem.data().content_manager_item_id ) oData.id = oElem.data().content_manager_item_id

			$.when(
			  content_download( oData, 'json' )
			).then( function( oData ){
				oElem.removeClassWild("animate_*").addClass('animate__animated ' + sAnimateClass)
				// Играем анимацию
				setTimeout(function(){
					oElem.remove()

					// Анимация скрытия кнопок управления
					oContentManagerButtons.removeClassWild("animate_*").addClass('animate__animated animate__backOutRight')
					// Играем анимацию
					setTimeout(function(){
						// oContentManagerButtons
						oContentManagerButtons.addClass('_hide_')
					}, 500)
				}, 500)
			})
		})
	})
})
