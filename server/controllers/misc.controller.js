import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// POST /api/contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message received! We will get back to you soon.' });
  } catch (err) {
    console.error('submitContact error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// POST /api/newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: 'Thanks for subscribing!' });
  } catch (err) {
    console.error('subscribeNewsletter error:', err);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
};
