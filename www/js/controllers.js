angular.module('starter.controllers', ['ionic','ngCordova'])
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// adding items to firebase
.controller('itemsCtrl', function($ionicLoading, $cordovaBarcodeScanner,Scanner,Activities,$scope,$rootScope,$timeout, $ionicPopup,$ionicListDelegate, Database, itemListner,User){
// updating item list
  console.log("Adding listen");
  $scope.items = [];
  // update from local storage
  itemListner.listenToItems(function (items){
           $timeout(function (){
           $scope.$apply(function(){
           console.log("Applying in callback");
            var tempItems = [];
            for(objects in items) {
               tempItems.push({
                 "uid": objects,
                 "Name":items[objects].Name,
                 "Quantity":items[objects].Quantity,
                 "Shop":items[objects].Shop
                })   
             } 



             //this scope must load from local
               $scope.items = tempItems;
          })},0,false);
       });
// Triggered on a button click, or some other target
$scope.addItem = function(){
$scope.data = {};
$scope.data.products = itemListner.searchNames;
// $scope.data.quantity = 1;
 var myPopup = $ionicPopup.show({
 title: 'Add New Item', // String. The title of the popup.
 scope: $scope,
 // subTitle: 'Enter all fields', // String (optional). The sub-title of the popup.
  templateUrl: 'templates/pop_up.html', // String (optional). The URL of an html template to place in the popup   body.
  buttons: [
      { // Array[Object] (optional). Buttons to place in the popup footer.
    text: 'CANCEL',
    type: 'button-default',
    onTap: function(e) {
    }
  }, 
  { 
    text: 'SCAN',
    type: 'button-royal',
    onTap: function(e) {
                      $cordovaBarcodeScanner.scan().then(function(imageData) {
                      if(imageData.text){
                                 
                                  $ionicLoading.show({template:'Scanning....'});
                                  Scanner.getData(imageData.text,function(cb){
                                   //$timeout(function (){
                                   $scope.data.name = cb.data.barcodeName;
                                   console.log(cb.data.barcodeName,"called back name")
                                   console.log(cb.data.newOrNot,"called back ans")
                                  // },0,false); 
                                    //if we scraped
                              if(cb.data.newOrNot == false){
                                $ionicLoading.hide();
                                  var myPopup2 = $ionicPopup.show({
                                      
                                        title: 'Is this the correct item name?' ,
                                        subTitle: cb.data.barcodeName,
                                        buttons: [
                                        { text: 'No',
                                          type: 'button-assertive',
                                          onTap: function(e) {                        
                                                  Database.ref_itemCatalog.child("Wrongbarcodes").child(imageData.text).push({
                                                      'Name': cb.data.barcodeName,
                                                   });
                                              myPopup2.close();
                                            }
                                          },
                                           {
                                            text: '<b>Yes</b>',
                                            type: 'button-royal',
                                            onTap: function(e) { 
                                                      Database.ref_itemCatalog.child("Rightbarcodes").child(imageData.text).push({
                                                          'Name': cb.data.barcodeName,
                                                      });
                                                      myPopup2.close();
                                                  }
                                         }]
                                   })
 //finish pop up two                         
                                              $ionicLoading.hide();
                                            var myPopup = $ionicPopup.show({
                                            title: 'Add New Item', // String. The title of the popup.
                                            scope: $scope,
                                            // subTitle: 'Enter all fields', // String (optional). The sub-title of the popup.
                                            templateUrl: 'templates/pop_up.html', // String (optional). The URL of an html template to place in the popup   body.
                                            buttons: [
                                                { // Array[Object] (optional). Buttons to place in the popup footer.
                                                text: 'CANCEL',
                                                type: 'button-default',
                                                onTap: function(e) {
                                                }
                                            }, 
                                            { 
                                                text: 'SCAN',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                       $ionicPopup.alert({
                                                        title: 'Already scanned!',    
                                                        });
                                                }
                                            }, 
                                            {
                                                text: 'ADD',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                if (!$scope.data.name ) {
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item name!',    
                                                        });
                                                    }
                                                    else if(!$scope.data.quantity){
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item quantity!',    
                                                        });
                                                    }
                                                    else {
                                                            console.log("Pushing item");

                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': $scope.data.name,
                                                                'Quantity': $scope.data.quantity,
                                                                'Shop':"",// $scope.data.shop,
                                                            });
                                                            myPopup.close();
                                                            }
                                                }
                                            }]
                                            })
                                 
                               }else{
                                    $ionicLoading.hide();
                                   var myPopup = $ionicPopup.show({
                                            title: 'Add New Item', // String. The title of the popup.
                                            scope: $scope,
                                            // subTitle: 'Enter all fields', // String (optional). The sub-title of the popup.
                                            templateUrl: 'templates/pop_up.html', // String (optional). The URL of an html template to place in the popup   body.
                                            buttons: [
                                                { // Array[Object] (optional). Buttons to place in the popup footer.
                                                text: 'CANCEL',
                                                type: 'button-default',
                                                onTap: function(e) {
                                                }
                                            }, 
                                            { 
                                                text: 'SCAN',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                       $ionicPopup.alert({
                                                        title: 'Already scanned!',    
                                                        });
                                                }
                                            }, 
                                            {
                                                text: 'ADD',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                if (!$scope.data.name ) {
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item name!',    
                                                        });
                                                    }
                                                    else if(!$scope.data.quantity){
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item quantity!',    
                                                        });
                                                    }
                                                    else {
                                                            console.log("Pushing item");

                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': $scope.data.name,
                                                                'Quantity': $scope.data.quantity,
                                                                'Shop':"",// $scope.data.shop,
                                                            });
                                                            myPopup.close();
                                                            }
                                                }
                                            }]
                                            })
                               }    
                           });        
                        }

                       }, function(error) {
                        console.log("An error happened -> " + error);
                   });
    }
  }, 
  {
    text: 'ADD',
    type: 'button-royal',
    onTap: function(e) {
       if (!$scope.data.name ) {
             e.preventDefault();
             $ionicPopup.alert({
             title: 'Please enter item name!',    
            });
          }
          else if(!$scope.data.quantity){
              e.preventDefault();
              $ionicPopup.alert({
             title: 'Please enter item quantity!',    
            });
          }
          else {
                 console.log("Pushing item");

                    Database.ref_users.child(User.getMyuid()).child('Items').push({
                    'Name': $scope.data.name,
                    'Quantity': $scope.data.quantity,
                    'Shop':"",// $scope.data.shop,
                  });
                  myPopup.close();
                }
    }
  }]
})
}

