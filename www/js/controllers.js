angular.module('starter.controllers', ['ionic','ngCordova'])
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// adding items to firebase
.controller('itemsCtrl', function(LocalStorageService,periodListner,$ionicModal,$ionicLoading, $cordovaBarcodeScanner,
                                  Scanner,Activities,$scope,$rootScope,$timeout, $ionicPopup,$ionicListDelegate,
                                  Database, $state,itemHistoryListner, itemListner,User){

$scope.$on('$ionicView.beforeEnter', function() {
    if(typeof window.ga !== 'undefined') { analytics.trackView("itemsCtrl");console.log("it works");}
});

 periodListner.addPeriodItems();
 $scope.addshopname = false;
 $scope.show = false;
 console.log("Adding listen");
 $scope.items = [];
 $scope.untickItems = function(items){
   for(item in items){
         if( items[item].clicked == true){
            items[item].clicked = false; 
         }
      }
      $scope.show = false;
       $scope.addshopname = false;
}
$scope.addShopName = function(items,name){
    if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Add Shop", "User chose shop from add shop model") }
      for(item in items){
         if(items[item].clicked == true){
            items[item].clicked = false; 
            Database.ref_users.child(User.getMyuid()).child('Items').child(items[item].uid).update({
                 'Shop':name
             });
         }
      }
$scope.addshopname = false;
$scope.show = false;
$scope.closeModal2();
}

  // update from local storage
 //this scope must load from local
var itemsz = LocalStorageService.getCacheArray(Database.ref_users.child(User.getMyuid()).child('Items').toString());
    shops = {
         Woolworths:{isshop:false}, 
         PicknPay:{isshop:false}, 
         Shoprite:{isshop:false}, 
         Spar:{isshop:false}, 
         Other:{isshop:false}, 
                    //"pnp","shoprite","spar"]
        }
  for(shop in shops){
      console.log(shop)
      for(item in itemsz){
         if(shop == itemsz[item].Shop){
              shops[shop].isshop=true;
         }
      }
  }
    $scope.shops = shops;
         var tempItems = [];
            for(objects in itemsz) {
               tempItems.push({
                 "uid": objects,
                 "Name":itemsz[objects].Name,
                 "Quantity":itemsz[objects].Quantity,
                 "Shop":itemsz[objects].Shop
                })   
             } 
             //this scope must load from local
               $scope.shops = shops;
               $scope.items = tempItems;
               console.log(tempItems);

    itemListner.listenToItems(function (items){

  shops = {
          Woolworths:{isshop:false}, 
          PicknPay:{isshop:false}, 
          Shoprite:{isshop:false}, 
          Spar:{isshop:false}, 
          Other:{isshop:false},  
        }
  for(shop in shops){
      console.log(shop)
      for(item in items){
         if(shop == items[item].Shop){
              shops[shop].isshop=true;
         }
      }
  }

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
               $scope.shops = shops;
               $scope.items = tempItems;
               console.log(tempItems);
          })},0,false);
       });
// Triggered on a button click, or some other target



