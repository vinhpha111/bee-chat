const state = () => ({
    loading: false,
    loadingView: false
})

const getters = {
    getLoading: state => state.loading,
    getLoadingView: state => state.loadingView,
}

const mutations = {
    setLoading: (state, bool) => {
        state.loading = bool
    },
    setLoadingView: (state, bool) => {
        state.loadingView = bool
    }
}

export default {
    state,
    getters,
    mutations
  }