$scope.scanItem = function(){
$scope.data = {};
$scope.data.products = itemListner.searchNames;
 $scope.data.quantity = 1;
                      $cordovaBarcodeScanner.scan().then(function(imageData) {
                      if(imageData.text){
                                  
                                  $ionicLoading.show({template:'Scanning....'});
                                  Scanner.getData(imageData.text,function(cb){
                                  $scope.data.name = cb.data.barcodeName;
                                  console.log(cb.data.barcodeName,"called back name")
                                  console.log(cb.data.newOrNot,"called back ans")
                                    //if we scraped
                              if(cb.data.newOrNot == false){
                                   $ionicLoading.hide();
                                  var myPopup2 = $ionicPopup.show({
                                      
                                        title: 'Is this the correct item name?' ,
                                        subTitle: cb.data.barcodeName,
                                        buttons: [
                                        { text: 'No',
                                          type: 'button-assertive',
                                          onTap: function(e) {                        
                                                  Database.ref_itemCatalog.child("Wrongbarcodes").child(imageData.text).push({
                                                      'Name': cb.data.barcodeName,
                                                   });
                                              myPopup2.close();
                                            }
                                          },
                                           {
                                            text: '<b>Yes</b>',
                                            type: 'button-royal',
                                            onTap: function(e) { 
                                                      Database.ref_itemCatalog.child("Rightbarcodes").child(imageData.text).push({
                                                          'Name': cb.data.barcodeName,
                                                      });
                                                      myPopup2.close();
                                                  }
                                         }]
                                   })
 //finish pop up two                         
                                              $ionicLoading.hide();
                                            var myPopup = $ionicPopup.show({
                                            title: 'Add New Item', // String. The title of the popup.
                                            scope: $scope,
                                            // subTitle: 'Enter all fields', // String (optional). The sub-title of the popup.
                                            templateUrl: 'templates/pop_up.html', // String (optional). The URL of an html template to place in the popup   body.
                                            buttons: [
                                                { // Array[Object] (optional). Buttons to place in the popup footer.
                                                text: 'CANCEL',
                                                type: 'button-default',
                                                onTap: function(e) {
                                                }
                                            }, 
                                            { 
                                                text: 'SCAN',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                       $ionicPopup.alert({
                                                        title: 'Already scanned!',    
                                                        });
                                                }
                                            }, 
                                            {
                                                text: 'ADD',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                if (!$scope.data.name ) {
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item name!',    
                                                        });
                                                    }
                                                    else if(!$scope.data.quantity){
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item quantity!',    
                                                        });
                                                    }
                                                    else {
                                                            console.log("Pushing item");

                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': $scope.data.name,
                                                                'Quantity': $scope.data.quantity,
                                                                'Shop':"",// $scope.data.shop,
                                                            });
                                                            myPopup.close();
                                                            }
                                                }
                                            }]
                                            })
                                 
                               }else{
                                    $ionicLoading.hide();
                                   var myPopup = $ionicPopup.show({
                                            title: 'Add New Item', // String. The title of the popup.
                                            scope: $scope,
                                            // subTitle: 'Enter all fields', // String (optional). The sub-title of the popup.
                                            templateUrl: 'templates/pop_up.html', // String (optional). The URL of an html template to place in the popup   body.
                                            buttons: [
                                                { // Array[Object] (optional). Buttons to place in the popup footer.
                                                text: 'CANCEL',
                                                type: 'button-default',
                                                onTap: function(e) {
                                                }
                                            }, 
                                            { 
                                                text: 'SCAN',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                       $ionicPopup.alert({
                                                        title: 'Already scanned!',    
                                                        });
                                                }
                                            }, 
                                            {
                                                text: 'ADD',
                                                type: 'button-royal',
                                                onTap: function(e) {
                                                if (!$scope.data.name ) {
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item name!',    
                                                        });
                                                    }
                                                    else if(!$scope.data.quantity){
                                                        e.preventDefault();
                                                        $ionicPopup.alert({
                                                        title: 'Please enter item quantity!',    
                                                        });
                                                    }
                                                    else {
                                                            console.log("Pushing item");

                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': $scope.data.name,
                                                                'Quantity': $scope.data.quantity,
                                                                'Shop':"",// $scope.data.shop,
                                                            });
                                                            myPopup.close();
                                                            }
                                                }
                                            }]
                                            })
                               }    
                           });         
                        }

                       }, function(error) {
                        console.log("An error happened -> " + error);
                   });
}
  $scope.tick = function(item,uid){
     Activities.mod =  Activities.mod + 1;
      if(Activities.mod%2 != 0){//first time
      item.checked = true;
      $timeout(function (){
      $scope.clickItem(item,uid);
        },2000,false);
      }else{
        item.checked = false; 
        Activities.mod = 0;
      }
  }
  
  $scope.remove = function(uid){
     Database.ref_users.child(User.getMyuid()).child('Items').child(uid).remove()
  }

  $scope.clickItem = function(item,uid){
   $timeout(function (){
   console.log(item)
   if(item.checked == true){
    Activities.chosenItems.push(item);
     console.log("ticked item added")
      }
    else{
           console.log("REMOVING ticked item added")
            console.log(Activities.chosenItems);
        for(var name = 0; name < Activities.chosenItems.length;name++){
             if(Activities.chosenItems[name].uid == item.uid){
                  console.log(Activities.chosenItems[name].uid);
                  Activities.chosenItems.splice(name,1);
                
              }
          }
       } 
     if(item.checked == true){
       $timeout(function (){

       console.log("Pushing item");
      // console.log(Database.chosenItems)
      /// problem this is an array with position and object
            Database.ref_users.child(User.getMyuid()).child('Items_History').child(timeConverter(Date.now())).push({
                'Date': Date.now(),
                'Name': item.Name,
                'Quantity': item.Quantity,
                'shop': item.Shop,
                'Item-id':item.uid
            }); 

      Activities.chosenItems.push(item);
    for (purchase in Activities.chosenItems){
        //remove from list
        Database.ref_users.child(User.getMyuid()).child('Items').child(Activities.chosenItems[purchase].uid).remove()
     }
      Activities.chosenItems = [];
      },3000,false);
    }
    },3000,false);
  }

})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
.controller('historyCtrl', function($scope,$timeout,Database,itemHistoryListner) {
  console.log("Adding listen");
  itemHistoryListner.listenToItemsHistory(function (dateHistory){
        $timeout(function (){
        var temp = { "": ""}
        $scope.$apply(function(){
        console.log("Applying in history callback");
        if(dateHistory == null){
           $scope.dates = temp;
        }
        else{
         $scope.dates = dateHistory;
          }
          })},0,false);
       });  
})

