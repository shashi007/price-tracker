/**
 * Taken from http://stackoverflow.com/a/2117523
 */
function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * Utility function to avoid tedious string concatenations:
 * Instead of: 'a' + 'b' + 'c', 
 *         or: ['a', 'b', 'c'].join(""), 
 * you can write: concat('a', 'b', 'c')
 */
function concat () {
    var args = Array.prototype.slice.call(arguments);
    return args.join("");
}
/**
 * Use __('a', 'b', 'c') instead of concat('a', 'b', 'c')
 */
__ = concat;
/**
 * Use $__('a', 'b', 'c') instead of $(__('a', 'b', 'c'))
 */
$__ = function() {
    return $(__.apply(null, arguments));
};
/**/

function QuotesView() {
    this.exchanges = {
        'amagi' : {
            description: 'Amagi Metals',
            link: 'https://www.amagimetals.com/',
        },
        'ambito' : {
            description: 'Ambito.com',
            link: 'http://www.ambito.com/economia/mercados/monedas/dolar/',
        },
        'lanacion' : {
            description: 'La Nacion',
            link: 'http://www.lanacion.com.ar/dolar-hoy-t1369'
        },
        'clarin' : {
            description: 'Clarin',
            link: 'http://www.ieco.clarin.com/'
        },
        'cexio' : {
            description: 'Cex.IO',
            link: 'https://cex.io/'
        },
        'cronista' : {
            description: 'Cronista',
            link: 'http://www.cronista.com'
        },
        'infobae' : {
            description: 'Infobae',
            link: 'http://www.infobae.com'
        },
        'coinbase' : {
            description: 'Coinbase',
            link: 'https://coinbase.com/charts',
        },
        'coinsetter' : {
            description: 'Coinsetter',
            link: 'https://www.coinsetter.com/',
        },
        'bitstamp' : {
            description: 'Bitstamp',
            link: 'https://www.bitstamp.net',
        },
        'btc-e' : {
            description: 'BTC-e',
            link: 'https://btc-e.com',
        },
        'okcoin' : {
            description: 'OKCoin',
            link: 'https://www.okcoin.com',
        },
        'bitfinex' : {
            description: 'Bitfinex',
            link: 'https://www.bitfinex.com/pages/stats',
        },
        'bullionvault' : {
            description: 'BullionVault',
            link: 'https://www.bullionvault.com',
        },
        'virwox' : {
            description: 'VirWox',
            link: 'https://www.virwox.com',
        }
    };

    this.symbols = {
        'USDARS' : {
            description: '(Dolar oficial)',
            exchanges: ['ambito', 'lanacion', 'cronista', 'infobae', 'clarin'],
            prefix: 'AR$',
            column: '1'
        }, 
        'USDARSB' : {
            description: '(Dolar blue)',
            exchanges: ['ambito', 'lanacion', 'cronista', 'infobae', 'clarin'],
            prefix: 'AR$',
            column: '1'
        }, 
        'USDARSCL' : {
            description: '(Contado c/liqui)',
            exchanges: ['ambito', 'cronista', 'infobae'],
            prefix: 'AR$',
            column: '1'
        },
        'USDARSBOL' : {
            description: '(Dolar bolsa)',
            exchanges: ['ambito'],
            prefix: 'AR$',
            column: '1'
        },
        'BTCUSD' : {
            description: '(Bitcoin)',
            exchanges: ['bitstamp', 'coinbase', 'btc-e',
                        'okcoin', 'bitfinex',
                        'coinsetter', 'cexio'],
            prefix: '$',
            column: '2'
        },  
        'LTCUSD' : {
            description: '(Litecoin)',
            exchanges: ['btc-e', 'okcoin', 'bitfinex', 'cexio'],
            prefix: '$',
            column: '2'
        },
        'XAUUSD' : {
            description: '(Gold)',
            exchanges: ['bullionvault', 'amagi'],
            prefix: '$',
            column: '2'
        },           
        'XAGUSD' : {
            description: '(Silver)',
            exchanges: ['bullionvault', 'amagi'],
            prefix: '$',
            column: '2'
        }, 
        'USDSLL' : {
            description: '(Linden/USD)',
            exchanges: ['virwox'],
            prefix: '',
            column: '2'
        }, 
        'BTCSLL' : {
            description: '(Linden/Bitcoin)',
            exchanges: ['virwox'],
            prefix: 'SLL ',
            column: '2'
        }, 
    };

    this.symbol_list = [
        'USDARSB', 'USDARS', 'USDARSCL', 'USDARSBOL',
        null,
        'BTCUSD', 'LTCUSD',
        null,
        'XAUUSD', 'XAGUSD',
        null,
        'USDSLL', 'BTCSLL'
    ];

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
}

QuotesView.prototype.render = function() {
    var self = this;

    this.symbol_list.forEach(function(symbol) {
        self.addSymbol(symbol, self.symbols[symbol]);
    });
};

