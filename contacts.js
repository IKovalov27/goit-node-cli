const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContact = contacts.find(({ id }) => id === contactId);

  if (!removedContact) {
    return null;
  }

  const updatedContacts = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

  return removedContact;
}

async function addContact(name, email, phone) {
  const newContact = { id: String(Date.now()), name, email, phone };
  const contacts = await listContacts();
  const updatedContacts = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));

  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
