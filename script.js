
// In file: server.js

// ... (keep all your existing code above this line)

// 📩 Generate Plan (calls AI server)
app.post('/api/generate-plan', async (req, res) => {
  try {
    const response = await fetch('http://localhost:6000/generate-plan', { // Correct port is 6000
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ AI server error:', error.message);
    res.status(500).json({ message: 'Error generating study plan' });
  }
});

// ===================================================================
// =================== ADD THIS NEW CODE BLOCK =======================
// ===================================================================

// 💬 Explain Topic (calls AI server)
app.post('/api/explain-topic', async (req, res) => {
  try {
    // Forward the request to your Python server's NEW endpoint
    const response = await fetch('http://localhost:6000/explain-topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ AI server error during explanation:', error.message);
    res.status(500).json({ message: 'Error generating explanation' });
  }
});

// ===================================================================
// ===================================================================


// 📌 Save Study Plan to History
app.post('/api/save-history', async (req, res) => {
  // ... (the rest of your file remains the same)