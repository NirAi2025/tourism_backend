
const HTTP = {
    port: process.env.APP_ENV == "production" ? process.env.PORT : 3000,
};

const APPNAME = {
    port:
        process.env.APP_ENV == "production"
            ? process.env.APP_NAME
            : "Tourism",
};

const APPURL =
    process.env.APP_ENV == "production"
        ? process.env.API_URL
        : "http://localhost:3000";

const Mysql = {
    host: process.env.APP_ENV == "production" ? process.env.MYSQL_DB_HOST : "localhost",
    user: process.env.APP_ENV == "production" ? process.env.MYSQL_DB_USER : "root",
    pwd: process.env.APP_ENV == "production" ? process.env.MYSQL_DB_PASSWORD : "",
    dialect: process.env.APP_ENV == "production" ? process.env.MYSQL_DB_DIALECT : "mysql",
    dbName: process.env.APP_ENV == "production" ? process.env.MYSQL_DB_NAME : "tourism_db",
    debug: process.env.APP_ENV == "production" ? false : true,
};

let JWT = {
    secret:
        process.env.APP_ENV == "production"
            ? process.env.JWT_ACCESS_SECRET
            : process.env.JWT_ACCESS_SECRET,
    options: {
        expiresIn: 60 * 60 * 24 * 30,
    },
    refresh: {
        secret:
            process.env.APP_ENV == "production"
                ? process.env.JWT_REFRESH_SECRET
                : process.env.JWT_REFRESH_SECRET,
        options: {
            expiresIn: 60 * 60 * 24 * 30,
        },
    },
};

const Timezone =
    process.env.APP_ENV == "production"
        ? process.env.TIMEZONE
        : "Asia/Calcutta";

const GoogleApiKey = process.env.GOOGLE_API_KEY;

export default {
    HTTP,
    APPNAME,
    APPURL,
    Mysql,
    JWT,
    Timezone,
    GoogleApiKey,
};
