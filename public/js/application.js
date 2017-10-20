angular.module('ProjectHarvestApp', ['ngRoute', 'satellizer'])
    .config(["$routeProvider", "$locationProvider", "$authProvider", function ($routeProvider, $locationProvider, $authProvider) {
        loginRequired.$inject = ["$location", "$auth"];
        skipIfAuthenticated.$inject = ["$location", "$auth"];
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html',
                controller: 'ContactCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/create', {
                templateUrl: 'partials/new-system.html',
                controller: 'SystemCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/insights', {
                templateUrl: 'partials/insights.html',
                controller: 'DashboardCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/cyno', {
                templateUrl: 'partials/cyno-checker.html',
                controller: 'CynoCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/account', {
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl',
                resolve: {loginRequired: loginRequired}
            })
            .when('/forgot', {
                templateUrl: 'partials/forgot.html',
                controller: 'ForgotCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .when('/reset/:token', {
                templateUrl: 'partials/reset.html',
                controller: 'ResetCtrl',
                resolve: {skipIfAuthenticated: skipIfAuthenticated}
            })
            .otherwise({
                templateUrl: 'partials/404.html'
            });

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';
        $authProvider.facebook({
            url: '/auth/facebook',
            clientId: '980220002068787',
            redirectUri: 'http://localhost:3000/auth/facebook/callback'
        });
        $authProvider.google({
            url: '/auth/google',
            clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
        });
        $authProvider.twitter({
            url: '/auth/twitter'
        });

        function skipIfAuthenticated($location, $auth) {
            if ($auth.isAuthenticated()) {
                $location.path('/');
            }
        }

        function loginRequired($location, $auth) {
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            }
        }
    }])
    .run(["$rootScope", "$window", function ($rootScope, $window) {
        if ($window.localStorage.user) {
            $rootScope.currentUser = JSON.parse($window.localStorage.user);
        }
    }]);

angular.module('ProjectHarvestApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('ProjectHarvestApp')
    .controller('CynoCtrl', ["$scope", "$rootScope", "$http", "$location", "$window", "$auth", "Cyno", function ($scope, $rootScope, $http, $location, $window, $auth, Cyno) {
        $scope.battle_summary = false;
        $scope.messages = {};
        $scope.checkCynoPilot = function () {
            $scope.cyno_data = {};
            $scope.team_a = {};
            $scope.team_b = {};
            $scope.battle_summary = false;
            var character_name = {
                character_name: $scope.character.name
            };
            Cyno.checkCynoPilot(character_name)
                .then(function (response) {
                    $scope.cyno_data = response.data;
                    if ($scope.cyno_data.drop_region != "unknown") {
                        $scope.battle_summary = true;
                        var alliance_name = $scope.cyno_data.alliance_id;
                        var victim_alliance_name = $scope.cyno_data.victim_id;
                        $scope.hot_drop_corp = $scope.cyno_data.summary.teamB.entities[alliance_name];
                        $scope.victim_corp = $scope.cyno_data.summary.teamA.entities[victim_alliance_name];
                        $scope.team_a = $scope.cyno_data.summary.teamA;
                        $scope.team_b = $scope.cyno_data.summary.teamB;
                    } else {
                        $scope.battle_message = "No recent battle information";
                    }
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    }]);


angular.module('ProjectHarvestApp')
    .controller('DashboardCtrl', ["$scope", "$rootScope", "$http", "$location", "$window", "$auth", "Dashboard", function ($scope, $rootScope, $http, $location, $window, $auth, Dashboard) {

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
    }]);

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


angular.module('ProjectHarvestApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('ProjectHarvestApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };
  }]);

angular.module('ProjectHarvestApp')
    .controller('HomeCtrl', ["$scope", "$rootScope", "$http", "$location", "$window", "$auth", function ($scope, $rootScope, $http, $location, $window, $auth) {

//
// background effect
// --------------------------------------------------
//


        var _cloud_opacity =                    1; // [0.1 to 1] - cloud opacity
        var _bg_effect_star_color =             'rgba(255, 255, 255, .9)';// rgba format - star color
        var _bg_effect_star_width =             1.5; // px - star width
        var _parallax_star_opacity =            .75; // [0.1 to 1] - parallax star opacity
        var _bg_effect = 2; // 0 = disable, 1 = cloud, 2 = star, 3 = parallax star


        function fn_siteBgEffect() {
            if (_bg_effect == 0) {
                $('.site-bg-canvas, .site-bg-effect').remove();
            } else if (_bg_effect == 1) {
                fn_siteBgCloud();
            } else if (_bg_effect == 2) {
                fn_siteBgStar();
            } else if (_bg_effect == 3) {
                fn_siteBgParallaxStar();
            }
        }



        function fn_siteBgCloud() {
            var $siteBgEffect = $('.site-bg-effect');
            $('.site-bg-canvas').remove();
            $siteBgEffect.css('opacity', _cloud_opacity);

            if ($siteBgEffect.length) {
                $siteBgEffect.append(
                    '<div class="cloud cloud-01"></div>' +
                    '<div class="cloud cloud-02"></div>' +
                    '<div class="cloud cloud-03"></div>'
                )

               $('#body').addClass('is-site-bg-cloud');

                fn_cloud01();
                fn_cloud02();
                fn_cloud03();
            }
        }

        function fn_cloud01() {
            var $cloud = $('.cloud-01');

            $cloud.velocity({
                translateZ: '0',
                translateX: ['-100%', '100%']
            }, {
                duration: 25000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateX: '100%'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_cloud01
                    });
                }
            });
        }

        function fn_cloud02() {
            var $cloud = $('.cloud-02');

            $cloud.velocity({
                translateZ: '0',
                translateX: ['-100%', '100%']
            }, {
                duration: 35000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateX: '100%'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_cloud02
                    });
                }
            });
        }

        function fn_cloud03() {
            var $cloud = $('.cloud-03');

            $cloud.velocity({
                translateZ: '0',
                translateX: ['-100%', '100%']
            }, {
                duration: 45000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateX: '100%'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_cloud03
                    });
                }
            });
        }

        function fn_siteBgStar() {
            var $canvas = $('.site-bg-canvas');

            $('#body').addClass('is-site-bg-star');

            function callCanvas (canvas) {
                var screenpointSplitt = 12000
                var movingSpeed = 0.2
                var viewportWidth = $(window).width();
                var viewportHeight = $(window).height();
                var nbCalculated = Math.round(viewportHeight*viewportWidth/screenpointSplitt);

                var $this = $(this),
                    ctx = canvas.getContext('2d');
                $this.config = {
                    star: {
                        color: _bg_effect_star_color,
                        width: _bg_effect_star_width
                    },
                    line: {
                        color: _bg_effect_star_color,
                        width: 0.4
                    },
                    position: {
                        x: canvas.width * 0.5,
                        y: canvas.height * 0.5
                    },
                    velocity: movingSpeed,
                    length: nbCalculated,
                    distance: 130,
                    radius: 120,
                    stars: []
                };

                function Star () {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;

                    this.vx = ($this.config.velocity - (Math.random() * 0.3));
                    this.vy = ($this.config.velocity - (Math.random() * 0.3));

                    this.radius = Math.random() * $this.config.star.width;
                }

                Star.prototype = {
                    create: function(){
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                        ctx.fill();
                    },

                    animate: function(){
                        var i;
                        for(i = 0; i < $this.config.length; i++){

                            var star = $this.config.stars[i];

                            if(star.y < 0 || star.y > canvas.height){
                                star.vx = star.vx;
                                star.vy = - star.vy;
                            }
                            else if(star.x < 0 || star.x > canvas.width){
                                star.vx = - star.vx;
                                star.vy = star.vy;
                            }
                            star.x += star.vx;
                            star.y += star.vy;
                        }
                    },

                    line: function(){
                        var length = $this.config.length,
                            iStar,
                            jStar,
                            i,
                            j;

                        for(i = 0; i < length; i++){
                            for(j = 0; j < length; j++){
                                iStar = $this.config.stars[i];
                                jStar = $this.config.stars[j];

                                if(
                                    (iStar.x - jStar.x) < $this.config.distance &&
                                    (iStar.y - jStar.y) < $this.config.distance &&
                                    (iStar.x - jStar.x) > - $this.config.distance &&
                                    (iStar.y - jStar.y) > - $this.config.distance
                                ) {
                                    if(
                                        (iStar.x - $this.config.position.x) < $this.config.radius &&
                                        (iStar.y - $this.config.position.y) < $this.config.radius &&
                                        (iStar.x - $this.config.position.x) > - $this.config.radius &&
                                        (iStar.y - $this.config.position.y) > - $this.config.radius
                                    ) {
                                        ctx.beginPath();
                                        ctx.moveTo(iStar.x, iStar.y);
                                        ctx.lineTo(jStar.x, jStar.y);
                                        ctx.stroke();
                                        ctx.closePath();
                                    }

                                }
                            }
                        }
                    }

                };
                $this.createStars = function () {
                    var length = $this.config.length,
                        star,
                        i;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for(i = 0; i < length; i++){
                        $this.config.stars.push(new Star());
                        star = $this.config.stars[i];
                        star.create();
                    }

                    star.line();
                    star.animate();
                };

                $this.setCanvas = function () {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };

                $this.setContext = function () {
                    ctx.fillStyle = $this.config.star.color;
                    ctx.strokeStyle = $this.config.line.color;
                    ctx.lineWidth = $this.config.line.width;
                    ctx.fill();
                };

                $this.loop = function (callback) {
                    callback();
                    reqAnimFrame(function () {
                        $this.loop(function () {
                            callback();
                        });
                    });
                };

                $this.bind = function () {
                    $(window).on('mousemove', function(e){
                        $this.config.position.x = e.pageX;
                        $this.config.position.y = e.pageY;
                    });
                };

                $this.init = function () {
                    $this.setCanvas();
                    $this.setContext();

                    $this.loop(function () {
                        $this.createStars();
                    });

                    $this.bind();
                };

                return $this;
            }

            var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };

            $canvas.hide();

            $(window).on('load', function() {
                setTimeout(function () {
                    callCanvas($('canvas')[0]).init();
                    $canvas.velocity('transition.fadeIn', {
                        duration: 3000
                    });
                }, 2000);
            });

            var waitForFinalEvent = (function () {
                var timers = {};
                return function (callback, ms, uniqueId) {
                    if (!uniqueId) {
                        uniqueId = '';
                    }
                    if (timers[uniqueId]) {
                        clearTimeout (timers[uniqueId]);
                    }
                    timers[uniqueId] = setTimeout(callback, ms);
                };
            })();

            $(window).resize(function () {
                waitForFinalEvent(function(){
                    callCanvas($('canvas')[0]).init();
                }, 800, '');
            });
        }

        function fn_siteBgParallaxStar() {
            var $siteBgEffect = $('.site-bg-effect');
            $('.site-bg-canvas').remove();
            $siteBgEffect.css('opacity', _parallax_star_opacity);

            if ($siteBgEffect.length) {
                $siteBgEffect.append(
                    '<div class="star star-01"></div>' +
                    '<div class="star star-02"></div>' +
                    '<div class="star star-03"></div>'
                )

                $('#body').addClass('is-site-bg-parallax-star');

                fn_star01();
                fn_star02();
                fn_star03();

                $(window).on('load', function() {
                    setTimeout(function () {
                        $siteBgEffect.velocity({
                            translateZ: '0',
                            opacity: [_parallax_star_opacity, '0'],
                        }, {
                            display: 'block',
                            duration: 3000
                        });
                    }, 2000);
                });
            }
        }

        function fn_star01() {
            var $star = $('.star-01');

            $star.velocity({
                translateZ: '0',
                translateY: ['-2000px', '0']
            }, {
                duration: 50000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateY: '0'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_star01
                    });
                }
            });
        }

        function fn_star02() {
            var $star = $('.star-02');

            $star.velocity({
                translateZ: '0',
                translateY: ['-2000px', '0']
            }, {
                duration: 100000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateY: '0'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_star02
                    });
                }
            });
        }

        function fn_star03() {
            var $star = $('.star-03');

            $star.velocity({
                translateZ: '0',
                translateY: ['-2000px', '0']
            }, {
                duration: 150000,
                ease: 'liner',
                queue: false,
                complete: function() {
                    $(this).velocity({
                        translateY: '0'
                    }, {
                        duration: 0,
                        queue: false,
                        complete: fn_star03
                    });
                }
            });
        }

        fn_siteBgEffect();

