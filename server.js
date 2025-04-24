import express from 'express';
import { query, validationResult } from 'express-validator';
import { addDays, addWeeks, parseISO, format } from 'date-fns';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dateValidation = query('date')
  .optional()
  .isISO8601()
  .toDate();

const daysValidation = query('days')
  .isInt()
  .toInt();

const weeksValidation = query('weeks')
  .isInt()
  .toInt();

app.get('/api/add-days', [dateValidation, daysValidation], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const baseDate = req.query.date ? new Date(req.query.date) : new Date();
  const days = parseInt(req.query.days);
  const resultDate = addDays(baseDate, days);

  res.json({
    result: format(resultDate, 'yyyy-MM-dd'),
    input: {
      baseDate: format(baseDate, 'yyyy-MM-dd'),
      days
    }
  });
});

app.get('/api/add-weeks', [dateValidation, weeksValidation], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const baseDate = req.query.date ? new Date(req.query.date) : new Date();
  const weeks = parseInt(req.query.weeks);
  const resultDate = addWeeks(baseDate, weeks);

  res.json({
    result: format(resultDate, 'yyyy-MM-dd'),
    input: {
      baseDate: format(baseDate, 'yyyy-MM-dd'),
      weeks
    }
  });
});

app.get('/api/subtract-days', [dateValidation, daysValidation], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const baseDate = req.query.date ? new Date(req.query.date) : new Date();
  const days = parseInt(req.query.days);
  const resultDate = addDays(baseDate, -days);

  res.json({
    result: format(resultDate, 'yyyy-MM-dd'),
    input: {
      baseDate: format(baseDate, 'yyyy-MM-dd'),
      days
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 