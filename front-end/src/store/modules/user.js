import axios from 'axios'

const state = () => ({
    token: localStorage.getItem("token"),
    refresh_token: localStorage.getItem("refresh_token"),
    user_info: JSON.parse(localStorage.getItem("user_info")),
})

const getters = {
    getToken: state => state.token,
    getRefreshToken: state => state.refresh_token,
    getUserInfo: state => state.user_info
}

const mutations = {
    setToken: (state, token) => {
        state.token = token
    },
    setRefreshToken: (state, refreshToken) => {
        state.token = refreshToken
    },
    setUserInfo: (state, userInfo) => {
        state.user_info = userInfo
    }
}

const actions = {
    loginUser: (store, data) => {
        return axios.post('user/login', data)
            .then(res => {
                localStorage.setItem('token', res.data.user.tokenData.token)
                localStorage.setItem('refresh_token', res.data.user.tokenData.refreshToken)
                localStorage.setItem('user_info', JSON.stringify(res.data.user))
                store.commit('setToken', res.data.user.tokenData.token)
                store.commit('setRefreshToken', res.data.user.tokenData.refreshToken)
                store.commit('setUserInfo', res.data.user)
                return res
            })
    },
    getUser: () => {
        return axios.get('user/get-auth-user-info')
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }