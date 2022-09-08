// PARAMS
var
  oModal = {},
  oModalBlock = $(document).find('#fttm_modal')

// EVENTS modal
oModal.show = function(){
  oModalBlock.modal('show')
  if ( oModalBlock.find('form').length ) forms_init( oModalBlock.find('form') )
}
oModal.hide = function(){
  // validation form
  if ( oModalBlock.find('form').length ) {
    if( ! oModalBlock.find('form')[0].checkValidity() ) {
      oModalBlock.find('form').find(":invalid").first().focus()
      return false
    }
    else{
      oModalBlock.find('form').submit(function(){
        oModalBlock.modal('hide')
      })
    }
  }
  else {
    oModalBlock.modal('hide')
  }
}

// SET Content
oModal.set_title = function( sTitle ){
  oModalBlock.find('.modal-title').html( sTitle )
}
oModal.set_content = function( sContent ){
  oModalBlock.find('.modal-body').html( sContent )
}
oModal.set_content_full = function( sContent ){
  oModalBlock.html( sContent )
}
oModal.set_footer = function( sFooter ){
  oModalBlock.find('.modal-footer').html( sFooter )
}
