const state = () => ({
    loading: false
})

const getters = {
    getLoading: state => state.loading,
}

const mutations = {
    setLoading: (state, bool) => {
        state.loading = bool
    }
}

export default {
    state,
    getters,
    mutations
  }