QuotesView.prototype.showChart = function(symbol, exchange) {
    var series_url = (
        location.origin + '/api/v1/symbols/' +
        symbol + '/' + exchange + '/series'
    );

    $__('#', symbol, '-', exchange, '-chart').addClass('hide');
    $__('#', symbol, '-', exchange, '-chart-progress').removeClass('hide');

    $.getJSON(series_url, function (response) {
        var series = function (name) {
            return {
                name : name.toUpperCase(),
                data: response.data.series.map(function (item) {
                    return [
                        new Date(item.date)*1,
                        item[name]
                    ];
                }),
                tooltip: {
                    valueDecimals: 2
                }
            };
        };

        $__('#', symbol, '-', exchange, '-chart').removeClass('hide');
        $__('#', symbol, '-', exchange, '-chart-progress').addClass('hide');

        $__('#', symbol, '-', exchange, '-chart').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            },
            title : {
                text : symbol + '@' + exchange
            },
            series : [
                series('ask'),
                series('bid')
            ]
        });
    });
};

QuotesView.prototype.onSymbolSelected = function(model, symbol) {
    var exchange = (
        model.getSelectedExchange(symbol) ||
        this.symbols[symbol].exchanges[0]
    );

    $(".select-symbol").removeClass("active");
    $__("#select-symbol-", symbol).addClass("active");

    $(".prices-body").addClass("hide");
    $__("#prices-body-", symbol).removeClass("hide");

    this.onExchangeSelected(model, symbol, exchange);
};

QuotesView.prototype.onExchangeSelected = function(model, symbol, exchange) {
    $(".select-exchange").removeClass('custom-nav-selected');
    $(".select-exchange").addClass('custom-nav-not-selected');

    $__("#select-exchange-", symbol, '-', exchange).removeClass('custom-nav-not-selected');
    $__("#select-exchange-", symbol, '-', exchange).removeClass('custom-nav-hover');
    $__("#select-exchange-", symbol, '-', exchange).addClass('custom-nav-selected');

    $(".exchange-details").addClass("hide");
    $__("#", symbol, '-', exchange, '-details').removeClass("hide");

    this.showChart(symbol, exchange);
};

QuotesView.prototype.hookSelectionButtons = function (model) {
    var self = this;

    $(".select-symbol").bind('click', function(event) {
        event.preventDefault();

        var symbol = $(this).attr("target");
        model.setSelectedSymbol(symbol);
        self.onSymbolSelected(model, symbol);

        return false;
    });

    $(".select-exchange").bind('click', function(event) {
        event.preventDefault();

        var symbol = model.getSelectedSymbol(),
            exchange = $(this).attr("target");
        model.setSelectedExchange(symbol, exchange);
        self.onExchangeSelected(model, symbol, exchange);

        return false;
    });

    $('.select-exchange').hover(
        function() {
            if (!$(this).hasClass('custom-nav-selected')) {
                $(this).removeClass('custom-nav-not-selected');
                $(this).addClass('custom-nav-hover');
            }
        },
        function() {
            $(this).removeClass('custom-nav-hover');

            if (!$(this).hasClass('custom-nav-selected')) {
                $(this).addClass('custom-nav-not-selected');
            }
        }
    );
};

QuotesView.prototype.restoreSelectionStatus = function (model) {
    var symbol = model.getSelectedSymbol() || this.symbol_list[0];
    this.onSymbolSelected(model, symbol);
};

QuotesView.prototype.renderSymbolPricesBody = function (symbol, info) {
    return $__(
        '<div class="row">',
        '  <div style="margin-top: 10px" ',
        '       class="hide prices-body" ',
        '       id="prices-body-', symbol, '">',
        '  </div>',
        '</div>'
    );
};

QuotesView.prototype.renderSymbolDetailsBody = function (symbol, info) {
    return $__(
        '<div class="row">',
        '  <div id="details-body-', symbol, '">',
        '  </div>',
        '</div>'
    );
};

QuotesView.prototype.renderSymbolNav = function (symbol, info) {
    return $__(
        '<li role="presentation" ',
        '    target="', symbol, '" ',
        '    class="select-symbol" ',
        '    id="select-symbol-', symbol,'">',
        '  <a>',
        '    <img src="img/symbol/', symbol, '.png" width=32 height=32></img>',
        '    <large>', symbol, '</large> <small>', info.description, '</small>',
        '  </a>',
        '</li>'
    );
};

QuotesView.prototype.renderSymbolNavSep = function () {
    return $__(
        '<li role="presentation" class="separator bottom-separator">',
        '</li>',
        '<li>',
        '</li>'
    );
};

QuotesView.prototype.addSymbol = function (symbol, info) {
    if (!symbol) {
        $__("#main-quotes-symbol-nav-bar").append(this.renderSymbolNavSep());
        return;
    }

    $__("#main-quotes-symbol-nav-bar").append(this.renderSymbolNav(symbol, info));
    $__("#main-quotes-prices-column").append(this.renderSymbolPricesBody(symbol, info));
    $__("#main-quotes-details-column").append(this.renderSymbolDetailsBody(symbol, info));

    var self = this;
    info.exchanges.forEach(function(exchange) {
        self.addExchangeForSymbol(symbol, exchange);
    });
};

