const { client } = require('../../db');

export default async function handler(req, res) {
  const db = client();
  const { id } = JSON.parse(req.body);

  try {
    throw new Error('Delete disabled, remove L8 in pages/api/delete-location.js');

    await db.none('DELETE FROM locations WHERE id = $1', id);

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
