const pg = require("pg");

// const config = {
//     host: "rds-postgresql-10mintutorial.cduqfy0z1ly8.us-west-1.rds.amazonaws.com",
//     user: "varunjoshi",
//     database: "rds-postgresql-10mintutorial",
//     password: "oatmeal0",
//     port: 5432,
// };

const config = {
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: process.env.PORT,
};

const pool = new pg.Pool(config);

pool.on("connect", () => {
    console.log("connected to the Database");
});

const createTables = () => {
    const imageTable = `CREATE TABLE IF NOT EXISTS
    images(
      id SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      cloudinary_id VARCHAR(128) NOT NULL,
      image_url VARCHAR(128) NOT NULL
    )`;
    pool.query(imageTable)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

pool.on("remove", () => {
    console.log("client removed");
    process.exit(0);
});

//export pool and createTables to be accessible from anywhere within the application
module.exports = {
    createTables,
    pool,
};

require("make-runnable");
