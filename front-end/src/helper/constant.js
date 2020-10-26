export const STATE_OF_MESSAGE = {
    IN_ROOM: 1,
    IN_USER: 2
}

export const SERVER = {
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
        REMOVE_EMOJI: 2
    },
    TYPE_EMOJI: {
        CHAR: 1,
        IMAGE: 2
    }
}