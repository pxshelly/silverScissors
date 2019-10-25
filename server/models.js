const pool = require('../database/index');

const retrieveAppointments = (date) => {
  return new Promise((resolve, reject) => {
    pool.connect()
      .then((client) => {
        const query = `SELECT * FROM appointments WHERE appt_date = $1`;
        return Promise.all([client.query(query, [date]), client]);
      })
      .then(([result, client]) => {
        resolve(result.rows);
        client.release();
      })
      .catch((error) => reject(error));
  });
};

const createAppointment = (appointment) => {
  const data = Object.values(appointment);
  return new Promise((resolve, reject) => {
    pool.connect()
      .then((client) => {
        const query = `INSERT INTO appointments (customer_name, employee_name, hair_service, appt_date, appt_time, phone_number, textable, notes, pictures) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        return Promise.all([client.query(query, data), client]);
      })
      .then(([result, client]) => {
        resolve(result);
        client.release();
      })
      .catch((error) => reject(error));
  })
}
module.exports = { retrieveAppointments, createAppointment };