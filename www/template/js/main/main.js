// Работа приложения
sVersion = '5.5.2'
// sSiteUrl = 'https://fttm.trywar.ru'
sSiteUrl = 'https://u0life.com'
// Параметры
u0life = {
	'user': '',
	'version': sVersion,
	'theme': '',
	'lang': '',
	'pathname': '/',
	'site_url': sSiteUrl,
	'ajax_salt': {
		'app': 'app',
		'site_url': sSiteUrl,
		'version': sVersion,
		'session': '',
	},
}

if ( localStorage.getItem('u0life') ) u0life = $.parseJSON( localStorage.getItem('u0life') )
else localStorage.setItem('u0life', JSON.stringify(u0life))

// Сохраниение изменений
u0life.save = function(){
  localStorage.setItem('u0life', JSON.stringify(u0life))
}

// Отрисовка приложения
u0life.init = function(){
	// Загружаем шаблоны и тему
	$.when(
		content_download( {
			'action': 'templates',
			'form': 'theme',
		}, 'json', false ),

		content_download( {
			'action': 'templates',
			'form': 'show',
			'template': 'pages/header',
		}, 'json', false ),

		content_download( {
			'action': 'templates',
			'form': 'show',
			'template': 'pages/footer',
		}, 'json', false ),

		content_download( {
      'app':'app',
      'action':'navs',
      'form':'show',
    }, 'json', false )
	).then( function( oDataTheme, oDataHeader, oDataFooter, oDataNav ){
		if ( oDataTheme[0].success ) {
			$(document).find('head').append( oDataTheme[0].success )
		}
		if ( oDataHeader[0].success ) {
			var oHeaderHtml = $('<div/>').html(oDataHeader[0].success)
			$(document).find('header').html( $(oHeaderHtml).find('header').html() )
		}
		if ( oDataFooter[0].success ) {
			var oFooterHtml = $('<div/>').html(oDataFooter[0].success)
			$(document).find('footer').html( $(oFooterHtml).find('footer').html() )
		}
		if ( oDataNav[0] ) {
			u0life.oNav = oDataNav[0]
			u0life.pathname = '/'
	    u0life.save()

			// navs loads and show
			block_nav_init()
		}

		// content worderk
		// page( '/' )

		// content load
		$(document).on ('click', 'header .home_link, main a, footer a', function(){
			if ( $(this).hasClass('content_loader_show') ) return true
			if ( $(this).attr('href').indexOf('#') === 0 ) return false

			$('body').addClass('_load_min_')

			if ( $(this).attr('href').indexOf('://') > 0 ) window.open($(this).attr('href'))
			else page( $(this).attr('href') )

			$('body').removeClass('_load_min_')

			return false
		})

		// bootstrap
		if ( $(document).find('#list-example').length )
			var scrollSpys = new bootstrap.ScrollSpy(document.body, {
				target: '#list-example'
			})

		// shower
		$(document).on('click', '[data-shower]', function(){
			if ( $(this).data().shower_class ) $(document).find($(this).data().shower).toggleClass( $(this).data().shower_class )
			$(document).find($(this).data().shower).toggleClass('_show_')
			return false
		})

		// theme_switch
		$(document).find('#theme_switch ._val').on ('click', function(){
			var oButton = $(this)

			u0life.theme = oButton.data().val
			u0life.save()

			$.when(
				content_download( {
					'action': 'sessions_configs',
					'form': 'theme',
					'theme': oButton.data().val,
				}, 'json', false )
			).then( function( oData ){
				if ( oData.success ) location.reload()
			})
		})

		// lang_switch
		$(document).find('#lang_switch ._vals').on ('change', function(){
			var oButton = $(this)

			u0life.lang = oButton.val()
			u0life.save()

			$.when(
				content_download( {
					'action': 'sessions_configs',
					'form': 'lang',
					'lang': oButton.val(),
				}, 'json', false )
			).then( function( oData ){
				if ( oData.success ) location.reload()
			})
		})

		// Forms
		$(document).on ('submit', 'form.__form_event_default', function(){
			content_download( $(this).serializeArray(), 'json', true )
			return false
		})

		// switch скрытые блоки
		$(document).on('change', '.switch select', function(){
			$(this).parents('form').find('[class*=switch_' + $(this).attr('name') + ']').removeClass('_show_')
			$(this).parents('form').find('.switch_' + $(this).attr('name') + '-' + $(this).val()).addClass('_show_')
		})

		// buttons
		// button logout
		$(document).on ('click', '#user_logout', function(){
			if ( confirm('Confirm logout') ) {
				$.when(
					content_download( {
						'app': 'app',
						'action': 'authorizations',
						'form': 'logout',
					}, 'json', true )
				).done( function( oData ){
					// Если ошибка, невыходим
					if ( oData.error ) return false
					// Выходим
					if ( oData.success ) {
						localStorage.clear()
						location.reload()
					}
				})
			}
			return false
		})

		// button delete
		$(document).on ('click', '#user_delete', function(){
			if ( confirm('Confirm delete profile') ) {
				$.when(
					content_download( {
						'app': 'app',
						'action': 'authorizations',
						'form': 'delete',
					}, 'json', true )
				).done( function( oData ){
					// Если ошибка, невыходим
					if ( oData.error ) return false
					// Выходим
					if ( oData.success ) {
						localStorage.clear()
						location.reload()
					}
				})
			}
			return false
		})

		// Логотип на мобиле
		$(document).find('.block_nav_mobile .nav_btn._logo').on('click', function(){
			$(document).find('footer').find('._bottom').toggleClass('_active_')
			return false
		})

		// Раскрытие меню
		$(document).find('#block_nav_fuller ._btn').on('click', function(){
			if ( $(document).find('#block_nav').hasClass('_full_') ) {
				$(document).find('header').removeClass('_full_')
				$(document).find('#block_nav_fuller').removeClass('_full_')
				$(document).find('#block_nav').removeClass('_full_')
				u0life.block_nav_fuller = false
			}
			else {
				$(document).find('header').addClass('_full_')
				$(document).find('#block_nav_fuller').addClass('_full_')
				$(document).find('#block_nav').addClass('_full_')
				u0life.block_nav_fuller = true
			}
			u0life.save()
		})

		// Мобильная версия
		$(document).find('#block_nav_mobile_main').on('click', function(){
			$(this).toggleClass('_active_')
			$(document).find('#block_nav ._main').toggleClass('_mobile_active_')

			$(document).find('#block_nav ._subs').removeClass('_mobile_active_')
			$(document).find('#block_nav_mobile_subs').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo_content').removeClass('_active_')

			if ( $(this).hasClass('_active_') ) $('body').addClass('_mobile_nav_active_')
			else $('body').removeClass('_mobile_nav_active_')
		})
		$(document).find('#block_nav_mobile_subs').on('click', function(){
			if ( ! $(this).hasClass('_showed_') ) return false

			$(this).toggleClass('_active_')
			$(document).find('#block_nav ._subs').toggleClass('_mobile_active_')

			$(document).find('#block_nav ._main').removeClass('_mobile_active_')
			$(document).find('#block_nav_mobile_main').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo_content').removeClass('_active_')

			if ( $(this).hasClass('_active_') ) $('body').addClass('_mobile_nav_active_')
			else $('body').removeClass('_mobile_nav_active_')
		})
		$(document).find('#block_nav_mobile_logo').on('click', function(){
			$(this).toggleClass('_active_')

			$(document).find('#block_nav ._subs').removeClass('_mobile_active_')
			$(document).find('#block_nav ._main').removeClass('_mobile_active_')
			$(document).find('#block_nav_mobile_main').removeClass('_active_')
			$(document).find('#block_nav_mobile_subs').removeClass('_active_')

			if ( $(this).hasClass('_active_') ) $('body').addClass('_mobile_nav_active_')
			else $('body').removeClass('_mobile_nav_active_')
		})
		$(document). on('click', '#block_nav ._main a, #block_nav ._subs a, #block_nav_mobile_body_blocker, #block_nav_mobile_logo_content a, .nav_btn ._href', function(){
			if ( $(this).attr('href').indexOf('://') > 0 ) window.open($(this).attr('href'))
			else page( $(this).attr('href') )

			$(document).find('#block_nav ._main').removeClass('_mobile_active_')
			$(document).find('#block_nav_mobile_main').removeClass('_active_')
			$(document).find('#block_nav ._subs').removeClass('_mobile_active_')
			$(document).find('#block_nav_mobile_subs').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo').removeClass('_active_')
			$(document).find('#block_nav_mobile_logo_content').removeClass('_active_')
			$('body').removeClass('_mobile_nav_active_')

			return false
		})

		// end
		$('body').removeClass('_load_').addClass('_loading_')
	})
}

