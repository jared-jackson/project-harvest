function assembleRadials(t){var e,r=[];for(var a in t)for(var o=0;o<=6;o++){var n="#plant"+t[a]+o;e=new ProgressBar.Circle(n,{color:"#8759f2",strokeWidth:4,trailWidth:1,easing:"easeInOut",duration:2400,text:{autoStyleContainer:!1},from:{color:"#ffc300",width:2},to:{color:"#1fd2ca",width:4},step:function(t,e){e.path.setAttribute("stroke",t.color),e.path.setAttribute("stroke-width",t.width);var r=Math.round(100*e.value());0===r?e.setText("0%"):e.setText(r+"%")}}),r.push(e),e.text.style.fontFamily='"Raleway", Helvetica, sans-serif',e.text.style.fontSize="2rem"}return r}angular.module("BlumeApp",["ngRoute","satellizer"]).config(["$routeProvider","$locationProvider","$authProvider",function(t,e,r){function a(t,e){e.isAuthenticated()&&t.path("/")}function o(t,e){e.isAuthenticated()||t.path("/login")}o.$inject=["$location","$auth"],a.$inject=["$location","$auth"],e.html5Mode(!0),t.when("/",{templateUrl:"partials/home.html",controller:"DashboardCtrl",resolve:{loginRequired:o}}).when("/contact",{templateUrl:"partials/contact.html",controller:"ContactCtrl"}).when("/create",{templateUrl:"partials/createGrow.html",controller:"GrowCtrl"}).when("/login",{templateUrl:"partials/login.html",controller:"LoginCtrl",resolve:{skipIfAuthenticated:a}}).when("/signup",{templateUrl:"partials/signup.html",controller:"SignupCtrl",resolve:{skipIfAuthenticated:a}}).when("/account",{templateUrl:"partials/profile.html",controller:"ProfileCtrl",resolve:{loginRequired:o}}).when("/forgot",{templateUrl:"partials/forgot.html",controller:"ForgotCtrl",resolve:{skipIfAuthenticated:a}}).when("/reset/:token",{templateUrl:"partials/reset.html",controller:"ResetCtrl",resolve:{skipIfAuthenticated:a}}).otherwise({templateUrl:"partials/404.html"}),r.loginUrl="/login",r.signupUrl="/signup",r.facebook({url:"/auth/facebook",clientId:"980220002068787",redirectUri:"http://localhost:3000/auth/facebook/callback"}),r.google({url:"/auth/google",clientId:"631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com"}),r.twitter({url:"/auth/twitter"})}]).run(["$rootScope","$window",function(t,e){e.localStorage.user&&(t.currentUser=JSON.parse(e.localStorage.user))}]),angular.module("BlumeApp").controller("ContactCtrl",["$scope","Contact",function(t,e){t.sendContactForm=function(){e.send(t.contact).then(function(e){t.messages={success:[e.data]}})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})}}]),angular.module("BlumeApp").controller("DashboardCtrl",["$scope","$rootScope","$http","$location","$window","$auth","Dashboard",function(t,e,r,a,o,n,s){s.getGrows(e.currentUser).then(function(e){t.current_grows=e.data,t.plant_ids=$.map(e.data,function(t){var e=[];for(var r in t.grow_items)e.push(t.grow_items[r].plant_id);return e}),t.plant_vitals=$.map(e.data,function(t){var e=[];for(var r in t.grow_items)e.push(t.grow_items[r].plant_vitals);return e}),setTimeout(function(){var e=0;t.circles=assembleRadials(t.plant_ids,t.plant_vitals),$.map(t.plant_vitals,function(r){for(var a in r)t.circles[e].animate(r[a]),e++;return null}),t.loading=!1},200)})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})}]),angular.module("BlumeApp").controller("ForgotCtrl",["$scope","Account",function(t,e){t.forgotPassword=function(){e.forgotPassword(t.user).then(function(e){t.messages={success:[e.data]}})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})}}]),angular.module("BlumeApp").controller("GrowCtrl",["$scope","$rootScope","$http","$location","$window","$auth","Account","GrowControls",function(t,e,r,a,o,n,s,c){t.createGrow=function(){var e={grow_name:t.grow.name,environment:t.grow.environment,grow_items:["White Widow","Sour Diesel","Blue Dream"]};c.createGrow(e).then(function(t){a.path("/")})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})}}]),angular.module("BlumeApp").controller("HeaderCtrl",["$scope","$location","$window","$auth",function(t,e,r,a){t.isActive=function(t){return t===e.path()},t.isAuthenticated=function(){return a.isAuthenticated()},t.logout=function(){a.logout(),delete r.localStorage.user,e.path("/")}}]),angular.module("BlumeApp").controller("LoginCtrl",["$scope","$rootScope","$location","$window","$auth",function(t,e,r,a,o){t.login=function(){o.login(t.user).then(function(t){e.currentUser=t.data.user,a.localStorage.user=JSON.stringify(t.data.user),r.path("/")})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})},t.authenticate=function(n){o.authenticate(n).then(function(t){e.currentUser=t.data.user,a.localStorage.user=JSON.stringify(t.data.user),r.path("/")})["catch"](function(e){e.error?t.messages={error:[{msg:e.error}]}:e.data&&(t.messages={error:[e.data]})})}}]),angular.module("BlumeApp").controller("ProfileCtrl",["$scope","$rootScope","$location","$window","$auth","Account",function(t,e,r,a,o,n){t.profile=e.currentUser,t.updateProfile=function(){n.updateProfile(t.profile).then(function(r){e.currentUser=r.data.user,a.localStorage.user=JSON.stringify(r.data.user),t.messages={success:[r.data]}})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})},t.changePassword=function(){n.changePassword(t.profile).then(function(e){t.messages={success:[e.data]}})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})},t.link=function(e){o.link(e).then(function(e){t.messages={success:[e.data]}})["catch"](function(e){a.scrollTo(0,0),t.messages={error:[e.data]}})},t.unlink=function(e){o.unlink(e).then(function(){t.messages={success:[response.data]}})["catch"](function(e){t.messages={error:[e.data]}})},t.deleteAccount=function(){n.deleteAccount().then(function(){o.logout(),delete a.localStorage.user,r.path("/")})["catch"](function(e){t.messages={error:[e.data]}})}}]),angular.module("BlumeApp").controller("ResetCtrl",["$scope","Account",function(t,e){t.resetPassword=function(){e.resetPassword(t.user).then(function(e){t.messages={success:[e.data]}})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})}}]),angular.module("BlumeApp").controller("SignupCtrl",["$scope","$rootScope","$location","$window","$auth",function(t,e,r,a,o){t.signup=function(){o.signup(t.user).then(function(t){o.setToken(t),e.currentUser=t.data.user,a.localStorage.user=JSON.stringify(t.data.user),r.path("/")})["catch"](function(e){t.messages={error:Array.isArray(e.data)?e.data:[e.data]}})},t.authenticate=function(n){o.authenticate(n).then(function(t){e.currentUser=t.data.user,a.localStorage.user=JSON.stringify(t.data.user),r.path("/")})["catch"](function(e){e.error?t.messages={error:[{msg:e.error}]}:e.data&&(t.messages={error:[e.data]})})}}]),angular.module("BlumeApp").factory("Account",["$http",function(t){return{updateProfile:function(e){return t.put("/account",e)},changePassword:function(e){return t.put("/account",e)},deleteAccount:function(){return t["delete"]("/account")},forgotPassword:function(e){return t.post("/forgot",e)},resetPassword:function(e){return t.post("/reset",e)}}}]),angular.module("BlumeApp").factory("Contact",["$http",function(t){return{send:function(e){return t.post("/contact",e)}}}]),angular.module("BlumeApp").factory("Dashboard",["$http",function(t){return{getGrows:function(e){return t.get("/getGrows",e)}}}]),angular.module("BlumeApp").factory("GrowControls",["$http",function(t){return{createGrow:function(e){return t.post("/createGrow",e)}}}]);