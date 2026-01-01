import sql from 'mssql';

const config = {
    user: "sa",
    password: "password01",
    server: 'localhost',
    database: 'Phonebook',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

export async function getConnection() {
    var pool = await sql.connect(config);
    return pool;
}

export { sql };