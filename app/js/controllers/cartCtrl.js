
four51.app.controller('CartViewCtrl', function ($scope, $location, $451, Order, OrderConfig, User, ProductDisplayService) {
	//$scope.order = OrderService.get($scope.user.CurrentOrderID, function(data){
		//angular.forEach($scope.currentOrder.LineItems, function(item){
		//	ProductDisplayService.setProductViewName(item.Product);
		//});
	//});

    $scope.continueShopping = function() {
        $location.path('catalog');
    };

	$scope.cancelOrder = function() {
        Order.delete($scope.currentOrder, function() {
			Order.delete($scope.currentOrder, function(){
				$scope.currentOrder = null;
				$scope.user.CurrentOrderID = null;
				User.save($scope.user, function(){
					$location.path('catalog');
				});
			});
        });
	};

	$scope.saveChanges = function() {
		if($scope.currentOrder.LineItems.length == $451.filter($scope.currentOrder.LineItems, {Property:'Selected', Value: true}).length){
			$scope.cancelOrder();
		}else{
			Order.save($scope.currentOrder, function(data) {
				$scope.currentOrder = data;
				OrderConfig.costcenter(data, $scope.user);
			});
		}
	};

	$scope.removeItem = function(item) {
		item.Selected = true;
		$scope.saveChanges();
	}

    $scope.checkOut = function() {
        Order.save($scope.currentOrder, function(data) {
            $scope.currentOrder = data;
            $location.path('checkout');
        });
    };

	$scope.$watch('currentOrder.LineItems', function(newval) {
		var newTotal = 0;
        if (!$scope.currentOrder) return newTotal;
		angular.forEach($scope.currentOrder.LineItems, function(item){
			newTotal += item.LineTotal;
		});
		$scope.currentOrder.Subtotal = newTotal;
	}, true);

    $scope.copyAddressToAll = function() {
        angular.forEach($scope.currentOrder.LineItems, function(n) {
            n.DateNeeded = $scope.currentOrder.LineItems[0].DateNeeded;
        });
    };


    $scope.onPrint = function()  {
             window.print();
    };
});