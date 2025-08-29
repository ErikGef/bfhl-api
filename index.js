const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Configure appropriately for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Utility functions
const isNumeric = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str)) && isFinite(str) && str.trim() !== '';
};

const isAlphabetic = (str) => {
  return /^[A-Za-z]+$/.test(str);
};

const hasSpecialCharacters = (str) => {
  return /[^A-Za-z0-9\s]/.test(str);
};

// POST /bfhl endpoint - Main processing endpoint
app.post('/bfhl', (req, res) => {
  try {
    // Comprehensive input validation
    if (!req.body) {
      return res.status(400).json({
        is_success: false,
        error: "Request body is required"
      });
    }

    if (!req.body.data) {
      return res.status(400).json({
        is_success: false,
        error: "Missing 'data' field in request body"
      });
    }

    if (!Array.isArray(req.body.data)) {
      return res.status(400).json({
        is_success: false,
        error: "Field 'data' must be an array"
      });
    }

    const { data } = req.body;

    // IMPORTANT: Replace these with your actual details
    const response = {
      is_success: true,
      user_id: "john_doe_17091999", // Format: firstname_lastname_ddmmyyyy (all lowercase)
      email: "john@xyz.com", // Your actual email address
      roll_number: "ABCD123", // Your actual roll number
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    };

    let numberSum = 0;
    const alphabetChars = [];

    // Process each item in the data array
    data.forEach(item => {
      if (item === null || item === undefined) return;

      const str = String(item).trim();

      // Skip empty strings
      if (str === '') return;

      // Check if it's a number (including multi-digit numbers)
      if (isNumeric(str)) {
        const num = parseInt(str);
        if (!isNaN(num)) {
          numberSum += num;

          // Classify as odd or even
          if (num % 2 === 0) {
            response.even_numbers.push(str);
          } else {
            response.odd_numbers.push(str);
          }
        }
      }
      // Check if it's purely alphabetic (single or multiple characters)
      else if (isAlphabetic(str)) {
        response.alphabets.push(str.toUpperCase());
        // Collect individual characters for concatenation
        for (let char of str) {
          alphabetChars.push(char);
        }
      }
      // Anything with special characters
      else if (hasSpecialCharacters(str)) {
        response.special_characters.push(str);
      }
    });

    // Set sum as string
    response.sum = numberSum.toString();

    // Create concatenation string
    // Reverse alphabets and apply alternating case
    if (alphabetChars.length > 0) {
      const reversedChars = [...alphabetChars].reverse();
      let concatString = '';

      for (let i = 0; i < reversedChars.length; i++) {
        const char = reversedChars[i];
        // Even index (0, 2, 4...) = uppercase, Odd index (1, 3, 5...) = lowercase
        concatString += (i % 2 === 0) ? char.toUpperCase() : char.toLowerCase();
      }
      response.concat_string = concatString;
    }

    // Return successful response
    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing /bfhl request:', error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error occurred while processing the request"
    });
  }
});

// GET /bfhl endpoint - Returns operation code
app.get('/bfhl', (req, res) => {
  try {
    res.status(200).json({
      operation_code: 1
    });
  } catch (error) {
    console.error('Error in GET /bfhl:', error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: "BFHL API is running",
    endpoints: {
      "POST /bfhl": "Main data processing endpoint",
      "GET /bfhl": "Get operation code", 
      "GET /health": "Health check"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    is_success: false,
    error: "Something went wrong!"
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    is_success: false,
    error: `Route ${req.originalUrl} not found`,
    available_endpoints: ["/bfhl", "/health"]
  });
});

// For local development
const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📋 API endpoints:`);
    console.log(`   POST http://localhost:${port}/bfhl - Main processing endpoint`);
    console.log(`   GET  http://localhost:${port}/bfhl - Operation code`);
    console.log(`   GET  http://localhost:${port}/health - Health check`);
  });
}

// Export for Vercel
module.exports = app;