var activeInputSearch = !1;
function fastSearch() {
  if (activeInputSearch) var t = activeInputSearch.val();
  else t = $(".search input[name=keyword]").val();
  $(".search input[name=keyword]").val(t);
  if ($.trim(t) != "")
    $.ajax({
      url:
        "/index.php?component=catalog&action=fastsearch&tmpl=ajax&keyword=" + t,
      celem: $(this),
      success: function (t) {
        if ($("#modal-search").length) {
          if ("" == t) {
            $("#modal-search")
              .find(
                ".modal_search-toper, .modal_search-row-1, .modal_search-row-2, .modal_search-row-3, .modal_title",
              )
              .css("visibility", "hidden");
          } else {
            var j = $(t);
            j.unwrap().unwrap();
            t = j.html();
            $("#modal-search div").html(t);
          }
        } else if ("" != t) {
          $.fancybox.close();
          $.fancybox.open({ type: "html", src: t, touch: !1 });
        }
        if ("" != t) {
          var i = $('#modal-search input[name="keyword"]');
          i.focus();
          var tm = i.val();
          i.val("");
          i.val(tm);
        }
        ($(".mob-menu").length > 0 &&
          "none" != $(".mob-menu").css("display") &&
          ($('.mob-menu .mob-menu_search input[name="keyword"]').val(""),
          $(".mob-menu .mob-menu_close").click()),
          "" != t);
      },
    });
}
function setCookie(t, e, i) {
  var a = "";
  if (i) {
    var o = new Date();
    (o.setTime(o.getTime() + 24 * i * 36e5),
      (a = "; expires=" + o.toUTCString()));
  }
  document.cookie = t + "=" + (e || "") + a + "; domain=.sauna-life.ru; path=/";
}
function getCookie(t) {
  var e = ("; " + document.cookie).split("; " + t + "=");
  return 2 == e.length && decodeURIComponent(e.pop().split(";").shift());
}
function controlCities() {
  ($(document).on("click", ".modal_search-results a", function (t) {
    return (
      t.preventDefault,
      $.ajax({
        type: "GET",
        url: "/set_city.php?cid=" + $(this).data("cid"),
        dataType: "json",
        success: function (t) {
          "" != t.redirect ? (window.location = t.redirect) : location.reload();
        },
      }),
      !1
    );
  }),
    $('.modal-cities input[type="text"]').on("input", function () {
      var t = $.trim($(this).val());
      "" == (t = t.toUpperCase())
        ? $(".modal_search-results a").show()
        : $(".modal_search-results a").each(function () {
            -1 === $(this).text().toUpperCase().indexOf(t)
              ? $(this).hide()
              : $(this).show();
          });
    }));
}
function controlShowMore() {
  $(".show-more-box").each(function () {
    if (void 0 === $(this).data("height") && void 0 !== $(this).data("tags")) {
      var t = parseInt($(this).data("tags")),
        i = 0;
      if (
        1 == $(this).children("*").length &&
        $(this).children("*").children("*").length > 1
      )
        var h = $(this).children("*").children("*");
      else if (
        1 == $(this).children("*").length &&
        1 == $(this).children("*").children("*").length &&
        $(this).children("*").children("*").children("*").length > 1
      )
        h = $(this).children("*").children("*").children("*");
      else h = $(this).children("*");
      (h.slice(0, t).each(function () {
        $(this).outerHeight(!0) + $(this).position().top > i &&
          (i = $(this).outerHeight(!0) + $(this).position().top);
      }),
        $(this).data("height", i));
    }
    return (
      void 0 === $(this).data("height") ||
      $(this).height() <= $(this).data("height") ||
      ($(this).wrapInner('<div class="cutter"></div>'),
      $(this).data("inithg", $(this).height()),
      $(this)
        .find(".cutter")
        .css("height", $(this).data("height") + "px"),
      void 0 === $(this).data("name1") && $(this).data("name1", "Показать все"),
      void 0 === $(this).data("name2") && $(this).data("name2", "Скрыть"),
      $(this).parent().hasClass("goods-3_body")
        ? $(this)
            .find(".cutter")
            .prepend(
              '<button type="button" class="show-all js_tgl">' +
                $(this).data("name1") +
                "</button>",
            )
        : $(this).append(
            '<div class="show-all">' + $(this).data("name1") + "</div>",
          ),
      void $(this).on("click", ".show-all", function () {
        if ($(this).parent().hasClass("cutter"))
          var t = $(this).parent(),
            i = $(this).parent().parent();
        else if ($(this).next().hasClass("cutter"))
          ((t = $(this).next()), (i = $(this).parent()));
        else ((t = $(this).prev()), (i = $(this).parent()));
        (t.animate(
          {
            height:
              parseInt(i.data("height")) == parseInt(t.outerHeight())
                ? i.data("inithg")
                : i.data("height"),
          },
          400,
        ),
          parseInt(i.data("height")) == parseInt(t.outerHeight())
            ? $(this).text(i.data("name2"))
            : $(this).text(i.data("name1")));
      }))
    );
  });
}
function historyCats() {
  jQuery("body").on(
    "click contextmenu",
    ".goods-2_filters-wrapper a, .goods-2_tags a, .goods-2_labels-2 a, .catalog_items a",
    function (t) {
      var e = $(this).data("cid");
      if (void 0 !== e) {
        e = parseInt(e);
        var i = getCookie("chist");
        i = i ? JSON.parse(i) : {};
        var a = $(this).data("dcid");
        for (var o in (void 0 !== a && a
          ? ((a = parseInt(a)), (i[e] = a))
          : void 0 !== i[e] && delete i[e],
        i))
          i[o] == e && delete i[o];
        setCookie("chist", (i = JSON.stringify(i)), 1);
      }
    },
  );
}
function addToCart() {
  $("body").on("click", ".addtocart", function (t) {
    if ((t.preventDefault(), $(this).hasClass("in-cart")))
      window.location = "/cart";
    else {
      if ($(this).closest("form").find(".need-calc").length) {
        var e = !1;
        if (
          ($(this)
            .closest("form")
            .find(".need-calc")
            .each(function () {
              $(this).val() > 0 && (e = !0);
            }),
          !e)
        )
          return (
            $(this).closest("form").find(".wrap-quantity").addClass("invalid"),
            !1
          );
      }
      if (
        $(this).closest("form").find(".product-field-type-S").length ||
        $(this).closest(".goods-2_item").find(".product-field-type-S").length
      ) {
        var i = !1;
        if ($(this).closest("form").find(".product-field-type-S").length)
          var a = "form";
        else a = ".goods-2_item";
        if (
          ($(this)
            .closest(a)
            .find(".product-field-type-S select")
            .each(function () {
              "" == $(this).val() &&
                ((i = !0),
                $(this)
                  .addClass("invalid")
                  .prev()
                  .append('<span class="s-error">*Нужно выбрать</span>'));
            }),
          i)
        )
          return !1;
      }
      ($(this).addClass("animation"),
        $.ajax({
          type: "POST",
          url: "/index.php?component=cart&action=add&tmpl=ajax",
          dataType: "json",
          celem: $(this),
          data: $(this).closest("form").serialize(),
          success: function (t) {
            digiLayerAddToCart(t);
            if (
              ($(".total_products").html(t.total),
              showNotif(
                '<a href="/cart">Товар успешно добавлен в корзину<span>Перейти в корзину</span></a>',
              ),
              void 0 !== t.in_cart[0] &&
                this.celem.closest("form").find(".card-main_calc-v2").length >
                  0 &&
                (this.celem
                  .closest("form")
                  .find('input[name="quantity[0]"]')
                  .val(t.in_cart[0]),
                (updateProdQuantity = !1),
                this.celem
                  .closest("form")
                  .find('input[name="quantity[0]"]')
                  .trigger("input"),
                (updateProdQuantity = !0)),
              this.celem.removeClass("animation").addClass("in-cart"),
              this.celem.parent().addClass("in-cart"),
              "" != $.trim(this.celem.text()))
            ) {
              let e = this.celem.find("svg").clone();
              (this.celem.text("В корзине"), this.celem.prepend(e));
            }
            $(".cart .cart_row .cart_total").length > 0 &&
              setTimeout(function () {
                location.reload();
              }, 800);
          },
        }));
    }
  });
}
($(function () {
  var t = $(".service_works").height();
  ($("div.service_row").on("click", ".service_works-buttons", function (e) {
    var i = $(".service_works")[0].scrollHeight;
    (console.log(i),
      (t += 260) < i && $(".service_works").css("height", t + "px"),
      t > i && $(".service_works-buttons").css("display", "none"));
  }),
    $("div.viewport").on("click", '[href*="#"]', function (t) {
      if ("" != this.hash.substr(1)) {
        t.preventDefault();
        var e = 0;
        ($("a[name=" + this.hash.substr(1) + "]").length
          ? (e = $("a[name=" + this.hash.substr(1) + "]").offset().top)
          : $("a" + this.hash).length && (e = $("a" + this.hash).offset().top),
          "none" != $(".viewport > .toper").css("display") &&
            (e -= $(".viewport > .toper").height()),
          "none" != $("header.header").css("display") &&
            (e -= $("header.header").height()),
          (e += 6) > 0 && $("body,html").animate({ scrollTop: e }, "slow"));
      }
    });
  var e = !1,
    i = !1;
  ($("body")
    .on("input", ".search input[name=keyword]", function () {
      var t = $(this).val();
      if (e) clearTimeout(e);
      ((t = $.trim(t)).length > 2 && t != i
        ? ((activeInputSearch = $(this)),
          (e = setTimeout("fastSearch()", 1200)))
        : t.length <= 2 && $(".search .search-res").remove(),
        (i = t));
    })
    .on("blur", function () {
      $(".search .search-res").fadeOut("fast");
    })
    .on("focus", function () {
      var t = $(this).val();
      (t = $.trim(t)).length > 2 && $(".search .search-res").show();
    }),
    $(
      '.form-validate input[type="text"]:required, .form-validate input[type="tel"]:required, .form-validate input[type="email"]:required, .form-validate textarea:required',
    ).focus(function () {
      $(this).addClass("redyval");
    }),
    $("body").on("click", ".fast-buy", function () {
      $.ajax({
        url:
          "/index.php?component=getmodule&position=fastbuy&tmpl=ajax&pid=" +
          $(this).data("pid"),
        celem: $(this),
        success: function (t) {
          ($.fancybox.close(),
            "" != t && $.fancybox.open({ type: "html", src: t, touch: !1 }));
        },
      });
    }),
    $("body").on("click", ".zamer-modal, .hamam-modal", function (t) {
      if ((t.preventDefault(), $(this).hasClass("zamer-modal")))
        var e = "zamer-modal";
      else e = "hamam-modal";
      $.ajax({
        url: "/index.php?component=getmodule&position=" + e + "&tmpl=ajax",
        celem: $(this),
        success: function (t) {
          ($.fancybox.close(),
            "" != t && $.fancybox.open({ type: "html", src: t, touch: !1 }));
        },
      });
    }),
    $("body").on("click", ".lower-price", function (t) {
      (t.preventDefault(),
        $.ajax({
          url:
            "/index.php?component=getmodule&position=cheaper&tmpl=ajax&pid=" +
            $(this).data("pid"),
          celem: $(this),
          success: function (t) {
            ($.fancybox.close(),
              "" != t && $.fancybox.open({ type: "html", src: t, touch: !1 }));
          },
        }));
    }),
    checkMobile(),
    jQuery(".js-show-mob-menu").click(function () {
      jQuery("body").addClass("show-mob-menu");
    }));
}),
  setTimeout(() => {
    var t;
    (checkCookies(),
      ((t = document.createElement("script")).type = "text/javascript"),
      t.setAttribute("async", ""),
      (t.src = "//code-ya.jivosite.com/widget/DrX27vGgVV"),
      document.head.appendChild(t),
      ((t = document.createElement("script")).type = "text/javascript"),
      t.setAttribute("async", ""),
      (t.src = "https://mod.calltouch.ru/init.js?id=o5i4wq1e"),
      document.head.appendChild(t));
  }, 3e3));
var updateProdQuantity = !0;
function contrlolQuantity() {
  var t = 0;
  ($("body").on("click", ".wrap-quantity .quantity-plus", function () {
    quantity = $(this).parent().parent().find("input.quantity-input");
    var t = parseInt(quantity.val());
    (isNaN(t) || quantity.val(t + 1),
      addProdQuantity(quantity),
      updateProdQuantity &&
        quantity.closest("form").find(".addtocart").hasClass("in-cart") &&
        updateQuantity(quantity));
  }),
    $("body").on("click", ".wrap-quantity .quantity-minus", function () {
      void 0 !==
        (quantity = $(this)
          .parent()
          .parent()
          .find("input.quantity-input")).data("minval") &&
        (t = quantity.data("minval"));
      var e = parseInt(quantity.val());
      (!isNaN(e) && e > t ? quantity.val(e - 1) : quantity.val(t),
        addProdQuantity(quantity),
        updateProdQuantity &&
          quantity.closest("form").find(".addtocart").hasClass("in-cart") &&
          updateQuantity(quantity));
    }),
    $("body").on("keyup input", ".wrap-quantity .quantity-input", function () {
      (addProdQuantity($(this)),
        updateProdQuantity &&
          $(this).closest("form").find(".addtocart").hasClass("in-cart") &&
          updateQuantity($(this)));
    }));
}
function updateQuantity(t) {
  var e = t.val();
  e = $.trim(e);
  var i = t.attr("name");
  ((i = i.replace(/\D/g, "")),
    (e = !0),
    $.ajax({
      type: "POST",
      url: "/index.php?component=cart&action=update2&tmpl=ajax&key=" + i,
      dataType: "json",
      celem: t,
      quantity: e,
      data: t.closest("form").serialize(),
      success: function (t) {
        digiLayerAddToCart(t);
        if (($(".total_products").html(t.total), 0 == this.celem.val())) {
          var e = !0;
          if (
            (this.celem.closest("form").find(".quantity-input").length > 1
              ? this.celem
                  .closest("form")
                  .find(".quantity-input")
                  .each(function () {
                    $(this).val() > 0 && (e = !1);
                  })
              : this.celem.closest("form").find(".quantity-input").val(1),
            e)
          ) {
            showNotif('<a href="/cart">Товар удалён из корзины</a>');
            var i = this.celem.closest("form").find(".addtocart");
            if (
              (i.removeClass("in-cart"),
              i.parent().removeClass("in-cart"),
              "" != $.trim(i.text()))
            ) {
              let a = i.find("svg").clone();
              (i.text("В корзину"), i.prepend(a));
            }
          }
        }
      },
    }));
}
function addProdQuantity(t) {
  var e = t.val(),
    i = t.parent().find(".quantity-minus");
  if (
    (0 == e
      ? i.addClass("invisible")
      : (i.removeClass("invisible"),
        1 == e
          ? i.html(
              '<svg width="12" height="15" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.9165 0.583313L4.12484 1.37498H0.166504V2.95831H0.958171V14.8333C0.958171 15.2467 1.10964 15.6682 1.40812 15.9667C1.7066 16.2652 2.12808 16.4166 2.5415 16.4166H10.4582C10.8716 16.4166 11.2931 16.2652 11.5916 15.9667C11.89 15.6682 12.0415 15.2467 12.0415 14.8333V2.95831H12.8332V1.37498H8.87484L8.08317 0.583313H4.9165ZM2.5415 2.95831H10.4582V14.8333H2.5415V2.95831ZM4.12484 4.54165V13.25H5.70817V4.54165H4.12484ZM7.2915 4.54165V13.25H8.87484V4.54165H7.2915Z" fill="#FF2E47"/></svg>',
            )
          : i.html(
              '    <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="13.1923" y1="0.807692" x2="0.807692" y2="0.807691" stroke="black" stroke-width="1.61538" stroke-linecap="round"></line></svg>',
            )),
    t.hasClass("need-calc") &&
      (t.closest("form").parent().hasClass("addtocart-area") && calcPrice(),
      t.closest("form").find(".wrap-quantity").removeClass("invalid")),
    $("#stonesQuantity2").length > 0)
  ) {
    var a = $("#stonesQuantity2").val();
    ((a = parseInt(a)), (a *= e), $("#stonesQuantity").val(a));
  }
  $("#addedpNum").length > 0 &&
    !t.hasClass("need-calc") &&
    $(".addprod_quant").val(e);
}
function calcPrice(t) {
  (void 0 !== t && null != t) || (t = !0);
  var e = $(".card-main_right form.product");
  if (
    (t &&
      $.ajax({
        type: "POST",
        url: "/index.php?component=cart&action=isincart&tmpl=ajax",
        dataType: "json",
        form: e,
        data: e.serialize(),
        success: function (t) {
          var e = this.form.find(".addtocart");
          if (t.total) {
            if (
              (e.addClass("in-cart"),
              e.parent().addClass("in-cart"),
              "" != $.trim(e.text()))
            ) {
              let i = e.find("svg").clone();
              (e.text("В корзине"), e.prepend(i));
            }
            this.form.find(".card-main_calc-v2").length > 0 &&
              (this.form.find('input[name="quantity[0]"]').val(t.total),
              (updateProdQuantity = !1),
              this.form.find('input[name="quantity[0]"]').trigger("input"),
              (updateProdQuantity = !0));
          } else {
            if (
              (e.removeClass("in-cart"),
              e.parent().removeClass("in-cart"),
              "" != $.trim(e.text()))
            ) {
              let a = e.find("svg").clone();
              (e.text("В корзину"), e.prepend(a));
            }
            (this.form.find(".card-main_calc-v2").length > 0 &&
              (this.form.find('input[name="quantity[0]"]').val(1),
              (updateProdQuantity = !1),
              this.form.find('input[name="quantity[0]"]').trigger("input"),
              (updateProdQuantity = !0)),
              calcPrice(!1));
          }
        },
      }),
    0 != $("#prPrice").length)
  ) {
    var i = $("#prPrice").html();
    if (((i = parseInt((i = i.replace(/ /g, "")))), $("#initPrice").length))
      var a = $("#initPrice").html();
    else
      ((a = 0),
        $("input.need-calc").each(function () {
          a += parseInt($(this).val() * $(this).data("price"));
        }));
    var o = (a = parseInt(a)),
      n = o,
      s = !1;
    ($(".product-fields .select-calc").length &&
      $(".product-fields .select-calc").each(function () {
        var t = $(this).find("option:selected").data("price");
        if (null != t && void 0 !== t) {
          var e = (t = t.toString()).substr(0, 1);
          ((pr2 = t.substr(1)),
            -1 != t.indexOf("%") &&
              (parseInt(e) > 0
                ? ((pr2 = o * (parseInt(t) / 100)), (e = "+"))
                : (pr2 = o * (parseInt(pr2) / 100))),
            "+" == e
              ? (a += parseInt(pr2))
              : "-" == e
                ? (a -= parseInt(pr2))
                : "=" == e && pr2 > 0
                  ? ((a = parseInt(pr2)), (s = 0))
                  : (a += parseInt(t)));
        }
        var i = $(this).find("option:selected").data("undprice");
        null != i &&
          void 0 !== i &&
          ((e = i.substr(0, 1)),
          (i = i.substr(1)),
          "=" == e && i > 0 && (s = parseInt(i)));
      }),
      (n = a));
    var c = 0;
    (("undefined" != typeof instalPrice && instalPrice > 0) ||
      ("undefined" != typeof instalPercent && instalPercent > 0)) &&
      (instalPercent > 0 && (c += a * (parseInt(instalPercent) / 100)),
      instalPrice > 0 && (c += instalPrice),
      $(".instal-total").html(number_format(c, 0, ",", " ") + " руб"));
    var r = document.getElementById("instalInput");
    null != r && void 0 !== r && (n += c);
    var l = document.getElementById("stonesInput");
    if ((document.getElementById("addedpNum"), null != l && void 0 !== l)) {
      var d = document.getElementById("stonesInput").value;
      n += stonesPrice[d];
    }
    ($(".related_groups input:checked").length &&
      $(".related_groups input:checked").each(function () {
        n += parseInt($(this).data("price"));
      }),
      $("#prPrice .PricesalesPrice").html(number_format(a, 0, ",", ".")),
      $("#addedPrice .PricesalesPrice").html(number_format(n, 0, ",", ".")),
      $(".card-main_price").length > 0 &&
        (a == n
          ? $(".addtocart-area .total-price").slideUp()
          : "none" == $(".addtocart-area .total-price").css("display") &&
            $(".addtocart-area .total-price").slideDown({
              start: function () {
                $(this).css({ display: "flex" });
              },
            })),
      !1 !== s &&
        (0 == s
          ? $("#prPrice .PricebasePrice").hide()
          : 0 == $("#prPrice .PricebasePrice").length
            ? $("#prPrice").append(
                '<br><span class="PricebasePrice">' +
                  number_format(s, 0, ",", " ") +
                  " руб</span>",
              )
            : $("#prPrice .PricebasePrice")
                .html(number_format(s, 0, ",", "."))
                .show()));
  }
}
function calcCatPrice(t) {
  if (
    (jQuery.prototype.isPrototypeOf(t) || (t = $(t)),
    t.closest(".goods-2_flat").length)
  )
    var e = t.closest(".goods-2_flat").find(".PricesalesPrice"),
      i = t.closest("form").find(".product-fields .select"),
      a = t.closest("form");
  else if (t.closest(".product-card").length) {
    var e = t.closest(".product-card").find(".PricesalesPrice"),
      i = t.closest(".product-card").find(".product-fields .select, .product-fields .product-card-dropdown"),
      a = t.closest(".product-card").find("form");
  } else
    ((e = t.closest(".goods-2_item").find(".PricesalesPrice")),
      (i = t.closest(".goods-2_item").find(".product-fields .select")),
      (a = t.closest(".goods-2_item").find("form")),
      setProdBoxCartInput(t));
  $.ajax({
    type: "POST",
    url: "/index.php?component=cart&action=isincart&tmpl=ajax",
    dataType: "json",
    celem: t,
    form: a,
    data: a.serialize(),
    success: function (t) {
      var e = this.form.find(".addtocart");
      if (t.total) {
        if (
          (e.addClass("in-cart"),
          e.parent().addClass("in-cart"),
          "" != $.trim(e.text()))
        ) {
          let i = e.find("svg").clone();
          (e.text("В корзине"), e.prepend(i));
        }
      } else if (
        (e.removeClass("in-cart"),
        e.parent().removeClass("in-cart"),
        "" != $.trim(e.text()))
      ) {
        let a = e.find("svg").clone();
        (e.text("В корзину"), e.prepend(a));
      }
      (t.total >= 1
        ? this.form.find('input[name="quantity[0]"]').val(t.total)
        : this.form.find('input[name="quantity[0]"]').val(1),
        this.form.find('input[name="quantity[0]"]').trigger("input"));
    },
  });
  var o = e.data("init"),
    n = (o = parseInt(o)),
    s = !1;
  if (
    (i.length &&
      i.each(function () {
        var selected = $(this).is("select") ? $(this).find("option:selected") : $(this).find(".product-card-dropdown__option.is-selected, .product-hero__dropdown-option.is-selected");
        var t = selected.length ? selected.data("price") : undefined;
        if (null != t && void 0 !== t) {
          var e = (t = t.toString()).substr(0, 1);
          ((pr2 = t.substr(1)),
            -1 != t.indexOf("%") &&
              (parseInt(e) > 0
                ? ((pr2 = n * (parseInt(t) / 100)), (e = "+"))
                : (pr2 = n * (parseInt(pr2) / 100))),
            "+" == e
              ? (o += parseInt(pr2))
              : "-" == e
                ? (o -= parseInt(pr2))
                : "=" == e && pr2 > 0
                  ? ((o = parseInt(pr2)), (s = 0))
                  : (o += parseInt(t)));
        }
        var i = selected.length ? selected.data("undprice") : undefined;
        null != i &&
          void 0 !== i &&
          ((e = i.substr(0, 1)),
          (i = i.substr(1)),
          "=" == e && i > 0 && (s = parseInt(i)));
      }),
    e.html(number_format(o, 0, ",", ".")),
    !1 !== s)
  ) {
    var c = e.parent();
    0 == s
      ? c.find(".PricebasePrice").hide()
      : c
          .find(".PricebasePrice")
          .html(number_format(s, 0, ",", "."))
          .show();
  }
}
function calcList() {
  ($(".tprod_add .product-fields:has(.select-calc)").length &&
    $(".tprod_add .product-fields:has(.select-calc)").each(function () {
      calcCatPrice($(this).find(".select-calc:first"));
    }),
    $(".prod_box .product-fields:has(.select-calc)").length &&
      $(".prod_box .product-fields:has(.select-calc)").each(function () {
        (calcCatPrice($(this).find(".select-calc:first")),
          setProdBoxCartInput($(this).find(".select-calc:first")));
      }));
}
function stonePrice() {
  var t = document.getElementById("stones").value;
  document.getElementById("stonePrice").innerHTML =
    number_format(stonesPrice[t], 0, ",", " ") + " руб";
}
function number_format(t, e, i, a) {
  var o, n;
  return (
    isNaN((e = Math.abs(e))) && (e = 2),
    null == i && (i = ","),
    null == a && (a = "."),
    (n = (o = parseInt((t = (+t || 0).toFixed(e))) + "").length) > 3
      ? (n %= 3)
      : (n = 0),
    (n ? o.substr(0, n) + a : "") +
      o.substr(n).replace(/(\d{3})(?=\d)/g, "$1" + a) +
      (e
        ? i +
          Math.abs(t - o)
            .toFixed(e)
            .replace(/-/, 0)
            .slice(2)
        : "")
  );
}
function comparison() {
  $("body").on("click", ".compare-btn", function (t) {
    (t.preventDefault(),
      $(this).data("cmpr")
        ? comparisonWin($(this).data("pid"), this.celem)
        : $.ajax({
            url:
              "/index.php?component=comparison&action=add&tmpl=ajax&id=" +
              $(this).data("pid"),
            celem: $(this),
            success: function (t) {
              (this.celem.text(t),
                this.celem.data("cmpr", 1),
                comparisonWin(
                  this.celem.data("pid"),
                  setComparisonCount(),
                  this.celem,
                ));
            },
          }));
  });
}
function getColorImage() {
  jQuery("body").on(
    "change",
    ".goods-2_item .product-field-type-S.image-change select, .goods-2_flat .product-field-type-S.image-change select",
    function (t) {
      if ("" != $(this).val()) {
        var e = $(this).find("option:selected").text(),
          i = $(this).closest(".product-fields").data("pid"),
          a = [];
        if (
          ($(this)
            .closest(".product-fields")
            .find(".product-field-type-S.image-change select")
            .each(function () {
              if ("" != $(this).val()) {
                var t = $(this).find("option:selected").text();
                t != e && a.push(t);
              }
            }),
          $(this).closest(".goods-2_flat").length > 0)
        )
          var o = $(this)
            .closest(".goods-2_flat")
            .find(".goods-2_item-pics img.i0");
        else
          o = $(this)
            .closest(".goods-2_item")
            .find(".goods-2_item-pics img.i0");
        $.post("/get_image.php", { prod_id: i, cur_val: e, rest_val: a }).done(
          function (t) {
            "" != t &&
              "no-image" != t &&
              (o.parent().find('img[src="' + t + '"]').length > 0 &&
                o
                  .parent()
                  .find('img[src="' + t + '"]')
                  .attr("src", o.attr("src")),
              o.attr("src", t));
          },
        );
      }
    },
  );
}
function getColorImage2() {
  $(".card-main_right .product-field-type-S.image-change select").length &&
    $(".card-main_right .product-field-type-S.image-change select").change(
      function () {
        if ("" != $(this).val()) {
          var t = $(this).find("option:selected").text(),
            e = [],
            i = !1;
          ($(".card-main_right .product-field-type-S.image-change select").each(
            function () {
              "" != $(this).val() &&
                e.push($(this).find("option:selected").text());
            },
          ),
            e.sort());
          var a = e.join(";");
          if (
            (0 !=
              $(
                '.card-main_left .card-main_slick-two button[data-color="' +
                  a +
                  '"]',
              ).length &&
              ($(
                '.card-main_left .card-main_slick-two button[data-color="' +
                  a +
                  '"]',
              )
                .eq(0)
                .click(),
              (i = !0)),
            !i && e.length > 1)
          ) {
            for (var o = getAllCombinationOfList(e), n = 0; n < o.length; n++)
              if (
                -1 != o[n].indexOf(t) &&
                0 !=
                  $(
                    '.card-main_left .card-main_slick-two button[data-color="' +
                      (a = o[n].join(";")) +
                      '"]',
                  ).length
              ) {
                ($(
                  '.card-main_left .card-main_slick-two button[data-color="' +
                    a +
                    '"]',
                )
                  .eq(0)
                  .click(),
                  (i = !0));
                break;
              }
          }
        }
      },
    );
}
function getAllCombinationOfList(t) {
  for (var e = [], i = t.length, a = 1 << i, o = 1; o < a; o++) {
    for (var n = [], s = 0; s < i; s++) o & (1 << s) && n.push(t[s]);
    e.push(n);
  }
  return (
    e.sort(function (t, e) {
      return t.length > e.length ? -1 : t.length < e.length ? 1 : 0;
    }),
    e
  );
}
function setProdBoxCartInput(t) {
  if (
    (jQuery.prototype.isPrototypeOf(t) || (t = $(t)),
    t.closest(".goods-2_item").find(".product-fields select").length)
  ) {
    var e = "";
    (t
      .closest(".goods-2_item")
      .find(".product-fields select")
      .each(function () {
        e +=
          '<input class="color-input" type="hidden" name="' +
          $(this).attr("name") +
          '" value="' +
          $(this).val() +
          '">';
      }),
      t.closest(".goods-2_item").find("form").length &&
        (t.closest(".goods-2_item").find("form .hidden-input").remove(),
        t
          .closest(".goods-2_item")
          .find("form")
          .append('<div class="hidden-input">' + e + "</div>")));
  }
}
function comparisonWin(t, e) {
  var i = getCookie("comparison"),
    a =
      '<div id="modal-4" class="modal d-inline-block"><div class="modal_bottom">';
  (i && Object.keys(JSON.parse(i)).length > 1
    ? (a +=
        '<a href="' +
        comparUrl +
        '" class="cart_total-6">Перейти к сравнению</a> &nbsp; &nbsp; <button type="button" class="modal_bottom-button" onclick="compaDel(' +
        t +
        '); return false;">Удалить из сравнения</button>')
    : (a =
        '<button type="button" class="modal_bottom-button" onclick="compaDel(' +
        t +
        '); return false;">Удалить из сравнения</button>'),
    (a += "</div></div>"),
    $.fancybox.open({ type: "html", src: a, touch: !1 }));
}
function compaDel(t) {
  $.ajax({
    url: "/index.php?component=comparison&action=delete&tmpl=ajax&id=" + t,
    pid: t,
    success: function () {
      ($(".compare-btn[data-pid=" + this.pid + "]").text("Сравнить"),
        $(".compare-btn[data-pid=" + this.pid + "]").data("cmpr", 0),
        setComparisonCount(),
        $.fancybox.close());
    },
  });
}
function comparisonDel() {
  $("body").on("click", ".close_box", function (t) {
    (t.preventDefault(),
      $.ajax({
        url:
          "/index.php?component=comparison&action=delete&tmpl=ajax&id=" +
          $(this).data("pid"),
        celem: $(this),
        success: function (t) {
          location.reload();
        },
      }));
  });
}
function changeChild(t) {
  $.ajax({
    type: "POST",
    url:
      "/index.php?component=catalog&action=addtocart&tmpl=ajax&eval_ready_js=1&id=" +
      $(t).val(),
    success: function (t) {
      ($(".wrap-addtocart").html(t), calcPrice());
    },
  });
}
function controlAddedParams() {
  (jQuery("body").on("click", '.stones-card input[type="radio"]', function (t) {
    if (
      ($(
        ".card-main_right form.product #stonesInput, .card-main_right form.product #stonesQuantity",
      ).remove(),
      $(".added-prods-list .stones-title").remove(),
      $(this).hasClass("checked"))
    )
      ($(this).removeClass("checked"),
        $(this).prop("checked", !1),
        $(this)
          .closest(".stones-card")
          .find(".card-add_item-button")
          .removeClass("a"));
    else {
      ($('.stones-card input[type="radio"].checked').removeClass("checked"),
        $(this).addClass("checked"),
        $(this)
          .closest(".stones-card")
          .find(".card-add_item-button")
          .hasClass("a") ||
          $(this)
            .closest(".stones-card")
            .find(".card-add_item-button")
            .addClass("a"),
        $(".card-main_right form.product").append(
          '<input type="hidden" id="stonesInput" name="' +
            $(this).attr("name") +
            '" value="' +
            $(this).val() +
            '">',
        ));
      var e = parseInt(
          $(".card-main_right form.product .quantity-input").val(),
        ),
        i = parseInt($("#stonesQuantity2").val());
      ($(".card-main_right form.product").append(
        '<input type="hidden" id="stonesQuantity" name="' +
          $("#stonesQuantity2").attr("name") +
          '" value="' +
          e * i +
          '">',
      ),
        $(".added-prods-list .main-options").prepend(
          '<div class="stones-title">' +
            $(this).closest("label").find("span").text() +
            "</div>",
        ),
        $clamp($(".added-prods-list .main-options .stones-title")[0], {
          clamp: 2,
        }));
    }
    calcPrice();
  }),
    jQuery("body").on("click", ".chimney-card", function (t) {
      $(this).hasClass("checked")
        ? ($(this).removeClass("checked"),
          $(this).find(".card-add_item-button").removeClass("a"),
          $(".card-main_right form.product #chimneyInput").remove())
        : ($(this).addClass("checked"),
          $(this).find(".card-add_item-button").addClass("a"),
          $(".card-main_right form.product #instalInput").length > 0
            ? $(".card-main_right form.product #instalInput").before(
                '<input type="hidden" value="1" id="chimneyInput" name="fieldData[0][21]" />',
              )
            : $(".card-main_right form.product").append(
                '<input type="hidden" value="1" id="chimneyInput" name="fieldData[0][21]" />',
              ));
    }),
    jQuery("body").on("click", ".install-card", function (t) {
      ($(this).hasClass("checked")
        ? ($(this).removeClass("checked"),
          $(this).find(".card-add_item-button").removeClass("a"),
          $(".card-main_right form.product #instalInput").remove(),
          $(".added-prods-list .instal-title").remove())
        : ($(this).addClass("checked"),
          $(this).find(".card-add_item-button").addClass("a"),
          $(".card-main_right form.product").append(
            '<input type="hidden" value="1" id="instalInput" name="fieldData[0][22]" />',
          ),
          $(".added-prods-list .main-options").append(
            '<div class="instal-title">Установка / подключение</div>',
          )),
        calcPrice());
    }));
}
function cartControls() {
  ($(".cart .wrap-quantity .quantity-plus").click(function () {
    quantity = $(this).parent().parent().find("input.quantity-input");
    var t = parseInt(quantity.val());
    (isNaN(t) || quantity.val(t + 1), updateCart(quantity));
  }),
    $(".cart .wrap-quantity .quantity-minus").click(function () {
      quantity = $(this).parent().parent().find("input.quantity-input");
      var t = parseInt(quantity.val());
      (!isNaN(t) && t > 1 ? quantity.val(t - 1) : quantity.val(1),
        updateCart(quantity));
    }),
    $(".cart .wrap-quantity .quantity-input").keyup(function () {
      if ((cartTimeout && clearTimeout(cartTimeout), "" !== $(this).val())) {
        var t = $.trim($(this).val());
        !isNaN((t = parseInt(t))) &&
          t > 0 &&
          ((priceInput = $(this)),
          (cartTimeout = setTimeout("updateCart()", 400)));
      }
    }),
    $(".cart .wrap-quantity .quantity-input").blur(function () {
      var t = parseInt($(this).val());
      (!isNaN(t) && t) || $(this).val($(this).data("qnt"));
    }),
    $(".cart .delete").click(function () {
      $.ajax({
        type: "POST",
        indexValue: { row: $(this).data("row") },
        url: "/index.php?component=cart&action=delete&tmpl=ajax",
        data: { row: $(this).data("row") },
        dataType: "json",
        success: function (t) {
          digiLayerRemoveFromCart(t);
          ($("#product_row_" + this.indexValue.row).fadeOut(400, function () {
            $(this).remove();
          }),
            0 == t.totalsum
              ? location.reload()
              : $("#cartTotal").html(t.totalsum),
            $(".total_products").html(t.texttotal),
            $(".coupon_row2 .a").length &&
              $(".coupon_row2 .a").html(t.coupondiscount),
            0 == t.total_discount
              ? $(".total_discount").hide()
              : $(".total_discount .a").html(t.total_discount),
            0 == t.instal_totalsum
              ? $(".instal_totalsum").hide()
              : $(".instal_totalsum .a").html(t.instal_totalsum),
            $(".noinstal_nocoupon_total").html(t.noinstal_nocoupon_totalsum));
        },
      });
    }),
    $(".cart .btn_coupon").click(function () {
      var t = $.trim($(this).prev().val());
      "" == t
        ? ($(this).parent().addClass("invalid"),
          $(this)
            .parent()
            .after('<span class="error">Укажите код купона</span>'))
        : ($(this).parent().removeClass("invalid"),
          $(this).parent().parent().find(".error").remove(),
          $.ajax({
            type: "POST",
            url: "/index.php?component=cart&action=coupon&tmpl=ajax",
            data: { code: t },
            dataType: "json",
            success: function (t) {
              t.error
                ? ($(".cart .cart_total-5").after(
                    '<span class="error">' + t.error + "</span>",
                  ),
                  $(".cart_total-5").addClass("invalid"))
                : window.location.reload();
            },
          }));
    }),
    $(".cart .btn_remove_coupon").click(function (t) {
      (t.preventDefault(),
        $.ajax({
          type: "POST",
          url: "/index.php?component=cart&action=removecoupon&tmpl=ajax",
          dataType: "json",
          success: function (t) {
            window.location.reload();
          },
        }));
    }),
    $(".cart_total button.cart_total-6").click(function () {
      $("html,body")
        .stop()
        .animate({ scrollTop: $(".cart_callback").offset().top - 100 }, 1e3);
    }));
}
function updateCart(t) {
  (void 0 === t && (t = priceInput),
    (qnt = parseInt((qnt = $.trim(t.val())))),
    t.data("qnt", qnt),
    $.ajax({
      type: "POST",
      indexValue: { row: t.data("row") },
      url: "/index.php?component=cart&action=update&tmpl=ajax",
      data: { row: t.data("row"), quantity: qnt },
      dataType: "json",
      success: function (t) {
        digiLayerAddToCart(t);
        ($("#cartTotal").html(t.totalsum),
          "" != t.prodsum &&
            $("#product_row_" + this.indexValue.row + " .td_5").html(t.prodsum),
          $(".total_products").html(t.texttotal),
          $(".coupon_row2 .a").length &&
            $(".coupon_row2 .a").html(t.coupondiscount),
          0 == t.total_discount
            ? $(".total_discount").hide()
            : $(".total_discount .a").html(t.total_discount),
          0 == t.instal_totalsum
            ? $(".instal_totalsum").hide()
            : $(".instal_totalsum .a").html(t.instal_totalsum),
          $(".noinstal_nocoupon_total").html(t.noinstal_nocoupon_totalsum));
      },
    }));
}
function checkCartData() {
  return !0;
}
function controlShowMoreRow() {
  $(".show-more-row").each(function () {
    if (void 0 === $(this).data("height") && void 0 !== $(this).data("tags")) {
      var t = parseInt($(this).data("tags")),
        e = 0;
      if (
        1 == $(this).children("*").length &&
        $(this).children("*").children("*").length > 1
      )
        var i = $(this).children("*").children("*");
      else
        i =
          1 == $(this).children("*").length &&
          1 == $(this).children("*").children("*").length &&
          $(this).children("*").children("*").children("*").length > 1
            ? $(this).children("*").children("*").children("*")
            : $(this).children("*");
      (i.slice(0, t).each(function () {
        $(this).outerHeight(!0) + $(this).position().top > e &&
          (e = $(this).outerHeight(!0) + $(this).position().top);
      }),
        $(this).data("height", e));
    }
    return (
      void 0 === $(this).data("height") ||
      $(this).height() <= $(this).data("height") ||
      ($(this).wrapInner('<div class="cutter"></div>'),
      $(this).data("inithg", $(this).height()),
      $(this)
        .find(".cutter")
        .css("height", $(this).data("height") + "px"),
      void 0 === $(this).data("name1") && $(this).data("name1", "Показать еще"),
      $(this).append(
        '<div class="show-all">' + $(this).data("name1") + "</div>",
      ),
      void $(this).on("click", ".show-all", function () {
        var t = $(this).parent(),
          e = $(this).prev();
        if (
          1 == e.children("*").length &&
          e.children("*").children("*").length > 1
        )
          var i = e.children("*").children("*");
        else
          i =
            1 == e.children("*").length &&
            1 == e.children("*").children("*").length &&
            e.children("*").children("*").children("*").length > 1
              ? e.children("*").children("*").children("*")
              : e.children("*");
        var a = 0,
          o = 0;
        (i.each(function () {
          if ($(this).position().top >= e.outerHeight())
            return ((a = $(this).position().top), !1);
        }),
          i.each(function () {
            $(this).position().top == a &&
              $(this).outerHeight(!0) + $(this).position().top > o &&
              (o = $(this).outerHeight(!0) + $(this).position().top);
          }),
          o > 0 &&
            e.animate({ height: o }, 400, function () {
              t.data("inithg") - 31 <= e.outerHeight() &&
                t.animate({ "padding-bottom": 0 }).find(".show-all").remove();
            }));
      }))
    );
  });
}
function controlShowMoreCategories() {
  ($(".goods-2_labels-2 .js_tgl").off("click"),
    $(".goods-2_labels-2 .js_tgl").click(function () {
      (printClearCats(),
        $(this).toggleClass("a"),
        $(this).hasClass("a")
          ? $(this).text("Свертнуть")
          : $(this).text("Показать всё"));
    }));
}
function controlShowMoreChildProds() {
  ($(".goods-2_flat-body-2 .js_tgl").off("click"),
    $(".goods-2_flat-body-2 .js_tgl").click(function () {
      ($(this).toggleClass("a").parent().toggleClass("a"),
        $(this).hasClass("a")
          ? $(this).find("span").text("Свертнуть")
          : $(this).find("span").text("Показать всё"));
    }));
}
function controlRelatedProducts() {
  $(".related_groups label input").click(function () {
    var t = $(this);
    (t.closest(".r_group").hasClass("multi") ||
      t.closest(".r_group").find("input").not(this).prop("checked", !1),
      calcPrice(),
      $("form.product .rel_groups").length ||
        $("form.product").append('<div class="rel_groups"></div>'));
    var e = "",
      i = "";
    ($(".related_groups input:checked").each(function () {
      var t = $(this);
      ((e +=
        '<input type="hidden" name="product_id[' +
        t.data("num") +
        ']" value="' +
        t.val() +
        '"><input type="hidden" name="quantity[' +
        t.data("num") +
        ']" value="1">'),
        (i +=
          "<div>" +
          t.closest(".hots_item").find(".hots_item-3").text() +
          "</div>"));
    }),
      $("form.product .rel_groups").html(e),
      $(".added-prods-list .added-prods").html(i),
      $(".added-prods-list .added-prods div").each(function () {
        $clamp(this, { clamp: 2 });
      }));
  });
}
function catLoadPage(t) {
  $.ajax({
    type: "POST",
    url: t + "?tmpl=ajax",
    cache: !1,
    success: function (t) {
      var e = t.split("{separ}");
      $("#product_list").html(e[0]);
      var i = $('a[name="prods"]').offset().top;
      ("none" != $(".viewport > .toper").css("display") &&
        (i -= $(".viewport > .toper").height()),
        "none" != $("header.header").css("display") &&
          (i -= $("header.header").height()),
        (i += 6) < 0 && (i = 0),
        $("html, body").animate({ scrollTop: i }, 500));
    },
  });
}
function checkCookies() {
  var t = localStorage.getItem("cookieDate"),
    e = localStorage.getItem("cookieType");
  cookiesBoxMin();
  checkCookies2();
  (document
    .getElementById("cookie_notification")
    .querySelector(".cookie_accept"),
    (!t || (3 == e && +t + 864e5 < Date.now()) || +t + 31536e6 < Date.now()) &&
      $("#cookie_notification").addClass("-visible"),
    $("body").on("click", "#cookie_notification .cookie_accept", function () {
      (localStorage.setItem("cookieDate", Date.now()),
        1 == $(this).data("type")
          ? (localStorage.setItem("cookieType", 1),
            setCookie("cookie_accept", 1, 365))
          : (localStorage.setItem("cookieType", 2),
            setCookie("cookie_accept", 2, 365),
            $.ajax({
              url: "/index.php?component=getmodule&action=cookieaccept&tmpl=ajax&type=2",
            })),
        $("#cookie_notification").removeClass("-visible"));
    }),
    $("body").on("click", "#cookie_notification .close", function () {
      (localStorage.setItem("cookieDate", Date.now()),
        localStorage.setItem("cookieType", 3),
        setCookie("cookie_accept", 3, 1),
        $("#cookie_notification").removeClass("-visible"));
    }));
}
function checkMobile() {
  var t = getCookie("is_mobile");
  1 != t &&
  ("ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0)
    ? setCookie("is_mobile", 1, 365)
    : "no" == t ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      setCookie("is_mobile", "no", 365);
}
function reachGoal(t) {
  yaCounter5555437.reachGoal(t);
}
var notificationTimeout = !1;
function showNotif(t) {
  ($("body").find(".notification").remove(),
    $("body").append(
      '<div class="notification closed">' +
        t +
        '<span class="close" title="Close"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg></span></div>',
    ),
    setTimeout(function () {
      $("body").find(".notification").removeClass("closed");
    }, 200),
    notificationTimeout && clearTimeout(notificationTimeout),
    (notificationTimeout = setTimeout(function () {
      $("body").find(".notification").addClass("closed");
    }, 3500)),
    $("body")
      .find(".notification .close")
      .on("click", function () {
        $(this).closest(".notification").addClass("closed");
      }));
}

function digiLayerAddToCart(t) {
  $.each(t.in_cart, function (ind, val) {
    if (typeof window.digiLayer != "undefined") {
      window.digiLayer.addToCart(t.prod_ids[ind], val);
      window.digiLayer.cartState();
    } else {
      console.log("digiLayer undefined");
    }
  });
}

function digiLayerRemoveFromCart(t) {
  $.each(t.prod_ids, function (ind, val) {
    if (typeof window.digiLayer != "undefined") {
      window.digiLayer.removeFromCart(val, amount);
      window.digiLayer.cartState();
    }
  });
}