QuotesView.prototype.renderExchangePrices = function (symbol, exchange) {
    var base_id = __(symbol, '-', exchange);

    return $__(
        '<div class="row" style="margin-bottom: 10px; margin-left: 25px;">',
        '  <div target="', exchange, '"',
        '       class="col-xs-5 select-exchange custom-nav custom-nav-not-selected"',
        '       id="select-exchange-', symbol, '-', exchange, '">', 
        '    <span style="font-size: xx-small;"> ',
        '       <img src="img/exchange/', exchange, '.ico" ',
        '            width=16 height=16> ', 
        '      <span style="font-size: small">', this.exchanges[exchange].description, '</span>',
        '    </span>',
        '    <a href="', this.exchanges[exchange].link,'" target="_blank">',
        '      <span class="glyphicon glyphicon-share"',
        '            style="font-size: x-small;"> ',
        '      </span>',
        '    </a>',
        '  </div>',
        '  <div class="col-xs-7"',
        '       id="', base_id, '-progress">',
        '    <div class="progress progress-striped active">',
        '      <div class="progress-bar" style="width: 100%">',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div class="col-xs-7 hide"',
        '       id="', base_id, '-error">',
        '    <div class="alert alert-danger">',
        '      <strong>Error</strong>',
        '      <span id="', base_id, '-error-msg"></span>',
        '    </div>',
        '  </div>',
        '  <div id="', base_id, '-prices" style="margin-top: 5px" class="hide">',
        '    <div class="col-xs-3">',
        '      <span class="label label-info" style="font-size: small"',
        '          id="', base_id, '-bid">',
        '      </span>',
        '    </div>',
        '    <div class="col-xs-3">',
        '      <span class="label label-primary" style="font-size: small" ',
        '            id="', base_id, '-ask">',
        '      </span>',
        '    </div>',
        '  </div>',
        '</div>'
    );
};

QuotesView.prototype.renderExchangeDetails = function (symbol, exchange) {
    var base_id = __(symbol, '-', exchange);

    return $__(
        '<div id="', base_id, '-details" ',
        '     class="hide separator left-separator exchange-details"',
        '     style="margin: 10px; margin-left: 25px">',
        '  <div class="row" style="margin: 25px">',
        '    <div class="progress progress-striped active" id="', base_id, '-chart-progress">',
        '      <div class="progress-bar" style="width: 100%">',
        '        Loading chart...',
        '      </div>',
        '    </div>',
        '    <div class="hide price-chart" id="', base_id, '-chart"></div>',
        '    <hr></hr>',
        '  </div>',
        '  <div id="', base_id, '-details-data" style="margin: 25px">',
        '    <div class="row">',
        '      <div class="col-xs-5">',
        '        <span style="font-size: small;">',
        '          <strong>Last updated:</strong>',
        '        </span>',
        '      </div>',
        '      <div class="col-xs-7"',
        '           id="', base_id, '-last-updated-progress">',
        '        <div class="progress progress-striped active">',
        '          <div class="progress-bar" style="width: 100%">',
        '          </div>',
        '        </div>',
        '      </div>',
        '      <div id="', base_id, '-last-updated" class="hide">',
        '        <div class="col-xs-7">',
        '          <span id="', base_id, '-last-updated-date" style="font-size: small;">',
        '          </span>',
        '          <span id="', base_id, '-last-updated-ago" style="font-size: small;">',
        '          </span>',
        '        </div>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
    );  
};

QuotesView.prototype.addExchangeForSymbol = function (symbol, exchange) {
    $__('#prices-body-', symbol).append(
        this.renderExchangePrices(symbol, exchange)
    );

    $__('#details-body-', symbol).append(
        this.renderExchangeDetails(symbol, exchange)
    );
};

QuotesView.prototype.renderPrice = function (price, prev) {
    var selector_base = __("#", price.symbol, "-", price.exchange),
        prices_selector = __(selector_base, "-prices"),
        bid_selector = __(selector_base, "-bid"),
        ask_selector = __(selector_base, "-ask"),
        error_selector = __(selector_base, "-error"),
        progress_selector = __(selector_base, "-progress");

    $(bid_selector).html(price.bid ?
                         __(this.symbols[price.symbol].prefix, 
                            price.bid.toFixed(2)) : "N/A");
    $(ask_selector).html(price.ask ?
                          __(this.symbols[price.symbol].prefix, 
                             price.ask.toFixed(2)) : "N/A");

    if (!prev || prev.bid != price.bid)
        $(bid_selector).effect("highlight");

    if (!prev || prev.ask != price.ask)
        $(ask_selector).effect("highlight");

    $(prices_selector).removeClass("hide");
    $(error_selector).addClass("hide");
    $(progress_selector).addClass("hide");
};

QuotesView.prototype.updateLabelsColors = function (price, prev) {
    var selector_base = __("#", price.symbol, "-", price.exchange),
        bid_selector = __(selector_base, "-bid"),
        ask_selector = __(selector_base, "-ask");

    var set_label_class = function(selector, label_class) {
        $(selector)
            .removeClass(__("label-info ",
                            "label-primary ",
                            "label-danger ",
                            "label-success ",
                            "label-default"))
            .addClass(__("label-", label_class));
    };

    if (prev && price.bid && prev.bid < price.bid)
        set_label_class(bid_selector, "success");

    if (prev && price.bid && prev.bid > price.bid)
        set_label_class(bid_selector, "danger");

    if (prev && price.ask && prev.ask < price.ask)
        set_label_class(ask_selector, "success");

    if (prev && price.ask && prev.ask > price.ask)
        set_label_class(ask_selector, "danger");

    if (!price.bid)
        set_label_class(bid_selector, "default");

    if (!price.ask)
        set_label_class(ask_selector, "default");
};

