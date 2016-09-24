angular.module('starter.services-timeline', [])

  .factory('Timeline', function($q, Profile, Utils, Codes, $http) {
    var self = this;

    self.getFeed = function(){
      var qGet = $q.defer();
      var ref = new Firebase(FBURL+'/posts')
      ref.on("value", function(allPosts) {
        qGet.resolve(allPosts.val());
      });
      return qGet.promise;
    };

    // retrieves all posts of the user
    self.getMyPosts = function(uid) {
      var qGet = $q.defer();
      var ref = new Firebase(FBURL);

      // Attach an asynchronous callback to read the data at our posts reference
      ref.child('posts_meta').child(uid).on("value", function(snapshot) {
        if(snapshot.val() != null) {
          qGet.resolve(snapshot.val());
        } else {
          qGet.resolve(null);
        }
      }, function (error) {
        Codes.handleError(error);
        qGet.reject(error);
      });
      return qGet.promise;
    };


    // retrieves all images for the specific post
    self.getImages = function(uid, postId){
      var qGet = $q.defer();
      var ref = new Firebase(FBURL);

      // Attach an asynchronous callback to read the data at our posts reference
      ref.child('posts_images').child(uid).child(postId).on("value", function(snapshot) {
        if(snapshot.val() != null) {
          qGet.resolve(snapshot.val());
        } else {
          qGet.resolve(null);
        }
      }, function (error) {
        Codes.handleError(error);
        qGet.reject(error);
      });
      return qGet.promise;
    };



    self.addPost = function(uid,FormData) {      // new
      var qAdd = $q.defer();
      var ref = new Firebase(FBURL);
      var postId = generatePostId();

      Utils.showMessage('Adding post...');
      FormData.meta.postID = postId;
      var paths = {};
      paths['/posts/' + postId] = FormData;
      paths['/posts_meta/' + uid + '/' + postId] = FormData;


      var onComplete = function(error) {
        if (error) {
			alert(error);
          Codes.handleError(error);
          qAdd.reject(error);
        } else {
          Utils.showMessage('Post added!', 1500);
          qAdd.resolve("POST_ADD_SUCCESS");
		  
		  console.log(FBURL+"/followedBy/"+uid);
		  
		  
		  
		  //check if there are images in post data the send push notification
		  
		  
		  
		  function sendnotifications(uid,FormData){
		  
		  
		  if(FormData.meta.images.length >= 1){
		 
		  
		  var devicetokens = [];
		  
		  var userref = new Firebase(FBURL+"/followedBy/"+uid+"/");
userref.once("value", function(snapshot) {
  // The callback function will get called twice, once for "fred" and once for "barney"
  snapshot.forEach(function(childSnapshot) {
    // key will be "fred" the first time and "barney" the second time
    var key = childSnapshot.key();
    // childData will be the actual contents of the child
    var childData = childSnapshot.val();
	
	
	var userref2 = new Firebase(FBURL+"/users/"+key+"/meta/");
	

// Attach an asynchronous callback to read the data at our posts reference
userref2.on("value", function(snapshot) {
  var newPost = snapshot.val();
  
  
 var curdevtoken = newPost.device_token;
 		    
// Define relevant info
var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZGM0ZWNiZC0xZDdkLTQyZjktYTMxNi0yY2NhNjk4ODk1ZDQifQ.NbDDlLBYUGIGalbRoCPrtwIz0D1l0MUGPLhcLnZ9t8A';
var tokens = devicetokens;


var profile = 'test';

// Build the request object
var req = {
  method: 'POST',
  url: 'https://api.ionic.io/push/notifications',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwt
  },
  data: {
    "tokens": curdevtoken,
    "profile": profile,
    "notification": {
      "title": "video posted",
      "message": "user has posted new video!",
      "android": {
        "title": "video posted",
        "message": "user has posted new video"
      },
      "ios": {
        "title": "Howdy",
        "message": "Hello iOS!"
      }
    }
  }
};

// Make the API call
$http(req).success(function(resp){
  // Handle success
  console.log("Ionic Push: Push success", resp);
}).error(function(error){
  // Handle error 
  console.log("Ionic Push: Push error", error);
});
  
  
  
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
	
	
	
  });
  
  
  
});
		  
		  
		  
		 } 
		 
		}
		
		
		 
		 
		 
		 sendnotifications(uid,FormData);
		 
		  
        }
      }
      ref.update(paths, onComplete);
	  
      return qAdd.promise;
    };

    // multi-location delete                     old
    self.deletePost = function(uid, postId) {
      var qDelete = $q.defer();
      var ref = new Firebase(FBURL);

      var paths = {};
      paths['/posts_meta/' + uid + '/' + postId]      = null;
      paths['/posts/' + postId]    = null;

      var onComplete = function(error) {
        if (error) {
          Codes.handleError(error);
          qDelete.reject(error);
        } else {

          Utils.showMessage('Post deleted!', 1000);
          qDelete.resolve("POST_DELETE_SUCCESS");
        }
      }
      ref.update(paths, onComplete);
      return qDelete.promise;
    };

    self.addLike = function(uid,postId, likes){
      console.log('likes ', likes);
      var qLike = $q.defer();
      var ref = new Firebase(FBURL);

      var paths = {};
      paths['/posts_meta/' + uid + '/' + postId + '/meta/likes'] = likes+ 1;
      paths['/posts/' + postId + '/meta/likes'] = likes + 1;


      var onComplete = function(error) {
        if (error) {
          Codes.handleError(error);
          qLike.reject(error);
        } else {

          Utils.showMessage('Post Liked!', 1000);
          qLike.resolve("liked");
        }
      }

      ref.update(paths, onComplete);
      return qLike.promise;
    };


    function generatePostId() {
      var d = new Date();

      var wordString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var letterPart = "";
      for (var i=0; i<10; i++) {
        letterPart = letterPart + wordString[Math.floor(26*Math.random())]
      };

      var fyear = d.getFullYear();
      var fmonth = d.getMonth()+1;
      var fday = d.getDate();
      var fhour = d.getHours();
      var fminute = d.getMinutes();

      fmonth = fmonth < 10 ? '0'+fmonth : fmonth;
      fday = fday < 10 ? '0'+fday : fday;
      fhour = fhour < 10 ? '0'+fhour : fhour;
      fminute = fminute < 10 ? '0'+fminute : fminute;

      var ftime = d.getTime();

      d = d.getTime();
      d = d.toString();

      return "P" + fyear + fmonth + fday + fhour + fminute + letterPart;
    };

    return self;
  })
