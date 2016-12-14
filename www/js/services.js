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
.factory('Activities',function(LocalStorageService){
  var chosenItems = [];
  var mod = 0;
  var itemhere;
  var callday = LocalStorageService.getCacheValue('callday')
  var callweek = LocalStorageService.getCacheValue('callweek')
  var callmonth = LocalStorageService.getCacheValue('callmonth')
  var count = LocalStorageService.getCacheValue('count') 
  return{
    callday:callday,
    callweek:callweek,
    callmonth:callmonth,
    chosenItems:chosenItems,
    mod:mod,
    itemhere:itemhere,
  }
})
.factory('Scanner', function($http){

    getData = function(Barcode,callback) {
          return $http.get('https://quiet-harbor-92343.herokuapp.com/api', {
   params:{
            request_id: Barcode,
          }})
         .then(function(BarcodeName,newOrNot) {
             console.log("get here")
             console.log(newOrNot)
             console.log(newOrNot)
              callback(BarcodeName,newOrNot);

        }, function(error) {
            console.log(error)
            return error;
        });

    }
     return {
        getData: getData
    };
})
.factory('periodListner',function($timeout,User,Database,LocalStorageService,Activities){
    // looking for change


var dailyItems = LocalStorageService.getCacheArray('daily');
var currentDay = LocalStorageService.getCacheValue("day");
   // add looking for 7
var weeklyItems = LocalStorageService.getCacheArray('weekly');
var currentWeek = LocalStorageService.getCacheValue("week");
var monthlyItems = LocalStorageService.getCacheArray('monthly');
var currentMonth = LocalStorageService.getCacheValue('month');
 function addPeriodItems(){
    var a = new Date(Date.now()); 
    var dat = a.getDate();
   
     console.log(dat,"DAY",parseInt(currentDay))
     if(dat !== parseInt(currentDay)){LocalStorageService.setCacheValue("callday", false)}
     if(dat !== parseInt(currentDay) && Activities.callday == false){
         LocalStorageService.setCacheValue("day",dat)
         LocalStorageService.setCacheValue("callday", true)
         for(item in dailyItems){
               console.log(dailyItems)
            if(Activities.callday == false){
               console.log("this day adder is called")
            Database.ref_users.child(User.getMyuid()).child('Items').push({
                     'Name': dailyItems[item].Name,
                     'Quantity': dailyItems[item].Quantity,
                     'Shop':"Unclassified",// $scope.data.shop,
                   });
             }
         }   
      
      }

    var dayOfWeek = a.getDay();
    console.log(dayOfWeek,"week")
    if(dayOfWeek == 1 && dayOfWeek !== parseInt(currentWeek)){LocalStorageService.setCacheValue("callweek", false)}
    if(dayOfWeek == 1 && Activities.callweek== false){
        for(item in weeklyItems){
        LocalStorageService.setCacheValue("callweek", true)
        Database.ref_users.child(User.getMyuid()).child('Items').push({
                     'Name': weeklyItems[item].Name,
                     'Quantity': weeklyItems[item].Quantity,
                     'Shop':"Unclassified",// $scope.data.shop,
                   }); 
        }
         LocalStorageService.setCacheValue("week", dayOfWeek)
    }
    var month = a.getMonth();
    console.log( month,"month",parseInt(currentMonth))
    if(dat !== parseInt(currentDay)){LocalStorageService.setCacheValue("callmonth", false)}
    if(month !== parseInt(currentMonth)  && Activities.callmonth == false){
         for(item in monthlyItems){
            LocalStorageService.setCacheValue("callmonth", false)
            Database.ref_users.child(User.getMyuid()).child('Items').push({
                     'Name': monthlyItems[item].Name,
                     'Quantity': monthlyItems[item].Quantity,
                     'Shop':"Unclassified",// $scope.data.shop,
             });
         LocalStorageService.setCacheValue('month',month)
         }
        
      }
      
     
}

 return{
     dailyItems:dailyItems,
     weeklyItems:weeklyItems,
     monthlyItems: monthlyItems,
     addPeriodItems:addPeriodItems,
   }

})
.factory('itemListner',function( $timeout,User,Database,LocalStorageService){
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
     searchNames:searchNames,
   }
})

