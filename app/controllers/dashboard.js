angular.module('ProjectHarvestApp')
    .controller('DashboardCtrl', function ($scope, $rootScope, $http, $location, $window, $auth, Dashboard) {

        Dashboard.getSystems($rootScope.currentUser)
            .then(function (response) {
                 $scope.current_systems = response.data;
                 console.log(response.data);
                // $scope.plant_ids = $.map(response.data, function (value) {
                //     var plant_ids = [];
                //     for (var x in value) {
                //         plant_ids.push(value.grow_items[x].plant_id);
                //     }
                //     return plant_ids;
                // });
                // $scope.plant_vitals = $.map(response.data, function (value) {
                //     var plant_vitals = [];
                //     for (var x in value.grow_items) {
                //         plant_vitals.push(value.grow_items[x].plant_vitals);
                //     }
                //     return plant_vitals;
                // });
                setTimeout(function () {
                    var index = 0;
                    $scope.circles = assembleRadials($scope.current_systems);
                    // $.map($scope.plant_vitals, function (vital) {
                    //     for (var plant_vital in vital) {
                    //         $scope.circles[index].animate(vital[plant_vital]);
                    //         index++;
                    //     }
                    //     return null;
                    // });
                    $scope.loading = false;
                }, 200);
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

