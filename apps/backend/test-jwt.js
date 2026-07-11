const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'admin-id', roles: ['ADMIN'] }, 'cambiar-en-produccion', { expiresIn: '1h' });
const axios = require('axios');
async function test() {
  try {
    let res = await axios.get('http://localhost:3000/api/v1/authorization/temporales/count', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Temporales:", res.data);
  } catch(e) { console.error("Temporales error:", e.response?.status, e.response?.data); }
  
  try {
    let res = await axios.get('http://localhost:3000/api/v1/authorization/pases/count', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Pases:", res.data);
  } catch(e) { console.error("Pases error:", e.response?.status, e.response?.data); }
}
test();
