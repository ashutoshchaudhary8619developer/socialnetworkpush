var FBURL = "https://burning-torch-4984.firebaseio.com";
var POST_MAX_CHAR  = 150;

angular.module('starter', [
  'ionic','ionic.service.core',
  'ngCordova',
  'firebase',
  'ionic.contrib.ui.tinderCards',




  // timeline and followers
  'starter.controllers-timeline',
  'starter.controllers-submit',
  'starter.controllers-followers',
  'starter.services-followers',
  'starter.services-timeline',
  'starter.controllers-chat',
  'starter.services-chat',
  'starter.controllers-feed',
  'starter.services-feed',
  'starter.controllers-events',
  'starter.services-events',
  'starter.controllers-meet',
  'starter.controllers-messages',
  'starter.services-messages',
  'starter.controllers-chat_detail',



  // auth and profile
  'starter.controllers-account',
  'starter.services-auth',
  'starter.services-profile',


  // cordova
  'starter.services-cordova-camera',

  // helpers
  'starter.services-codes',
  'starter.services-utils',
  'starter.services-fb-functions',
  'starter.directives'
  ]
)

.run(function($ionicPlatform, $rootScope, $ionicHistory, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	
	
	/*
	
	
	DropboxSync.uploadFile({
    filePath: 'file:///storage/sdcard0/DCIM/Camera/SomeVideo.mp4', // required, local URI
    dropboxPath: '/ashutoshapp' // optional, defaults to root ('/')
}, function() { // success
   alert("succefully uploaded");
}, function() { // fail
alert("unsucceful");
    // Handle error in fail callback.
});
	
	*/
	
	/*
	Ionic.io();
	
	
var authProvider = 'basic';
var authSettings = { 'remember': true };

var loginDetails = {
  'email': 'email@example.com',
  'password': 'secret'
};


var authFailure = function(errors) {
  for (var err in errors) {
   console.log(err);
  }
};

var authSuccess = function(user) {
	
	var push = new Ionic.Push({
  "debug": true 
});
	
	var callback = function(token) {
  console.log('Registered token:', token.token);
  push.saveToken(token);
};


	push.register(callback);
	
};

	
	var details = {
  'email': 'email@example.com',
  'password': 'secret',
  
}

details.custom = {
  'wants_emails': true
};

var signupSuccess = function() {
	
	
Ionic.Auth.login(authProvider, authSettings, loginDetails).then(authSuccess, authFailure);
	
};

var signupFailure = function() {
	
};


Ionic.Auth.signup(details).then(signupSuccess, signupFailure);

  Ionic.Auth.login(authProvider, authSettings, loginDetails).then(authSuccess, authFailure);
 */
	
	
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$ionicGoBack = function() {
    $ionicHistory.goBack();
  };
  // Redirect the user to the login state if unAuthenticated
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.log("$stateChangeError", error);
    event.preventDefault(); // http://goo.gl/se4vxu
    if(error == "AUTH_LOGGED_OUT") {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.account');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $sceProvider) {

 $sceProvider.enabled(false);
 
  // Define the resolve function, which checks whether the user is Authenticated
  // It fires $stateChangeError if not the case
  var authResolve = function (Auth) {
    return Auth.getAuthState();
  };


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    // view feed
    .state('tab.feed', {
      url: '/feed',
      views: {
        'tab-feed': {
          templateUrl: 'templates/timeline/tab-feed.html',
          controller: 'FeedCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })
    //Topic nested view with stateParam url
    .state('tab.feed.Topic', {
      url:'/Topic/:topic',
      views:{
        'Topic': {
          templateUrl: 'templates/timeline/childviews/Topic.html',
          controller: 'FeedCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })
    .state('tab.feed.main-feed', {
      url:'/main-feed',
      views:{
        'main-feed': {
          templateUrl: 'templates/timeline/childviews/main-feed.html',
          controller: 'FeedCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })
    .state('tab.events', {
      url:'/events',
      views:{
        'tab-events': {
          templateUrl: 'templates/timeline/tab-events.html',
          controller: 'EventsCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })
    .state('tab.meet', {
      url: '/meet',
      views: {
        'tab-meet': {
          templateUrl: 'templates/timeline/tab-meet.html',
          controller: 'MeetCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })

    // view timeline
    .state('tab.timeline', {
      url: '/timeline/:uid',
      views: {
        'tab-timeline': {
          templateUrl: 'templates/timeline/tab-timeline.html',
          controller: 'TimelineCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })

    //Messaging tab
    .state('tab.chats',{
      url:'/chats',
      views:{
        'tab-chats':{
          templateUrl: 'templates/timeline/tab-chats.html',
          controller: 'ChatCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })
      .state('tab.chats.messages',{
        url:'/messages/:recipientID?recipientUsername',
        views:{
          'messages':{
            templateUrl: 'templates/timeline/childviews/chat-detail.html',
            controller: 'ChatDetailCtrl',
            resolve: {authResolve: authResolve}
          }
        }
      })

      .state('sendMessage', {
        url: '/sendMessage/:recipientID?recipientUser?firstMessage',
        templateUrl: 'templates/timeline/sendMessage.html',
        controller: 'MessageCtrl',
        resolve: {authResolve: authResolve}
      })

    // manage followers
    .state('tab.followers', {
      url: '/followers',
      views: {
        'tab-followers': {
          templateUrl: 'templates/timeline/tab-followers.html',
          controller: 'FollowersCtrl',
          resolve: {authResolve: authResolve}
        }
      }
    })

    // new post
    .state('submit', {
      url: '/submit/:topic',
      templateUrl: 'templates/timeline/submit.html',
      controller: 'SubmitCtrl',
      resolve: {authResolve: authResolve}
    })

    // account settings, signup and login
    .state('tab.account', {
      url: '/account/:nextState',
      views: {
        'tab-account': {
          templateUrl: 'templates/auth/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

})