QuotesView.prototype.renderDetails = function (price) {
    var selector_base = __("#", price.symbol, "-", price.exchange),
        last_updated_selector = __(selector_base, "-last-updated"),
        last_updated_date_selector = __(selector_base, "-last-updated-date"),
        last_updated_ago_selector = __(selector_base, "-last-updated-ago"),
        last_updated_progress_selector = __(selector_base, "-last-updated-progress");

    var updated_on = (new Date(price.updated_on)).toLocaleString();

    $(last_updated_date_selector).html(updated_on);
    $(last_updated_ago_selector).html(__('(0.00s ', 'ago)'));

    $(last_updated_selector).removeClass("hide");
    $(last_updated_progress_selector).addClass("hide");
};

QuotesView.prototype.renderCustomFields = function (price) {
    var selector_base = __("#", price.symbol, "-", price.exchange);

    var render_func = {
        published_on: function (value) {
            $__(selector_base, '-last-published-date').html(
                (new Date(value)).toLocaleString()
            );
        },
        volume24: function (value) {
            $__(selector_base, '-volume24-value').html(
                __(value.toFixed(2), ' BTC')
            );
        },
        low24: function (value) {
            $__(selector_base, '-low24-value').html(
                __('$', value.toFixed(2))
            );
        },
        high24: function (value) {
            $__(selector_base, '-high24-value').html(
                __('$', value.toFixed(2))
            );
        }
    };

    for (var field in price.custom) {
        render_func[field](price.custom[field]);
    }
};

QuotesView.prototype.addCustomFields = function (price) {
    var selector_base = __("#", price.symbol, "-", price.exchange);

    for (var field in price.custom) {
        var custom_selector = __(selector_base, "-", field);
        if (!$(custom_selector).length) {
            $__(selector_base, '-details-data').append(
                this.addCustomField(price.symbol, price.exchange, field)
            );
        }
    }
};

QuotesView.prototype.addCustomField = function (symbol, exchange, field) {
    var base_id = __(symbol, '-', exchange);

    var field_desc = {
        published_on: "Last published:",
        volume24: 'Volume (24hs):',
        high24: 'High (24hs)',
        low24: 'Low (24hs)'
    };

    var field_body = {
        published_on: __(
            '<div class="col-xs-7">',
            '  <span id="', base_id, '-last-published-date" style="font-size: small;">',
            '  </span>',
            '  <span id="', base_id, '-last-published-ago" style="font-size: small;">',
            '  </span>',
            '</div>'
        ),
        volume24: __(
            '<div class="col-xs-7">',
            '  <span id="', base_id, '-volume24-value" style="font-size: small;">',
            '  </span>',
            '</div>'
        ),
        high24: __(
            '<div class="col-xs-7">',
            '  <span id="', base_id, '-high24-value" style="font-size: small;">',
            '  </span>',
            '</div>'
        ),
        low24: __(
            '<div class="col-xs-7">',
            '  <span id="', base_id, '-low24-value" style="font-size: small;">',
            '  </span>',
            '</div>'
        )
    };

    return $__(
        '<div class="row" id="', base_id, '-', field, '">',
        '  <div class="col-xs-5">',
        '    <span style="font-size: small;">',
        '      <strong>', field_desc[field], '</strong>',
        '    </span>',
        '  </div>',
        '  <div>', field_body[field], '</div>',
        '</div>'
    );
};

QuotesView.prototype.renderPriceError = function (error) {
    var selector_base = __("#", error.info.symbol, "-", error.info.exchange),
        prices_selector = __(selector_base, "-prices"),
        error_selector = __(selector_base, "-error"),
        error_msg_selector = __(selector_base, "-error-msg"),
        progress_selector = __(selector_base, "-progress");

    $(error_msg_selector).html(error.message);

    $(error_selector).removeClass("hide");
    $(prices_selector).addClass("hide");
    $(progress_selector).addClass("hide");
};

QuotesView.prototype.renderGenericError = function (error) {
    $("#global-error").removeClass("hide");
    $("#global-error-msgs").empty();
    $("#global-error-msgs").append($__(
        "<li>", error.message, "</li>"
    ));
};

QuotesView.prototype.clearGenericError = function () {
    $("#global-error").addClass("hide");
    $("#global-error-msgs").empty();
};

QuotesView.prototype.timedelta = function(last_update) {
    var delta = ((new Date()) - last_update) / 1000,
        frames = {},
        ret = '';

    frames.minute = {seconds: 60, suffix: 'm'};
    frames.hour = {seconds: frames.minute.seconds * 60, suffix: 'h'};
    frames.day = {seconds: frames.hour.seconds * 24, suffix: 'd'};
    frames.week = {seconds: frames.day.seconds * 7, suffix: 'w'};

    ['week', 'day', 'hour', 'minute'].forEach(function (frame) {
        if (delta >= frames[frame].seconds) {
            var units = Math.floor(delta / frames[frame].seconds);
            ret += units + frames[frame].suffix + ' ';
            delta = delta % frames[frame].seconds;
        }
    });

    return ret + delta.toFixed(2) + 's';
};

QuotesView.prototype.updateGlobalTimer = function (last_update) {
    $("#quotes-updated-ago").html(this.timedelta(last_update));
};

QuotesView.prototype.updateQuoteTimer = function (quote) {
    var selector_base = __("#", quote.symbol, "-", quote.exchange);

    $__(selector_base, "-last-updated-ago").html(
        __('(', this.timedelta(new Date(quote.updated_on)), ' ago)')
    );

    if ("published_on" in quote.custom) {
        $__(selector_base, "-last-published-ago").html(
            __('(', this.timedelta(new Date(quote.custom.published_on)), ' ago)')
        );
    }
};