.controller('itemCtrl', function( $timeout,$scope,Database,UserLocalStorageService,$ionicHistory) {

})
.controller('logoutCtrl', function( Activities,Database,User,$timeout,$scope,$ionicHistory,$state,LocalStorageService,$ionicLoading) {
    $scope.logout = function(){
     $ionicLoading.show({template:'Logging out....'});
         User.logout();
         User.clearMe();
         Activities.mod = 0;
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $timeout(function () {
        $ionicLoading.hide();
         $state.go('login');
        ionic.Platform.exitApp(); // stops the app
        window.close();
        }, 5000);
      
};
    })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
.controller("loginCtrl", function ( $ionicLoading,$ionicViewService, $scope, $state, User, $ionicPopup, $rootScope, LocalStorageService) {
      
        var passwords = LocalStorageService.getCacheValue("password");
        var emails = LocalStorageService.getCacheValue("email"); 
            console.log(passwords,emails)   
            if(passwords != null || emails != null){
                $ionicLoading.show({template:'Welcome Back....'});
                logUserIn(emails, passwords,"");
            }
    $scope.login = {};
    function logUserIn(email, pass, social) {
        $scope.isLoading = true;
        if(social != ""){
             User.loginSocial(social)
            .then(function (data) {
                $scope.isLoading = false;
                if (data.code) {
                    $scope.showAlert(data.code, data.message);
                } 
                else {
                      console.log(User.me())
                       var cachedUserID = LocalStorageService.setCacheValue("my_uid", User.me().uid);
                        console.log(cachedUserID)
                    if (window.cordova) {
                        console.log("window.console")
                       // User.saveToken();
                    }
                    // console.log(User.me())
                    $state.go('app.items');
                }
            });
        }
        else{
             User.login(email, pass)
            .then(function (data) {
                $scope.isLoading = false;
                if (data.code) {
                    $scope.showAlert(data.code, data.message);
                } 
                else {
                    console.log(User.me().uid)
                    var cachedUserID = LocalStorageService.setCacheValue("my_uid", User.me().uid);
                     console.log(cachedUserID)
                    if (window.cordova) {
                        console.log("window.console")
                       // User.saveToken();
                    }
                    console.log(User.me())
                    $ionicLoading.hide();
                    $state.go('app.items');
                }
            });
        }
            
    }

    $scope.showAlert = function (title, text) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: text
        });
    };

    $scope.submit = function ($event) {
        console.log("called this")
           console.log($scope.login.email);
           console.log($scope.login.password)
           logUserIn($scope.login.email, $scope.login.password,"");
       };
    $scope.social = function ($event,social) {
        logUserIn("", "", social);
    };
})

