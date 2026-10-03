const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataFilePath = path.join(__dirname, 'problems.json');

// Read all problems from JSON file
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON store:', err);
    return [];
  }
};

// Save problems to JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing JSON store:', err);
  }
};

const localStore = {
  find: (query = {}) => {
    let items = readData();

    if (query.platform && query.platform !== 'All') {
      items = items.filter((p) => p.platform === query.platform);
    }
    if (query.difficulty && query.difficulty !== 'All') {
      items = items.filter((p) => p.difficulty === query.difficulty);
    }
    if (query.status && query.status !== 'All') {
      items = items.filter((p) => p.status === query.status);
    }
    if (query.topic && query.topic !== 'All') {
      items = items.filter((p) =>
        p.topic.toLowerCase().includes(query.topic.toLowerCase())
      );
    }
    if (query.search && query.search.trim() !== '') {
      const q = query.search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.topic?.toLowerCase().includes(q) ||
          p.platform?.toLowerCase().includes(q) ||
          p.notes?.toLowerCase().includes(q)
      );
    }

    // Sort by createdAt descending
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById: (id) => {
    const items = readData();
    return items.find((p) => p._id === id || p._id === String(id));
  },

  create: (itemData) => {
    const items = readData();
    const now = new Date().toISOString();
    const newProblem = {
      _id: crypto.randomBytes(12).toString('hex'), // MongoDB-like 24 hex char ID
      title: itemData.title.trim(),
      platform: itemData.platform,
      difficulty: itemData.difficulty,
      topic: itemData.topic.trim(),
      status: itemData.status || 'Unsolved',
      link: itemData.link ? itemData.link.trim() : '',
      notes: itemData.notes ? itemData.notes.trim() : '',
      createdAt: now,
      updatedAt: now,
    };
    items.unshift(newProblem);
    writeData(items);
    return newProblem;
  },

  findByIdAndUpdate: (id, updateData) => {
    const items = readData();
    const index = items.findIndex((p) => p._id === id || p._id === String(id));
    if (index === -1) return null;

    const existing = items[index];
    const updated = {
      ...existing,
      title: updateData.title !== undefined ? updateData.title.trim() : existing.title,
      platform: updateData.platform || existing.platform,
      difficulty: updateData.difficulty || existing.difficulty,
      topic: updateData.topic !== undefined ? updateData.topic.trim() : existing.topic,
      status: updateData.status || existing.status,
      link: updateData.link !== undefined ? updateData.link.trim() : existing.link,
      notes: updateData.notes !== undefined ? updateData.notes.trim() : existing.notes,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    writeData(items);
    return updated;
  },

  findByIdAndDelete: (id) => {
    const items = readData();
    const index = items.findIndex((p) => p._id === id || p._id === String(id));
    if (index === -1) return null;

    const deleted = items.splice(index, 1)[0];
    writeData(items);
    return deleted;
  },
};

module.exports = localStore;
