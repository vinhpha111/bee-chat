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
        if (message) {
            eventBus.$emit('initReplyMessage', message)   
        }
    }
}

const actions = {
    getMessageInRoom: (state, req) => {
        return axios.post('message/get-message-by-slug-room', req)
    },
    addEmojiChar: (state, req) => {
        return axios.post('message/add-emoji-by-char', req)
    },
    removeEmoji: (state, req) => {
        return axios.post('message/remove-emoji', req)
    },
    getMessageById: (state, _id) => {
        return axios.get('message/get-by-id', {
            params: {
                _id
            }
        })
    },
    sendEditMessage: (state, data) => {
        return axios.post('message/edit-message', data)
    },
    deleteMessageNotify: (state, id) => {
        return axios.delete(`message/${id}/remove-notify`)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }