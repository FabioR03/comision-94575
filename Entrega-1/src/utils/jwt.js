import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'coderSecret'; 

export const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    },
    PRIVATE_KEY,
    { expiresIn: '24h' }
  );
};
