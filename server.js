import express from 'express';
import cors from 'cors';
import { Thought } from './libs/mongoose';

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  console.log(req.body);
  try {
    const newThought = await new Thought({
      message: message
    }).save();
    res.status(201).json({ success: true, response: newThought });
  } catch (error) {
    console.warn(error);
    res.status(400).json({ success: false, response: error });
  }
});

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const heartToUpdate = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 }
    });
    res.status(200).json({
      success: true,
      response: `Member ${heartToUpdate.message} has their score updated`
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json({ success: false, response: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
