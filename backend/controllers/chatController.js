const asyncHandler = require('express-async-handler');
const { MongoDataHandler, DemoDataHandler } = require('../data/DataHandler');
const { MyAgent } = require('../ai/Agent');

// Decide which data handler to use. For now, default to Mongo.
function buildDataHandler() {
  // Env flag to use demo handler (useful for tests): AI_DEMO=1
  if (process.env.AI_DEMO === '1') {
    return new DemoDataHandler({ employees: [], projects: [] });
  }
  return new MongoDataHandler();
}

// POST /api/chat
// body: { message: string }
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'message is required' });
  }

  const handler = buildDataHandler();
  const agent = new MyAgent(handler);

  const result = await agent.handleChat(message, { user: req.user });
  res.status(200).json({ success: true, data: result });
});

module.exports = { chat };
