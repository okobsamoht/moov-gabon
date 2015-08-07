// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

app.run(function($transform) {
  window.$transform = $transform;
});

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'home.html', reloadOnSearch: false});
  $routeProvider.when('/scroll',        {templateUrl: 'scroll.html', reloadOnSearch: false}); 
  $routeProvider.when('/toggle',        {templateUrl: 'toggle.html', reloadOnSearch: false}); 
  $routeProvider.when('/tabs',          {templateUrl: 'tabs.html', reloadOnSearch: false}); 
  $routeProvider.when('/accordion',     {templateUrl: 'accordion.html', reloadOnSearch: false}); 
  $routeProvider.when('/overlay',       {templateUrl: 'overlay.html', reloadOnSearch: false}); 
  $routeProvider.when('/forms',         {templateUrl: 'forms.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown',      {templateUrl: 'dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/touch',         {templateUrl: 'touch.html', reloadOnSearch: false});
  $routeProvider.when('/swipe',         {templateUrl: 'swipe.html', reloadOnSearch: false});
  $routeProvider.when('/drag',          {templateUrl: 'drag.html', reloadOnSearch: false});
  $routeProvider.when('/drag2',         {templateUrl: 'drag2.html', reloadOnSearch: false});
  $routeProvider.when('/carousel',      {templateUrl: 'carousel.html', reloadOnSearch: false});
  $routeProvider.when('/profile',       {templateUrl: 'profile.html', reloadOnSearch: false});
  $routeProvider.when('/offre',         {templateUrl: 'offre.html', reloadOnSearch: false});
  $routeProvider.when('/offres',        {templateUrl: 'offres.html', reloadOnSearch: false});
  $routeProvider.when('/service/:serviceId',      {templateUrl: 'service.html', reloadOnSearch: false});
  $routeProvider.when('/services',      {templateUrl: 'services.html', reloadOnSearch: false});
  $routeProvider.when('/produit',       {templateUrl: 'produit.html', reloadOnSearch: false});
  $routeProvider.when('/produits',      {templateUrl: 'produits.html', reloadOnSearch: false});
  $routeProvider.when('/epiq',          {templateUrl: 'epiq.html', reloadOnSearch: false});
  $routeProvider.when('/assistance',    {templateUrl: 'assist.html', reloadOnSearch: false});
  $routeProvider.when('/apropos',       {templateUrl: 'about.html', reloadOnSearch: false});
  $routeProvider.when('/mcs',       {templateUrl: 'mcs.html', reloadOnSearch: false});
  $routeProvider.when('/mgs',       {templateUrl: 'mgs.html', reloadOnSearch: false});
  $routeProvider.when('/m3g',       {templateUrl: 'm3g.html', reloadOnSearch: false});
  $routeProvider.when('/mcsp',       {templateUrl: 'mcsp.html', reloadOnSearch: false});
  $routeProvider.when('/flooz',       {templateUrl: 'flooz.html', reloadOnSearch: false});
  $routeProvider.when('/data',       {templateUrl: 'data.html', reloadOnSearch: false});
  $routeProvider.when('/zopim',       {templateUrl: 'zopim.html', reloadOnSearch: false});
  $routeProvider.when('/roam',       {templateUrl: 'roam.html', reloadOnSearch: false});
});

// 
// `$touch example`
// 

app.directive('toucharea', ['$touch', function($touch){
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;  
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem){
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if( drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });
      
      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          // 
          // use translate both as basis for the new transform:
          // 
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);
          
          //
          // Add rotation:
          //
          var Dx    = touch.distanceX, 
              t0    = touch.startTransform, 
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );
          
          t.rotateZ = angle + (Math.round(t0.rotateZ));
          
          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

app.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          //
          // Here you can see how to limit movement 
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);

