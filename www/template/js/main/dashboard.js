// Параметры
dateCurrent = new Date()
iDay = iDayCurrent = dateCurrent.getDate()
iMonth = iMonthCurrent = dateCurrent.getMonth()
iYear = iYearCurrent = dateCurrent.getFullYear()

iMonth = iMonth + 1

// Запуск работы и отрисовка
function dashboard_init(){
  // Параметры
  dateCurrent = new Date()
  iDay = iDayCurrent = dateCurrent.getDate()
  iMonth = iMonthCurrent = dateCurrent.getMonth()
  iYear = iYearCurrent = dateCurrent.getFullYear()

  iMonth = iMonth + 1

  date_switch( iDay, iMonth, iYear )
}


// Изменение данных
$(document).on ('change', '#dashboard_day', function(){
  date_update()
  date_switch( iDay, iMonth, iYear )
})
$(document).on ('change', '#dashboard_month', function(){
  date_update()
  date_switch( iDay, iMonth, iYear )
})
$(document).on ('change', '#dashboard_year', function(){
  date_update()
  date_switch( iDay, iMonth, iYear )
})

$(document).on ('click', '#liveliner_prev_day', function(){
  liveliner_day( 'prev_day', $(this).data().day, $(this).data().month, $(this).data().year )
})
$(document).on ('click', '#liveliner_reload_day', function(){
  liveliner_day( 'get_day', $(this).data().day, $(this).data().month, $(this).data().year )
})

// Загрузка актуальных данных
function date_switch( iDay, iMonth, iYear ) {
  liveliner_day( 'get_day', iDay, iMonth, iYear )
}

// Получаем актуальные значения дат
function date_update( iDayNew, iMonthNew, iYearNew ){
  if ( iDayNew ) {
    iDay = iDayNew
    if ( $(document).find('#dashboard_day').length ) $(document).find('#dashboard_day').val(iDayNew)
  }
  else {
    var iDayNew = $(document).find('#dashboard_day').val() ? $(document).find('#dashboard_day').val() : 1
    iDay = iDayNew
    $(document).find('#dashboard_day').val(iDayNew)
  }

  if ( iMonthNew ) {
    iMonth = iMonthNew
    if ( $(document).find('#dashboard_month').length ) $(document).find('#dashboard_month').val(iMonthNew)
  }
  else {
    if ( $(document).find('#dashboard_month').length ) iMonth = $(document).find('#dashboard_month').val()
    else iMonth = dateCurrent.getMonth()
  }

  if ( iYearNew ) {
    iMonth = iMonthNew
    if ( $(document).find('#dashboard_month').length ) $(document).find('#dashboard_month').val(iMonthNew)
  }
  else {
    if ( $(document).find('#dashboard_year').length ) iYear = $(document).find('#dashboard_year').val()
    else iYear = dateCurrent.getFullYear()
  }
}

