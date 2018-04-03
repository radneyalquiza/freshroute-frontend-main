// jquery
import jQuery from "jquery";
global.jQuery = jQuery;

// charting library
// import Raphael from "raphael/raphael";
// global.Raphael = Raphael;

import * as firebase from "firebase";

// Import Vue Maps
// import * as VueGoogleMaps from "vue2-google-maps";

// Import Vue
import Vue from 'vue'

// Import VueX
import Vuex from "vuex";

// Import Framework7
import Framework7 from 'framework7/dist/framework7.esm.bundle.js';

// Import Framework7 Vue
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/dist/css/framework7.css'

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css'

// Import Fontawesome Theme Styles
import FontAwesome from 'font-awesome/css/font-awesome.css'

// Import App Custom Styles
import AppStyles from './assets/sass/main.scss'

// Import vue2 hammer wrapper
import { VueHammer } from "vue2-hammer";

// Import App Component
import app from './main.vue'

// Import Routes
import routes from './routes.js'

// // Import Vuex Storage
// import store from './assets/vuex/storage.js'

// State Management
Vue.use(Vuex);

// VueX Store Modules
import routestore from "./assets/vue/store/route.js";
import userstore from "./assets/vue/store/user.js";
import modelstore from "./assets/vue/store/model.js";

// Install Plugin
Vue.use(Framework7Vue, Framework7);

Vue.use(VueHammer);

// Vue.use(VueGoogleMaps, {
//   load: {
//       key: "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"
//           // libraries: ['maps', 'places', 'geocode']
//   }
// });

var store;
var App;

let theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

document.addEventListener("deviceready", function() {

    window.showPreloader = function(msg) {
      // if (!$(".modal-overlay-visible").length) window.f7.showPreloader(msg);
    };
    window.hidePreloader = function() {
      // if ($(".modal-overlay-visible").length) {
      //     setTimeout(function() {
      //         window.f7.hidePreloader();
      //         $(".modal-overlay-visible").remove();
      //         $(".popup-overlay").remove();
      //     }, 800);
      // }
    };

    store = new Vuex.Store({
        modules: {
            Route: routestore,
            User: userstore,
            Model: modelstore
        },
        strict: true
    });

    console.log('init bro')

    // Init Vue App
    App = new Vue({
      // Root Element
      el: '#app',
      store,
      render: c => c('app'),
      data: {},
      components: {
          app,
      },
      routes,
      framework7: {
          view: {
            pushState: true
          },
          material: true,
          tapHold: true,
          id: 'io.freshroute.app',
          theme: "md", // md or ios
      },
      created() {
          Vue.prototype.$firebase = firebase.initializeApp({
              apiKey: "AIzaSyAA-i7VNULO2EM5KBhxQ2_uXwdlei5DSl4",
              authDomain: "freshroute-ac861.firebaseapp.com",
              databaseURL: "https://freshroute-ac861.firebaseio.com",
              projectId: "freshroute-ac861",
              storageBucket: "freshroute-ac861.appspot.com",
              messagingSenderId: "171839500964"
          });
      }
    });

});