$scope.addItem = function(){
if(typeof window.ga !== 'undefined') {window.ga.trackEvent("Add Item", "User clicked on add item button"); }
$scope.data = {};
$scope.data.products = itemListner.searchNames;
$scope.data.quantity = 1;
$scope.up = function(){
$scope.data.quantity++;
}
$scope.down = function(){
    if($scope.data.quantity > 1){
    $scope.data.quantity--;
    }
}
 var myPopup = $ionicPopup.show({
 title: 'Add New Item', 
 scope: $scope,
  templateUrl: 'templates/pop_up.html', 
  buttons: [
      { 
    text: 'CANCEL',
    type: 'button-default',
    onTap: function(e) {
    }
  }, 
  { 
    text: 'SCAN',
    type: 'button-royal',
    onTap: function(e) {
           $scope.scanItem();
    }
  }, 
  {
    text: 'ADD',
    type: 'button-royal',
    onTap: function(e) {
         if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Add Item", "User added item manually"); }
       if (!$scope.data.name ) {
             e.preventDefault();
             $ionicPopup.alert({
             title: 'Please enter item name!',
              buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else if(!$scope.data.quantity){
              e.preventDefault();
              $ionicPopup.alert({
             title: 'Please enter item quantity!', 
                buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else {
                 console.log("Pushing item");

                    Database.ref_users.child(User.getMyuid()).child('Items').push({
                    'Name': $scope.data.name,
                    'Quantity': $scope.data.quantity,
                    'Shop':"Other",// $scope.data.shop,
                  });
                  myPopup.close();
                }
    }
  }]

})
$scope.addSubmit= function(){
         if (!$scope.data.name ) {
             $ionicPopup.alert({
             title: 'Please enter item name!',
              buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else if(!$scope.data.quantity){
              $ionicPopup.alert({
             title: 'Please enter item quantity!', 
                buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else {
                 console.log("Pushing item");

                    Database.ref_users.child(User.getMyuid()).child('Items').push({
                    'Name': $scope.data.name,
                    'Quantity': $scope.data.quantity,
                    'Shop':"Other",// $scope.data.shop,
                  });
                    myPopup.close();
                }
}
}
 
  $scope.remove = function(uid){
    if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Delete", "User deleted item"); }
     Database.ref_users.child(User.getMyuid()).child('Items').child(uid).remove()
  }
  $scope.closeFooter = function(items){
     if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Footer", "User user closed footer"); }
     for(item in items){
                    if(items[item].clicked == true){
                    items[item].clicked = false; 
                    $scope.show = false;
                    $scope.addshopname = false;
                    }
                 }
   }
  $scope.showFooter = function(items,item,key){ 
       if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Footer", "User clicked items to show footer"); }
            $scope.addshopname = false;
        if(item.checked == true){
            item.checked = false;
        }
        if(item.clicked == true) {
            item.clicked = false;
            var b = 0;
            for(i in items){
            if(items[i].clicked == true){
                b++;
            }
            }
            // check if all false
            if(b > 0){// no they not
            $scope.show = true;  
            }else{$scope.show = false;}
        }
        else if(item.clicked == false) {
            item.clicked = true; 
            $scope.show = true;
            
        }
        else{
        item.clicked = true;
        $scope.show = true; 
        }

           $ionicModal.fromTemplateUrl('templates/my-modal.html', {
           scope: $scope,
           animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function() {
                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Schedules", "User opened schedules module"); }
                $scope.modal.show();
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
           // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
             $scope.exit = function(){
                 for(item in items){
                    if(items[item].clicked == true){
                      items[item].clicked = false; 
                    }
                 }
                  $scope.addshopname = false;
                  $scope.modal.remove(); 
                  $scope.show = false;
             }
        $ionicModal.fromTemplateUrl('templates/popupshop.html', {
           scope: $scope,
           animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal2 = modal;
            });
            $scope.openModal2 = function() {
                $scope.modal2.show();
            };
            $scope.pictures =  [0,1,2,3];
            $scope.closeModal2 = function() {
        for(item in items){
            if(items[item].clicked == true){
                items[item].clicked = false; 
            }
         }
               $scope.modal2.remove();
               $scope.show = false;
               $scope.addshopname = false;
            };
           // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal2.remove();
            });
          
           $scope.removeAllItems = function(){
                console.log("clicked remove schedule") 
            for(ite in items){
                    if(items[ite].clicked){
                         items[ite].clicked = false; 
                         for(trackeditem in periodListner.dailyItems){
                           if( periodListner.dailyItems[trackeditem].uid == items[ite].uid){
                              periodListner.dailyItems.splice(trackeditem,1)
                           }    
                         }
                         for(trackeditem in periodListner.weeklyItems){
                           if( periodListner.weeklyItems[trackeditem].uid == items[ite].uid){
                              periodListner.weeklyItems.splice(trackeditem,1)
                           }    
                         }
                         for(trackeditem in periodListner.monthlyItems){
                           if( periodListner.monthlyItems[trackeditem].uid == items[ite].uid){
                              periodListner.monthlyItems.splice(trackeditem,1)
                           }    
                         }
                    }
                 } 
                  $scope.show = false;
                  $scope.modal.remove(); 

                 $ionicLoading.show({template:'All selected items have been removed from purchase schedules'});
                $timeout(function (){
                      $ionicLoading.hide();
                    },1500);
             }
  $scope.daily = function(){
      if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Schedules", "User put items in daily purchases"); }
                console.log("clicked d")
             for(ite in items){
                     //console.log(items[ite])
                    if(items[ite].clicked){
                         items[ite].clicked = false; 
                         var ie = 0;
                         for(trackeditem in periodListner.dailyItems){
                           if( periodListner.dailyItems[trackeditem].Name == items[ite].Name){
                              ie++;
                           }    
                         }
                         if(ie == 0){
                         periodListner.dailyItems.push(items[ite]) 
                         console.log( periodListner.dailyItems)
                         }
                    }
                 }
             LocalStorageService.setCacheValue("daily",periodListner.dailyItems)
             $scope.modal.remove();  
             $scope.show = false;
               $ionicLoading.show({template:'Items Added to daily purchases'});
                $timeout(function (){
                      $ionicLoading.hide();
                    },1500);
             
                   

            }
            $scope.weekly= function(){
                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Schedules", "User put items in weekly purchases"); }
                console.log("clicked w")
                 for(ite in items){
                     //console.log(items[ite])
                    if(items[ite].clicked){
                         items[ite].clicked=false;
                         var ie = 0;
                         for(trackeditem in periodListner.weeklyItems){
                           if( periodListner.weeklyItems[trackeditem].Name == items[ite].Name){
                             console.log(trackeditem.Name)
                              ie++;
                           }    
                         }
                         if(ie == 0){  
                         periodListner.weeklyItems.push(items[ite])
                         console.log( periodListner.weeklyItems)
                         } 
                    }
                 }
             LocalStorageService.setCacheValue("weekly",periodListner.weeklyItems)
                       $scope.modal.remove(); 
                        $scope.show = false;

                $ionicLoading.show({template:'Items Added to weekly purchases'});
                $timeout(function (){
                      $ionicLoading.hide();
                    },1500);

            }
            $scope.monthly = function(){
                 if(typeof window.ga !== 'undefined') {window.ga.trackEvent("Schedules", "User put items in monthly purchases"); }
                console.log("clicked m")
                 for(ite in items){
                     //console.log(items[ite])
                    if(items[ite].clicked){
                         items[ite].clicked=false;
                          var ie = 0;
                          console.log(ie)
                         for(trackeditem in periodListner.monthlyItems){
                           if(periodListner.monthlyItems[trackeditem].Name == items[ite].Name){
                               console.log()
                              ie++;
                           }    
                         }
                         if(ie == 0){  
                         periodListner.monthlyItems.push(items[ite])
                         console.log( periodListner.monthlyItems)
                         }   
                    }
                 }
               LocalStorageService.setCacheValue("monthly",periodListner.monthlyItems)
                       $scope.modal.remove();  
                        $scope.show = false;

                $ionicLoading.show({template:'Items Added to monthly purchases'});
                $timeout(function (){
                      $ionicLoading.hide();
                    },1500);
            } 
    
    $scope.buyNow = function(){
         if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Footer", "User purchased multiple items"); }
                 for(ite in items){
                     console.log(items[ite])
                    if(items[ite].clicked){
                        items[ite].checked = true;
                        $scope.clickItem(items[ite],items[ite].uid)
                        items[ite].clicked==false; 
                        $scope.show = false;
                    }
                 }
       }  
    }
  $scope.clickItem = function(item,uid){
       if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Buy", "User bought items"); }
    //$timeout(function (){
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
$timeout(function (){
            if(item.checked == true){
            console.log("Pushing item");
            // console.log(Database.chosenItems)
            /// problem this is an array with position and object
                    Database.ref_users.child(User.getMyuid()).child('Items_History')
                    .child(itemHistoryListner.timeConverter(Date.now(),true))
                    .child(itemHistoryListner.timeConverter(Date.now(),false,false)).push({
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
            } },3000,false);
        }

        $scope.scanItem = function(){
             if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User tried to scan from pop button"); }
                      $cordovaBarcodeScanner.scan().then(function(imageData) {
                      if(imageData.text){
                              $ionicLoading.show({template:'Scanning....'});
                              Scanner.getData(imageData.text,function(cb){
                              console.log(cb.data.barcodeName,"called back name")
                              console.log(cb.data.newOrNot,"called back ans")

                              if(cb.data.newOrNot == false){
                                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned and scraped product,recieved product name"); }
                                   $ionicLoading.hide();                              
                                   var myPopup2 = $ionicPopup.show({
                                        title:  cb.data.barcodeName,
                                        subTitle: 'Is this the correct name?',
                                        buttons: [
                                        { text: 'No',
                                          type: 'button-assertive',
                                          onTap: function(e) {  
                                              if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User got incorrect product"); }                     
                                                  Database.ref_itemCatalog.child("Wrongbarcodes").child(imageData.text).push({
                                                      'Name': cb.data.barcodeName,
                                                   });
                                             myPopup2.close();
                                             $ionicLoading.hide();
                                             $scope.addItem();
                                            }
                                          },
                                           {
                                            text: '<b>Yes</b>',
                                            type: 'button-royal',
                                            onTap: function(e) {
                                                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned and recieved a correct product"); }
                                                      Database.ref_itemCatalog.child("Rightbarcodes").child(imageData.text).push({
                                                          'Name': cb.data.barcodeName,
                                                      });
                                                      myPopup2.close();
                                                  $ionicLoading.hide();
                                                  console.log("Pushing item");
                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': cb.data.barcodeName,
                                                                'Quantity':1,
                                                                'Shop':"Other",// $scope.data.shop,
                                                            });
                                                            myPopup3.close();

                                        }
                                         }]
                                   })
 //finish pop up two                         
                               }else{
                                    if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned an known product in the db"); }
                                    $ionicLoading.hide();
                                                                console.log("Pushing item");
                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': cb.data.barcodeName,
                                                                'Quantity': 1,
                                                                'Shop':"Other",
                                                            });
                               }    
                           });        
                        }
                       }, function(error) {
                        console.log("An error happened -> " + error);
                   });
        }
  
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
.controller('scanCtrl', function( LocalStorageService,$ionicLoading, $cordovaBarcodeScanner,
                                  Scanner,$scope,$timeout,$ionicPopup,
                                  Database,itemListner,User) {
     $scope.scanItem = function(){
             if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User tried to scan from pop button"); }
                      $cordovaBarcodeScanner.scan().then(function(imageData) {
                          console.log("scanned "+ imageData.text)
                      if(imageData.text !== ''){
                              $ionicLoading.show({template:'Scanning....'});
                              Scanner.getData(imageData.text,function(cb){
                              console.log(cb.data.barcodeName,"called back name")
                              console.log(cb.data.newOrNot,"called back ans")

                              if(cb.data.newOrNot == false){
                                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned and scraped product,recieved product name"); }
                                   $ionicLoading.hide();                              
                                   var myPopup2 = $ionicPopup.show({
                                        title:  cb.data.barcodeName,
                                        subTitle: 'Is this the correct name?',
                                        buttons: [
                                        { text: 'No',
                                          type: 'button-assertive',
                                          onTap: function(e) {  
                                              if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User got incorrect product"); }                     
                                                  Database.ref_itemCatalog.child("Wrongbarcodes").child(imageData.text).push({
                                                      'Name': cb.data.barcodeName,
                                                   });
                                             myPopup2.close();
                                             $ionicLoading.hide();
                                             $scope.addItem();
                                            }
                                          },
                                           {
                                            text: '<b>Yes</b>',
                                            type: 'button-royal',
                                            onTap: function(e) {
                                                 if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned and recieved a correct product"); }
                                                      Database.ref_itemCatalog.child("Rightbarcodes").child(imageData.text).push({
                                                          'Name': cb.data.barcodeName,
                                                      });
                                                      myPopup2.close();
                                                  $ionicLoading.hide();
                                                  console.log("Pushing item");
                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': cb.data.barcodeName,
                                                                'Quantity':1,
                                                                'Shop':"Other",// $scope.data.shop,
                                                            });
                            
                                        }
                                         }]
                                   })
 //finish pop up two                         
                               }else{
                                    if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Scan", "User scanned an known product in the db"); }
                                    $ionicLoading.hide();
                                                                console.log("Pushing item");
                                                                Database.ref_users.child(User.getMyuid()).child('Items').push({
                                                                'Name': cb.data.barcodeName,
                                                                'Quantity': 1,
                                                                'Shop':"Other",
                                                            });
                               }    
                           });        
                        }

                       }, function(error) {
                        console.log("An error happened -> " + error);
                   });
        }
$scope.addItem = function(){
if(typeof window.ga !== 'undefined') {window.ga.trackEvent("Add Item", "User clicked on add item button"); }
$scope.data = {};
$scope.data.products = itemListner.searchNames;
$scope.data.quantity = 1;
$scope.up = function(){
$scope.data.quantity++;
}
$scope.down = function(){
    if($scope.data.quantity > 1){
    $scope.data.quantity--;
    }
}
 var myPopup = $ionicPopup.show({
 title: 'Add New Item Manually', 
 scope: $scope,
  templateUrl: 'templates/pop_up.html', 
  buttons: [
      { 
    text: 'CANCEL',
    type: 'button-default',
    onTap: function(e) {
    }
  }, 
  { 
    text: 'SCAN',
    type: 'button-royal',
    onTap: function(e) {
           
    }
  }, 
  {
    text: 'ADD',
    type: 'button-royal',
    onTap: function(e) {
         if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Add Item", "User added item manually"); }
       if (!$scope.data.name ) {
             e.preventDefault();
             $ionicPopup.alert({
             title: 'Please enter item name!',
              buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else if(!$scope.data.quantity){
              e.preventDefault();
              $ionicPopup.alert({
             title: 'Please enter item quantity!', 
                buttons: [{
                text:'Ok',
                type: 'button-positive'
            }]    
            });
          }
          else {
                 console.log("Pushing item");

                    Database.ref_users.child(User.getMyuid()).child('Items').push({
                    'Name': $scope.data.name,
                    'Quantity': $scope.data.quantity,
                    'Shop':"Other",// $scope.data.shop,
                  });
                  myPopup.close();
                }
    }
  }]

})
}

})
.controller('historyCtrl', function( $state,$window,$ionicLoading,User,$scope,$timeout,Database,itemHistoryListner,LocalStorageService) {
    if(typeof $window.ga !== 'undefined') { $window.ga.trackView("history View"); }
var x = false;
 // $scope.openDatePicker = itemHistoryListner.picker;
$scope.chosenDateChange = function(){
if(typeof window.ga !== 'undefined'){window.ga.trackEvent("Date", "changed history view"); }
    x=true;
    console.log(x);
       console.log("Adding listen p");
      itemHistoryListner.picker(function (date,dateHistory){
        console.log(date)
        if(dateHistory == undefined || dateHistory == null){
         var temp={"":''}
             $ionicLoading.show({template:'No items were purchased on this date'});
                 $timeout(function (){
                    $ionicLoading.hide();
                    callHistory()
                    },1500);
        }else{
        var temp = {[date]:dateHistory}
        console.log(temp)
      }
      $timeout(function (){
        $scope.$apply(function(){
        console.log("Applying in history callback2");
            $scope.dates = temp; 
             x = false  
          })},0,false);
    });
     // x = false;
 }
callHistory();
function callHistory(){
if(x==false){
 var currentHistory = {}
  console.log("Adding listen c");
  itemHistoryListner.listenToItemsHistory(function (dateHistory){
        $ionicLoading.hide();
        $timeout(function (){
        var temp = { "": ""}
        $scope.$apply(function(){
        console.log("Applying in history callback c");
        if(dateHistory == null){
           $scope.dates = temp;
           console.log("history empty")
        }
        else{
            $scope.dates = dateHistory;
            Object.assign(currentHistory,dateHistory)
          }
          })},0,false);
       });

      $scope.hasMoreData=true;
       var temp2={};
       $scope.loadMore = function() {
	   itemHistoryListner.listenToMoreItemsHistory(function (dateHistory){
              console.log("here")
        $timeout(function (){
        $scope.$apply(function(){
        console.log("Applying in history load more callback");
        console.log(dateHistory)
        if(dateHistory == null){
          $scope.hasMoreData=false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
           console.log("more history empty")
        }
        else{
         console.log(temp2, dateHistory)
        for(key in dateHistory){
              for(key2 in temp2){
                    if(key == key2){
                    $scope.hasMoreData=false;
                      console.log("stop now")
                    }
              }
          }
            Object.assign(currentHistory,dateHistory)
            $scope.dates = currentHistory;
            temp2 = dateHistory;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          })},0,false);
       });
	};
 }
}
})

.controller('logoutCtrl', function( Activities,Database,User,$timeout,$scope,$ionicHistory,$state,LocalStorageService,$ionicLoading) {
    $scope.logout = function(){
     $ionicLoading.show({template:'Logging out....'});
        // User.logout();
        // User.clearMe();
         Activities.mod = 0;
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $timeout(function () {
        $ionicLoading.hide();
        // $state.go('login');
        ionic.Platform.exitApp(); // stops the app
        window.close();
        }, 1000);
      
};
    })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
.controller("loginCtrl", function (ConnectivityMonitor, periodListner, $cordovaOauth,$ionicLoading,$ionicViewService,
                                         $scope, $state, User, $ionicPopup, $rootScope, LocalStorageService) {
         if(typeof window.ga !== 'undefined') { window.ga.trackView("loginCtrl"); }
        var passwords = LocalStorageService.getCacheValue("password");
        var emails = LocalStorageService.getCacheValue("email"); 
       if(ConnectivityMonitor.isOnline){
            $scope.passwords = passwords;
            if(passwords != null || emails != null){
                   $ionicLoading.show({template:'Welcome Back....'});
                    User.checkUser(function(check){
                       if(check){
                          console.log(check,"already logged in")
                          $ionicLoading.hide();
                          $state.go('app.items');
                       }
                       else{
                         logUserIn(emails, passwords,"");
                       }
                    })
              
            }
       }
       else{
        $ionicLoading.show({template:'Failing to establish a nework connection'});
        $timeout(function () {
        $state.go('login');
        $ionicLoading.hide();
        },4000);
       }
    $scope.login = {};
    function logUserIn(email, pass, social) {
        $scope.isLoading = true;
        if(social !== ""){
           if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Login", "User logged in with facebook"); }
            function callback(cb){
                if(social == "facebook"){
                  $cordovaOauth.facebook("1658448584446921", ['email']).then(function(response) {
                         var credential = firebase.auth.FacebookAuthProvider.credential(response.access_token); 
                         cb(credential);
                         })
                }else{
                      $cordovaOauth.facebook("1658448584446921", ['email']).then(function(response) {
                         var credential = firebase.auth.FacebookAuthProvider.credential(response.access_token);
                          cb(credential); 
                         })    
                    }}
          callback( function (credential){
              User.loginSocial(credential)
             .then(function (data) {
                 console.log(data)
                $scope.isLoading = false;
                if (data) {
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
         })
             
        }
        else{
           if(typeof window.ga !== 'undefined') { window.ga.trackEvent("Login", "User logged in with Username and password"); }
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
        console.log(social,'here')
        logUserIn("", "", social);
    };
})

.controller("signUpCtrl", function ($ionicViewService, $scope, $state, User, $ionicPopup, $rootScope, LocalStorageService) {
    if(typeof window.ga !== 'undefined') { window.ga.trackView("Sign up view"); }
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
                    if ($rootScope.isAdmin == 'undefined') {
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

        