var oModal = {}

oModal.show = function(){
  $(document).find('#fttm_modal').modal('show')

  if ( $(document).find('#fttm_modal form').length ) forms_init( $(document).find('#fttm_modal form') )
}

oModal.hide = function(){
  $(document).find('#fttm_modal').modal('hide')
}

oModal.set_title = function( sTitle ){
  $(document).find('#fttm_modal .modal-title').html( sTitle )
}

oModal.set_content = function( sContent ){
  $(document).find('#fttm_modal .modal-body').html( sContent )
}

oModal.set_content_full = function( sContent ){
  $(document).find('#fttm_modal').html( sContent )
}

oModal.set_footer = function( sFooter ){
  $(document).find('#fttm_modal .modal-footer').html( sFooter )
}
