# Configurable Number Line

This repository contains a single-page JavaScript app for rendering a configurable, scrollable number line.

## Features

- Set the visible labelled range with start and end numbers.
- Choose the major division size.
- Choose minor divisions in halves, fifths, or tenths.
- Label only the major divisions that fall within the selected range.
- Support negative numbers, zero, and positive numbers.
- Extend the line by one major division past each end and finish with arrow heads.
- Scroll horizontally when the rendered number line is wider than the screen.
- Use a `#BCFCBF` page background.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
