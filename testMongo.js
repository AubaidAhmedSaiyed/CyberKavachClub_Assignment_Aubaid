const { MongoClient } = require('mongodb');

async function test() {
  const uri = "mongodb://127.0.0.1:27017/cyberkavach";
  console.log("Testing unauthenticated connection...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db('cyberkavach');
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
  } catch (err) {
    console.error("Connection Error:", err.message);
  } finally {
    await client.close();
  }
}

test();
