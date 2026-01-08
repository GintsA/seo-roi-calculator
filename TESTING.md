# Testing

## Manual smoke test

1. Open `index.html` in a browser or use the live app.
2. Verify the form validates required inputs and bounds.
3. Verify calculations and formatting with the cases below.

## Test cases

Case A:
- Inputs: visitors 1000, increase 10, conversion 2.5, revenue 50
- Expected:
  - Current revenue: EUR 1,250.00
  - Projected visitors: 1,100
  - Projected conversions: 28
  - Projected revenue: EUR 1,375.00
  - Revenue delta: EUR 125.00

Case B (comma decimal input):
- Inputs: visitors 1200, increase 5, conversion 1,5, revenue 100
- Expected:
  - Current revenue: EUR 1,800.00
  - Projected visitors: 1,260
  - Projected conversions: 19
  - Projected revenue: EUR 1,890.00
  - Revenue delta: EUR 90.00

Case C (validation bounds):
- Inputs: visitors -1, increase 0, conversion 0, revenue 0
- Expected: error for visitors being out of range.