function QuotesModel() {
    this.quotes = {};
    this.selected = undefined;
}

QuotesModel.prototype.save = function () {
    localStorage["quotes.selected"] = JSON.stringify(this.selected);
};

QuotesModel.prototype.load = function () {
    this.selected = JSON.parse(localStorage["quotes.selected"] || null) || {
        symbol: null,
        exchange: {}
    };
};

QuotesModel.prototype.getSelectedSymbol = function () {
    return this.selected.symbol;
};

QuotesModel.prototype.getSelectedExchange = function (symbol) {
    return this.selected.exchange[symbol];
};

QuotesModel.prototype.setSelectedSymbol = function (symbol) {
    this.selected.symbol = symbol;
    this.save();
};

QuotesModel.prototype.setSelectedExchange = function (symbol, exchange) {
    this.selected.exchange[symbol] = exchange;
    this.save();
};

QuotesModel.prototype.updateQuote = function(quote) {
    if (!(quote.symbol in this.quotes))
        this.quotes[quote.symbol] = {};

    var prev = this.quotes[quote.symbol][quote.exchange];
    this.quotes[quote.symbol][quote.exchange] = quote;
    return prev;
};

QuotesModel.prototype.getQuote = function(symbol, exchange) {
    if (!(symbol in this.quotes))
        return;

    if (!(exchange in this.quotes[symbol]))
        return;
    
    return this.quotes[symbol][exchange];
};

function QuotesController(view, model) {
    this.view = view;
    this.model = model;
    this.updated_on = new Date();
    this.watchdog();
}

QuotesController.prototype.start = function () {
    this.model.load();
    this.view.render();
    this.view.hookSelectionButtons(this.model);
    this.view.restoreSelectionStatus(this.model);
};

QuotesController.prototype.onPriceUpdated = function (price) {
    var prev;

    this.updated_on = new Date();
    prev = this.model.updateQuote(price);
    this.view.addCustomFields(price);
    this.view.updateLabelsColors(price, prev);
    this.view.renderPrice(price, prev);
    this.view.renderDetails(price);
    this.view.renderCustomFields(price);
};

QuotesController.prototype.onConnect = function (error) {
    this.view.clearGenericError();
};

QuotesController.prototype.onError = function (error) {
    if (!error.info || !error.info.exchange || !error.info.symbol) {
        this.view.renderGenericError(error);
    } else {
        this.view.renderPriceError(error);
    }
};

QuotesController.prototype.watchdog = function () {
    this.view.updateGlobalTimer(this.updated_on);

    for (var symbol in this.model.quotes) {
        for (var exchange in this.model.quotes[symbol]) {
            var quote = this.model.getQuote(symbol, exchange);
            this.view.updateQuoteTimer(quote);
        }
    }

    setTimeout(this.watchdog.bind(this), 1000);
};

QuotesController.prototype.getQuote = function (symbol, exchange) {
    return this.model.getQuote(symbol, exchange);
};

QuotesController.prototype.getExchanges = function (symbol) {
    return this.view.symbols[symbol].exchanges;
};

QuotesController.prototype.getExchangeDescription = function (exchange) {
    return this.view.exchanges[exchange].description;
};

function PortfolioModel() {
    this.portfolios = undefined;
    this.main_exchange = undefined;
}

PortfolioModel.prototype.save = function () {
    localStorage["portfolio.portfolios"] = JSON.stringify(this.portfolios);
    localStorage["portfolio.main_exchange"] = this.main_exchange;
};

PortfolioModel.prototype.load = function () {
    this.portfolios = JSON.parse(localStorage["portfolio.portfolios"] || null) || [];
    this.main_exchange = localStorage["portfolio.main_exchange"] || 'coinbase';
};

PortfolioModel.prototype.setMainExchange = function (exchange) {
    this.main_exchange = exchange;
    this.save();
};

PortfolioModel.prototype.savePortfolio = function (portfolio) {
    this.portfolios.push(portfolio);
    this.save();
};

PortfolioModel.prototype.deletePortfolio = function (guid) {
    var self = this;

    this.portfolios.forEach(function(portfolio, index) {
        if (portfolio.guid == guid) {
            self.portfolios.splice(index, 1);
        }
    });

    this.save();
};

PortfolioModel.prototype.saveTrade = function (portfolio, trade) {
    var self = this;

    this.portfolios.forEach(function(portfolio_) {
        if (portfolio_.guid == portfolio.guid) {
            portfolio_.trades.push(trade);
        }
    });

    this.save();
};

PortfolioModel.prototype.deleteTrade = function (guid) {
    var self = this;

    this.portfolios.forEach(function(portfolio) {
        portfolio.trades.forEach(function(trade, index) {
            if (trade.guid == guid) {
                portfolio.trades.splice(index, 1);
            }
        });
    });

    this.save();
};

function PortfolioView() {
    this.controller = undefined;
}

PortfolioView.prototype.setController = function (controller) {
    this.controller = controller;
};

PortfolioView.prototype.render = function (portfolios) {
    var self = this;

    portfolios.forEach(function(portfolio) {
        self.addPortfolio(portfolio);
        portfolio.trades.forEach(function(trade) {
            self.addTrade(portfolio, trade);
        });
    });
};

PortfolioView.prototype.updateTradeReturn = function(trade, investment) {
    var selector_base = __('#trade-', trade.guid);

    this.updateInvestment(selector_base, investment);
};

