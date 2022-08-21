$.fn.content_manager = function() {
  arrPageParams.content_manager_action = this.data().content_manager_action
  arrPageParams.content_manager_block = this.data().content_manager_block
  arrPageParams.content_manager_item = this.data().content_manager_item
  arrPageParams.content_manager_button = this.data().content_manager_button
  arrPageParams.content_manager_sum = this.data().content_manager_sum
  content_manager_init( this.attr('id') )
}

function content_manager_init( oContentManagerButtonsId ) {
  // content_manager | Работа с несколькими элементами
	$(document).on('click', arrPageParams.content_manager_block + ' ' + arrPageParams.content_manager_button, function(){
  		var oContentManagerButtons = $(document).find('#' + oContentManagerButtonsId)
  		$(this).toggleClass('_active_')
  		// $(this).parents('.list-group-item').toggleClass('content_manager_select')
  		$(this).parents('._elem').toggleClass('content_manager_select')

      // Подсчёт суммы если надо
      if ( arrPageParams.content_manager_sum ) {
        if ( $(document).find(arrPageParams.content_manager_block).find('.content_manager_select').length ) {
          var iContentManagerSum = 0
          $(document).find(arrPageParams.content_manager_block).find('.content_manager_select').each(function(){
            iContentManagerSum = iContentManagerSum + parseInt($(this).find(arrPageParams.content_manager_sum).html())
          })
          animation_number_to(oContentManagerButtons.find('.content_manager_sum'),parseInt(oContentManagerButtons.find('.content_manager_sum').html()),iContentManagerSum,500)
        }
        else {
          animation_number_to(oContentManagerButtons.find('.content_manager_sum'),parseInt(oContentManagerButtons.find('.content_manager_sum').html()),0,500)
        }
      }

  		if ( $(document).find(arrPageParams.content_manager_block).find('.content_manager_select').length ) {
  			// Анимация показа активных кнопок
  			if ( oContentManagerButtons.hasClass('_hide_') ) {
  				// Анимация
  				oContentManagerButtons.removeClassWild("animate_*").addClass('animate__animated animate__backInRight')
  				// Играем анимацию
  				setTimeout(function(){
  					oContentManagerButtons.removeClass('_hide_')
  					// oContentManagerButtons
  				}, 500)
  			}
  		}
  		// Анимация скрытия
  		else {
  			// Анимация
  			oContentManagerButtons.removeClassWild("animate_*").addClass('animate__animated animate__backOutRight')
  			// Играем анимацию
  			setTimeout(function(){
  				// oContentManagerButtons
  				oContentManagerButtons.addClass('_hide_')
  			}, 500)
  		}
  		return false
	})

	$(document).on('click', '#' + oContentManagerButtonsId + ' .del', function(){
		if ( confirm('Вы действительно хотите удалить всё выбранное к херам?') ) {
			var
				oContentManagerButtons = $(this).parents('#' + oContentManagerButtonsId),
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
		}
	})
}
