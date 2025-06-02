const db = require('../database')

async function clearTestUsers() {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM users WHERE Name IN ('Durga', 'Patrik')";
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error clearing test users:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { clearTestUsers };