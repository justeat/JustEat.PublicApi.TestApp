if (typeof (JE) === 'undefined')
    JE = {};

JE.API = (function () {
    var self = this;

    var baseURI = 'http://api-interview.just-eat.com/';

    self.setAuthKey = function (authKey) {
        if (!authKey) {
            alert('Please set the "Auth-Key" appSettings value in Web.config');
            throw 'authKey must have a value, you may have to set the "Auth-Key" appSettings value in Web.config';
        }

        $.ajaxSetup({
            headers: {
                'Accept-Tenant': 'uk',
                'Authorization': authKey
            }
        });
    };

    self.getRestaurants = function (postcode, callback) {
        console.log('getting restaurants for postcode: ' + postcode);

        $.getJSON(baseURI + 'restaurants', {
                q: postcode.replace(' ', '')
        },
            function (results) {
                console.log(results);
                callback(results.Restaurants);
            }
        );
    };

    self.getMenus = function(restaurantId, callback) {
        $.getJSON(baseURI + 'restaurants/' + restaurantId + '/menus', function(results) {
            console.log(results);
            callback(results.Menus);
        });
    };

    self.getProductCategories = function (restaurantId, callback) {
        $.getJSON(baseURI + 'restaurants/' + restaurantId + '/productcategories?type=delivery&time' + new Date().toUTCString(), function (results) {
            console.log(results);
            callback(results.Menu);
        });
    };

    self.createBasket = function (menuId, callback) {
        $.post(baseURI + 'baskets', {
            'MenuId': menuId
        },
            function (results) {
                console.log(results);
                callback(results);
            }
        );
    };

    self.addProductToBasket = function(basketId, productId, callback) {
        $.post(baseURI + 'baskets/' + basketId + '/orderitems', {
            'ProductId': productId,
            'RequiredAccessories': [],
            'MealParts': []
        },
            function (results) {
                console.log(results);
                callback(results);
            }
        );
    };

    return self;
})();