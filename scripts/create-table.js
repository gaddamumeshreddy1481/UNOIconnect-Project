export const createUsersTable = (db, callback) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        User_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_First VARCHAR(255),
        User_Last VARCHAR(255),
        User_Phone VARCHAR(15),
        User_Address VARCHAR(255),
        User_Email VARCHAR(255) UNIQUE,
        User_Password VARCHAR(255)
      )
    `;

    db.query(createTableQuery, function (err, result) {
        if (err) {
            throw err;
        }

        console.log("Users table created or already exists");
        callback();
    });
};