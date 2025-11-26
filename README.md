# VA Retirement & Disability Preparation System

A comprehensive planning and tracking dashboard for military veterans preparing for retirement and VA disability claims.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)

## Features

- **Master Checklist** - Track 49 items across 5 categories (Retirement, VA Claims, Medical, Benefits, Legal)
- **Condition Tracker** - Log conditions with evidence, DBQs, nexus letters, severity, and estimated ratings
- **VA Math Calculator** - Accurate combined rating calculator using proper VA compounding formula
- **Document Requirements** - Complete evidence checklists for 8 condition categories
- **Readiness Score** - Visual submission readiness with weak areas highlighted

## Quick Start

### Option 1: Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/va-prep-system.git
cd va-prep-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Deploy to Vercel (Free)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repository
4. Click "Deploy" (no configuration needed)
5. Done! Your app is live at `your-project.vercel.app`

### Option 3: Deploy to Netlify (Free)

1. Push this code to a GitHub repository
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

### Option 4: Deploy to GitHub Pages (Free)

1. Add to `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/'
})
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add to `package.json` scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

4. Run:
```bash
npm run deploy
```

## Project Structure

```
va-prep-app/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main application component
    └── index.css       # Tailwind styles
```

## Customization

### Adding Checklist Items

Edit the `initialChecklist` object in `src/App.jsx`:

```jsx
const initialChecklist = {
  retirement: {
    title: 'Military Retirement',
    items: [
      { id: 'r1', label: 'Your new item', sublabel: 'Optional description', checked: false },
      // ... more items
    ]
  },
  // ... more categories
};
```

### Adding Document Requirements

Edit the `documentRequirements` object:

```jsx
const documentRequirements = {
  yourCategory: {
    title: 'Your Category',
    icon: '🎯',
    items: [
      'Required document 1',
      'Required document 2',
    ]
  },
  // ... more categories
};
```

### Updating Payment Rates

Edit the `getMonthlyPayment` function with current VA rates:

```jsx
const getMonthlyPayment = (rating) => {
  const payments = {
    0: 0, 10: 171.23, 20: 338.49, // ... update with current rates
  };
  return payments[rating] || 0;
};
```

## Adding Data Persistence

To save user data, you can add localStorage:

```jsx
// In App.jsx, after state declarations:

// Load saved data on mount
useEffect(() => {
  const saved = localStorage.getItem('va-prep-data');
  if (saved) {
    const data = JSON.parse(saved);
    setChecklist(data.checklist || initialChecklist);
    setConditions(data.conditions || []);
    setRatings(data.ratings || []);
  }
}, []);

// Save data on changes
useEffect(() => {
  localStorage.setItem('va-prep-data', JSON.stringify({
    checklist, conditions, ratings
  }));
}, [checklist, conditions, ratings]);
```

## Adding Export/Import

Add buttons to export data as JSON:

```jsx
const exportData = () => {
  const data = { checklist, conditions, ratings };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'va-prep-backup.json';
  a.click();
};

const importData = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    setChecklist(data.checklist);
    setConditions(data.conditions);
    setRatings(data.ratings);
  };
  reader.readAsText(file);
};
```

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons

## Disclaimer

This is an organizational and planning tool only. It does not constitute legal, medical, or financial advice. Always verify information with official VA resources.

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built for veterans, by veterans.** 🎖️