PortfolioView.prototype.renderTrade = function(portfolio, trade) {
    return $__(
        '<li class="list-group-item" ',
        '    id="trade-', trade.guid, '">', 
        '  <button type="button" class="close" aria-hidden="true"',
        '          id="btn-', trade.guid, '-remove">', 
        '    &times;',
        '  </button>',
        '  <div class="row">',
        '    <div class="col-sm-6">',
        '      <h5>',
        '        <strong>', trade.amount, ' BTC</strong> for ',
        '        <strong>', trade.price, ' USD</strong>',
        '        (', (trade.price / trade.amount).toFixed(2), ' USD/BTC)',
        '      </h5>',
        '      <h5>',
        '        Value: ',
        '        <strong>',
        '          <span id="trade-', trade.guid, '-current-value">',
        '            ??',
        '          </span> USD',
        '        </strong>',
        '        Profit: <strong>',
        '          <span id="trade-', trade.guid, '-profit">',
        '            ??',
        '          </span> USD',
        '        </strong>',
        '      </h5>',
        '    </div>',
        '    <div class="col-sm-6">',
        '      <h4>', 
        '        <span class="label label-default" ',
        '              id="trade-', trade.guid, '-gain">',
        '          ??.??',
        '        </span>',
        '      </h4>',
        '    </div>',
        '  </div>',
        '</li>'
    );
};

PortfolioView.prototype.addTrade = function(portfolio, trade) {
    var self = this;

    $__("#portfolio-", portfolio.guid, "-trades").append(
        this.renderTrade(portfolio, trade)
    );

    $__("#btn-", trade.guid, "-remove").click(function (event) {
        event.preventDefault();
        self.controller.deleteTrade(trade.guid);
    });
};

PortfolioView.prototype.removeTrade = function(guid) {
    $__("#trade-", guid).remove();
};

PortfolioView.prototype.renderPortfolio = function(portfolio) {
    return $__(
        '<div class="panel panel-default" ',
        '     id="portfolio-', portfolio.guid, '">',
        '  <div class="panel-heading">',
        '    <button type="button" class="close" aria-hidden="true"',
        '            id="btn-', portfolio.guid,'-remove">', 
        '      &times;',
        '    </button>',
        '    <h4>', portfolio.name, 
        '      <span class="label label-default" style="margin-left: 10px"',
        '          id="portfolio-', portfolio.guid, '-gain">',
        '        0.00%',
        '      </span>',
        '    </h4>',
        '  </div>',
        '  <div class="panel-body" id="portfolio-', portfolio.guid, '-totals">',
        '    <div class="row">',
        '      <div class="col-sm-6">',
        '        <h5>',
        '          <div>',
        '            Portfolio holdings: ',
        '            <strong>', 
        '              <span id="portfolio-', portfolio.guid, '-holdings"',
        '                    style="font-size: large;">',
        '                0',
        '              </span> BTC',
        '            </strong>',
        '          </div>',
        '          <div>',
        '            Portfolio cost: ',
        '            <strong>',
        '              <span id="portfolio-', portfolio.guid, '-cost">',
        '                0',
        '              </span> USD',
        '            </strong>',
        '          </div>',
        '          <div>',
        '            Avg: ', 
        '            <span id="portfolio-', portfolio.guid, '-avg-price">',
        '              0',
        '            </span> USD/BTC',
        '          </div>',
        '          <div>',
        '            Current: ', 
        '            <span id="portfolio-', portfolio.guid, '-current-price">',
        '              0',
        '            </span> USD/BTC',
        '          </div>',
        '        </h5>',
        '      </div>',
        '      <div class="col-sm-6">',
        '        <h5>',
        '          <div>',
        '            Current value: ',
        '            <strong>',
        '              <span id="portfolio-', portfolio.guid, '-current-value"',
        '                    style="font-size: large;">',
        '                0',
        '              </span> USD',
        '            </strong>',
        '          </div>',
        '          <div>',
        '            Profit: <strong>',
        '              <span id="portfolio-', portfolio.guid, '-profit">',
        '                0',
        '              </span> USD',
        '            </strong>',
        '          </div>',
        '        </h5>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <ul class="list-group" id="portfolio-', portfolio.guid, '-trades">',
        '  </ul>',
        '  <ul class="list-group">',
        '    <li class="list-group-item">',
        '      <form class="form-inline" role="form">',
        '        <div class="row">',
        '          <div class="form-group col-sm-3" ',
        '               id="input-', portfolio.guid, '-amount">',
        '            <div class="input-group">',
        '              <input type="number" step="any" ',
        '                     class="form-control" ',
        '                     placeholder="Enter amount">',
        '              <span class="input-group-addon">BTC</span>',
        '            </div>',
        '          </div>',
        '          <div class="form-group col-sm-3" ',
        '               id="input-', portfolio.guid, '-price">',
        '            <div class="input-group">',
        '              <input type="number" step="any"',
        '                     class="form-control" ',
        '                     placeholder="Enter price">',
        '              <span class="input-group-addon">USD</span>',
        '            </div>', 
        '          </div>',
        '          <div class="col-sm-2">',
        '            <button class="btn btn-primary"',
        '                    id="btn-', portfolio.guid, '-add" >',
        '            <span class="glyphicon glyphicon-plus"></span>',
        '              Add',
        '            </button>',
        '          </div>',
        '        </div>',
        '      </form>',
        '    </li>',
        '  </ul>',
        '</div>'
    );
};

