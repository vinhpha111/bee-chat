import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import room from './modules/room'
import loading from './modules/loading'

Vue.use(Vuex)

let modules = {
    user,
    loading,
    room
}
const store = new Vuex.Store({
  modules
});

export default store