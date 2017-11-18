angular.module('ProjectHarvestApp').run(['$templateCache', function($templateCache) {$templateCache.put('partials/404.html','<div class="container text-center">\r\n  <h1>404</h1>\r\n  <p>Page Not Found</p>\r\n</div>');
$templateCache.put('partials/contact.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-heading">\r\n      <h3 class="panel-title">Contact Form</h3>\r\n    </div>\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="sendContactForm()" class="form-horizontal">\r\n        <div class="form-group">\r\n          <label for="name" class="col-sm-2">Name</label>\r\n          <div class="col-sm-8">\r\n            <input type="text" name="name" id="name" class="form-control" ng-model="contact.name" autofocus>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="email" class="col-sm-2">Email</label>\r\n          <div class="col-sm-8">\r\n            <input type="email" name="email" id="email" class="form-control" ng-model="contact.email">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="message" class="col-sm-2">Body</label>\r\n          <div class="col-sm-8">\r\n            <textarea name="message" id="message" rows="7" class="form-control" ng-model="contact.message"></textarea>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-2 col-sm-8">\r\n            <button type="submit" class="btn btn-success">Send</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('partials/cyno-checker.html','<div class="container">\r\n    <div class="row">\r\n        <div class="panel">\r\n            <div class="panel-body">\r\n                <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n                    <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n                </div>\r\n                <form ng-submit="checkCynoPilot()" class="form-horizontal">\r\n                    <legend>Check to see if pilot is a cyno</legend>\r\n                    <div class="form-group">\r\n                        <label for="name" class="col-sm-3">Character Name</label>\r\n                        <div class="col-sm-7">\r\n                            <input type="text" name="name" id="name" class="form-control" ng-model="character.name">\r\n                        </div>\r\n                    </div>\r\n                    <div class="form-group">\r\n                        <div class="col-sm-offset-3 col-sm-4">\r\n                            <button type="submit" class="btn btn-success">Check Character</button>\r\n                        </div>\r\n                    </div>\r\n                    <div ng-if="cyno_data.is_cyno == false" role="alert" class="alert alert-danger">\r\n                        <h2>NO CYNO</h2>\r\n                    </div>\r\n                    <div ng-if="cyno_data.is_cyno == true" role="alert" class="alert alert-success">\r\n                        <h2>MOTHAFUCKIN CYNO</h2>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class="row" ng-show="battle_summary">\r\n        <div class="panel">\r\n            <div class="panel-body">\r\n                <h3 style="text-transform: uppercase;">{{hot_drop_corp}} VS. {{victim_corp}} on\r\n                    {{cyno_data.kill_time}}</h3>\r\n                <div class="horizontal-divider"></div>\r\n\r\n                <div class="col-md-6" style="padding-top: 10px;">\r\n                    <div class="col-md-10 kill_card" style="background-color: #ffffff; height: 75px; margin-bottom: 10px;" ng-repeat="ship in team_b.list">\r\n                        <span>Character : {{ship.characterName}}</span>\r\n                        <br/>\r\n                        <span>Ship : {{ship.shipName}}</span>\r\n                        <br/>\r\n                        <span>Corp : {{ship.corporationName}}</span>\r\n                    </div>\r\n                </div>\r\n                <div class="col-md-6" style="margin-top: 10px;">\r\n                    <div class="col-md-10 kill_card"  id="{{ship.characterID}}" ng-repeat="ship in team_a.list">\r\n                        <span>Character : {{ship.characterName}}</span>\r\n                        <br/>\r\n                        <span>Ship : {{ship.shipName}}</span>\r\n                        <br/>\r\n                        <span>Corp : {{ship.corporationName}}</span>\r\n                    </div>\r\n                </div>\r\n                <a href="{{cyno_data.kill_mail_id}}" target="_blank" role="button" class="btn btn-default">View Kill Details</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('partials/footer.html','<footer>\r\n  <p>\xA9 2016 Company, Inc. All Rights Reserved.</p>\r\n</footer>');
$templateCache.put('partials/forgot.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="forgotPassword()">\r\n        <legend>Forgot Password</legend>\r\n        <div class="form-group">\r\n          <p>Enter your email address below and we\'ll send you password reset instructions.</p>\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email" autofocus>\r\n        </div>\r\n        <button type="submit" class="btn btn-success">Reset Password</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('partials/header.html','<nav ng-controller="HeaderCtrl" class="navbar navbar-default navbar-static-top">\r\n  <div class="container">\r\n    <div class="navbar-header">\r\n      <button type="button" data-toggle="collapse" data-target="#navbar" class="navbar-toggle collapsed">\r\n        <span class="sr-only">Toggle navigation</span>\r\n        <span class="icon-bar"></span>\r\n        <span class="icon-bar"></span>\r\n        <span class="icon-bar"></span>\r\n      </button>\r\n      <a href="/" class="navbar-brand">Project Harvest</a>\r\n    </div>\r\n    <div id="navbar" class="navbar-collapse collapse">\r\n      <ul class="nav navbar-nav" ng-if="isAuthenticated()">\r\n        <li ng-class="{ active: isActive(\'/\')}"><a href="/">Insights</a></li>\r\n        <li ng-class="{ active: isActive(\'/create\')}"><a href="/create">Add System</a></li>\r\n        <li ng-class="{ active: isActive(\'/cyno\')}"><a href="/cyno">Cyno Checker</a></li>\r\n      </ul>\r\n      <ul ng-if="isAuthenticated()" class="nav navbar-nav navbar-right">\r\n        <li class="dropdown">\r\n          <a href="#" data-toggle="dropdown" class="navbar-avatar dropdown-toggle">\r\n            <img ng-src="{{currentUser.picture || currentUser.gravatar}}"> {{currentUser.name || currentUser.email || currentUser.id}} <i class="caret"></i>\r\n          </a>\r\n          <ul class="dropdown-menu">\r\n            <li><a href="/account">My Account</a></li>\r\n            <li class="divider"></li>\r\n            <li><a href="#" ng-click="logout()"}>Logout</a></li>\r\n          </ul>\r\n        </li>\r\n      </ul>\r\n      <ul ng-if="!isAuthenticated()" class="nav navbar-nav navbar-right">\r\n        <li ng-class="{ active: isActive(\'/login\')}"><a href="/login">Log in</a></li>\r\n        <li ng-class="{ active: isActive(\'/signup\')}"><a href="/signup">Sign up</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</nav>\r\n');
$templateCache.put('partials/home.html','<div class="container-fluid">\r\n    <div class="row">\r\n\r\n        <div class="col-md-3">\r\n            1 of 3\r\n        </div>\r\n        <div class="col-md-6" style="text-align: center;">\r\n            2 of 3 (wider)\r\n        </div>\r\n        <div class="col-md-3">\r\n            3 of 3\r\n        </div>\r\n    </div>\r\n\r\n\r\n</div>\r\n</div>\r\n');
$templateCache.put('partials/insights.html','<div class="container-fluid">\r\n    <h3>Last Updated : {{insights[0].last_updated}}</h3>\r\n    <div class="row">\r\n        <div class="col-sm-4" ng-repeat="kill in insights track by $index">\r\n            <div class="panel">\r\n                <div class="panel-body">\r\n                    <h3 style="text-transform: uppercase;">{{kill.system_name}} : <span>{{system.security_status | number : 1}}</span></h3>\r\n                    <div class="horizontal-divider"></div>\r\n                    <div class="row">\r\n                        <div class="col-md-12">\r\n                            <!--<div class="radial" id="{{\'plant\' + vitals.plant_id + $index}}" ng-repeat=" vital in vitals.plant_vitals track by $index"></div>-->\r\n                            <span>Kill Time: {{kill.killmail_time}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class="row">\r\n                        <div class="col-md-12">\r\n                            <!--<div class="radial" id="{{\'plant\' + vitals.plant_id + $index}}" ng-repeat=" vital in vitals.plant_vitals track by $index"></div>-->\r\n                            <span># of Attackers Involved : {{kill.attackers.length}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <a href="#" role="button" class="btn btn-default">View details</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('partials/login.html','<div class="container login-container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <form ng-submit="login()">\r\n        <legend>Log In</legend>\r\n        <div class="form-group">\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email" autofocus>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="password">Password</label>\r\n          <input type="password" name="password" id="password" placeholder="Password" class="form-control" ng-model="user.password">\r\n        </div>\r\n        <div class="form-group"><a href="/forgot"><strong>Forgot your password?</strong></a></div>\r\n        <button type="submit" class="btn btn-success">Log in</button>\r\n      </form>\r\n      <!--<div class="hr-title"><span>or</span></div>-->\r\n      <!--<div class="btn-toolbar text-center">-->\r\n        <!--<button class="btn btn-facebook" ng-click="authenticate(\'facebook\')">Sign in with Facebook</button>-->\r\n        <!--<button class="btn btn-twitter" ng-click="authenticate(\'twitter\')">Sign in with Twitter</button>-->\r\n        <!--<button class="btn btn-google" ng-click="authenticate(\'google\')">Sign in with Google</button>-->\r\n      <!--</div>-->\r\n    </div>\r\n  </div>\r\n  <p class="text-center">\r\n    Don\'t have an account? <a href="/signup"><strong>Sign up</strong></a>\r\n  </p>\r\n</div>\r\n');
$templateCache.put('partials/new-system.html','<div class="container">\r\n    <div class="panel">\r\n        <div class="panel-body">\r\n            <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n                <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n            </div>\r\n            <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n                <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n            </div>\r\n            <form ng-submit="newSystem()" class="form-horizontal">\r\n                <legend>Add a new system to monitor</legend>\r\n                <div class="form-group">\r\n                    <label for="name" class="col-sm-3">System Name</label>\r\n                    <div class="col-sm-7">\r\n                        <input type="text" name="name" id="name" class="form-control" ng-model="system.name">\r\n                    </div>\r\n                </div>\r\n                <div class="form-group">\r\n                    <div class="col-sm-offset-3 col-sm-4">\r\n                        <button type="submit" class="btn btn-success">Add System</button>\r\n                    </div>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('partials/profile.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="updateProfile()" class="form-horizontal">\r\n        <legend>Profile Information</legend>\r\n        <div class="form-group">\r\n          <label for="email" class="col-sm-3">Email</label>\r\n          <div class="col-sm-7">\r\n            <input type="email" name="email" id="email" class="form-control" ng-model="profile.email">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="name" class="col-sm-3">Character Name</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="name" id="name" class="form-control" ng-model="profile.name">\r\n          </div>\r\n        </div>\r\n        <!--<div class="form-group">-->\r\n          <!--<label class="col-sm-3">Gender</label>-->\r\n          <!--<div class="col-sm-4">-->\r\n            <!--<label class="radio-inline radio col-sm-4">-->\r\n              <!--<input type="radio" name="gender" value="male" ng-checked="profile.gender === \'male\'"><span>Male</span>-->\r\n            <!--</label>-->\r\n            <!--<label class="radio-inline col-sm-4">-->\r\n              <!--<input type="radio" name="gender" value="female" ng-checked="profile.gender === \'female\'"><span>Female</span>-->\r\n            <!--</label>-->\r\n          <!--</div>-->\r\n        <!--</div>-->\r\n        <div class="form-group">\r\n          <label for="location" class="col-sm-3">Location</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="location" id="location" class="form-control" ng-model="profile.location">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="website" class="col-sm-3">Website</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="website" id="website" class="form-control" ng-model="profile.website">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label class="col-sm-3">Character Image</label>\r\n          <div class="col-sm-4">\r\n            <img ng-src="{{profile.gravatar}}" class="profile" width="100" height="100">\r\n            <input type="text" name="character_id" id="character_id" class="form-control" ng-model="profile.image">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-3 col-sm-4">\r\n            <button type="submit" class="btn btn-success">Update Profile</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <form ng-submit="changePassword()" class="form-horizontal">\r\n        <legend>Change Password</legend>\r\n        <div class="form-group">\r\n          <label for="password" class="col-sm-3">New Password</label>\r\n          <div class="col-sm-7">\r\n            <input type="password" name="password" id="password" class="form-control" ng-model="profile.password">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="confirm" class="col-sm-3">Confirm Password</label>\r\n          <div class="col-sm-7">\r\n            <input type="password" name="confirm" id="confirm" class="form-control" ng-model="profile.confirm">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-4 col-sm-offset-3">\r\n            <button type="submit" class="btn btn-success">Change Password</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div class="form-horizontal">\r\n        <legend>Linked Accounts</legend>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-3 col-sm-4">\r\n            <p>\r\n              <a href="#" ng-click="unlink(\'facebook\')" ng-if="currentUser.facebook" class="text-danger">Unlink your Facebook account</a>\r\n              <a href="#" ng-click="link(\'facebook\')" ng-if="!currentUser.facebook">Link your Facebook account</a>\r\n            </p>\r\n            <p>\r\n              <a href="#" ng-click="unlink(\'twitter\')" ng-if="currentUser.twitter" class="text-danger">Unlink your Twitter account</a>\r\n              <a href="#" ng-click="link(\'twitter\')" ng-if="!currentUser.twitter">Link your Twitter account</a>\r\n            </p>\r\n            <p>\r\n              <a href="#" ng-click="unlink(\'google\')" ng-if="currentUser.google" class="text-danger">Unlink your Google account</a>\r\n              <a href="#" ng-click="link(\'google\')" ng-if="!currentUser.google">Link your Google account</a>\r\n            </p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <form ng-submit="deleteAccount()" class="form-horizontal">\r\n        <legend>Delete Account</legend>\r\n        <div class="form-group">\r\n          <p class="col-sm-offset-3 col-sm-9">You can delete your account, but keep in mind this action is irreversible.</p>\r\n          <div class="col-sm-offset-3 col-sm-9">\r\n            <button type="submit" class="btn btn-danger">Delete my account</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('partials/reset.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n        <form ng-submit="resetPassword()">\r\n          <legend>Reset Password</legend>\r\n          <div class="form-group">\r\n            <label for="password">New Password</label>\r\n            <input type="password" name="password" id="password" placeholder="New password" class="form-control" ng-model="user.password" autofocus>\r\n          </div>\r\n          <div class="form-group">\r\n            <label for="confirm">Confirm Password</label>\r\n            <input type="password" name="confirm" id="confirm" placeholder="Confirm password" class="form-control" ng-model="user.confirm">\r\n          </div>\r\n          <div class="form-group">\r\n            <button type="submit" class="btn btn-success">Change Password</button>\r\n          </div>\r\n        </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('partials/signup.html','<div class="container login-container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <form ng-submit="signup()">\r\n        <legend>Create an account</legend>\r\n        <div class="form-group">\r\n          <label for="name">Character Name</label>\r\n          <input type="text" name="name" id="name" placeholder="Name" class="form-control" ng-model="user.name" autofocus>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email">\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="password">Password</label>\r\n          <input type="password" name="password" id="password" placeholder="Password" class="form-control" ng-model="user.password">\r\n        </div>\r\n        <div class="form-group">\r\n          <small class="text-muted">By signing up, you agree to the <a href="/">Terms of Service</a>.</small>\r\n        </div>\r\n        <button type="submit" class="btn btn-success">Create an account</button>\r\n      </form>\r\n      <!--<div class="hr-title"><span>or</span></div>-->\r\n      <!--<div class="btn-toolbar text-center">-->\r\n        <!--<button class="btn btn-facebook" ng-click="authenticate(\'facebook\')">Sign in with Facebook</button>-->\r\n        <!--<button class="btn btn-twitter" ng-click="authenticate(\'twitter\')">Sign in with Twitter</button>-->\r\n        <!--<button class="btn btn-google" ng-click="authenticate(\'google\')">Sign in with Google</button>-->\r\n      <!--</div>-->\r\n    </div>\r\n  </div>\r\n  <p class="text-center">\r\n    Already have an account? <a href="/login"><strong>Log in</strong></a>\r\n  </p>\r\n</div>\r\n');}]);