import Vue from 'vue'
import _ from 'lodash'
import * as firebase from 'firebase'

const STATE = {
    Clients: [],
    Services: []
}


const GETTERS = {

    Clients: function(state) {
        return state.Clients;
    },

    Services: function(state) {
        return state.Services;
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
    }
}


const ACTIONS = {

    getClientsAndAddresses({ commit }, cb) {

        let promise = firebase.database()
            .ref("AppClients")
            .orderByKey()
            // get array of clients
            .on("value", async function(data) {
                let cs = data.val();
                let clients = [];
                console.log('ssss', cs)

                if(cs) {
                    for(var x in cs) {
                        cs[x].AppClientId = x;
                        await firebase.database()
                            .ref("AppAddresses")
                            .orderByChild("AppClientId")
                            .limitToFirst(1)
                            .once("value", function(address) {
                                let a = address.val();
                                cs[x].AppAddresses = [];
                                for(var p in a) {
                                    a[p].AppAddressId = p;
                                    cs[x].AppAddresses.push(a[p]);
                                }
                                clients.push(cs[x]);
                                console.log('dddd', clients);

                            })
                    }
                }

                if(typeof cb == "function")
                    cb();
                commit("SET_CLIENTS", clients);

            });
        return promise;

    },

}


export default {

    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS

};