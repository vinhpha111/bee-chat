module.exports = {
    server: process.env.DB_SERVER || "",
    url: process.env.DB_URL || "",
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    db: process.env.DB_DATABASE_NAME || ''
}