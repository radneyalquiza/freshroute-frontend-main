import Vue from 'vue'
import moment from 'moment'
import * as firebase from 'firebase'

// temporary until we can use HTTP
import RouteModel from '../../../assets/js/atlas-job-model.js'
import GoogleMapsLoader from "google-maps"
import axios from 'axios'

const gmapkey = "AIzaSyBLXvlal6niC0b49NWSorcdFV9cQT3Y754"

// ---------------------------------------------------------------------------------------
const RouteStatus = {
    STOP: 0,
    PAUSE: 1,
    PLAY: 2,
    DONE: 3
};
const LocationStatus = {
    INCOMPLETE: 0,
    DOING: 1,
    COMPLETE: 2,
    ACTIVE: 3,
    // OPENED: 4,
    DONE: 5
};
// ---------------------------------------------------------------------------------------

const STATE = {

    Route: [], // array of AppAddress objects
    RouteName: "", // custom name for the route, for user identification
    started: false, // state of the route if started or not

    // follows the sort order of state.Route. Each address has 1 marker object
    Markers: [],

    RouteDateTimeStarted: null,
    RouteCompleteSaved: false,
    RouteTempSaved: false,
    RoutePaused: false,
    Center: null,
    current: 0,
    RouteStatus: 0,

    Workers: [],

    // property currently open in the active-location component
    activeLocation: null,
    locationopened: false,
    whereyouare: null,

    ExternalExpenses: []

    // each element in Route[] will contain various timings apart from the actual address
}



const GETTERS = {
    Route: function(state) {
        return state.Route;
    },
    RouteName: function(state) {
        return state.RouteName;
    },
    started: function(state) {
        return state.started;
    },
    Markers: function(state) {
        return state.Markers;
    },
    Clients: function(state, getters, root) {
        return;
    },
    Center: function(state) {
        return state.Center;
    },
    current: function(state) {
        return state.current;
    },
    activeLocation: function(state) {
        var loc = _.find(state.Route, function(obj) {
            return obj.Status == LocationStatus.ACTIVE || obj.Status == LocationStatus.DOING || obj.Status == LocationStatus.OPENED;
        });
        if (loc) return loc;
    },
    locationopened: function(state) {
        return state.locationopened;
    },
    whereyouare: function(state) {
        return state.whereyouare;
    },
    RouteStatus: function(state) {
        return state.RouteStatus;
    },
    // expose statuses
    LocationStatus: function(state) {
        return LocationStatus;
    },

    ExternalExpenses: function(state) {
        return state.ExternalExpenses;
    },
    Workers: function(state) {
        return state.Workers;
    }
}


