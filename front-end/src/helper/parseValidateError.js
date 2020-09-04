module.exports = (errorArrays) => {
    let errors = {}
    for (const index in errorArrays) {
        const error = errorArrays[index]
        errors[error.param] = error.msg
    }
    return errors
} 