//
// function end
// --------------------------------------------------
//



    }]);


angular.module('ProjectHarvestApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('ProjectHarvestApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('ProjectHarvestApp')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('ProjectHarvestApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('ProjectHarvestApp')
    .controller('SystemCtrl', ["$scope", "$rootScope", "$http", "$location", "$window", "$auth", "Account", "System", function ($scope, $rootScope, $http, $location, $window, $auth, Account, System) {
        $scope.newSystem = function () {
            var new_system = {
                system_name: $scope.system.name
            };
            System.newSystem(new_system)
                .then(function (response) {
                    $location.path('/');
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    }]);


angular.module('ProjectHarvestApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
angular.module('ProjectHarvestApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
angular.module('ProjectHarvestApp')
    .factory('Cyno', ["$http", function($http) {
        return {
            checkCynoPilot: function(data) {
                return $http.post('/checkCynoPilot', data);
            }
        };
    }]);
angular.module('ProjectHarvestApp')
    .factory('Dashboard', ["$http", function($http) {
        return {
            getSystems: function(data) {
                return $http.get('/getSystems', data);
            }
        };
    }]);
angular.module('ProjectHarvestApp')
    .factory('System', ["$http", function($http) {
        return {
            newSystem: function(data) {
                return $http.post('/newSystem', data);
            }
        };
    }]);