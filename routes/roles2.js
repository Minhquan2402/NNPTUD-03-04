
const express = require('express');
const router = express.Router();
const { dataRole, dataUser } = require('../utils/data2');

let roles = [...dataRole];
let users = [...dataUser];

// GET all roles
router.get('/', (req, res) => {
  res.json(roles);
});

// GET role by id

// GET role by id
router.get('/:id', (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
});

// GET all users in a role
router.get('/:id/users', (req, res) => {
  const roleId = req.params.id;
  const usersInRole = users.filter(u => u.role && u.role.id === roleId);
  res.json(usersInRole);
});

// CREATE new role
router.post('/', (req, res) => {
  const { id, name, description } = req.body;
  if (!id || !name) return res.status(400).json({ message: 'Missing id or name' });
  if (roles.find(r => r.id === id)) return res.status(409).json({ message: 'Role ID exists' });
  const now = new Date().toISOString();
  const newRole = { id, name, description, creationAt: now, updatedAt: now };
  roles.push(newRole);
  res.status(201).json(newRole);
});

// UPDATE role
router.put('/:id', (req, res) => {
  const idx = roles.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Role not found' });
  const { name, description } = req.body;
  roles[idx] = {
    ...roles[idx],
    name: name || roles[idx].name,
    description: description || roles[idx].description,
    updatedAt: new Date().toISOString()
  };
  res.json(roles[idx]);
});

// DELETE role
router.delete('/:id', (req, res) => {
  const idx = roles.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Role not found' });
  const deleted = roles.splice(idx, 1);
  res.json(deleted[0]);
});

module.exports = router;