PortfolioView.prototype.addPortfolio = function(portfolio) {
    var self = this;

    $("#portfolios").append(this.renderPortfolio(portfolio));

    $__("#btn-", portfolio.guid, "-add").click(function (event) {
        event.preventDefault();

        var amount_selector = __("#input-", portfolio.guid, "-amount"),
            price_selector = __("#input-", portfolio.guid, "-price"),
            amount = parseFloat($__(amount_selector, " > div > :input").val()),
            price = parseFloat($__(price_selector, " > div > :input").val()),
            valid = true;

        if (!(amount > 0)) {
            $(amount_selector).addClass("has-error");
            valid = false;
        } else {
            $(amount_selector).removeClass("has-error");                
        }

        if (!(price > 0)) {
            $(price_selector).addClass("has-error");
            valid = false;
        } else {
            $(price_selector).removeClass("has-error");                
        }

        if (valid) {
            $__(amount_selector, " > div > :input").val("");
            $__(price_selector, " > div > :input").val("");
            self.controller.createTrade(portfolio, amount, price);
        }
    });

    $__("#btn-", portfolio.guid, "-remove").click(function (event) {
        event.preventDefault();
        self.controller.deletePortfolio(portfolio.guid);
    });
};

PortfolioView.prototype.updatePortfolioReturn = function(portfolio, holdings, return_) {
    var selector_base = __('#portfolio-', portfolio.guid);

    this.updateInvestment(selector_base, holdings, return_);
};

PortfolioView.prototype.removePortfolio = function(guid) {
    $__("#portfolio-", guid).remove();
};

PortfolioView.prototype.updateGlobalReturn = function(holdings, return_) {
    this.updateInvestment("#global", holdings, return_);
};

PortfolioView.prototype.updateInvestment = function(selector_base, investment) {
    if (!investment)
        return;

    $__(selector_base, '-holdings').html(investment.holdings.toFixed(2));
    $__(selector_base, '-cost').html(investment.cost.toFixed(2));
    $__(selector_base, '-avg-price').html(investment.average.toFixed(2));
    $__(selector_base, '-current-price').html(investment.current_price.toFixed(2));
    
    $__(selector_base, '-current-value').html(investment.current_value.toFixed(2));
    $__(selector_base, '-profit').html(investment.profit.toFixed(2));

    $__(selector_base, '-gain').html(__(
        investment.gain < 0 ? '' : '+', (investment.gain * 100).toFixed(2), '%'
    ));

    var classes = ['label-default', 'label-danger', 'label-success'];

    classes.forEach(function (label_class) {
        $__(selector_base, '-gain').removeClass(label_class);
    });
    
    $__(selector_base, '-gain').addClass(
        investment.gain < 0 ? 'label-danger' : 'label-success'
    );
};

PortfolioView.prototype.start = function(main_exchange) {
    var self = this;

    this.updateMainExchange(main_exchange);

    self.controller.getExchanges("BTCUSD").forEach(function (exchange) {
        $('#portfolio-exchanges').append($__(
            '<li>',
            '  <a id="btn-portfolio-exchange-', exchange, '">', 
                 self.controller.getExchangeDescription(exchange), 
            '    (<span id="portfolio-exchange-', exchange, '-price">',
            '     ?? </span> USD)',
            '  </a>',
            '</li>'
        ));
        $__('#btn-portfolio-exchange-', exchange).click(function (event) {
            event.preventDefault();
            self.controller.setMainExchange(exchange);
        });
    });

    $("#btn-create-portfolio").click(function (event) {
        event.preventDefault();

        var input_selector = "#input-portfolio-name",
            value_selector = __(input_selector, " > :input"),
            portfolio_name = $(value_selector).val();

        if (!portfolio_name) {
            $(input_selector).addClass("has-error");
        } else {
            $(input_selector).removeClass("has-error");
            $(value_selector).val(""); 

            self.controller.createPortfolio(portfolio_name);
        }
    });
};

PortfolioView.prototype.updateMainExchange = function (exchange) {
    $("#portfolio-main-exchange").html(
        this.controller.getExchangeDescription(exchange)
    );
};

PortfolioView.prototype.updateExchangePrice = function (exchange, quote) {
    $__('#portfolio-exchange-', exchange, '-price').html(quote.toFixed(2));
};

function PortfolioController(view, model) {
    this.view = view;
    this.model = model;

    this.view.setController(this);
    this.quotes_controller = undefined;
}

PortfolioController.prototype.setQuotesController = function(controller) {
    this.quotes_controller = controller;
};

PortfolioController.prototype.start = function () {
    this.model.load();
    this.view.start(this.model.main_exchange);
    this.view.render(this.model.portfolios);
};

PortfolioController.prototype.getInvestmentInfo = function (investment) {
    var quote = this.quotes_controller.getQuote('BTCUSD', this.model.main_exchange);

    if (!quote) 
        return undefined;

    var average = ((investment.amount > 0) 
                     ? (investment.price / investment.amount) : 0),
        current_value = investment.amount * quote.bid,
        profit = current_value - investment.price,
        gain = ((investment.price > 0 && investment.amount > 0) 
                 ? (current_value / investment.price) - 1 : 0);
    
    return {
        holdings: investment.amount,
        cost: investment.price,
        average: average,
        current_value: current_value,
        current_price: quote.bid,
        profit: profit,
        gain: gain
    };
};

PortfolioController.prototype.getExchanges = function (symbol) {
    return this.quotes_controller.getExchanges(symbol);
};

