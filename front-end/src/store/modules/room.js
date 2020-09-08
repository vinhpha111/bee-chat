import axios from 'axios'

const state = () => ({
    listRoom: []
})

const getters = {
    getListRoom: state => state.listRoom
}

const mutations = {
    setListRoom: (state, listRoom) => {
        state.listRoom = listRoom
    },
    addRoom: (state, room) => {
        state.listRoom.push(room)
    },
}

const actions = {
    getListRoomByUser: () => {
        return axios.get('room/get-list-room-by-user')
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }