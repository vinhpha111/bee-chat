module.exports = {
  ROLE_OF_USER: {
    ADMIN: 1,
    GUEST: 2
  },
  ROLE_IN_ROOM: {
    ADMIN: 1,
    GUEST: 2
  },
  TYPE_OF_MESSAGE: {
    IN_ROOM: 1,
    IN_USER: 2
  },
  TYPE_EMIT_TO_ROOM: {
    NEW_MESSAGE: 1
  },
  TYPE_EMIT_TO_MESSAGE: {
    ADD_EMOJI: 1,
    REMOVE_EMOJI: 2,
    EDIT_MESSAGE: 3
  },
  EVENT_TO_COMMON_PER_USER: 'on_common',
  TYPE_EMIT_TO_COMMON: {
    NEW_MESSAGE_NOTIFY: 1,
    REMOVE_MESSAGE_NOTIFY: 2
  },
  TYPE_EMOJI: {
    CHAR: 1,
    IMAGE: 2
  },
  TYPE_ROOM: {
    ROOM_NORMAL: 1,
    CONTACT_USER: 2
  },
  TYPE_MESSAGE_NOTIFY: {
    NORMAL: 1,
    MENTION: 2
  }
}