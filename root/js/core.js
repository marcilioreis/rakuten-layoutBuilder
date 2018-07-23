var pageW = window.innerWidth;
var lastScrollTop = 0;

//Reinicia um carrossel
function reinitCarousel(el, qtd, arrows, buttons) {

    if (el.hasClass('owl-carousel')) {

        el.attr('style', 'opacity: 0');
        el.data('owlCarousel').destroy();

    };

    if(buttons == true){
        buttons = true;
    } else {
        buttons = false;
    }

    if(arrows != undefined){
        arrows = true;
    } else {
        arrows = true;
    }


    el.owlCarousel({
        items: qtd,
        navigation: arrows,
        responsive: false,
        pagination: buttons
        //transitionStyle: "fade",
        //stopOnHover: false,
        //autoPlay : 5000,
    });

    el.parent().attr('style', '');
};

//Setar o header fixo
function setFixHeader() {
    var bodyClass = jQuery("body").attr("class");
    bodyClass = bodyClass.trim(" ").split(" ");

    var fixed = [
        'home',
        'catalog',
        'vitrine',
        'product',
        'look',
        'basketpage',
        'page-wishlist',
        'internal'
    ];

    if (jQuery.inArray(bodyClass[0], fixed) !== -1 || jQuery.inArray(bodyClass[1], fixed) !== -1) {
        jQuery("body").addClass("fix");

        jQuery(window).scroll(function (event) {
            var st = jQuery(this).scrollTop();
            if (st > jQuery('#header').height()) {
                if (st > lastScrollTop) {
                    jQuery('#header').removeClass('showHeader');
                    jQuery('#header').addClass('hideHeader');
                    jQuery('#header').addClass('headerFixed');
                } else if (st < lastScrollTop) {
                    jQuery('#header').addClass('showHeader');
                    jQuery('#header').removeClass('hideHeader');
                }
            } else if (st < lastScrollTop) {
                jQuery('#header').addClass('showHeader');
                jQuery('#header').removeClass('hideHeader');
                jQuery('#header').removeClass('headerFixed');
            };
            lastScrollTop = st;
        });
        if (pageW <= 979) {
            jQuery('#header').after(jQuery('.wrap-nav-mobile'));
        };

    } else {
        jQuery("body").attr('style', 'opacity: 1');
    }
};

//Normaliza setas de navegação e botoes dos banners
function normalizeBannerAssets() {
    if (pageW >= 980) {
        jQuery('.banners > ul > li').each(function () {
            var imgH = jQuery('.owl-item img', this).height();

            if (jQuery('.owl-buttons', this).length) {
                var arrowH = jQuery('.owl-buttons .owl-prev', this).height();
                var arrowPos = (imgH / 2) - (arrowH / 2) + "px";
                jQuery('.owl-buttons', this).attr('style', 'top:' + arrowPos);
            };

            if (jQuery('.owl-pagination', this).length) {
                var pagH = jQuery('.owl-pagination', this).height();
                var pagPos = (imgH - pagH) + "px";
                jQuery('.owl-pagination', this).attr('style', 'top:' + pagPos);
            };

            jQuery('.owl-controls', this).attr('style', 'opacity:1');
        });

        //Sppecial Store
        if (jQuery('.b-specialstore .owl-buttons').length) {
            var spH = jQuery('.b-specialstore .owl-carousel').height();
            var spArrowH = jQuery('.b-specialstore .owl-buttons .owl-prev').height();
            var SpArrowPos = (spH / 2) - (spArrowH / 2) + "px";
            jQuery('.b-specialstore .owl-buttons').attr('style', 'top:' + SpArrowPos);
            jQuery('.b-specialstore .owl-controls').attr('style', 'opacity:1');
        };

    };
}

//Alinhamento vertical dos itens dos produtos de catalogo e outras areas da loja
function verticalAlign() {
    if (jQuery('.list-products .hproduct').length) {
        jQuery('.list-products .hproduct').each(function () {
            if (!jQuery(this).find('.details .caracteristicas').length) {
                jQuery('.details .name', this).after('<div class="caracteristicas"></div>')
            }
            if (!jQuery(this).find('.details .offers').length) {
                jQuery('.details .caracteristicas', this).after('<span class="offers">' +
                                                                    '<div class="priceCurrency"></div>' +
                                                                    '<div class="regular price-from"></div>' +
                                                                    '<div class="price sale price-to"></div>' +
                                                                    '<div class="price sale percent-a-vista"></div>' +
                                                                '</span>');
            }
            if (!jQuery(this).find('.offers > .price-from').length && pageW <= 979) { //  && pageW <= 979
                jQuery('.priceCurrency', this).after('<div class="regular price-from"></div>');
            }
            if (!jQuery(this).find('.details .parcel').length) {
                jQuery('.details .offers', this).after('<span class="parcel"></span>');
            }
            if (!jQuery(this).find('.offers > .percent-a-vista').length) {
                jQuery('.offers .price-to', this).after('<span class="price sale percent-a-vista" style="display:block"></span>');
            }
            if (!jQuery(this).find('.details > .stamp').length) {
                jQuery('.details .link', this).after('<div class="stamp"></div>');
            }
            if (!jQuery(this).find('.details > .btn.buy').length) {
                jQuery('.details .reviewaggregate', this).after('<a class="btn buy" style="visibility: hidden"></a>');
            }
            if (!jQuery(this).find('.details > .compare').length) {
                jQuery('.details .btn.buy', this).after('<fieldset class="compare" style="visibility: hidden"></fieldset>');
            }
        });

        jQuery('.list-products .hproduct .figure').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .tools').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .name').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .caracteristicas').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .offers .regular').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .offers .price-to').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .offers .percent-a-vista').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .details .parcel').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .stamp').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .btn.buy').matchHeight({
            byRow: true
        });
        jQuery('.list-products .hproduct .compare').matchHeight({
            byRow: true
        });
    };
    if (jQuery('#pnlHomeDelivery').length) {
        jQuery('.address.box .info > .details').matchHeight({
            byRow: true
        });
    }
}

//Reset no carrossel de sku do catalogo
function resetSkuCat() {
    if (pageW <= 979 && jQuery('.hproduct').length && jQuery('.skus').length) {
        jQuery('.tools').each(function () {
            if (jQuery('.skus', this).hasClass('owl-carousel')) {
                reinitCarousel(jQuery('.skus', this), 3, true, false);
            };
            if (jQuery('.skus > li', this).length > 3 && !jQuery('.skus', this).hasClass('owl-carousel')) {
                jQuery('.skus', this).owlCarousel({
                    items: 3,
                    navigation: true,
                    responsive: true,
                    pagination: false
                });
            };
        });
    };

    if (pageW >= 980 && jQuery('.tools').length) {
        jQuery('.tools').each(function () {
            if (jQuery('.owl-carousel', this).length) {
                reinitCarousel(jQuery('.owl-carousel', this), 4);
            }
        });
    };
}

//Reset no carrossel de SKU's do look
function resetLookAsideSku(){
    if (jQuery('.lookDetalhe .aside .jcarousel-skin-tango').length) {
        jQuery('.jcarousel-skin-tango').each(function () {
            if (jQuery(this).hasClass('owl-carousel')) {
                reinitCarousel(jQuery(this), 3, true, false);
            };
            if (jQuery('> li', this).length > 3) {
                jQuery(this).owlCarousel({
                    items: 3,
                    navigation: true,
                    responsive: true,
                    pagination: false
                });
            };
        });
    };
};

//Corrige bug de exibir % duplicado na wishlist
function fixPercentWishlist() {
    jQuery('.reviewaggregate .rating').each(function () {
        jQuery(this).attr('style', jQuery(this).attr('style').replace('%%', '%'));
    });
};

//Troca televendas por sac na pagina institucional
function changeSacText() {
    jQuery('.fst .televendas').ready(function () {
        var sac = jQuery('.fst .televendas').text().replace('Televendas', 'SAC');
        jQuery('.fst .televendas').text(sac);
    });
};

