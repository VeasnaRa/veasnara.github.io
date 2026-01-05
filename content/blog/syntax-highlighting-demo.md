---
title: "Syntax Highlighting Demo"
date: 2026-01-05
excerpt: "A demonstration of syntax highlighting for various programming languages"
tags: [programming, javascript, python, syntax]
thumbnail: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop
---

## JavaScript Example

Here's a simple JavaScript function with syntax highlighting:

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`Fibonacci(10) = ${result}`);
```

## Python Example

A Python class demonstrating object-oriented programming:

```python
class DataProcessor:
    def __init__(self, data):
        self.data = data

    def process(self):
        """Process the data and return results."""
        return [x * 2 for x in self.data if x > 0]

    def summarize(self):
        total = sum(self.data)
        avg = total / len(self.data)
        return {"total": total, "average": avg}

# Usage
processor = DataProcessor([1, -2, 3, 4, -5])
print(processor.process())
print(processor.summarize())
```

## React Component

A modern React component using hooks:

```jsx
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setCount(count => count + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

## CSS Styling

Modern CSS with custom properties:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --text-color: #1f2937;
  --spacing-unit: 8px;
}

.card {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: calc(var(--spacing-unit) * 2);
  padding: calc(var(--spacing-unit) * 3);
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
```

## Bash Script

A simple deployment script:

```bash
#!/bin/bash

echo "Starting deployment..."

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"

  # Deploy to server
  rsync -avz --delete ./dist/ user@server:/var/www/html/

  echo "Deployment complete!"
else
  echo "Build failed. Aborting deployment."
  exit 1
fi
```

## Summary

Syntax highlighting makes code much more readable by color-coding different parts of the syntax. This helps developers quickly identify:

- Keywords and reserved words
- Strings and literals
- Comments and documentation
- Functions and method calls
- Variables and constants
