# Visual Rule Builder - Kontent.ai Custom Element

A visual interface for building personalization rules in Kontent.ai. This custom element provides an intuitive UI for content authors to create complex rule conditions with multiple signals and logical operators (AND/OR), storing the result as machine-readable JSON.

## 🎯 Purpose

This custom element is designed to support the **Koerber website personalization POC** (Option 3: Custom Element Visual Rule Builder) as documented in `poc-content-variants-approaches.md`. It enables content authors to:

- Define personalization rules visually without writing JSON
- Create conditions based on user signals (industry, solution interest, returning visitor, etc.)
- Combine multiple conditions with AND/OR logic
- Preview the generated JSON that will be evaluated by the frontend

## 📸 Preview

```
┌──────────────────────────────────────────────────────────────────┐
│ PERSONALIZATION RULES                                            │
│                                                                   │
│  Match: [ALL ▼] of the following conditions                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Industry  [equals ▼]  [Pharma & Life Sciences ▼]       [×] │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Returning Visitor [equals ▼]  [Yes ▼]                  [×] │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [+ Add condition]                           [Show JSON]          │
└──────────────────────────────────────────────────────────────────┘
```

## 🔧 Features

- **Visual Rule Building**: Intuitive UI similar to Conscia's rule editor
- **Multiple Signal Types**:
  - Industry (Pharma, Logistics, Food & Beverage, etc.)
  - Solution Interest (Automation, Digital Solutions, Packaging, etc.)
  - Returning Visitor (Yes/No)
  - Visit Intent (Learn, Explore Solutions, Contact Sales)
  - Page Category (Products, Solutions, About, Resources)
  - Content Type (Article, Case Study, Whitepaper, Video)
- **Flexible Operators**:
  - `$eq` - equals
  - `$ne` - not equals
  - `$in` - is one of (multi-select)
  - `$nin` - is not one of (multi-select)
  - `$contains` - contains
  - `$gt`, `$lt`, `$gte`, `$lte` - comparison operators
- **Logic Operators**: AND (`$and`) / OR (`$or`) for combining conditions
- **Real-time Validation**: Ensures all fields are complete before saving
- **JSON Preview**: Shows the exact JSON structure that will be stored
- **Responsive Design**: Works on all screen sizes

## 📦 Installation

### 1. Development Setup

```bash
# Navigate to the app directory
cd custom-elements/rule-builder/app

# Install dependencies
npm install

# Generate SSL certificates for local development
# (Required for Kontent.ai Custom Elements)
openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes

# Trust the certificate on macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain localhost.pem

# Start development server
npm run dev
```

The app will be available at `https://localhost:5175`

### 2. Deploy to Netlify

```bash
# Build for production
npm run build

# Deploy to Netlify
# (Configure Netlify to build from custom-elements/rule-builder/app)
```

### 3. Add to Kontent.ai

1. Go to your Kontent.ai project
2. Navigate to **Settings** → **Custom elements**
3. Click **Add custom element**
4. Fill in the details:
   - **Name**: Visual Rule Builder
   - **Hosted URL**: `https://your-netlify-url.netlify.app` (or localhost during dev)
   - **Parameters**: None required (optional configuration can be added)

### 4. Use in Content Type

1. Edit a content type (e.g., `personalization_variant`)
2. Add a new element of type **Custom element**
3. Select **Visual Rule Builder**
4. The underlying field type should be **Text** (stores JSON string)

## 🎨 JSON Output Format

The custom element generates JSON in the following format:

### Single Condition

```json
{
  "$eq": {
    "field": "industry",
    "value": "pharma"
  }
}
```

### Multiple Conditions with AND

```json
{
  "$and": [
    {
      "$eq": {
        "field": "industry",
        "value": "pharma"
      }
    },
    {
      "$eq": {
        "field": "returning_visitor",
        "value": true
      }
    }
  ]
}
```

### Multiple Conditions with OR

```json
{
  "$or": [
    {
      "$eq": {
        "field": "industry",
        "value": "pharma"
      }
    },
    {
      "$eq": {
        "field": "industry",
        "value": "logistics"
      }
    }
  ]
}
```

### Multi-value Condition

```json
{
  "$in": {
    "field": "solution",
    "value": ["automation", "digital", "packaging"]
  }
}
```

## 🔌 Integration with Frontend

The JSON output is designed to be directly evaluated by the frontend rules engine in `getStaticProps` or Edge Middleware:

```typescript
import type { RuleJSON } from "./types/rules";

function evaluateRule(
  rule: RuleJSON,
  signals: Record<string, unknown>,
): boolean {
  // Parse the rule JSON and evaluate against user signals
  // Implementation depends on your rules engine design
}

// Example usage in getStaticProps
const variantRule = variant.rules_json ? JSON.parse(variant.rules_json) : null;
const shouldActivate = variantRule && evaluateRule(variantRule, userSignals);
```

## 🛠️ Customization

### Adding New Signal Fields

Edit [src/types/index.ts](app/src/types/index.ts) and add to the `SIGNAL_FIELDS` array:

```typescript
{
  value: 'custom_signal',
  label: 'Custom Signal',
  valueType: 'select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
}
```

### Adding New Operators

Edit [src/types/index.ts](app/src/types/index.ts) and add to the `OPERATORS` array:

```typescript
{ value: '$custom', label: 'custom operator' }
```

## 📚 Architecture

```
rule-builder/
├── app/
│   ├── src/
│   │   ├── components/
│   │   │   └── Condition.tsx      # Individual rule condition component
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types and constants
│   │   ├── utils/
│   │   │   └── ruleUtils.ts       # JSON conversion utilities
│   │   ├── App.tsx                # Main component
│   │   ├── App.css                # Styles
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies
│   ├── vite.config.ts             # Vite configuration
│   └── tsconfig.json              # TypeScript configuration
├── kontent-app-config.json        # Kontent.ai custom element metadata
├── netlify.toml                   # Netlify deployment config
└── README.md                      # This file
```

## 🔐 Security

- HTTPS is required for Kontent.ai custom elements (enforced by Kontent.ai)
- Local development requires self-signed SSL certificates
- Production deployment should use a proper SSL certificate (Netlify provides this automatically)

## 🐛 Troubleshooting

### Custom Element not loading in Kontent.ai

- Ensure the URL is **HTTPS** (not HTTP)
- Check browser console for errors
- Verify the Kontent.ai Custom Element SDK is loaded (check Network tab)

### Changes not saving

- Check if the content item is in **Draft** mode (not published/locked)
- Ensure all condition fields are filled in (validation prevents saving incomplete rules)
- Check browser console for JavaScript errors

### Height issues

- The custom element automatically adjusts height based on content
- Maximum height is capped at 800px to prevent excessive scrolling in Kontent.ai

## 📖 References

- [Kontent.ai Custom Elements Documentation](https://kontent.ai/learn/docs/custom-elements)
- [Kontent.ai Custom Elements JS API](https://kontent.ai/learn/docs/apis/custom-elements-js-api)
- [POC Documentation](../../docs/poc-content-variants-approaches.md) (in Koerber repo)

## 📝 License

Internal use for Koerber personalization project.

## 👥 Authors

Koerber Development Team - POC Implementation (Feb 2026)
