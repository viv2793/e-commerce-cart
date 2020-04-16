var app = angular.module('myApp', []); 
app.controller('smartqCtrl', function($scope,$http) {
    $scope.todoList = [{todoText:'Clean House', done:false}];
	$scope.testmsg = "hi....i'm working correctly";
	$scope.cartValue = 0;
	$scope.data = [];
	$scope.categoryArr = [];
	$scope.dataWithCategory = {};
	$scope.cartArr = [];
	let url = 'https://thesmartq.firebaseio.com/menu.json';
	
	$http.get(url)
    .then(function(response) {
        //First function handles success
		console.log("get response",response);
        $scope.data = response.data;
		console.log("data", $scope.data);
		filCategory(response.data);
		if($scope.data.length === 0){
			$scope.testmsg = 'There are foods to order.'
		}
    }, function(response) {
        //Second function handles error
		alert("some error occured!!! Refresh Page.")
        console.log("Something went wrong");
    });
	
	$scope.add = function(item){

		if(item.selectedNumbers > 0){
			for(p=0;p<$scope.cartArr.length;p++){
				if($scope.cartArr[p].name === item.name){
					$scope.cartArr[p].selectedNumbers = $scope.cartArr[p].selectedNumbers + 1;

				}
			}
		}
		
		if(item.selectedNumbers === 0){
			$scope.cartArr.push(item);
			item.selectedNumbers = item.selectedNumbers + 1;
		
		}
		
		calCartVal();
	}
	
	$scope.remove = function(item){
		console.log("inn remove", item);
		if((item.selectedNumbers-1)>0){
			item.selectedNumbers = item.selectedNumbers - 1;
		}
		if((item.selectedNumbers-1)==0){
			for(q=0;q<$scope.cartArr.length;q++){
				if($scope.cartArr[q] === item.name){
					$scope.cartArr.splice(q,1);
				}
			}
			item.selectedNumbers = item.selectedNumbers - 1;
		}
		calCartVal();		
	}
	
	function calCartVal(){
		let sum = 0;
		for(p=0;p<$scope.cartArr.length;p++){
			sum = sum + $scope.cartArr[p].price * $scope.selectedNumbers;
		}
		console.log("cartArr",$scope.cartArr);
		console.log("type", typeof($scope.cartValue));
		$scope.cartValue = sum;
	}
	
	function filCategory(arr){
		let k=0;
		for(i=0;i<arr.length;i++){
			let cat = arr[i].category;
			arr[i]['selectedNumbers'] = 0;
			if($scope.categoryArr.indexOf(cat) === -1){
				$scope.categoryArr[k] = arr[i].category;	
				k=k+1;
			}
		}
		filterData();
	}
	
	function filterData(){
		let dataObj = {};
		for(i=0;i<$scope.categoryArr.length;i++){
			let tempArr = [];
			let currCategory = $scope.categoryArr[i];
			for(j=0;j<$scope.data.length;j++){
				if($scope.data[j].category === currCategory){
					console.log("currCategory", currCategory);
					tempArr.push($scope.data[j]);
				}
			}
			dataObj[currCategory] = tempArr;
		}
		$scope.dObj = dataObj;
		console.log("obj", dataObj);
	}
	
	
    $scope.todoAdd = function() {
        $scope.todoList.push({todoText:$scope.todoInput, done:false});
        $scope.todoInput = "";
    };

    $scope.remove = function() {
        var oldList = $scope.todoList;
        $scope.todoList = [];
        angular.forEach(oldList, function(x) {
            if (!x.done) $scope.todoList.push(x);
        });
    };
});