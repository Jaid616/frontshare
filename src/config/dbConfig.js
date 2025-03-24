import PouchDB from "pouchdb";

// Initialize PouchDB (Persistent Storage)
const db = new PouchDB("local_db", { auto_compaction: true });
// const db = new PouchDB("local_db", { adapter: "leveldb", auto_compaction: true });

// Expose it globally for debugging
window.db = db;

async function getAllItems() {
    try {
      const result = await db.allDocs({ include_docs: true });
      const items = result.rows.map(row => row.doc);
      console.log(items);
      return items;
    } catch (error) {
      console.error('Error fetching all items:', error);
    }
  }
  
  getAllItems();
export default db;