PortfolioController.prototype.getExchangeDescription = function (exchange) {
    return this.quotes_controller.getExchangeDescription(exchange);
};

PortfolioController.prototype.onPriceUpdated = function (price) {
    if (price.symbol != 'BTCUSD')
        return;

    if (price.exchange == this.model.main_exchange)
        this.updateInvestments();

    this.updateExchangePrice(price);
};

PortfolioController.prototype.updateInvestments = function() {
    var self = this;

    var global_total = {
        amount: 0,
        price: 0
    };

    this.model.portfolios.forEach(function (portfolio) {
        var portfolio_total = {
            amount: 0, 
            price: 0
        };

        portfolio.trades.forEach(function (trade) {
            portfolio_total.amount += trade.amount;
            portfolio_total.price += trade.price;

            self.view.updateTradeReturn(
                trade, 
                self.getInvestmentInfo(trade)
            );
        });

        global_total.amount += portfolio_total.amount;
        global_total.price += portfolio_total.price;

        self.view.updatePortfolioReturn(
            portfolio,
            self.getInvestmentInfo(portfolio_total)
        );
    });

    self.view.updateGlobalReturn(self.getInvestmentInfo(global_total));
};

PortfolioController.prototype.updateExchangePrice = function(price) {    
    var quote = this.quotes_controller.getQuote(price.symbol, price.exchange);

    this.view.updateExchangePrice(price.exchange, quote.bid);
};

PortfolioController.prototype.setMainExchange = function(exchange) {
    this.model.setMainExchange(exchange);
    this.updateInvestments();
    this.view.updateMainExchange(exchange);
};

PortfolioController.prototype.createPortfolio = function (name) {
    var portfolio = {
        guid: guid(),
        name: name,
        trades: [],
    };

    this.model.savePortfolio(portfolio);
    this.view.addPortfolio(portfolio);

    this.updateInvestments();
};

PortfolioController.prototype.createTrade = function (portfolio, amount, price) {
    var trade = {
        guid: guid(),
        amount: amount,
        price: price
    };

    this.model.saveTrade(portfolio, trade);
    this.view.addTrade(portfolio, trade);

    this.updateInvestments();
};

PortfolioController.prototype.deletePortfolio = function (guid) {
    this.model.deletePortfolio(guid);
    this.view.removePortfolio(guid);

    this.updateInvestments();
};

PortfolioController.prototype.deleteTrade = function (guid) {
    this.model.deleteTrade(guid);
    this.view.removeTrade(guid);

    this.updateInvestments();
};

function GlobalView() {}

GlobalView.prototype.hookSidebarButtons = function () {
    $(".navbar-button").click(function(event) {
        event.preventDefault();

        // hide all "main" divs
        $(".main").addClass("hide");
        // show the div with class "main" and id "main-$target"
        $__(".main#main-", $(this).attr("target")).removeClass("hide");

        // make all navbar buttons inactive:
        $(".navbar-button").removeClass("active");
        // active the current one:
        $(this).addClass("active");
    });
};

GlobalView.prototype.activateSection = function (section) {
    // activate the main 'quotes' section:
    $__(".navbar-button[target='", section, "']").click();
};

GlobalView.prototype.setWindowTitle = function (title) {
    document.title = title;
};

function GlobalController(view) {
    this.view = view;
}

GlobalController.prototype.start = function() {
    this.view.hookSidebarButtons();
    this.view.activateSection("quotes");
};

GlobalController.prototype.onPriceUpdated = function (price) {
    // TODO: add support for selecting symbol and exchange

    if (price.symbol != 'BTCUSD')
        return;

    if (price.exchange != 'bitstamp')
        return;

    this.view.setWindowTitle('($' + price.ask + ') - Price Tracker');
};

function init_app () {
    global_view = new GlobalView();
    global_controller = new GlobalController(global_view);

    quotes_view = new QuotesView();
    quotes_model = new QuotesModel();
    quotes_controller = new QuotesController(quotes_view, quotes_model);

    portfolio_view = new PortfolioView();
    portfolio_model = new PortfolioModel();
    portfolio_controller = new PortfolioController(portfolio_view, 
                                                   portfolio_model);
    portfolio_controller.setQuotesController(quotes_controller);

    global_controller.start();
    quotes_controller.start();
    portfolio_controller.start();
}

function setup_client(client) {
    client.addHandler("onConnect", function() {
        quotes_controller.onConnect();
        this.requestExchanges();
    });

    client.addHandler("onExchangesListReceived", function(exchanges) {
        this.requestPrices(exchanges);
    });

    client.addHandler("onPriceUpdated", function(price) {
        global_controller.onPriceUpdated(price);
        quotes_controller.onPriceUpdated(price);
        portfolio_controller.onPriceUpdated(price);
    });

    client.addHandler("onError", function (error) {
        quotes_controller.onError(error);
    });
}

function init_client () {
    var url = location.origin.replace(/^http/, 'ws');

    var wsclient = new WSClient(url);

    setup_client(wsclient);

    wsclient.addHandler("onDisconnect", function() {
        if (!wsclient.connected) {
            var restclient = new RESTClient(location.origin, 60);
            setup_client(restclient);
            restclient.connect();
        } else {
            quotes_controller.onError({message:'Disconnected'});
        }
    });

    wsclient.connect();
}

$(document).ready(function() {
    init_app();
    init_client();
});