function liveliner_day ( sForm, iDay, iMonth, iYear ) {
  $(document).find('#dashboard_days').addClass('_loading_')
  $.when(
    content_download( {
      'action':'dashboards',
      'form':sForm,
      'day':iDay,
      'month':iMonth,
      'year':iYear,
    }, 'json', false )
  ).then( function( oData ) {
    var sResultHtml = ''

    var
    iTimesDaySum = 24,
    iTimesDaySumPercent = 100,
    iTimesDayCategoriesSum = 0,
    iMoneysDayCategoriesSum = 0

    if ( iDay == 1 && sForm == 'prev_day' ) {
      date_update( oData.day, oData.month, oData.year )
      dashboard_month( oData.month, oData.year )
      subscriptions_month( oData.month, oData.year )
    }

    iDay = oData.day
    iMonth = oData.month
    iYear = oData.year

    sResultHtml += '<div class="_liveliner_day">'
    sResultHtml += '<div class="_line_hours"><div class="_val">' + oData.times_sum + '</div><div class="_seporator">/</div><div class="_def">24</div></div>'
    if ( oData.moneys_sum ) sResultHtml += '<div class="_line_moneys"><div class="_val">' + oData.moneys_sum + '</div></div>'
    sResultHtml += '<div class="block_date _date">'
      sResultHtml += '<select name="day" class="_day form-select" id="dashboard_day">'
        var iDays = new Date(oData.year, oData.month, 0).getDate()
        // if ( parseInt(iMonthCurrent) == oData.month && parseInt(iYearCurrent) == oData.year ) iDays = oData.day
        for (var i = 1; i <= iDays; i++) {
          if ( oData.day == i ) sResultHtml += '<option selected="selected" value="' + i + '">' + i + '</option>'
          else sResultHtml += '<option value="' + i + '">' + i + '</option>'
        }
      sResultHtml += '</select>'
      sResultHtml += '<button class="_button btn" id="liveliner_reload_day" data-day="' + oData.day + '" data-month="' + oData.month + '" data-year="' + oData.year + '" style="display:none;">'
        sResultHtml += '<i class="fa-solid fa-rotate-right"></i>'
      sResultHtml += '</button>'
      sResultHtml += '<button class="_button btn" id="liveliner_prev_day" data-day="' + oData.day + '" data-month="' + oData.month + '" data-year="' + oData.year + '">'
        // sResultHtml += '<?=$oLang->get('PrevDay')?>'
        sResultHtml += '<i class="fa-solid fa-arrow-right-long"></i>'
      sResultHtml += '</button>'
    sResultHtml += '</div>'
    sResultHtml += '<div class="_vals">'

      $.each(oData.categories, function( iCategoryId, oCategory ){
        if ( oCategory.moneys && oCategory.moneys.sum ) {
          iMoneysDayCategoriesSum = Math.abs(oCategory.moneys.sum) > iMoneysDayCategoriesSum ? Math.abs(oCategory.moneys.sum) : iMoneysDayCategoriesSum
        }
      })

      $.each(oData.categories, function( iCategoryId, oCategory ){
        var
          iCategoryMoneysSum = oCategory.moneys && parseInt(oCategory.moneys.sum) != 0 ? oCategory.moneys.sum : 0,
          dateCategoryTimesSum = oCategory.times && parseInt(oCategory.times.sum) != 0 ? oCategory.times.sum : 0

        if ( iCategoryMoneysSum || dateCategoryTimesSum  ) {
          var
            iCategoryHeightPercent = 0,
            iCategoryWidthPercent = 0

          if ( dateCategoryTimesSum ) {
            arrCategoryTimesSum = dateCategoryTimesSum.split(':')
            iCategoryTimesSum = arrCategoryTimesSum[0]

            arrCategoryTimesSum = arrCategoryTimesSum[0] + ':' + arrCategoryTimesSum[1]

            iCategoryHeightPercent = iCategoryTimesSum / 24 * 100
          }
          else {
            iCategoryTimesSum = 2
            iCategoryHeightPercent = iCategoryTimesSum / 24 * 100
          }

          if ( iMoneysDayCategoriesSum ) iCategoryWidthPercent = Math.abs(iCategoryMoneysSum / iMoneysDayCategoriesSum * 100)
          else iCategoryWidthPercent = 0

          iTimesDaySum = iTimesDaySum - iCategoryTimesSum
          iTimesDayCategoriesSum = iTimesDayCategoriesSum + iCategoryTimesSum

          sResultHtml += '<div class="_category" style="height:' + iCategoryHeightPercent + '%">'
            sResultHtml += '<div class="_content">'
              sResultHtml += '<div class="_title">' + oCategory.title + '</div> '
              if ( iCategoryMoneysSum != 0 )
                sResultHtml += '<div class="_moneys">' + Math.round(iCategoryMoneysSum) + '</div>'
              if ( dateCategoryTimesSum )
                sResultHtml += '<div class="_times">' + dateCategoryTimesSum + '</div>'
              sResultHtml += '<div class="_background_moneys" style="width:' + iCategoryWidthPercent + '%; background:' + oCategory.color + ';"></div>'
              sResultHtml += '<div class="_background_times" style="background: ' + oCategory.color + '"></div>'
            sResultHtml += '</div>'
            sResultHtml += '<div class="_buttons">'
              sResultHtml += '<a href="javascript:;" class="_button content_loader_show" data-action="times" data-animate_class="animate__flipInY" data-elem=".time" data-form="form" data-full="true" data-category_id="' + iCategoryId + '" data-date="' + iYear + '-' + iMonth + '-' + iDay + '" data-filter="true" data-success_click="#liveliner_reload_day">'
                sResultHtml += '<span class="_icon"><i class="fa-solid fa-clock"></i></span>'
              sResultHtml += '</a>'
              sResultHtml += '<a href="javascript:;" class="_button content_loader_show" data-action="moneys" data-animate_class="animate__flipInY" data-elem=".time" data-form="form" data-full="true" data-category_id="' + iCategoryId + '" data-date="' + iYear + '-' + iMonth + '-' + iDay + '" data-filter="true" data-success_click="#liveliner_reload_day">'
                sResultHtml += '<span class="_icon"><i class="fa-solid fa-wallet"></i></span>'
              sResultHtml += '</a>'
            sResultHtml += '</div>'
          sResultHtml += '</div>'
        }
      })

      sResultHtml += '<div class="_category" style="min-height:' + ( iTimesDaySum / 24 * 100 ) + '%">'
        sResultHtml += '<div class="_content">'
          sResultHtml += '<div class="_title">No</div> '
          sResultHtml += '<div class="_background_moneys" style="width: 2%; background: white;"></div>'
          sResultHtml += '<div class="_background_times" style="background: white"></div>'
        sResultHtml += '</div>'
      sResultHtml += '</div>'

    sResultHtml += '</div>'

    sResultHtml += '<div class="_buttons">'
      sResultHtml += '<div class="_group">'
        sResultHtml += '<div class="_icon">'
          sResultHtml += '<i class="fa-solid fa-clock"></i>'
        sResultHtml += '</div>'
        sResultHtml += '<a href="javascript:;" class="btn btn-lg __main content_loader_show" data-action="times" data-animate_class="animate__flipInY" data-elem=".time" data-form="form" data-full="true" data-date="' + iYear + '-' + iMonth + '-' + iDay + '" data-filter="true" data-success_click="#liveliner_reload_day">'
          sResultHtml += '<i class="fa-solid fa-plus"></i>'
        sResultHtml += '</a>'
        sResultHtml += '<a href="/times/?date=' + iYear + '-' + iMonth + '-' + iDay + '" class="btn btn-lg">'
          sResultHtml += '<i class="fa-solid fa-bars"></i>'
        sResultHtml += '</a>'
      sResultHtml += '</div>'
      sResultHtml += '<div class="_group">'
        sResultHtml += '<div class="_icon">'
          sResultHtml += '<i class="fa-solid fa-wallet"></i>'
        sResultHtml += '</div>'
        sResultHtml += '<a href="javascript:;" class="btn btn-lg __main content_loader_show" data-action="moneys" data-animate_class="animate__flipInY" data-elem=".time" data-form="form" data-full="true" data-date="' + iYear + '-' + iMonth + '-' + iDay + '" data-filter="true" data-success_click="#liveliner_reload_day">'
          sResultHtml += '<i class="fa-solid fa-plus"></i>'
        sResultHtml += '</a>'
        sResultHtml += '<a href="/moneys/?date=' + iYear + '-' + iMonth + '-' + iDay + '" class="btn btn-lg">'
          sResultHtml += '<i class="fa-solid fa-bars"></i>'
        sResultHtml += '</a>'
      sResultHtml += '</div>'
    sResultHtml += '</div>'

    sResultHtml += '</div>'

    $(document).find('#dashboard_days').html( sResultHtml )
    $(document).find('#dashboard_day').select2({selectionCssClass: ':all:'})
    $(document).find('#dashboard_days').removeClass('_loading_')
    })
  }
