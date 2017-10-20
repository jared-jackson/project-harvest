angular.module('ProjectHarvestApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $http, $location, $window, $auth) {

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



    });

