import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import room from './modules/room'
import message from './modules/message'
import loading from './modules/loading'
import sockket from './modules/socket'

Vue.use(Vuex)

let modules = {
    user,
    loading,
    room,
    message,
    sockket
}
const store = new Vuex.Store({
  modules
});

export default store