import io from "socket.io-client"

const STATUS_EMIT = {
  PENDING: 0,
  SUCCESS: 200,
  EXPIRED: 490,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TIMEOUT: 408
}

const state = {
  socket: null,
  socketBeingEmit: {},
}

const getters = {
  getSocket: state => state.socket,
  getSocketBeingEmit: state => state.socketBeingEmit,
}

const mutations = {
  changeSocketBeingEmit: (state, {index, data}) => {
    state.socketBeingEmit[index] = data;
  },
  removeSocketBeingEmit: (state, index) => {
    delete state.socketBeingEmit[index];
  },
};

const actions = {
  instanceSocket: async ({ state, dispatch }, path) => {
    state.socket = io(path);
    dispatch('onSocketUpdateBeingEmit')
  },

  onSocket: ({ getters }, conf) => {
    return getters.getSocket.on(conf.on, conf.callback);
  },

  onSocketUpdateBeingEmit: (store) => {
    store.getters.getSocket.on("updateSocketBeingEmit", (res) => {
      store.commit("changeSocketBeingEmit", { index: res.index, data:res });
    });
  },

  emitSocket: ({ getters }, conf) => {
    getters.getSocket.emit(conf.on, conf);
  },

  removeListenSocket: ({ getters }, eventOn) => {
    getters.getSocket.off(eventOn);
  },

  emitSocketCallback: (store, conf) => {
    return new Promise((resolve, reject) => {
      // emit socket
      const index = new Date().getTime();
      store.commit("changeSocketBeingEmit", { index, data: { status: STATUS_EMIT.PENDING } });
      conf.index = index
      store.dispatch("emitSocket", conf);

      // waiting socket response
      let socketBeingEmit = null
      const currentTime = new Date().getTime();
      let period = 0; // second
      setInterval(function(){
        period = (new Date().getTime() - currentTime) / 1000;
        socketBeingEmit = store.getters.getSocketBeingEmit[index];
        if (!(socketBeingEmit && socketBeingEmit.status === STATUS_EMIT.PENDING && period < 20)) {
          let dataResponse = store.getters.getSocketBeingEmit[index];
          if (dataResponse && dataResponse.status === STATUS_EMIT.PENDING) {
            dataResponse.status = STATUS_EMIT.TIMEOUT;
          }
          store.commit("removeSocketBeingEmit", index);

          // return response data
          if (dataResponse && dataResponse.status === STATUS_EMIT.SUCCESS) {
            resolve(dataResponse);
          }
          reject(new Error(400));
        }
      })
    })
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}