//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function($rootScope, $scope){

  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';
  if(!localStorage.getItem('reg')){
    $scope.regText = "S'enregistrer";
    $scope.regInfo = "Enregistrez vos informations pour optimiser l'assistance!";
  }
  if(localStorage.getItem('reg')){
    $scope.regText = "Mon Profil";
    $scope.regInfo = "";
  }

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    /* global alert: false; */
    alert('Congrats you scrolled to the end of the list!');
  };

  //
  // 'Services' screen
  //
  var serviceItems = [
    {
      id:1,
      service: 'Appels Gratuits',
      codeActivation: '',
      lien: '#/mcs',
      image: ''
    },
    {
      id:2,
      service: 'Moov Radio',
      codeActivation: '',
      lien: '#/mgs',
      image: ''
    },
    {
      id:3,
      service: 'Bip Cool',
      codeActivation: '',
      lien: '#/m3g',
      image: ''
    },
    {
      id:4,
      service: 'Moov Partage',
      codeActivation: '',
      lien: '#/mcsp',
      image: ''
    },
    {
      id:5,
      service: 'FLOOZ',
      codeActivation: '',
      lien: '#/flooz',
      image: ''
    },
    {
      id:6,
      service: 'Data & Internet',
      codeActivation: '',
      lien: '#/data',
      image: ''
    }

  ];

  //for (var i=1; i<=20; i++) {
  //  serviceItems.push('Item ' + i);
  //}

  $scope.serviceItems = serviceItems;

  var produitItems = [
    {
      id:1,
      produit: 'Alcatel OT 679',
      image: 'ALCATEL OT 679.png',
      prix: '24 430 FCFA'
    },
    {
      id:2,
      produit: 'Blackberry 8520',
      image: 'Blackberry 8520.png',
      prix: '80 430 FCFA '
    }

  ];

  $scope.produitItems = produitItems;

  var offreItems = [
    {
      id:1,
      offre: 'Moov First',
      image: 'moovfirst.jpg',
      activ: '*104*1%23',
      description: 'A. 1F/s  en local (Moov et autres réseau)  B. 29F /mn vers 12 Destinations à l’international : France, USA ; Canada ; Afrique du Sud ; Maroc ; Belgique ; Espagne ; Inde ; Chine ; UK ; Allemagne et Italie Appel vers autres destinations à l’international : tarif en vigueur C. Sms: 14F vers Moov ; 25F vers autres réseau et 70F vers l’international'    },
    {
      id:2,
      offre: 'FLOOZ',
      image: 'flooz.jpg',
      activ: '*155%23',
      description: 'Flooz, est un compte électronique ouvert sur votre numéro de téléphone Moov. Lorsque votre compte Flooz est ouvert, votre numéro de téléphone devient également votre numéro de compte Flooz.'
    }

  ];

  $scope.offreItems = offreItems;

  //
  // Right Sidebar
  // 
  $scope.chatUsers = [
    { name: 'Carlos  Flowers', online: true },
    { name: 'Byron Taylor', online: true },
    { name: 'Jana  Terry', online: true },
    { name: 'Darryl  Stone', online: true },
    { name: 'Fannie  Carlson', online: true },
    { name: 'Holly Nguyen', online: true },
    { name: 'Bill  Chavez', online: true },
    { name: 'Veronica  Maxwell', online: true },
    { name: 'Jessica Webster', online: true },
    { name: 'Jackie  Barton', online: true },
    { name: 'Crystal Drake', online: false },
    { name: 'Milton  Dean', online: false },
    { name: 'Joann Johnston', online: false },
    { name: 'Cora  Vaughn', online: false },
    { name: 'Nina  Briggs', online: false },
    { name: 'Casey Turner', online: false },
    { name: 'Jimmie  Wilson', online: false },
    { name: 'Nathaniel Steele', online: false },
    { name: 'Aubrey  Cole', online: false },
    { name: 'Donnie  Summers', online: false },
    { name: 'Kate  Myers', online: false },
    { name: 'Priscilla Hawkins', online: false },
    { name: 'Joe Barker', online: false },
    { name: 'Lee Norman', online: false },
    { name: 'Ebony Rice', online: false }
  ];

  //
  // 'Forms' screen
  //  
  $scope.rememberMe = true;
  $scope.statut = 'SILVER';
  $scope.nom = localStorage.getItem('nom');
  $scope.email = localStorage.getItem('email');
  $scope.exitApp = function() {navigator.app.exitApp()};

  $scope.login = function() {
    //alert('You submitted the login form' + $scope.ncr);
    //localStorage.setItem('reg', 'reg')
    $scope.nom = this.nom;
    $scope.email = this.email;
    localStorage.setItem('nom', this.nom);
    localStorage.setItem('email', this.email);
    localStorage.setItem('reg', 'reg');
    window.location = 'index.html';
  };

  $scope.solde = function(number) {
    phonedialer.dial(
        number,
        function(err) {
          if (err == "empty") alert("Numéro inconnu!");
          else alert("Erreure :" + err);
        },
        function(success) {
        }
    );

  };

  $scope.call = function(number) {
    console.log(number)
    phonedialer.dial(
        number,
        function(err) {
          if (err == "empty") alert("Numéro inconnu!");
          else alert("Erreure :" + err);
        },
        function(success) {
        }
    );

  };

  $scope.vcall = function(number){
    console.log(number)
    function onConfirm(buttonIndex) {
      //alert('You selected button ' + buttonIndex);
      if(buttonIndex == 1) {
        phonedialer.dial(
            number,
            function(err) {
              if (err == "empty") alert("Numéro inconnu!");
              else alert("Erreure :" + err);
            },
            function(success) {
            }
        );
      }
      if(buttonIndex == 2) {
        //alert('quitter')
        return null;
      }
    }

    function showConfirm(titre, message) {
      navigator.notification.confirm(
          message, // message
          onConfirm,            // callback to invoke with index of button pressed
          titre,           // title
          ['Continuer','Quitter']         // buttonLabels
      );
    }
    navigator.notification.vibrate(100);
    showConfirm('Assistant MOOV', 'Etes vous sur de vouloir effectuer cette opération?');

  }

  $scope.vsms = function(number, message){
    var intent = ""; //leave empty for sending sms using default intent
    var success = function () {
      x.send('xalert', 'SMS ENVOYEE');
    };
    var error = function (e) { x.send('xalert', 'ECHEC:' + e); };
    var x = this;

    function onConfirm(buttonIndex) {
      //alert('You selected button ' + buttonIndex);
      if(buttonIndex == 1) {
        //alert('continuer')
        sms.send(number, message, intent, success, error);
        //console.log(number,message);
      }
      if(buttonIndex == 2) {
        //alert('quitter')
        return null;
      }
    }

    function showConfirm(titre, message) {
      navigator.notification.confirm(
          message, // message
          onConfirm,            // callback to invoke with index of button pressed
          titre,           // title
          ['Continuer','Quitter']         // buttonLabels
      );
    }
    navigator.notification.vibrate(100);
    showConfirm('Assistant MOOV', 'Etes vous sur de vouloir effectuer cette opération?');

  }

  $scope.sms = function(number, message){
    var intent = ""; //leave empty for sending sms using default intent
    var success = function () {
      x.send('xalert', 'SMS ENVOYEE');
    };
    var error = function (e) { x.send('xalert', 'ECHEC:' + e); };
    var x = this;

    sms.send(number, message, intent, success, error);
    //console.log(number,message);

  }

  var abonnItems = [];

  for (var i=1; i<=3; i++) {
    abonnItems.push('Service ' + i);
  }

  $scope.abonnItems = abonnItems;

  // 
  // 'Drag' screen
  // 
  $scope.notices = [];
  
  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1) });
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});

