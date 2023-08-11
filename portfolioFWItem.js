module.exports = function(app){
    var PortfolioFWItem = Object.getPrototypeOf(app).PortfolioFWItem = new app.Component("portfolioFWItem");
    // PortfolioFWItem.debug = true;
    PortfolioFWItem.createdAt      = "2.4.0";
    PortfolioFWItem.lastUpdate     = "2.4.0";
    PortfolioFWItem.version        = "1";
    // PortfolioFWItem.factoryExclude = true;
    // PortfolioFWItem.loadingMsg     = "This message will display in the console when component will be loaded.";
    // PortfolioFWItem.requires       = [];

    // PortfolioFWItem.prototype.onCreate = function(){
    // do thing after element's creation
    // }
    return PortfolioFWItem;
}