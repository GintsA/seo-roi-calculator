# SEO ROI Calculator

**Live app:** https://gintsa.github.io/seo-roi-calculator/

**Repo:** https://github.com/GintsA/seo-roi-calculator

Version/tag: v0.1.0
Release date: 2026-01-08

## What this is

A static SEO ROI calculator that estimates baseline revenue, projected revenue after an SEO-driven traffic increase, and the revenue delta using a simple linear model.

## How to use

1. Enter current monthly visitors.
2. Enter expected traffic increase (%).
3. Enter conversion rate (%).
4. Enter revenue per conversion (EUR).
5. Click Calculate.

## Quick test example

Inputs: visitors 10,000; traffic increase 20%; conversion rate 2.5; revenue per conversion 50.  
Expected: baseline revenue, projected revenue, and delta appear; visitors/conversions are whole numbers, revenue is shown in EUR with two decimals.

## Assumptions / limitations

- Simple linear estimate, not a guarantee.
- Does not model seasonality, retention, CAC, or SEO costs.
- Visitors/conversions shown as rounded whole numbers; revenue shown in EUR.

## Monetization

This tool is free. If you find it useful, you can support it here (optional):  
https://buymeacoffee.com/gintsa

## Evidence

- [screenshot-01.png](./EVIDENCE/screenshot-01.png)
- [screenshot-02.png](./EVIDENCE/screenshot-02.png)
- [demo.mp4](./EVIDENCE/demo.mp4)
- [monetization-proof.png](./EVIDENCE/monetization-proof.png)

## Reflection

### What I shipped (2-4 sentences)

SEO ROI tool that calculates the increase based on the expected change in traffic. It's a quick and convenient tool that does exacly one thing.

### What I cut (scope reductions) and why

All the required parts have been included. No cuts.

### What broke / surprised me

Nothing.

### Quality vs effort (what paid off)

Quality is not the best. Some bugs.

### Monetization reality check

- Hook used: "This tool is free. If you find it useful, you can support it here (optional): Buy me a coffee"
- Where it appears: README.md and in UI
- Is the disclosure honest and clear? Yes
- Friction points I noticed: Commiting to GH Pages is slow.
- One improvement I would make next time (without scope creep): More appealing UI.

### Next level readiness

- What responsibility I feel ready for next: Not sure fully.

## AI Usage Log

- Used AI for: initial UI structure, validation approach, and calculation implementation per BBG_001 formulas.
- I reviewed/edited: (fill in after you commit - what you changed and why)
- I can explain: inputs, validation ranges, and the calculation formulas in app.js.
