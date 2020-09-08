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
    getMessageInRoom: (state, slug) => {
        return axios.get('message/get-message-by-slug-room', {
            params: {
                slugRoom: slug
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