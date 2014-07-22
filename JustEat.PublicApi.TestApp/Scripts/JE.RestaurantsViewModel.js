if (typeof (JE) === 'undefined')
    JE = {};

JE.RestaurantsViewModel = function () {
    var self = this;

    var basketId;
    var getMenuSubscriptions = [];

    self.restaurants = ko.observableArray();
    self.postcode = ko.observable();
    self.selectedRestaurant = ko.observable();

    self.loadRestaurants = function () {
        self.selectedRestaurant(null);
        self.restaurants.removeAll();
        self.isLoadingRestaurants(true);

        JE.API.getRestaurants(self.postcode(), function (restaurants) {
            self.restaurants.removeAll();
            for (var i = 0; i < restaurants.length; i++) {
                self.restaurants.push(restaurants[i]);
                console.log(restaurants[i]);
            }
            self.isLoadingRestaurants(false);
        });
    };
    self.isLoadingRestaurants = ko.observable(false);

    self.hasRestaurants = ko.computed(function () { return self.restaurants().length > 0; });

    self.createBasket = function () {
        JE.API.createBasket(83177, function (basket) {
            basketId = basket.Id;
        });
    };

    self.getMenu = function (restaurant) {
        self.selectedRestaurant(restaurant);

        for (var i = 0; i < getMenuSubscriptions.length; i++) {
            getMenuSubscriptions[i](restaurant);
        }
    };

    self.onGetMenu = function(callback) {
        getMenuSubscriptions.push(callback);
    };
};