.factory('itemHistoryListner',function(ionicDatePicker,$ionicLoading,Database,User,LocalStorageService){
       //i want to fire this only if cache is not empty
       function timeConverter(UNIX_timestamp,header,more){
            var a = new Date(UNIX_timestamp);
            var year = a.getFullYear();
            var month = a.getMonth();
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();

            var months= ['January','February','March','April','May','June','July','August',
                         'september','October','November','December']
            var time = date + ' ' + months[month] + ' ' + year ;
            var headerMonth = months[month] + ' ' + year;
            if(month == 0){
                month =12;
                year=year-1;
            }
            var headerMoreMonth = months[month-1] + ' ' + year;
            // + ' ' + hour + ':' + min + ':' + sec
            if(header&&!more){
               return headerMonth;  
            }
            else if(!header && !more){
                 return time;
            }
            else if(!header && more){
               return timeMore;  
            }
            else{
                 return headerMoreMonth;
            }


        }
picker = function(callback){
    var chosenDate = {
                callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                            Database.ref_users.child(User.getMyuid()).child('Items_History')
                            .child(timeConverter(val,true))
                            //.child(timeConverter(val,false))
                            .on('value', function(snapshot){
                              console.log("listener fired");
                              historyitems = snapshot.val()
                              //flip
                              if(historyitems == null){
                                callback(t,historyitems)
                              }else{
                              var t = timeConverter(val,false,false);
                               callback(t,historyitems[t])
                              }
                             });
    
                },

                from: new Date(2016, 10, 1), //Optional
                to: new Date(Date.now()),     //Optional
                inputDate: new Date(),        //Optional
                mondayFirst: true,            //Optional
                closeOnSelect: true,          //Optional
                templateType: 'model'         //Optional
            };
            openDatePicker();
   function openDatePicker(){
            console.log("called")
            ionicDatePicker.openDatePicker(chosenDate);
        };

}
  




  listenToItemsHistory = function(callback){
      $ionicLoading.show({template:'loading....'});
      Database.ref_users.child(User.getMyuid()).child('Items_History').child(timeConverter(Date.now(),true,false))
      .on('value', function(snapshot) {
                console.log("listener fired");
                //flip
                historyitems = snapshot.val()
                console.log(historyitems)
                callback(historyitems)
         });
         
       }//send in timestamp here
  listenToMoreItemsHistory = function(callback){
      Database.ref_users.child(User.getMyuid()).child('Items_History').child(timeConverter(Date.now(),true,true))
      .on('value', function(snapshot) {
                console.log("listener fired");
                historyitems = snapshot.val()
                //flip
                callback(historyitems)
         });
         
       }
   return{
       listenToMoreItemsHistory:listenToMoreItemsHistory,
       listenToItemsHistory:listenToItemsHistory,
       timeConverter:timeConverter,
       picker:picker
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
        checkUser: function(callback){
            firebase.auth().onAuthStateChanged(function(user) {
                callback(user)
                });
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
                     LocalStorageService.setCacheValue("password", password); 
                     LocalStorageService.setCacheValue("email", email);
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
          loginSocial: function(credential){
            if (me)
            return Promise.resolve(me);
            var deff = $q.defer();
            isLoading = true;
            console.log("into")
            isLoading = true;
             return firebase.auth().signInWithCredential(credential).then(function(results) {
                        console.log(user)
                        var user = result.user;
                        addUserToFirebaseUsers(user);
                        me = user;
                        return Promise.resolve(user)
                    }).catch(function(error) {
                    console.log(error.message)
                    return Promise.resolve(error);
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
}])
.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
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
});

