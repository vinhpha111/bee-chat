const state = () => ({
    type: null // reply, search,...
})

const getters = {
    getType: state => state.type,
}

const mutations = {
    setType: (state, type) => {
		state.type = type
    },
}

export default {
	namespaced: true,
    state,
    getters,
    mutations
  }