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
    },
    getRoleInRoom: (store, roomSlug) => {
        return axios.get(`room/get-role?roomSlug=${roomSlug}`)
    },
    addNewRoom: (store, data) => {
        return axios.post('room/add', data)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
  }