//remove ".00" da porcentagem de desconto nos produtos em lista;
function fixPercentCat() {
    jQuery('#main').ready(function () {
        jQuery('.hproduct:not(#info-product), .result, .aside .hproduct').each(function () {
            var percent = jQuery('.value-percentage', this).text().replace('.00', '').replace(' %', '%');
            jQuery('.value-percentage', this).text(percent);
        });
    });
};

//Adiciona botão de retornar ao topo
function addBtTop() {
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() >= 50) {
            jQuery('.voltar-top').fadeIn(200);
        } else {
            jQuery('.voltar-top').fadeOut(200);
        }
    });
    jQuery('.voltar-top').click(function () {
        jQuery('body,html').animate({
            scrollTop: 0
        }, 500);
    });
};

//Muda a localização padrão do botão de tabela de medidas (.padrao-brasileiro)
function changePadraoBrasilero() {
    if (jQuery('body').hasClass('product') && jQuery('.padrao-brasileiro').length) {
        jQuery('.tools').prepend(jQuery('.padrao-brasileiro'));
    };
};


// [CORE HEADER 1]
//Construção de elementos entre desktop e mobile
function reinitHeader() {
    //Alterna a posição do menu entre desktop e mobile
    if (pageW >= 980 && !jQuery("#header .container #nav").length) {
        jQuery("#header .container").prepend(jQuery("#nav"));
    }

    if (pageW <= 979 && jQuery("#header .container #nav").length) {
        jQuery('.wrap-nav-mobile').append(jQuery("#nav"));
        jQuery('#header').after(jQuery('.wrap-nav-mobile'));
    }

    //Alterna a posição do welcome entre desktop e mobile
    if (pageW >= 980 && !jQuery("#header #identificacao").length) {
        jQuery("#header .iconav-user > ul").prepend(jQuery("#identificacao"));
    }

    if (pageW <= 979 && !jQuery(".wrap-nav-mobile #identificacao").length) {
        jQuery('.wrap-nav-mobile').prepend(jQuery("#identificacao"));
    }

    //Alterna a posição do menu helper entre desktop e mobile
    if (pageW >= 980 && !jQuery(".iconav-user .iconav-user-sub").length) {
        jQuery(".iconav-user").prepend(jQuery(".iconav-user-sub"));
    }

    if (pageW <= 979 && !jQuery(".wrap-nav-mobile .iconav-user-sub").length) {
        jQuery('.wrap-nav-mobile').append(jQuery(".iconav-user-sub"));
    }
    
};

// [CORE HEADER 1]
//Clona numero de itens do carrinho para o responsivo
function cloneBasketNumber() {
    if (pageW <= 979) {
        //Clona numero de itens no carrinho para versao responsiva
        jQuery(".basket-count-number").clone().prependTo(jQuery(".btn-cart-mobile"));
        //Ajuste help dentro do menu mobile
        jQuery('.wrap-nav-mobile').append(jQuery(".iconav-user-sub"));
    };
};

// [CORE PRODUCT 1]
//Reset carrossel de fotos detalhe do produto responsivo
function productFixes() {
    if (pageW <= 979 && jQuery('body').hasClass('product')) {
        if (jQuery('.item-prod-images.video').length) {
            jQuery('.item-prod-images.video').parent().prev().remove();
            reinitCarousel(jQuery('.responsive-prod-images .container-carousel'), 1, true, true);
        };
    };
};

// [CORE LOOK 1]
//Corrige posicionamento de blocos quando muda a resolução
function lookFixes() {

    if (pageW >= 980 && jQuery('body').hasClass('lookDetalhe')) {
        if (jQuery('.main-look > .aside').length || jQuery('.look-right > #info-product').length) {
            jQuery('.look-right').append(jQuery('.main-look .aside'));
            jQuery('.main-look').prepend(jQuery('#info-product'));
        }
    }

    if (pageW <= 979 && jQuery('body').hasClass('lookDetalhe')) {
        if (jQuery('.item-prod-images.video').length) {
            jQuery('.item-prod-images.video').parent().prev().remove();
            reinitCarousel(jQuery('.responsive-prod-images .container-carousel'), 1, true, true);
        };
    };

};