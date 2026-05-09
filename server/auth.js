import jwt from 'jsonwebtoken';

// Generates a JWT when user hits /api/token
export const generateToken = (req, res) => {
  const { username, role } = req.body;
  
  if (!username || !role) {
    return res.status(400).json({ error: 'Bad Request: username and role are required in JSON body.' });
  }

  const payload = { username, role };
  // Fallback to text if env is missing
  const secret = process.env.JWT_SECRET || 'super_secret_cyber_key_123';
  
  // Create token that expires in 24 hours
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  
  return res.status(200).json({ token });
};

// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Expecting format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Access denied. No token provided.' });
  }

  const secret = process.env.JWT_SECRET || 'super_secret_cyber_key_123';
  
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
    }
    // Attach decoded user info (username, role) to request for next steps
    req.user = user;
    next();
  });
};

// Middleware to check specific roles
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Forbidden: Access denied. Requires '${requiredRole}' role.` });
    }
    next();
  };
};
