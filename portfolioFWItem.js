module.exports = function(app){
    var PortfolioFWItem = Object.getPrototypeOf(app).PortfolioFWItem = new app.Component("portfolioFWItem");
    // PortfolioFWItem.debug = true;
    PortfolioFWItem.createdAt      = "2.4.0";
    PortfolioFWItem.lastUpdate     = "2.4.0";
    PortfolioFWItem.version        = "1.1";
    PortfolioFWItem.factoryExclude = true;
    // PortfolioFWItem.loadingMsg     = "This message will display in the console when component will be loaded.";
    // PortfolioFWItem.requires       = [];

    PortfolioFWItem.prototype.onCreate = function(){
    var item = this;
        item.reader = (item.reader !== undefined) ? item.reader : undefined;
        item.id = (item.id !== undefined) ? item.id : item.getData('id',undefined);
        item.alias = (item.alias !== undefined) ? item.alias : item.getData('alias',undefined);
        item.timerAutoplay = null;

        if(item.reader !== undefined && item.id !== undefined)
            item.loadGallery();

        return item;
    }
    
    PortfolioFWItem.prototype.loadGallery = function(){
        var item = this;
        return new Promise(function(resolve,reject){
            item.gallery = {
                $el : item.$el.find('.gallery'),
                $nav: $('<div class="nav_gallery"></div>'),
                $imgs: item.$el.find('.gallery img'),
            }

            item.gallery.$imgs.each(function(index,img){
                img.src = $(img).attr('data-path');
                $(img).parent().attr('data-step', index).addClass('loading');
                img.onload = function () {
                    $(img).parent().removeClass('loading').addClass('loaded');
                    $(window).resize(img.onResize);
                    img.onResize();
                };
                img.onResize = function () {
                    var refWidth = viewport.width * 0.8;
                    var refHeight = viewport.height - (viewport.width - viewport.width * 0.8);
                    $(img).parent().removeClass('full');
                    if ($(img).outerWidth() >= refWidth && $(img).outerHeight() >= refHeight) $(img).parent().addClass('full');
                    // adjust position of the gallery
                    var stepImg = item.gallery.$nav.find('.item.active').attr('data-step');
                    item.$el.find('.wrapper').css('top', item.reader.$reader.outerHeight() * stepImg * -1);
                };
                var $nav_item = $('<span class="item" data-step="' + index + '"><i class="far fa-circle"></i></span>');
                item.gallery.$nav.append($nav_item);
            });
            item.gallery.$nav.find('.item').bind('click', function (e, pauseGallery) {
                if (e.originalEvent !== undefined || pauseGallery === true) {
                    item.stopGallery();
                    item.timerAutoplay = setTimeout(function(){
                        item.runGallery();
                    }, 15000);
                }
                var step = parseInt($(this).attr('data-step'));
                // active state on gallery's nav
                item.gallery.$nav.find('.item').removeClass('active').find('svg').removeClass('fa-dot-circle').addClass('far fa-circle');
                $(this).addClass('active').find('svg').addClass('far fa-dot-circle');
                // active state on img container (non-necessary)
                item.gallery.$imgs.parent().removeClass('active');
                $(item.gallery.$imgs[step]).parent().addClass('active');
                // gallery movement
                item.$el.find('.wrapper').addClass('animated').css('top', item.reader.$reader.outerHeight() * step * -1).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                    $(this).removeClass('animated');
                });
            });
            item.gallery.$nav.append('<span class="arrows"><i class="fas fa-arrows-alt-v"></i></span>');
            // item.gallery.$el.append(item.gallery.$nav);
            item.$el.find('.content').append(item.gallery.$nav);
            item.gallery.$loadbar = $('<div class="loadbar"></div>').appendTo(item.gallery.$el);
            setTimeout(function(){item.gallery.$nav.find('.item').first().trigger('click')},10);
            item.$el.find('.wrapper').trigger('transitionend');

            resolve();
        });
    };
    PortfolioFWItem.prototype.runGallery = function(){
        var item = this;
        item.stopGallery();
        item.gallery.$loadbar.animate({ 'width': '100%' }, 10000);
        item.timerAutoplay = setTimeout(function(){
            if (item.gallery.$nav.find('.item.active').next('.item').length) 
                item.gallery.$nav.find('.item.active').next('.item').trigger('click');
            else 
                item.gallery.$nav.find('.item').first().trigger('click');
            item.runGallery();
        }, 10000);
    };
    PortfolioFWItem.prototype.stopGallery = function(){
        var item = this;
        item.gallery.$loadbar.stop().css('width', 0);
        clearTimeout(item.timerAutoplay);
    };
    PortfolioFWItem.prototype.openDetails = function(){
        var item = this;
        item.reader.bindSwipe('detail');
        item.$el.find('.content').addClass('active');
    };

    return PortfolioFWItem;
}