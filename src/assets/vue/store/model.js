import Vue from 'vue'
import _ from 'lodash'
import * as firebase from 'firebase'

const STATE = {
    Clients: [],
    Services: [],
    ActiveClient: null
}


const GETTERS = {

    Clients: function(state) {
        return state.Clients;
    },

    Services: function(state) {
        return state.Services;
    },

    ActiveClient: function(state) {
        return state.ActiveClient;
    }
}


const MUTATIONS = {

    SET_CLIENTS(state, clients) {
        state.Clients = clients;
    },

    setModel(state, model) {
        if (model)
            state.Model = model;
    },
    setUserModel(state, umodel) {
        if (umodel)
            state.UserModel = umodel;
    },
    SET_ACTIVE_CLIENT(state, appclientid) {
        state.ActiveClient = _.find(state.Clients, function(obj) {
            return obj.AppClientId === appclientid;
        })
    },
    UNSET_ACTIVE_CLIENT(state) {
        state.ActiveClient = null;
    }
}


const ACTIONS = {

    getClientsAddresses({ commit }, cb) {

        let promise = firebase.database()
            .ref("AppClients")
            .orderByKey()
            // get array of clients
            .on("value", async function(data) {
                let cs = data.val();
                let clients = [];
                if(cs) {
                    for(var x in cs) {
                        cs[x].AppClientId = x;
                        clients.push(cs[x]);
                    }
                }

                if(typeof cb == "function")
                    cb();
                commit("SET_CLIENTS", clients);

            });
        return promise;

    },

    getClient({ commit }, id) {
        firebase.database()
            .ref("AppClients/"+id)
            // get array of clients
            .on("value", function(data) {
                let cs = data.val();
                if(cs) {
                    for(var x in cs) {
                        commit("SET_ACTIVE_CLIENT", cs[x]);
                    }
                }

            });
    },

    selectClient({ commit }, appclientid) {
        commit("SET_ACTIVE_CLIENT", appclientid);
    },

    deselectClient({ commit }) {
        commit("UNSET_ACTIVE_CLIENT");
    }
}


export default {

    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS

};