.controller("signUpCtrl", function ($ionicViewService, $scope, $state, User, $ionicPopup, $rootScope, LocalStorageService) {
    //if (window.ga) {
    // window.ga.trackView('Sign Up View')
    //}
   // window.ga.trackView('sign-up')
    $scope.signup = {};

    function logUserIn(username, pass) {
        $scope.isLoading = true;
        User.login(username, pass)
            .then(function (data) {
                $scope.isLoading = false;
                if (data.code) {
                    $scope.showAlert(data.code, data.message);
                } else {
                    if (window.cordova) {
                        //User.saveToken();
                    }

                    //this is where we check first login and actually redirect

                    $rootScope.isAdmin = User.me().admin;
                    if ($rootScope.isAdmin == undefined) {
                        $rootScope.isAdmin = false;
                    }
                      $state.go('app.items');

                }
            });

    }

    $scope.showAlert = function (title, text) {
        console.log(title);
        console.log(text);
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: text
        });
        
         $scope.isLoading = false;
    };

    $scope.submit = function ($event) {
        $scope.isLoading = true;
        //register new user here
        //console.log("Running submit with ", $scope.signup.email,$scope.signup.password);
        function userAccountCreated(email, password) {
            console.log("Account created");
            logUserIn(email,password);
        }

        User.createNewUserAuth($scope.signup.email, $scope.signup.password, userAccountCreated, $scope.showAlert);

    };
});
function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp);
            var year = a.getFullYear();
            var month = a.getMonth();
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var months= ['January','February','March','April','May','June','July','August','september','October','November','December' ]
            var time = date + ' ' + months[month] + ' ' + year ;
            // + ' ' + hour + ':' + min + ':' + sec
            console.log(time)
         return time;
        }