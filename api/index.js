const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
  try {
    // Validate request body
    if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request format. 'data' field must be an array."
      });
    }

    const { data } = req.body;

    // Initialize response data
    const response = {
      is_success: true,
      user_id: "john_doe_17091999", // Replace with your actual data
      email: "john@xyz.com", // Replace with your actual email
      roll_number: "ABCD123", // Replace with your actual roll number
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    };

    let numberSum = 0;
    const alphabetList = [];

    // Process each item in the data array
    data.forEach(item => {
      const str = String(item);

      // Check if it's a number
      if (!isNaN(str) && !isNaN(parseFloat(str)) && isFinite(str)) {
        const num = parseInt(str);
        numberSum += num;

        // Check if odd or even
        if (num % 2 === 0) {
          response.even_numbers.push(str);
        } else {
          response.odd_numbers.push(str);
        }
      }
      // Check if it's alphabetic
      else if (/^[A-Za-z]+$/.test(str)) {
        response.alphabets.push(str.toUpperCase());
        // Store alphabets for concatenation (preserve original case)
        alphabetList.push(str);
      }
      // Check if it contains special characters
      else if (/[^A-Za-z0-9\s]/.test(str)) {
        response.special_characters.push(str);
      }
    });

    // Set sum as string
    response.sum = numberSum.toString();

    // Create concatenation string
    // Reverse the alphabets array and apply alternating caps
    if (alphabetList.length > 0) {
      const reversedAlphabets = alphabetList.reverse();
      let concatString = '';

      for (let i = 0; i < reversedAlphabets.length; i++) {
        const char = reversedAlphabets[i];
        if (i % 2 === 0) {
          // Even index - uppercase
          concatString += char.toUpperCase();
        } else {
          // Odd index - lowercase
          concatString += char.toLowerCase();
        }
      }
      response.concat_string = concatString;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

// GET method handler for /bfhl (optional, for testing)
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// Handle 404 for other routes
app.use('*', (req, res) => {
  res.status(404).json({
    is_success: false,
    error: "Route not found"
  });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;