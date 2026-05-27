jQuery(document).ready(function(){ // begin
    var  url=$(location).attr('href');
    var result = url.split('.'); if(result[0]!='https://sauna-life'){jQuery('.call_phone_9955_3').css('display','none'); 
        jQuery('.cek2').css('display','none');}
    console.log(result[0]);

    function lazyLoad() {
        $('.lazy').each(function() {
            let $img = $(this);
            if ($img.offset().top < $(window).scrollTop() + $(window).height() && !$img.hasClass('lazy-loaded')) {
                $img.attr('src', $img.data('src')).addClass('lazy-loaded');
            }
        });
        
        $('.lazy_item').each(function() {
            let $item = $(this);
            if ($item.offset().top < $(window).scrollTop() + $(window).height() && !$item.hasClass('lazy-loaded')) {
                $item.attr('style', $item.data('style')).addClass('lazy-loaded');
            }
        });
    }
    lazyLoad(); // Запускаем при загрузке страницы
    $(window).on('scroll', lazyLoad); // Запускаем при прокрутке
    $(window).on('resize', lazyLoad); // Запускаем при изменении размера окна
    let ww = $(document).width();
    setCookie('ww',ww,1);
}); // end

function checkCookies2(){
    $('body').on('click', '#cookie_notification.minimize', function () {
        $(this).removeClass('minimize');
        cookiesBoxMin(5000);
    });
}

function cookiesBoxMin(mtime){
    if(typeof mtime=='undefined')
        mtime = 12000;
    setTimeout(function(){ $('#cookie_notification').addClass('minimize'); }, mtime);
}

function controlPromo(){
    if($('.goods-2_row .promo_body').length>0) {
        let ww = $(document).width();
        if(ww<=767 && $('.goods-2_row .goods-2_items:first > div').length>=3){
            $('.goods-2_row .goods-2_items:first > div:last').prependTo( $(".goods-2_row #product_list") );
        }
        else if(ww>767 && $('.goods-2_row .goods-2_items:first > div').length==2){
            $('.goods-2_row #product_list > div:first').appendTo( $(".goods-2_row .goods-2_items:first") );
        }
    }
}

function printClearCats(){
    if($('.goods-2_labels-2 .goods-2_labels').length==0) {
        var c = $('.goods-2_labels-2 .slick-track').clone();
        c.find('.slick-cloned').remove();
        c.find('a').unwrap().removeAttr('tabindex');
        $('.goods-2_labels-2').append('<div class="goods-2_labels"><div>'+c.html()+'</div></div>');
    }
}