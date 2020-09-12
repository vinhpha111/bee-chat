import axios from 'axios'

const state = () => ({
    messageInRoom: {}
})

const getters = {
    getMessageInRoom: state => (roomId) => {
        return state.messageInRoom[roomId] || []
    }
}

const mutations = {
    
}

const actions = {
    getMessageInRoom: (state, req) => {
        return axios.post('message/get-message-by-slug-room', req)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }