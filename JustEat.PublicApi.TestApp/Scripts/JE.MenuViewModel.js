if (typeof (JE) === 'undefined')
    JE = {};

JE.MenuViewModel = function () {
    var self = this;
    var currentMenu;
    var currentBasket;

    var initProducts = function(menuItem) {
        for (var i = 0; i < menuItem.Products.length; i++) {
            var product = menuItem.Products[i];
            product.friendlyName = product.Name + ' ' + product.Synonym;
        }
    };

    self.menuCategories = ko.observableArray();

    self.hasMenuCategories = ko.computed(function() { return self.menuCategories().length > 0; });

    self.getMenu = function (restaurant) {
        self.isLoadingMenu(true);

        JE.API.getProductCategories(restaurant.Id, function (menu) {
            currentMenu = menu;

            self.menuCategories.removeAll();
            for (var i = 0; i < menu.Categories.length; i++) {
                self.menuCategories.push(menu.Categories[i]);
            }
            self.isLoadingMenu(false);
        });
    };
    self.isLoadingMenu = ko.observable(false);

    self.isChoosingProduct = ko.observable(false);

    self.selectedMenuItem = ko.observable();

    self.chooseProduct = function (menuItem) {
        //Nasty hack but don't have time to make a view model for this
        initProducts(menuItem);

        self.selectedMenuItem(menuItem);
        self.isChoosingProduct(true);
    };

    var postProductToBasket = function(product) {
        JE.API.addProductToBasket(currentBasket.Id, product.ProductId, function (results) {
            alert('Item added successfully!');
        });
    }

    self.addToBasket = function (product) {
        if (typeof (currentBasket) === 'undefined') {

            JE.API.createBasket(currentMenu.MenuCardDetails.MenuCardId, function(basket) {
                currentBasket = basket;
                postProductToBasket(product);
            });
        } else {
            postProductToBasket(product);
        }
    };
};