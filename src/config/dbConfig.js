import PouchDB from "pouchdb";

// Initialize PouchDB (Persistent Storage)
const db = new PouchDB("local_db", { auto_compaction: true });
// const db = new PouchDB("local_db", { adapter: "leveldb", auto_compaction: true });

// Expose it globally for debugging
// window.db = db;

export default db;
