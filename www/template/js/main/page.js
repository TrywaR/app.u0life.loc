function page( sUrl ){
  $.when(
    content_download( {
      'action': 'contents',
      'form': 'show',
      'path': sUrl,
    }, 'json', false )
  ).then( function( oData ){
    if ( oData.success ) {
      var oMainHtml = $('<div/>').html(oData.success)
      $(document).find('main').html( oMainHtml )
    }
  })
}
