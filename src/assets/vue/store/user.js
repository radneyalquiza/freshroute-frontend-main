import Vue from "vue"
import * as firebase from 'firebase'

const STATE = {
    currentLocation: null,
    LastLogin: null,
    loading: false,
    UserModel: null,
    currentAddress: null,
    GPSGranted: false,
    selectedAppRouteId: null
};

const GETTERS = {
    currentLocation(state) {
        return state.currentLocation;
    },

    gpsGranted(state) {
        return state.GPSGranted;
    },

    loading(state) {
        return state.loading;
    },

    UserModel(state) {
        return state.UserModel;
    },

    LastLogin(state) {
        return state.lastLogin;
    },

    currentAddress(state) {
        return state.currentAddress;
    },

    Routes(state) {
        return state.MyRoutes;
    },

    selectedAppRouteId(state) {
        return state.selectedAppRouteId;
    }
};

const MUTATIONS = {
    setCurrentLocation(state, locdata) {
        if (locdata) {
            state.currentLocation = locdata;
        }
    },

    setGPSGranted(state, granted) {
        state.GPSGranted = granted;
    },

    setLoading(state, status) {
        if (typeof status == 'boolean') state.loading = status;
    },

    setUserModel(state, umodel) {
        state.UserModel = umodel;
    },

    setAddress(state, address) {
        state.currentAddress = address;
    },

    setUserRoutes(state, routes) {
        state.MyRoutes = routes;
    },

    setSelectedAppRouteId(state, id) {
        state.selectedAppRouteId = id;
    }
};

const ACTIONS = {
    getCurrentLocation({ commit, getters }, handlers) {
        if (getters.loading == true) return;

        commit("setLoading", true);

        // commit("setLoading", false);
        // commit("setCurrentLocation", {
        //     lat: 44.19271,
        //     lng: -79.14355
        // });

        // setTimeout(function() {
        //     if (typeof onsuccess == "function") onsuccess();
        // }, 1);

        if(device.platform !== "browser") {
            checkAvailability(_getGPS, handlers.fail);
        }
        else
            _getGPS();


        function _getGPS() {
            navigator.geolocation.getCurrentPosition(function(pos) {
                if (pos && pos.coords) {
                    commit('setLoading', false);
                    commit("setCurrentLocation", {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                    commit('setGPSGranted', true);
                    if (typeof handlers.success == "function") handlers.success();
                }
            }, function(err) {
                commit('setLoading', false);
                if (typeof handlers.fail == "function")
                    handlers.fail(err);
            })
        }

        // navigator.geolocation.watchPosition(
        //     function(pos) {
        //         if (pos && pos.coords) {
        //             console.log(pos);
        //             commit('setLoading', false);
        //             commit("setCurrentLocation", {
        //                 lat: pos.coords.latitude,
        //                 lng: pos.coords.longitude
        //             });
        //             if (typeof onsuccess == "function") onsuccess();
        //         }
        //     },
        //     function(err) {
        //         console.log(err);
        //         commit('setLoading', false);
        //         if (typeof onfail == "function")
        //             onfail(err);
        //     }, { enableHighAccuracy: true }
        // );
    },

    getCurrentAddress({ commit, getters }) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: getters.currentLocation }, function(
            results,
            status
        ) {
            if (status === "OK") {
                if (results[1]) {
                    // instance.CurrentLocation = results[1].formatted_address;
                    commit("setAddress", results[1].formatted_address);
                }
            }
        });
    },

    findUser({ commit, getters }, payload) {
        return new Promise(function(resolve, reject) {
            if (typeof payload == 'string') {
                let v = firebase.database().ref("AppUsers/" + payload)
                .once("value", function(a) {
                    console.log(a.val());
                });
            }
            else if (typeof payload == "object") {
                let v = firebase.database().ref("AppUsers")
                .orderByChild("username")
                .limitToFirst(1)
                .once("value", function(b) {
                    console.log(b.val());
                });
            }




            // v.then(function(data) {
            //         const users = data.val();
            //         if (typeof payload == 'string') {
            //             let id = payload;
            //             for (var key in users) {
            //                 if (key == id) {
            //                     commit("setUserModel", Object.assign({}, users[key], { id: key }));
            //                     resolve({ id: key, user: users[key] });
            //                     break;
            //                 }
            //             }
            //             reject();

            //         } else if (typeof payload == "object") {
            //             let usr = payload.username;
            //             let pass = payload.password;
            //             for (var key in users) {
            //                 if (users[key].UserName == usr &&
            //                     users[key].Password == pass) {
            //                     commit("setUserModel", Object.assign({}, users[key], { id: key }));
            //                     resolve({ id: key, user: users[key] });
            //                     break;
            //                 }
            //             }
            //             reject();
            //         }
            //     })
            //     .catch(function(err) {
            //         reject(err);
            //     });
        });

    },

    setSelectedAppRouteId({ commit }, id) {
        commit('setSelectedAppRouteId', id);
    }
};


// NOTE!!!!!!!!!!!!!!
// If getting issues in the future with iOS, check this https://stackoverflow.com/a/43882878
// NOTE!!!!!!!!!!!!!!
function checkAvailability(getGPSFn, failGetFn){
    cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
        if(!available){
           checkAuthorization(getGPSFn, failGetFn);
        }else{
            if(typeof getGPSFn == "function")
                getGPSFn();
        }
    }, function(error){
        if(typeof failGetFn == "function")
            failGetFn();
    });
}

function checkAuthorization(getGPSFn, failGetFn){
    cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
        if(authorized){
            checkDeviceSetting(getGPSFn, failGetFn);
        }else{
            cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                switch(status){
                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        checkDeviceSetting(getGPSFn, failGetFn);
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        if(typeof failGetFn == "function")
                            failGetFn();
                        // User denied permission
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                        if(typeof failGetFn == "function")
                            failGetFn();
                        // User denied permission permanently
                        break;
                }
            }, function(error){
                if(typeof failGetFn == "function")
                    failGetFn();
            });
        }
    }, function(error){
        if(typeof failGetFn == "function")
            failGetFn();
    });
}

function checkDeviceSetting(getGPSFn, failGetFn){
    cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
        if(!enabled){
            cordova.plugins.locationAccuracy.request(function (success){
                if(typeof getGPSFn == "function")
                    getGPSFn();
            }, function onRequestFailure(error){
                if(typeof failGetFn == "function")
                    failGetFn();

                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                    if(confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                        cordova.plugins.diagnostic.switchToLocationSettings();
                        // check again
                        checkAvailability(getGPSFn, failGetFn);
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        } else {
            if(typeof getGPSFn == "function")
                getGPSFn();
        }
    }, function(error){
        if(typeof failGetFn == "function")
            failGetFn();
    });
}


export default {
    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS
}