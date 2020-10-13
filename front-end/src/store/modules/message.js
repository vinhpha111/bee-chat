import axios from 'axios'
import eventBus from '../../helper/eventBus'

const state = () => ({
    messageInRoom: {},
    messageReply: null
})

const getters = {
    getMessageInRoom: state => (roomId) => {
        return state.messageInRoom[roomId] || []
    },
    getMessageReply: state => state.messageReply
}

const mutations = {
    setMessageReply: (state, message) => {
        state.messageReply = message
        eventBus.$emit('initReplyMessage', message)
    }
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