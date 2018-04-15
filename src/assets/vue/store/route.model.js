import Vue from 'vue'
import _ from 'lodash'
import * as firebase from 'firebase'

const STATE = {
	Routes: null,
	ActiveRoute: null
}


const GETTERS = {

    Routes: function(state) {
		console.log(state.Routes);
        return state.Routes;
    },

    ActiveRoute: function(state) {
        return state.ActiveRoute;
    },
}


const MUTATIONS = {

    SET_ROUTES(state, routes) {
        state.Routes = routes;
    },
	SET_ACTIVE_ROUTE(state, id) {
        state.ActiveRoute = _.find(state.Routes, function(obj) {
            return obj.AppRouteId === id;
        })
	}
}


const ACTIONS = {

    
    getRoutes({ commit }) {
		firebase.database().ref("AppRoutes")
		.once("value", function(data) {
			const r = data.val();
			let routes = [];
			for(var x in r) {
				r[x].AppRouteId = x;
				routes.push(r[x]);
			}
			commit("SET_ROUTES", routes);
		});
	},
	
	selectActiveRoute({ commit }, id) {
		commit("SET_ACTIVE_ROUTE", id);
	}
}


export default {

    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS

};