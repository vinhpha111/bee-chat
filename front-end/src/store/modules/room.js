import axios from 'axios'

const state = () => ({
  listRoom: [],
  userContacts: []
})

const getters = {
  getListRoom: state => state.listRoom,
  userContacts: state => state.userContacts
}

const mutations = {
  setListRoom: (state, listRoom) => {
    state.listRoom = listRoom
  },
  addRoom: (state, room) => {
    state.listRoom.push(room)
  },
  setListContact: (state, listContact) => {
    state.userContacts = listContact
  },
  addUserContact: (state, userContact) => {
    state.userContacts.push(userContact)
  },
  increaseNotify: (state, roomId, type = 'normal') => {
    for (let index in state.listRoom) {
      if (state.listRoom[index]._id === roomId && type === 'normal') {
        state.listRoom[index].num_notify_normal ++
      }
      if (state.listRoom[index]._id === roomId && type === 'mention') {
        state.listRoom[index].num_notify_mention ++
      }
    }
  },
  decreaseNotify: (state, roomId, type = 'normal') => {
    for (let index in state.listRoom) {
      if (state.listRoom[index]._id === roomId && type === 'normal' && state.listRoom[index].num_notify_normal > 0) {
        state.listRoom[index].num_notify_normal --
      }
      if (state.listRoom[index]._id === roomId && type === 'mention' && state.listRoom[index].num_notify_mention > 0) {
        state.listRoom[index].num_notify_mention --
      }
    }
  }
}

const actions = {
  getRoomBySlug: (store, slug) => {
    return axios.get(`room/detail/${slug}`)
  },
  getContactBySlug: (store, slug) => {
    return axios.get(`room/contact/${slug}`)
  },
  getListRoomByUser: () => {
    return axios.get('room/get-list-room-by-user')
  },
  getListContactByUser: () => axios.get('room/get-list-contact-by-user'),
  getRoleInRoom: (store, roomSlug) => {
    return axios.get(`room/get-role?roomSlug=${roomSlug}`)
  },
  addNewRoom: (store, data) => {
    return axios.post('room/add', data)
  },
  sendMessageInRoom: (store, data) => {
    return axios.post('room/addMessage', data)
  },
  findOrCreateContactRomm: (store, data) => {
    return axios.get('room/find-or-create-contact-room', {
      params: data
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}