// События
$(function(){
  // Сброс формы редактирования контента
  $(document).on('click', '.form_reset', function(){
		var oForm = $(this).parents('form')
    // Сбрасываем
		oForm[0].reset()
		oForm.find('[name=id]').val('')
		oForm.find('[type=submit]').html('<i class="fas fa-plus-square"></i> Add')

		// Снимаем выделение если выбран какой то элемент
		$(document).find('#content_loader_to ._edit_').removeClass('_edit_')

		// Убираем старую анимацию
		oForm.removeClassWild("animate_*")

		// Играем анимацию отчистки
		setTimeout(function(){
			oForm.addClass('animate__animated animate__rubberBand')
		}, 100)
	})

  // Загрузка контента
  $(document).on('click', '.content_download', function(){
		// Параметры
		var
			oElem = $(this),
			sAnimateClass = oElem.data().animate_class ? oElem.data().animate_class : 'animate__zoomOut',
			oData = {
				'action' : $(this).data().action,
				'form' : $(this).data().form,
				'id' : $(this).data().id
			}

		// Если это удаление элемента
		if ( oElem.data().form == 'del' ) {
      // Запрашиваем подтверждение
			if ( confirm('Confirm delete') ) {
				if ( oElem.data().elem ) {
					// Анимация удаления
					oElem.parents( oElem.data().elem ).removeClassWild("animate_*").addClass('animate__animated ' + sAnimateClass)
					// Играем анимацию
					setTimeout(function(){
						oElem.parents( oElem.data().elem ).remove()
					}, 500)
				}
				else return status({'error':'Not have class delete :( attr data-elem'})
			}
			else return false
		}

		// Если это редактирование элемента
		if ( oElem.data().form == 'edit' ) {
			// Меняем запрос на вывод информации о элементе
			oData.form = 'show'
      // Помечаем элемент как редактируемый
			oElem.parents( oElem.data().elem ).addClass('_edit_').siblings().removeClass('_edit_')

			// Получаем объект элемента
			$.when(
			  content_download( oData, 'json', false )
			).then( function( oData ){
				// Определяем форму редактирования
				// if ( oData.type ) oEditForm = $(document).find('[data-content_download_edit_type="' + oData.type + '"]')
				// else oEditForm = $(document).find('[data-content_download_edit_type="0"]')
				$(document).find('form').each(function(){
					var sType = oData.type ? oData.type : 0
					if ( ('.' + $(this).data().content_download_edit_type).indexOf( sType ) > 0 ) {
						return oEditForm = $(this)
					}
				})

				// Добавляем данные в форму редактирования
				for (var key in oData ) {
					var oInput = oEditForm.find('[name="' + key + '"]')
					if ( oInput.hasClass('select') ) oInput.find('[value="' + oData[key] + '"]').prop('selected', true)
					oInput.val( oData[key] )
				}
				// Обнавляем данные формы, инфа про сохранение
				oEditForm.find('[type=submit]').html('<i class="fas fa-pen-square"></i> Save')

				// Анимация добавление данных в форму
				oEditForm.removeClassWild("animate_*")

				// Играем анимацию
				setTimeout(function(){
					oEditForm.addClass('animate__animated ' + sAnimateClass)
				}, 100)

				// Раскрываем форму редактирования, если закрыта
				oCollapse = oEditForm.parents('.accordion')
				if ( oCollapse.find('.accordion-button').hasClass('collapsed') ) oCollapse.find('.accordion-button').click()
			})

			return false
		}

		$.when(
		  content_download( oData, 'json' )
		).then( function( oData ){
		})
	})
})

// Функции
// content_download
function content_download( oData, oReturnType, sAppStatus ) {
  $('body').addClass( '_load_min_' )

  // oData - Какие данные запросить
  // oReturnType - Возвращяемый тип данных
  // sAppStatus - Показывать статусы, по умолчанию да

  // Отображение статуса
  if ( typeof sAppStatus === 'undefined' ) sAppStatus = true
  // Тип возвращяемых данных
  if ( typeof oReturnType === 'undefined' ) oReturnType = 'html'

  // Получаем данные
  return $.ajax({
    url: oData.site_url ? oData.site_url : u0life.site_url,
    dataType: oReturnType,
    data: $.extend( oData, u0life.ajax_salt ),
    method: 'POST',
		xhr: function() {
      var xhr = new window.XMLHttpRequest();

      // Upload progress
      xhr.upload.addEventListener("progress", function(evt){
       if (evt.lengthComputable) {
      	 var percentComplete = evt.loaded / evt.total;
      	 //Do something with upload progress
      	 fttm_progress_bar( percentComplete )
       }
      }, false);

      return xhr;
	 },
  }).fail(function( oData ){
    if ( sAppStatus ) status( {'error': {'text': 'Connect error'}} )
  }).done(function( oData ){
    if ( sAppStatus ) status( oData )

    $('body').removeClass( '_load_min_' )

		var iLocationTime = 500
		if ( oData.success && oData.success.location_time ) iLocationTime = oData.success.location_time
		if ( oData.location_time ) iLocationTime = oData.location_time

		if ( oData.location )
			setTimeout(function(){
				page(oData.location)
			}, iLocationTime)

		if ( oData.location_reload || ( oData.success && oData.success.location_reload ) )
			setTimeout(function(){
				location.reload()
			}, iLocationTime)

		if ( oData.success && oData.success.location )
			setTimeout(function(){
				page(oData.success.location)
			}, iLocationTime)

		if ( oData.error && oData.error.location )
			setTimeout(function(){
				page(oData.error.location)
			}, iLocationTime)
  })
}
// content_download x