app.factory('cService', function () {
  // Some fake testing data

  var cs = [
    { id: 0, senderName: 'Joe', subject: 'Hi there!', content: 'Let\'s meet for dinner today! Please?', avatar: 'http://ionicframework.com/img/docs/venkman.jpg'},
    { id: 1, senderName: 'Twitch.tv', subject: 'Live stream today', content: 'We\'re gonna go full stream at 20:00. Make sure to be there!', avatar: 'http://ionicframework.com/img/docs/stantz.jpg'},
    { id: 2, senderName: 'eBay', subject: 'Free shipping on branded cameras', content: 'Good news! Starting December 20th, we will start shipping branded cameras!', avatar: 'http://ionicframework.com/img/docs/spengler.jpg'},
    { id: 3, senderName: 'PayPal', subject: 'Payment received from joe@gmail.com', content: 'To see all transaction details, please log into your account.', avatar: 'http://ionicframework.com/img/docs/winston.jpg'},
    { id: 4, senderName: 'Tully', subject: 'Dogs!', content: 'Who brought the dog?!', avatar: 'http://ionicframework.com/img/docs/tully.jpg'},
    { id: 5, senderName: 'Dana', subject: 'I am The Gatekeeper!', content: 'yes, yes I am!', avatar: 'http://ionicframework.com/img/docs/barrett.jpg'},
    { id: 6, senderName: 'Slimer', subject: 'Need help!', content: 'Can you please help me with this thing?', avatar: 'http://ionicframework.com/img/docs/slimer.jpg'},
    { id: 7, senderName: 'Jordan', subject: 'What\'s up?', content: 'We haven\'t met for years!', avatar: 'http://ionicframework.com/img/docs/venkman.jpg'},
    { id: 8, senderName: 'Joe', subject: 'I like trains', content: 'Trains are awesome. I like trains.', avatar: 'http://ionicframework.com/img/docs/spengler.jpg'},
    { id: 9, senderName: 'PayPal', subject: 'Payment received from joe@gmail.com', content: 'To see all transaction details, please log into your account.', avatar: 'http://ionicframework.com/img/docs/winston.jpg'},
    { id: 10, senderName: 'eBay', subject: 'Free shipping on branded cameras', content: 'Good news! Starting December 20th, we will start shipping branded cameras!', avatar: 'http://ionicframework.com/img/docs/spengler.jpg'},
  ];

  return {
    all: function() {
      return cs;
    },
    get: function (cId) {
      // Simple index lookup
      return cs[cId];
    }
  }
});

app.controller('cCtrl', function ($scope, $stateParams, cService) {
    $scope.c = cService.get(params.cId);
});
