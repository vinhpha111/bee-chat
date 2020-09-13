import axios from 'axios'

const state = () => ({
    token: localStorage.getItem("token"),
    refresh_token: localStorage.getItem("refresh_token"),
    user_info: null,
    beingRefreshToken: false
})

const getters = {
    getToken: state => state.token,
    getRefreshToken: state => state.refresh_token,
    getUserInfo: state => state.user_info,
    beingRefreshToken: state => state.beingRefreshToken
}

const mutations = {
    setToken: (state, token) => {
        localStorage.setItem('token', token)
        state.token = token
    },
    setRefreshToken: (state, refreshToken) => {
        localStorage.setItem('refresh_token', refreshToken)
        state.token = refreshToken
    },
    setUserInfo: (state, userInfo) => {
        state.user_info = userInfo
    },
    setBeingRefreshToken: (state, bool) => {
        state.beingRefreshToken = bool
    }
}

const actions = {
    loginUser: (store, data) => {
        return axios.post('user/login', data)
            .then(res => {
                store.commit('setToken', res.data.user.tokenData.token)
                store.commit('setRefreshToken', res.data.user.tokenData.refreshToken)
                store.commit('setUserInfo', res.data.user)
                return res
            })
    },
    getUser: () => {
        return axios.get('user/get-auth-user-info')
    },
    getToken: (store) => {
        return axios.post('user/get-token', { refreshToken: store.getters.getRefreshToken })
    },
    findUserByString: (store, str) => {
        return axios.get('user/find-by-string', {
            params: {
                str: str
            }
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }