const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://chatme.vercel.app", // Replace with your actual Vercel domain
  ],
  methods: ['GET', 'POST']
};

module.exports = corsOptions;
