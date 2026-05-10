import { authenticateToken, requireAnyRole } from './auth.js';

export function setupRoutes(app, db) {
  // Define our 4 core entities and which fields need to be handled as JSON arrays
  const entities = [
    { path: 'skills', table: 'skills', jsonFields: ['linkedResources'] },
    { path: 'projects', table: 'projects', jsonFields: ['techStack'] },
    { path: 'jobs', table: 'jobs', jsonFields: ['linkedSkills'] },
    { path: 'learning', table: 'learning_resources', jsonFields: [] },
  ];

  entities.forEach(({ path, table, jsonFields }) => {
    
    // 1. GET ALL (With Pagination)
    app.get(`/api/${path}`, async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 100;
        const skip = parseInt(req.query.skip) || 0;
        
        const rows = await db.all(`SELECT * FROM ${table} LIMIT ? OFFSET ?`, [limit, skip]);
        
        // Convert JSON strings back into Javascript Arrays for the React app
        rows.forEach(row => {
          jsonFields.forEach(field => {
            if (row[field]) {
              try { row[field] = JSON.parse(row[field]); } catch (e) { row[field] = []; }
            }
          });
        });
        
        res.status(200).json(rows);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // 2. GET SINGLE ITEM
    app.get(`/api/${path}/:id`, async (req, res) => {
      try {
        const row = await db.get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
        if (!row) return res.status(404).json({ error: 'Resource not found' });

        jsonFields.forEach(field => {
          if (row[field]) {
            try { row[field] = JSON.parse(row[field]); } catch (e) { row[field] = []; }
          }
        });

        res.status(200).json(row);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // 3. POST (Create) - Requires admin or writer role
    app.post(`/api/${path}`, authenticateToken, requireAnyRole('admin', 'writer'), async (req, res) => {
      try {
        const item = req.body;
        if (!item.id) {
            return res.status(400).json({ error: 'Bad Request: "id" is required.' });
        }

        const keys = Object.keys(item);
        const values = Object.values(item).map((val, index) => {
          return jsonFields.includes(keys[index]) ? JSON.stringify(val) : val;
        });

        const placeholders = keys.map(() => '?').join(', ');
        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        
        await db.run(query, values);
        res.status(201).json({ message: 'Created successfully', id: item.id });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // 4. PUT (Update) - Requires admin or writer role
    app.put(`/api/${path}/:id`, authenticateToken, requireAnyRole('admin', 'writer'), async (req, res) => {
      try {
        const id = req.params.id;
        const item = req.body;
        
        const keys = Object.keys(item).filter(k => k !== 'id');
        if (keys.length === 0) return res.status(400).json({ error: 'Bad Request: No data provided to update' });

        const values = keys.map(k => {
          return jsonFields.includes(k) ? JSON.stringify(item[k]) : item[k];
        });

        const setString = keys.map(k => `${k} = ?`).join(', ');
        const query = `UPDATE ${table} SET ${setString} WHERE id = ?`;
        
        // Append ID for the WHERE clause
        values.push(id);
        
        const result = await db.run(query, values);
        if (result.changes === 0) {
          return res.status(404).json({ error: 'Not Found: Resource does not exist' });
        }
        res.status(200).json({ message: 'Updated successfully' });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // 5. DELETE - Strictly Protected Route (Requires 'admin' role)
    app.delete(`/api/${path}/:id`, authenticateToken, requireAnyRole('admin'), async (req, res) => {
      try {
        const id = req.params.id;
        const result = await db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
        
        if (result.changes === 0) {
          return res.status(404).json({ error: 'Not Found: Resource does not exist' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  });
}
