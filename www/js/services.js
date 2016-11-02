angular.module('starter.services',[])

.factory('Database',function(){
         // Initialize Firebase

  var config = {
    apiKey: "AIzaSyDZgVathi3JywRaHhcGhkTDkkLK-FVvSUc",
    authDomain: "shopassist-1b556.firebaseapp.com",
    databaseURL: "https://shopassist-1b556.firebaseio.com",
    storageBucket: "shopassist-1b556.appspot.com",
    messagingSenderId: "935128640342"
  };
 firebase.initializeApp(config);
        var storage = firebase.storage();
        var db = firebase.database();
        var ref_users = db.ref('Users');
        var ref_itemCatalog = db.ref('Items_Catalog');

  return{
    ref_itemCatalog:ref_itemCatalog,
    ref_users: ref_users,
    db:db,
    }

})
.factory('Activities',function(){
  var chosenItems = [];
  var mod = 0;
  var itemhere;
  return{
    chosenItems:chosenItems,
    mod:mod,
    itemhere:itemhere,
  }
})
.factory('Scanner', function($http){

    return {
        getData: getData
    };


    function getData(Barcode,callback) {
        var BarcodeName;
        var newOrNot;
          return $http.get('https://floating-headland-88014.herokuapp.com/api', {
   params:{
            request_id: Barcode,
          }})
         .then(function(BarcodeName,newOrNot) {
            callback(BarcodeName,newOrNot);
        }, function(error) {
            return error;
        });

    }
})
.factory('itemListner',function( $timeout,User,Database,LocalStorageService){
 var items = LocalStorageService.getCacheArray(Database.ref_users.child(User.getMyuid()).child('Items').toString());
 var searchNames = LocalStorageService.getCacheArray("names");
     listenToItems = function(callback){
         Database.ref_users.child(User.getMyuid()).child('Items').on('value', function(snapshot) {
         console.log("listener fired");
          items = snapshot.val();
         
          for(obj in items){
              var temp = false;
            for(name in searchNames){
                 if(searchNames[name] == items[obj].Name){
                     temp = true;
                  }   
              } 
              if(temp == false){
                searchNames.push(items[obj].Name) 
              }
          }
          console.log(searchNames)
          LocalStorageService.setCacheValue("names",searchNames)
          LocalStorageService.setCacheValue(Database.ref_users.child(User.getMyuid()).child('Items').toString(),items)
          callback(items);
         });
     } 
   return{
     listenToItems:listenToItems,
     searchNames:searchNames
   }
})

.factory('itemHistoryListner',function(Database,User,LocalStorageService){
       //i want to fire this only if cache is not empty
  var history = LocalStorageService.getCacheArray(Database.ref_users.child(User.getMyuid()).child('Items_History').toString());
        listenToItemsHistory = function(callback){
            Database.ref_users.child(User.getMyuid()).child('Items_History').on('value', function(snapshot) {
           console.log("listener fired");
           history = snapshot.val()
           LocalStorageService.setCacheValue(Database.ref_users.child(User.getMyuid()).child('Items_History').toString(),history)
           callback(history)
         });
       }
   return{
       listenToItemsHistory:listenToItemsHistory
   }
})