const MUTATIONS = {
    UPDATE_LOCATION: function(state, payload) {

    },
    SET_ROUTE_NAME: function(state, name) {
        console.log(name);
        if (name)
            state.RouteName = name;
    },
    SET_ROUTE_WORKERS: function(state, payload) {
        state.Workers = payload;
    },
    // just a list of address id's
    SET_ADDRESSES: function(state, addresses) {
        if (addresses) {
            state.Route = addresses.map(function(obj) {
                return Object.assign({}, obj, MUTATION_HELPERS.LocationEmptyState);
            });
        }
    },
    INIT_ADDRESS_AS_LOCATION: function(state, payload) {
        var route = state.Route[payload.sequence];
        route = _.extend(route, payload.address);
        // delete route.AppAddresses;
    },
    INIT_CLIENT_AS_LOCATION: function(state, payload) {
        var route = state.Route[payload.sequence];
        route = _.extend(route, payload.client);
        // delete route.AppAddresses;
    },
    SORT: function(state) {
        if (state && state.Route)
            state.Route = _.orderBy(state.Route, ['Sequence'], ['asc']);
    },

    UPDATE_LOCATION_POSITION: function(state, payload) {
        var p = state.Route[payload.sequence];
        // update the Location property for an address
        Vue.set(p, "Location", payload.position);
    },
    UPDATE_ROUTE_CENTER: function(state, payload) {
        state.Center = payload.position;
    },
    UPDATE_ROUTE_MARKERS: function(state, payload) {
        // add or replace route marker
        Vue.set(state.Markers, payload.sequence, { position: payload.position });
    },

    UPDATE_ROUTE_STATUS: function(state, payload) {
        state.RouteStatus = payload.status;
    },

    SET_ACTIVE_LOCATION: function(state, payload) {
        state.activeLocation = state.Route[payload.sequence];
        state.locationopened = true;
    },

    UPDATE_PROPERTY_STATUS: function(state, payload) {
        console.log(state.Route[payload.sequence], state.Route, payload);
        if (state.Route[payload.sequence].Status == LocationStatus.DOING && payload.status == LocationStatus.ACTIVE) { return; }
        state.Route[payload.sequence].Status = payload.status;
    },

    UPDATE_WEATHER: function(state, payload) {
        state.Route[payload.sequence].Weather = payload.weather;
    },

    SET_WHERE_YOU_ARE: function(state, payload) {
        state.whereyouare = payload.whereyouare;
    },

    START_PROPERTY: function(state, payload) {
        var p = state.Route[payload.sequence];
        Vue.set(p, "JobData", {
            Paused: false,
            Timer: null, // actual display
            TimeStarted: null,
            CurrentTime: null,
            CurrentPauseTime: null,
            IntervalObject: null,
            PauseIntervalObject: null,
            TotalJobTime: 0,
            PauseTimer: null,
            PauseStartTime: null,
            PauseEndTime: null,
            TotalPauseTime: 0,
            TempPauseTime: 0,
            DateTimeStarted: null,
            DateTimeEnded: null,
            TotalJobTimeText: null
        });
        p.JobData.TimeStarted = Date.now();
        p.JobData.CurrentTime = Date.now();
        p.JobData.DateTimeStarted = moment().format('LT');
        p.Status = LocationStatus.DOING;
    },
    STOP_PROPERTY: function(state, payload) {
        var p = state.Route[payload.sequence];
        clearInterval(p.JobData.IntervalObject);
        p.JobData.DateTimeEnded = moment().format('LT');
        p.Status = LocationStatus.DONE;
    },
    SET_PROPERTY_TIMER: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.IntervalObject = payload.interval;
    },
    PAUSE_PROPERTY: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.Paused = true;
        p.JobData.PauseStartTime = Date.now();
        p.JobData.CurrentPauseTime = Date.now();

        if (!p.JobData.PauseIntervalObject)
            p.JobData.PauseIntervalObject = payload.interval;
        else
            clearInterval(payload.interval);
    },
    UNPAUSE_PROPERTY: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.Paused = false;
        if (p.JobData.TempPauseTime)
            p.JobData.TotalPauseTime += p.JobData.TempPauseTime;
    },
    UPDATE_TIMER: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.CurrentTime = Date.now();

        if (p.JobData.Paused != true) {
            // in milliseconds
            p.JobData.TotalJobTime = MUTATION_HELPERS.timeElapsed(
                p.JobData.CurrentTime,
                p.JobData.TimeStarted
            );

            if (p.JobData.TotalPauseTime)
                p.JobData.TotalJobTime -= p.JobData.TotalPauseTime;

            p.JobData.Timer = MUTATION_HELPERS.formatTimer(p.JobData.TotalJobTime);
        }

    },
    UPDATE_PAUSE_TIMER: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.CurrentPauseTime = Date.now();

        if (p.JobData.Paused == true) {
            // in milliseconds
            p.JobData.TempPauseTime = MUTATION_HELPERS.timeElapsed(
                p.JobData.CurrentPauseTime,
                p.JobData.PauseStartTime
            );
            p.JobData.PauseTimer = MUTATION_HELPERS.formatTimer(p.JobData.TempPauseTime);
        }
    },

    CLOSE_PROPERTY: function(state, payload) {
        state.locationopened = false;
        // state.activeLocation.Status = LocationStatus.ACTIVE;
        // state.activeLocation = null;
    },

    END_PROPERTY: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.Status = LocationStatus.COMPLETE;
    },
    JOB_COMPLETE: function(state, payload) {
        var p = state.Route[payload.sequence];
        p.JobData.TotalJobTimeText = MUTATION_HELPERS.formatTimer(p.JobData.TotalJobTime);
    },

    NEXT: function(state) {
        console.log(state.current, state.Route.length)
        if(state.current >= state.Route.length-1) return;
        state.current++;
        state.activeLocation = state.Route[state.current];
    },

    ADD_EXPENSE: function(state, payload) {
        state.ExternalExpenses.push(payload);
    }
}

const ACTIONS = {
    setRoute({ commit }, route) {
        if (route)
            commit('SET_ROUTE', route);
    },
    getRouteData({ commit, getters, dispatch, rootGetters }, approuteid) {

        firebase.database().ref("AppRoutes/" + approuteid)
            .once("value", function(data) {

                let RouteModel = data.val();

                commit('SET_ADDRESSES', RouteModel.Nodes);
                commit('SORT');

                var route = getters.Route;

                for (var x = 0; x < route.length; x++) {
                    (function(idx) {
                        firebase.database().ref('AppClients/' + route[idx].ClientId)
                            .once("value", function(data) {
                                let c = data.val();
                                commit('INIT_CLIENT_AS_LOCATION', {
                                    sequence: idx,
                                    client: c
                                });

                            });
                        firebase.database().ref('AppAddresses/' + route[idx].AddressId)
                            .once("value", function(data) {
                                let a = data.val();
                                commit('INIT_ADDRESS_AS_LOCATION', {
                                    sequence: idx,
                                    address: a
                                });
                                commit('UPDATE_ROUTE_MARKERS', {
                                    sequence: idx,
                                    position: { 
                                        lat: a.lat,
                                        lng: a.lng
                                    }
                                });

                                if(idx == route.length-1)
                                {
                                    let routecenter = {
                                        position: rootGetters['User/currentLocation'],
                                        sequence: idx+1
                                    }
                                    commit('UPDATE_ROUTE_MARKERS', routecenter);
                                    commit('UPDATE_ROUTE_CENTER', routecenter );
                                }
                            });
                    })(x);
                }
                commit('SET_ROUTE_NAME', RouteModel.Name);
                commit('SET_ROUTE_WORKERS', RouteModel.Workers);
            });

    },
    sortRoute({ commit }) {
        commit('SORT');
    },

    // get long/lat for newly added route addresses
    getGeoLocation({ commit, getters, rootGetters }) {
        let geocoder = new google.maps.Geocoder();
        var route = getters.Route;
        for (var idx = 0; idx < route.length; idx++) {
            (function(i) {
                geocoder.geocode({ 'address': route[i].Street + " " + route[i].City + " " + route[i].PostalCode },
                    function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var latitude = results[0].geometry.location.lat();
                            var longitude = results[0].geometry.location.lng();
                            var position = { lat: latitude, lng: longitude };

                            commit('UPDATE_LOCATION_POSITION', {
                                sequence: i,
                                position: position
                            })

                            Vue.set(route[i], "Location", position);

                            // supposed to push into route markers, but async so just send the sequence too
                            commit('UPDATE_ROUTE_MARKERS', {
                                sequence: i,
                                position: position
                            });

                            // initially set the center to the user's location
                            if (i == (route.length - 1)) {
                                commit('UPDATE_ROUTE_CENTER', {
                                    position: rootGetters['User/currentLocation'],
                                    sequence: route.length
                                });
                                commit('UPDATE_ROUTE_MARKERS', {
                                    sequence: route.length,
                                    position: rootGetters['User/currentLocation']
                                });
                            }
                        } else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
            })(idx);
        }
    },

    startRoute({ commit }) {
        commit('UPDATE_ROUTE_STATUS', {
            status: RouteStatus.PLAY
        });
    },
    endRoute({ commit }) {
        commit('UPDATE_ROUTE_STATUS', {
            status: RouteStatus.DONE
        });
    },

    // WE NEED TO PASS A SEQUENCE NUMBER HERE
    enableProperty({ commit }, payload) {
        commit('UPDATE_PROPERTY_STATUS', {
            status: LocationStatus.ACTIVE,
            sequence: payload.sequence
        });
        if(typeof payload.callback == 'function')
            payload.callback();
    },

    // WE NEED TO PASS A SEQUENCE NUMBER HERE
    openProperty({ commit, getters }, sequence) {
        // commit('UPDATE_PROPERTY_STATUS', {
        //     status: LocationStatus.ACTIVE,
        //     sequence: sequence
        // });
        commit('SET_ACTIVE_LOCATION', { sequence: sequence });
        commit('UPDATE_ROUTE_CENTER', {
            position: { lat: getters.activeLocation.lat, lng: getters.activeLocation.lng },
            sequence: sequence
        });
    },

    updateWeather({ commit, getters }) {
        var al = ACTION_HELPERS.getOpened(getters.Route);
        console.log(al);

        axios.get("http://api.openweathermap.org/data/2.5/weather", {
            params: {
                units: "metric",
                lat: al.lat,
                lon: al.lng,
                APPID: "be03f14ebd1f48d5e5a22c551ac78bda"
            }
        }).then(function(response) {
            if (response) {
                console.log('rrrr', response)
                let weather = response.data;
                if(weather)
                    commit('UPDATE_WEATHER', {
                        sequence: al.Sequence,
                        weather: weather
                    })
            }
        }).catch(function(e) {
            console.log('Failed to get Weather', e);
        })

        // Dom7.ajax({
        //     url: "http://api.openweathermap.org/data/2.5/weather",
        //     method: "GET",
        //     dataType: "json",
        //     data: {
        //         units: "metric",
        //         lat: al.Location.lat,
        //         lon: al.Location.lng,
        //         APPID: "be03f14ebd1f48d5e5a22c551ac78bda"
        //     },
        //     contentType: "application/json",
        //     success: function(response) {
        //         if (response) {
        //             commit('UPDATE_WEATHER', {
        //                 sequence: al.Sequence,
        //                 weather: response
        //             })
        //         }
        //     }
        // });
    },

    getDistanceFromLocation({ commit, getters }, payload) {
        var al = ACTION_HELPERS.getOpened(getters.Route);

        if(!payload.userlocation) return;

        let cb = payload.callback;

        GoogleMapsLoader.KEY = gmapkey;
        GoogleMapsLoader.load(function(google) {
            var service = new google.maps.DistanceMatrixService();
            var geocoder = new google.maps.Geocoder();

            console.log("qwqwqqwq", typeof cb)
    
            geocoder.geocode({ 'location': { lat: al.lat, lng: al.lng } }, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        // instance.CurrentLocation = results[1].formatted_address;
                        commit('SET_WHERE_YOU_ARE', {
                            whereyouare: results[1].formatted_address
                        })
                        service.getDistanceMatrix({
                            origins: [new google.maps.LatLng(payload.userlocation.lat, payload.userlocation.lng)],
                            destinations: [new google.maps.LatLng(al.lat, al.lng)],
                            travelMode: 'DRIVING',
                            unitSystem: google.maps.UnitSystem.METRIC
                        }, function(result, status) {
                            console.log('no?', result)
                            if (status == "OK" && result) {
                                console.log('vvvv', result.rows, typeof cb);
                                if (result.rows) {
                                    if (typeof cb == "function") {
                                        console.log('call bro');
                                        cb(result);
                                    }
                                }
                            }
                        });
    
                    }
                } else {
                    if (typeof cb == "function") cb(status)
                }
    
            });
        });
    },


    // TIMER RELATED ACTIONS
    startPropertyTimer({ commit, getters, dispatch }, sequence) {
        commit('START_PROPERTY', { sequence: sequence });
        var i = setInterval(function() {
            commit('UPDATE_TIMER', { sequence: sequence });
        }, 1000);

        commit('SET_PROPERTY_TIMER', { sequence: sequence, interval: i });
    },
    stopTimer({ commit }, sequence) {
        console.log('stop bro')
        commit('STOP_PROPERTY', { sequence: sequence });
    },
    pauseTimer({ commit }, sequence) {
        var x = setInterval(function() {
            commit('UPDATE_PAUSE_TIMER', { sequence: sequence });
        }, 1000);
        commit('PAUSE_PROPERTY', { sequence: sequence, interval: x });
    },
    unpauseTimer({ commit }, sequence) {
        commit('UNPAUSE_PROPERTY', { sequence: sequence })
    },

    completeProperty({ commit }, sequence) {
        commit('END_PROPERTY', { sequence: sequence });
        commit('STOP_PROPERTY', { sequence: sequence });
    },
    closeProperty({ commit, rootGetters }) {
        commit('CLOSE_PROPERTY');
        commit('UPDATE_ROUTE_CENTER', {
            position: rootGetters['User/currentLocation']
        });
    },
    jobComplete({ commit }, sequence) {
        commit('CLOSE_PROPERTY', { sequence: sequence })
        commit('UPDATE_PROPERTY_STATUS', {
            status: LocationStatus.COMPLETE,
            sequence: sequence
        });
        commit('JOB_COMPLETE', { sequence: sequence })
    },

    next({ commit }) {
        commit('NEXT');
    },

    addExternalExpense({ commit }, payload) {
        commit('ADD_EXPENSE', payload);
    },

    addPropertyToRoute({ commit }, payload) {

    }
}


export default {
    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS
};

const ACTION_HELPERS = {
    getOpened: function(route) {
        var loc = _.find(route, function(obj) {
            return obj.Status == LocationStatus.ACTIVE || obj.Status == LocationStatus.DOING;
        })
        if (loc) return loc;
    }
}
const MUTATION_HELPERS = {
    formatTimer: function(milliseconds) {

        var seconds = Math.ceil((milliseconds / 1000) % 60);
        seconds = seconds >= 10 ? seconds : '0' + seconds;

        var minutes = Math.floor((milliseconds / 1000 / 60) % 60);
        minutes = minutes >= 10 ? minutes : '0' + minutes;

        var hours = Math.floor((milliseconds / 1000 / 60 / 60));
        hours = hours >= 10 ? hours : '0' + hours;

        return hours + ':' + minutes + ':' + seconds;
    },
    // in milliseconds
    timeElapsed: function(currenttime, starttime) {
        return currenttime - starttime;
    },
    JobDataEmptyState: {
        Paused: false,
        Timer: null, // actual display
        TimeStarted: null,
        CurrentTime: null,
        CurrentPauseTime: null,
        IntervalObject: null,
        PauseIntervalObject: null,
        TotalJobTime: 0,
        PauseTimer: null,
        PauseStartTime: null,
        PauseEndTime: null,
        TotalPauseTime: 0,
        TempPauseTime: 0,
        DateTimeStarted: null,
        DateTimeEnded: null,
        TotalJobTimeText: null
    },
    LocationEmptyState: {
        Status: LocationStatus.INCOMPLETE,
        Skipped: false,
        Expand: false,
        Location: null,
        Weather: null,
        StartTime: null,
        EndTime: null,
        Expenses: null,
        JobData: null
    }
}