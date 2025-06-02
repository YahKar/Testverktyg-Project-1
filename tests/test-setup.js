const db = require('../database')
function clearTestUsers() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('clearTestUsers() called outside of test environment!');
      return resolve();
    }

    db.query('DELETE FROM users', (err, results) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { clearTestUsers };