.factory('User', function (Database,$timeout, $q,$rootScope,LocalStorageService) {
    
    var me = LocalStorageService.getCacheObject("me");
    var cachedUserID = LocalStorageService.getCacheValue("my_uid");

    function addUserToFirebaseUsers(me) {
        console.log("firebase")
        Database.db.ref('Users').child(me.uid).child('User_Info').set({
            name: me.displayName ? me.displayName : me.email,
            email: me.email
        });
    }

    return {
        getMyuid: function () {
            if (me) {
                return me.uid;
            }
            else {
                if (cachedUserID) {
                    return cachedUserID;
                }
                else {
                    var cachedUserID = LocalStorageService.getCacheValue("my_uid");
                    return cachedUserID;
                }
            }
        },
        loadFromCache: function () {
        var cachedUsers = LocalStorageService.getCacheValue(Database.ref_users.toString());

            if (cachedUsers != null) {
                users = cachedUsers.val;
            }
        },

        get: function (userId) {
            var tempUser = users[userId];

            if (tempUser != null) {
                tempUser['uid'] = userId;
            }

            return tempUser;
        },
        me: function () {
            return me;
        },

        clearMe: function () {
            me = null;
        },

        login: function (email, password) {

            var firebaseAuth = firebase.auth();
               if (me)
                return Promise.resolve(me);
            var deff = $q.defer();
            isLoading = true;
            return firebaseAuth.signInWithEmailAndPassword(email,password)
                .then(function (authData) {
                    console.log("authdata",authData.uid)
                    addUserToFirebaseUsers(authData);
                    me = authData;
                    return Promise.resolve(authData);
                }).catch(function (error) {
                    //this is where we will get incorrect login
                    console.log(error.message)
                   // deff.resolve(error.message);
                    return Promise.resolve(error);
                    //return error;
                   
                });

            // return deff.promise
            
          },
          loginSocial: function(network){
              console.log(network)
              if(network  == "google"){
              var provider = new firebase.auth.GoogleAuthProvider();
              }
              else{
                  var provider = new firebase.auth.FacebookAuthProvider();
              }
                if (me)
                return Promise.resolve(me);
                 var deff = $q.defer();
                 isLoading = true;
                return firebase.auth().signInWithPopup(provider).then(function(result) {
                if (result.credential) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    var token = result.credential.accessToken;
                    // ...
                }
                  // The signed-in user info.
                    var user = result.user;
                   addUserToFirebaseUsers(user);
                      me = user;
                 return Promise.resolve(user)
                }).catch(function(error) {
                   console.log(error.message)
                return Promise.resolve(error);
                // ...
                });
            },
           
        logout: function(email,password){
            firebase.auth().signOut().then(function() {
            console.log("Sign-out successful")
             }, function(error) {
                console.log(error.message)
             });
        },

        createNewUserAuth: function (email, password, cb, failureCB) {

            var firebaseAuth = firebase.auth();

            firebaseAuth.createUserWithEmailAndPassword(email, password).then(function (success) {
                cb(email, password);
                 
            }, function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                failureCB(errorCode, errorMessage);
            });



        },
    };
})

//Local Storage
.service("LocalStorageService", [function ( User, $window) {

    hasLocalStorage = checkLocalStorage();
    // API
    return {
        clear: clear,
        setCacheValue: setCacheValue,
        getCacheValue: getCacheValue,
        clearCacheValue: clearCacheValue,
        getCacheArray: getCacheArray,
        getCacheObject: getCacheObject
    };

    function getCacheObject(name) {
        var cacheVal = getCacheValue(name);

        if (cacheVal) {
            return cacheVal;
        }
        else {
            return null;
        }
    }

    function getCacheArray(name) {
        var cacheVal = getCacheValue(name);

        if (cacheVal) {
            return Object.keys(cacheVal).map(function (key) { return cacheVal[key] });
        }
        else {
            return [];
        }
    }

    function setCacheValue(name, value) {
        if (!hasLocalStorage)
            return;
        localStorage['cache.' + name] = JSON.stringify(value);
    }

    function clearCacheValue(name) {
        if (!hasLocalStorage)
            return;
        delete localStorage['cache.' + name];
    }

    function getCacheValue(name, value) {
        if (!hasLocalStorage)
            return null;
        var key = 'cache.' + name;
        if (!(key in localStorage))
            return null;
        return JSON.parse(localStorage[key]);
    }

    function checkLocalStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    function clear() {
     localStorage.clear();
     document.location.href = 'index.html';
    }
}]);
/*.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){
 
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });
 
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });
 
        }
        else {
 
          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);    
 
          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);  
        }       
    }
  }
});*/

