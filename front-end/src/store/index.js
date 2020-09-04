import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import loading from './modules/loading'

Vue.use(Vuex)

let modules = {
    user,
    loading
}
const store = new Vuex.Store({
  modules
});

export default store