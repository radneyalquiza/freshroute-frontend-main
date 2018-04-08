import Vue from "vue"
import * as firebase from 'firebase'

const STATE = {
    currentLocation: null,
    LastLogin: null,
    loading: false,
    UserModel: null,
    currentAddress: null,
    MyRoutes: [],
    selectedAppRouteId: null
};

const GETTERS = {
    currentLocation(state) {
        return state.currentLocation;
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
    getCurrentLocation({ commit, getters }, onsuccess, onfail) {
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

        navigator.geolocation.getCurrentPosition(function(pos) {
            if (pos && pos.coords) {
                console.log(pos);
                commit('setLoading', false);
                commit("setCurrentLocation", {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                if (typeof onsuccess == "function") onsuccess();
            }
        }, function(err) {
            console.log(err);
            commit('setLoading', false);
            if (typeof onfail == "function")
                onfail(err);
        })

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
            let v = firebase.database().ref("AppUsers").once("value");
            v.then(function(data) {
                    const users = data.val();
                    if (typeof payload == 'string') {
                        let id = payload;
                        for (var key in users) {
                            if (key == id) {
                                commit("setUserModel", Object.assign({}, users[key], { id: key }));
                                resolve({ id: key, user: users[key] });
                                break;
                            }
                        }
                        reject();

                    } else if (typeof payload == "object") {
                        let usr = payload.username;
                        let pass = payload.password;
                        console.log('look for', usr, pass)
                        for (var key in users) {
                            if (users[key].UserName == usr &&
                                users[key].Password == pass) {
                                console.log("qwqwqq", usr, pass)
                                commit("setUserModel", Object.assign({}, users[key], { id: key }));
                                resolve({ id: key, user: users[key] });
                                break;
                            }
                        }
                        reject();
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });

    },

    getRoutesOfUser({ commit }, payload) {

        firebase.database().ref('AppUserRoutes').
        orderByChild('AppUserId').
        equalTo(payload).
        once("value", function(data) {
            let r = data.val();
            let routes = [];
            for (var x in r)
                for (var p in r[x].AppRoutes)
                    routes.push({ RouteName: r[x].AppRoutes[p], AppRouteId: p });
            commit('setUserRoutes', routes);

        });
    },

    setSelectedAppRouteId({ commit }, id) {
        commit('setSelectedAppRouteId', id);
    }
};

export default {
    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS
}