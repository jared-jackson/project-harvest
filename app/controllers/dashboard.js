angular.module('ProjectHarvestApp')
    .controller('DashboardCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Dashboard) {

        var socket = io("/dashboard");

        Dashboard.getSystems($rootScope.currentUser)
            .then(function (response) {
                socket.on('getInsights', function(response) {

                    $scope.$apply(function() {
                        $scope.insights = response;
                    });


                })
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    });

function assembleRadials(systems) {
    var radial;
    var circles = [];
    for (var system in systems) {
        for (var x = 0; x <= 2; x++) { // Watson only returns us with 5 emotions. Typically wouldn't hard code a value like this.
            var container = '#' + systems[system].system_name + x;
            radial = new ProgressBar.Circle(container, {
                color: '#8759f2',
                strokeWidth: 4,
                trailWidth: 1,
                easing: 'easeInOut',
                duration: 2400,
                text: {
                    autoStyleContainer: false
                },
                from: {color: '#ffc300', width: 2},
                to: {color: '#1fd2ca', width: 4},
                step: function (state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    circle.path.setAttribute('stroke-width', state.width);
                    var value = Math.round(circle.value() * 100);
                    if (value === 0) {
                        circle.setText('0%');
                    } else {
                        circle.setText(value + "%");
                    }
                }
            });
            circles.push(radial);
            radial.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            radial.text.style.fontSize = '2rem';
        }
    }
    return circles;
}

