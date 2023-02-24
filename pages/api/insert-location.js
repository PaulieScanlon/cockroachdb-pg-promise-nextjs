const { getDB } = require('../../db');
const requestIp = require('request-ip');
const geoip = require('fast-geoip');

export default async function handler(req, res) {
  const { db } = getDB();
  const { date } = JSON.parse(req.body);

  try {
    const ip = await requestIp.getClientIp(req);
    const geo = await geoip.lookup(ip);

    const city = geo ? geo.city : 'Greenland';
    const lat = geo ? geo.ll[0] : 65.95346100241352;
    const lng = geo ? geo.ll[1] : -44.96798528799432;

    const response = await db.one(
      'INSERT INTO locations (date, city, lat, lng, runtime) VALUES(${date}, ${city}, ${lat}, ${lng}, ${serverless}) RETURNING id',
      {
        date: date,
        city: city,
        lat: lat,
        lng: lng,
        serverless: 'serverless',
      }
    );

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: response.id,
        city: city,
        date: date,
        lat: lat,
        lng: lng,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
