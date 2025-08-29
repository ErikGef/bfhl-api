const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/bfhl', (req, res) => {
  try {
    if (!req.body || !req.body.data || !Array.isArray(req.body.data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid request format. 'data' field must be an array."
      });
    }

    const { data } = req.body;

    const response = {
      is_success: true,
      user_id: "john_doe_17091999",
      email: "john@xyz.com",
      roll_number: "ABCD123",
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    };

    let numberSum = 0;
    const alphabetList = [];

    data.forEach(item => {
      const str = String(item);

      if (!isNaN(str) && !isNaN(parseFloat(str)) && isFinite(str)) {
        const num = parseInt(str);
        numberSum += num;

        if (num % 2 === 0) {
          response.even_numbers.push(str);
        } else {
          response.odd_numbers.push(str);
        }
      } else if (/^[A-Za-z]+$/.test(str)) {
        response.alphabets.push(str.toUpperCase());
        alphabetList.push(str);
      } else if (/[^A-Za-z0-9\\s]/.test(str)) {
        response.special_characters.push(str);
      }
    });

    response.sum = numberSum.toString();

    if (alphabetList.length > 0) {
      const reversedAlphabets = alphabetList.reverse();
      let concatString = '';

      for (let i = 0; i < reversedAlphabets.length; i++) {
        const char = reversedAlphabets[i];
        concatString += (i % 2 === 0) ? char.toUpperCase() : char.toLowerCase();
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

app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

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