arrPageParams = {}
arrPageContent = {}

// Функции
// Чистка классов по маске, для анимаций
// $("div").removeClassWild("status_*");
$.fn.removeClassWild = function( mask ) {
  return this.removeClass( function( index, cls ) {
      var re = mask.replace(/\*/g, '\\S+')
      return ( cls.match( new RegExp('\\b' + re + '', 'g' ) ) || []).join(' ')
  })
}

// scroll_to
function scroll_to(elem, fix_size, scroll_time, sScrollBlock){
  scroll_val = ( elem && elem.length && elem.offset().top ) ? elem.offset().top : 0
  scroll_val = fix_size ? fix_size : scroll_val
  scroll_time = scroll_time != null ? scroll_time : 500
  sScrollBlock = sScrollBlock ? sScrollBlock : ''
  sScrollBlockSelector = $(window).width() >= 919 ? '#main_block_content' : 'html, body'
  if ( sScrollBlock ) sScrollBlockSelector = sScrollBlock
  $(sScrollBlockSelector).animate({
    scrollTop: scroll_val
  }, scroll_time)

}
// scroll_to x

// animation_number_to
// animation_number_to("example",900,1500,3000)
// animation_number_to("test",10,-5,15000)
function animation_number_to( oElem, iFrom, iTo, iDuration, sTheme, sFormat ) {
	if ( ! oElem.length ) return false
	if ( ! iDuration ) var iDuration = 2000
	if ( ! sTheme ) var sTheme = 'minimal'
	if ( ! sFormat ) var sFormat = '( ddd),dd'
	if ( ! iFrom ) var iFrom = 0
	if ( ! iTo ) var iTo = 0

	if ( parseFloat(iFrom.toString().indexOf(':')) > 0 || parseFloat(iTo.toString().indexOf(':')) > 0 ) {
		sFormat = '(dd):dd'
		iTo = parseFloat(iTo.toString().replace(':', '.'))
	}

	iFrom = parseFloat(iFrom.toString().replace(/\s/g, ''))
	iTo = parseFloat(iTo.toString().replace(/\s/g, ''))

	var oOdometer = new Odometer({
	  el: oElem[0],
	  value: iFrom,
	  theme: sTheme,
	  format: sFormat,
	  duration: iDuration
	})

	// oOdometer.render()

	oOdometer.update( iTo )
}
// animation_number_to x
