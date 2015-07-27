app = angular.module 'myApp', []

app.controller 'MainCtrl', ($scope) ->
  $scope.testVar = 'You made it!'
