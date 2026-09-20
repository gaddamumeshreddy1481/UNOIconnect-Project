export const createEventsTable = (db, callback) => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Events (
      Event_ID INT AUTO_INCREMENT PRIMARY KEY,
      Event_Title VARCHAR(255) NOT NULL,
      Event_Start DATETIME NOT NULL,
      Event_END DATETIME NOT NULL,
      Event_Location VARCHAR(255),
      Event_Description TEXT,
      Event_Photo_URL VARCHAR(255)
    )
  `;

    db.query(createTableQuery, function (err, result) {
        if (err) {
            throw err;
        }

        console.log("Events table created or already exists");
        callback();
        insertEvents(db, eventsToInsert, () => {
            // Close the database connection when done
            db.end();
        });
    });
};

const insertEvents = (db, events, callback) => {
    const insertEventQuery = `
    INSERT INTO Events
    (Event_Title, Event_Start, Event_END, Event_Location, Event_Description, Event_Photo_URL)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    events.forEach((event) => {
        db.query(
            insertEventQuery,
            [
                event.title,
                event.start,
                event.end,
                event.location,
                event.description,
                event.photoURL,
            ],
            (err, result) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Event "${event.title}" inserted successfully`);
                }
            }
        );
    });

    callback();
};

const eventsToInsert = [
    {
        title: 'Event 1',
        start: '2023-12-10 09:00:00',
        end: '2023-12-10 12:00:00',
        location: 'PKI_Atrium',
        description: 'Description for Event 1',
        photoURL: 'https://picsum.photos/370/180',
    },
    {
        title: 'Event 2',
        start: '2023-12-15 14:00:00',
        end: '2023-12-15 17:00:00',
        location: 'Milo Bail Student Center',
        description: 'Description for Event 2',
        photoURL: 'https://picsum.photos/370/180',
    },
    {
        title: 'Event 3',
        start: '2023-12-20 10:30:00',
        end: '2023-12-20 13:30:00',
        location: 'PKI_Atrium',
        description: 'Description for Event 3',
        photoURL: 'https://picsum.photos/370/180',
    },
    {
        title: 'Event 4',
        start: '2023-12-25 18:00:00',
        end: '2023-12-25 21:00:00',
        location: 'Milo Bail Student Center',
        description: 'Description for Event 4',
        photoURL: 'https://picsum.photos/370/180',
    },
];

export const createEventRegistrationsTable = (db, callback) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS EventRegistrations (
        Registration_ID INT AUTO_INCREMENT PRIMARY KEY,
        User_Id INT NOT NULL,
        Event_Id INT NOT NULL,
        FOREIGN KEY (User_Id) REFERENCES Users(User_ID),
        FOREIGN KEY (Event_Id) REFERENCES Events(Event_ID),
        UNIQUE KEY Unique_Registration (User_Id, Event_Id)
      )
    `;

    db.query(createTableQuery, function (err, result) {
        if (err) {
            throw err;
        }

        console.log("EventRegistrations table created or already exists");
        callback();
    });
};

