// Functions
function forms_init( oForm ){
  // switch скрытые блоки
  $( oForm ).find('.switch select').each(function(){
    oForm.find('.switch_' + $(this).attr('name') + '-' + $(this).val()).addClass('_show_')
  })
}
