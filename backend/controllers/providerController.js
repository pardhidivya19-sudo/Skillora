const pool = require("../config/db");

exports.createProviderProfile = async (req, res) => {
  try {
    const { experience, location, description } = req.body;

    const result = await pool.query(
      `INSERT INTO provider_profile
       (user_id, experience, location, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, experience, location, description]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.addSkillToProvider = async (req, res) => {
  try {
    const { skill_id, price, duration } = req.body;

    // First get provider_id from provider_profile
    const provider = await pool.query(
      `SELECT provider_id FROM provider_profile WHERE user_id = $1`,
      [req.user.id]
    );

    if (provider.rows.length === 0) {
      return res.status(400).json({ message: "Provider profile not found" });
    }

    const provider_id = provider.rows[0].provider_id;

    const result = await pool.query(
      `INSERT INTO provider_skills
       (provider_id, skill_id, price, duration)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [provider_id, skill_id, price, duration]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProvidersBySkill = async (req, res) => {
  try {
    const { skill_id } = req.params;

    const result = await pool.query(
      `
      SELECT p.provider_id, u.name, ps.price, ps.duration
      FROM provider_profile p
      JOIN users u ON p.user_id = u.user_id
      JOIN provider_skills ps ON p.provider_id = ps.provider_id
      WHERE ps.skill_id = $1
      `,
      [skill_id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProviderRating = async (req, res) => {
  try {
    const { provider_id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        AVG(rating) AS average_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE provider_id = $1
      `,
      [provider_id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


