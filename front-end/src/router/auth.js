import store from '../store'
export default async (to, from, next) => {
  store.commit('setLoadingView', true)
  let auth = to.meta.auth
  let currentUser = store.getters.getUserInfo
  if (!currentUser) {
    try {
      const userResponse = await store.dispatch('getUser')
      if (userResponse) {
        currentUser = userResponse.data
        store.commit('setUserInfo', currentUser)

        // join socket
        await store.dispatch('instanceSocket', 'http://127.0.0.1:4000')
        await store.dispatch('emitSocketCallback', {on: 'join', token: store.getters.getToken})
      }
    } catch (error) {
      console.log(error)
    }
  }

  const status = {
    continue: 1,
    home: 2,
    login: 3
  }
  let currenStatus = status.continue
  if (auth) {
    if (!currentUser || auth.indexOf(currentUser.role) === -1) {
      currenStatus = status.login
    }
  } else if (currentUser && to.name === 'Login') {
    currenStatus = status.home
  } else {
    currenStatus = status.continue
  }
  
  // auth in room
  let authInRoom = to.meta.authInRoom
  const roomSlug = to.params.slug
  if (currenStatus === status.continue && authInRoom && roomSlug) {
    let role = null
    try {
      role = await store.dispatch('getRoleInRoom', roomSlug)
    } catch (error) {
      console.log(error) 
    }
    if (!role || (authInRoom.indexOf(role.data) === -1)) {
      currenStatus = status.home
    }
  }
  store.commit('setLoadingView', false)
  switch (currenStatus) {
    case status.continue:
      next()
      break;
    case status.home:
      next({path: '/'})
      break;
    case status.login:
      next({path: '/login'})
      break;
  }
}