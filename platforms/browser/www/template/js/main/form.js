// Functions
function forms_init( oForm ){
  // switch скрытые блоки
  $( oForm ).find('.switch select').each(function(){
    oForm.find('.switch_' + $(this).attr('name') + '-' + $(this).val()).addClass('_show_')
  })

  // Чекбоксы
  $( oForm ).find('input[type=checkbox]').on('change', function() {
    if ( $(this).is(':checked') ) $(this).attr('value', 'true')
    else $(this).attr('value', 'false')
  })
}
