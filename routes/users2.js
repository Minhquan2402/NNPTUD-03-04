const express = require('express');
const router = express.Router();
const { dataUser, dataRole } = require('../utils/data2');

let users = [...dataUser];

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET user by username
router.get('/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// CREATE new user
router.post('/', (req, res) => {
  const { username, password, email, fullName, avatarUrl, status, loginCount, role } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Missing required fields' });
  if (users.find(u => u.username === username)) return res.status(409).json({ message: 'Username exists' });
  const now = new Date().toISOString();
  const roleObj = dataRole.find(r => r.id === (role?.id || role));
  if (!roleObj) return res.status(400).json({ message: 'Invalid role' });
  const newUser = {
    username, password, email, fullName, avatarUrl, status: !!status, loginCount: loginCount || 0,
    role: { id: roleObj.id, name: roleObj.name, description: roleObj.description },
    creationAt: now, updatedAt: now
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE user
router.put('/:username', (req, res) => {
  const idx = users.findIndex(u => u.username === req.params.username);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const { password, email, fullName, avatarUrl, status, loginCount, role } = req.body;
  let roleObj = users[idx].role;
  if (role) {
    const found = dataRole.find(r => r.id === (role?.id || role));
    if (found) roleObj = { id: found.id, name: found.name, description: found.description };
  }
  users[idx] = {
    ...users[idx],
    password: password || users[idx].password,
    email: email || users[idx].email,
    fullName: fullName || users[idx].fullName,
    avatarUrl: avatarUrl || users[idx].avatarUrl,
    status: typeof status === 'boolean' ? status : users[idx].status,
    loginCount: loginCount !== undefined ? loginCount : users[idx].loginCount,
    role: roleObj,
    updatedAt: new Date().toISOString()
  };
  res.json(users[idx]);
});

// DELETE user
router.delete('/:username', (req, res) => {
  const idx = users.findIndex(u => u.username === req.params.username);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  const deleted = users.splice(idx, 1);
  res.json(deleted[0]);
});

module.exports = router;
