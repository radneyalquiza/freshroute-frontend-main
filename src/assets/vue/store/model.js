import Vue from 'vue'

// temporary until we can use HTTP
import Model from '../../../assets/js/atlas-identity-model.js'
import _ from 'lodash'

const STATE = {
    Model: null,
    UserModel: null,
    loading: false
}


const GETTERS = {
    Model(state) {
        return state.Model;
    },
    UserModel(state) {
        return state.UserModel;
    },
    loading(state) {
        return state.loading;
    }
}


const MUTATIONS = {
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

    getModelData({ commit }) {
        commit('setModel', Model);
    },

}


export default {

    namespaced: true,
    state: STATE,
    getters: GETTERS,
    actions: ACTIONS,
    mutations: MUTATIONS

};