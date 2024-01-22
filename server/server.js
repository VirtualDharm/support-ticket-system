const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost/support-ticket-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define mongoose schemas and models for Support Agent and Support Ticket
const supportAgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  active: Boolean,
  dateCreated: Date,
});

const SupportAgent = mongoose.model('SupportAgent', supportAgentSchema);

const supportTicketSchema = new mongoose.Schema({
  topic: String,
  description: String,
  dateCreated: Date,
  severity: String,
  type: String,
  assignedTo: String,
  status: String,
  resolvedOn: Date,
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);


// Define routes for creating support agent and support ticket
// Create Support Agent
app.post('/api/support-agents', async (req, res) => {
  try {
    // Validate input data (e.g., proper email format)
    // Create a new support agent with the specified attributes
    // Store the agent information in the MongoDB database
    const newAgent = await SupportAgent.create({
      ...req.body,
      active: true,
      dateCreated: new Date(),
    });

    res.status(201).json(newAgent);
  } catch (error) {
    // Proper error handling
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create Support Ticket
app.post('/api/support-tickets', async (req, res) => {
  try {
    // Validate input data (e.g., severity level, date format)
    // Create a new support ticket with the specified attributes
    // Implement round-robin assignment logic to assign a ticket to the next support agent
    // Change the status to Assigned when an agent is assigned
    // Automatically set the status to "New" when the ticket is created
    const newTicket = await SupportTicket.create({
      ...req.body,
      status: 'New',
      dateCreated: new Date(),
    });

    // Round-robin assignment logic (you may need to implement this logic)
    // const nextAgent = ...;

    // Update the assignedTo field with the nextAgent ID
    // Update the status to 'Assigned'

    res.status(201).json(newTicket);
  } catch (error) {
    // Proper error handling
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
