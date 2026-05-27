var priceRange = jQuery('.goods-2_filters-range.price-range');
var priceInputFrom = $('.goods-2_price-from');
var priceInputTo = $('.goods-2_price-to');
var instancePriceRange;
var instanceFieldRange = [];

jQuery(document).ready(function() {
  priceRange.ionRangeSlider({
    type: "double",
    min: priceRange.data('min'),
    max: priceRange.data('max'),
    from: priceRange.data('from'),
    to: priceRange.data('to'),
    onStart: updatePrInputs,
    onChange: updatePrInputs,
    onFinish: updatePrInputs
  });
  instancePriceRange = priceRange.data('ionRangeSlider');
  function updatePrInputs(data){
    let from = data.from;
    let to = data.to;
    priceInputFrom.prop('value', from+' ₽');
    priceInputTo.prop('value', to+' ₽');
  }
  priceInputFrom.on('change', function () {
    let val = $(this).prop('value');
    let minPrice = $('.price-range').data('min');
    let to = instancePriceRange.options.to;
    val = parseInt(val);
    if (val < minPrice)
      val = minPrice;
    else if (val > to)
      val = to;
    instancePriceRange.update({
      from: val
    });
    $(this).prop('value', val+' ₽');
  });
  priceInputTo.on('change', function () {
    let val = $(this).prop('value');
    let maxPrice = $('.price-range').data('max');
    let from = instancePriceRange.options.from;
    val = parseInt(val);
    if (val < from)
      val = from;
    else if (val > maxPrice)
      val = maxPrice;
    instancePriceRange.update({
      to: val
    });
    $(this).prop('value', val+' ₽');
  });
  $('.open-filters').click(function(){
    $('body').addClass('filtered');
  });
  $('.close-filters').click(function(){
    $('body').removeClass('filtered');
  });
  $('.goods-2_filters .go').click(function(){

    let price1 = $('.goods-2_price-from').val();
    price1 = parseInt(price1);
    let price2 = $('.goods-2_price-to').val();
    price2 = parseInt(price2);

    var maxPrice = $('.price-range').data('max');
    var minPrice = $('.price-range').data('min');

    if(price1==minPrice && price2==maxPrice){
      $('.goods-2_price-from').prop('disabled', true);
      $('.goods-2_price-to').prop('disabled', true);
    }
    else{
      $('.goods-2_price-from').val(price1);
      $('.goods-2_price-to').val(price2);
    }

    if($('.goods-2_filters-range.field-range').length>0)
      $('.goods-2_filters-range.field-range').each(function() {
        let min = $(this).data('min');
        let max = $(this).data('max');
        let from = parseFloat($(this).next().find('.param-from').val());
        let to = parseFloat($(this).next().find('.param-to').val());
        if(from==min && to==max){
          $(this).next().find('.param-from').prop('disabled', true);
          $(this).next().find('.param-to').prop('disabled', true);
        }
        else{
          $(this).next().find('.param-from').val(from);
          $(this).next().find('.param-to').val(to);
        }
      });

    var queryString = $(this).closest('form').serialize();
    var action = $(this).closest('form').attr('action');

    if(action.indexOf('?')>0)
      window.location = $(this).closest('form').attr('action') + '&' + queryString;
    else
      window.location = $(this).closest('form').attr('action') + '?' + queryString;

  });
  $('.goods-2_filters .reset').click(function(){
    window.location = $(this).closest('form').attr('action');
  });
})


function filterRange(){
  $('.goods-2_filters-range.field-range').each(function() {
    let num = parseInt( $(this).data('num') );
    $(this).ionRangeSlider({
      type: "double",
      min: $(this).data('min'),
      max: $(this).data('max'),
      from: $(this).data('from'),
      to: $(this).data('to'),
      onStart: updateFlInputs,
      onChange: updateFlInputs,
      onFinish: updateFlInputs
    });
    instanceFieldRange[num] = $(this).data('ionRangeSlider');

    $(this).next().find('.param-from').on('change', function () {
      let val = $(this).prop('value');
      let min = $(this).parent().prev().data('min');
      let unit = $(this).parent().prev().data('unit');
      let num = parseInt( $(this).parent().prev().data('num') );
      let to = instanceFieldRange[num].options.to;
      val = parseInt(val);
      if (val < min)
        val = min;
      else if (val > to)
        val = to;
      instanceFieldRange[num].update({
        from: val
      });
      $(this).prop('value', val+' '+unit);
    });
    $(this).next().find('.param-to').on('change', function () {
      var val = $(this).prop('value');
      let max = $(this).parent().prev().data('max');
      let unit = $(this).parent().prev().data('unit');
      let num = parseInt( $(this).parent().prev().data('num') );
      let from = instanceFieldRange[num].options.from;
      val = parseInt(val);
      if (val < from)
        val = from;
      else if (val > max)
        val = max;
      instanceFieldRange[num].update({
        to: val
      });
      $(this).prop('value', val+' '+unit);
    });

  });
}
function updateFlInputs(data){
  let from = data.from;
  let to = data.to;
  let unit = data.input.data('unit');
  data.input.next().find('.param-from').prop('value', from+' '+unit);
  data.input.next().find('.param-to').prop('value', to+' '+unit);
}