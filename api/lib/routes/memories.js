const express = require("express");
const router = express.Router();
const { db, admin } = require("../lib/firebase");

const COLLECTION = "memories";

function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.use(requireApiKey);

router.post("/", async (req, res) => {
  try {
    const { content, tags = [], userId = "utkarsh", importance = 1 } = req.body;

    const docRef = await db.collection(COLLECTION).add({
      content,
      tags,
      userId,
      importance,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      id: docRef.id,
      message: "Memory saved"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save memory" });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).get();

    const memories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ memories });
  } catch (err) {
    res.status(500).json({ error: "Failed to read memories" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();

    res.json({
      message: "Memory deleted"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete memory" });
  }
});

module.exports = router;
