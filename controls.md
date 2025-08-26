# controls.css

A lightweight, consistent styling system for all HTML controls using CSS variables for easy theming and customization.
This system makes it incredibly easy to build consistent, professional-looking forms and interfaces while maintaining the flexibility to customize everything through CSS variables!

## How to Use This System

### 1. **Quick Start**
```html
<head>
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="controls.css">
</head>
```

### 2. **Easy Theming**
Change the entire appearance by modifying just a few variables:

```css
:root {
  /* Make everything sharp instead of rounded */
  --gui-radius: 0;

  /* Remove all borders */
  --border-width: 0;

  /* Change the primary color theme */
  --color-primary: #10b981; /* Green instead of blue */

  /* Make everything larger */
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.25rem;
}
```

### 3. **Example Usage**
```html
<!-- Basic form with consistent styling -->
<form>
  <div class="form-group">
    <label for="email" class="form-label">Email Address</label>
    <input type="email" id="email" placeholder="Enter your email">
    <span class="form-help">We'll never share your email</span>
  </div>

  <div class="form-group">
    <label class="form-label">
      <input type="checkbox"> Subscribe to newsletter
    </label>
  </div>

  <div class="flex justify-between">
    <button type="button" class="btn-outline">Cancel</button>
    <button type="submit" class="btn-primary">Subscribe</button>
  </div>
</form>
```

## Key Benefits

### 🎨 **Consistent Design**
- All controls use the same spacing, colors, and borders
- Change one variable to affect the entire system

### 🔧 **Easy Customization**
- Want sharp corners? Change `--gui-radius` to `0`
- Need no borders? Set `--border-width` to `0`
- Different brand colors? Update the color variables

### 📱 **Responsive & Accessible**
- Automatic dark mode support
- Proper focus indicators
- Touch-friendly sizing

### 🚀 **Framework-Inspired Utilities**
- Most useful utility classes from Tailwind/Bootstrap
- Consistent naming patterns
- Easy to remember and use


## 🎯 **Organized CSS Variables**
- **Grouped properties**: All border-related controls use the same `--border-*` variables
- **Single control points**: Change `--gui-radius` to affect ALL rounded corners
- **Semantic organization**: Colors, spacing, borders, and shadows are logically grouped

## 🔧 **Easy Global Changes**
Want to make everything sharp? Just change:
```css
--gui-radius: 0;
```

Want to remove all borders? Just change:
```css
--border-width: 0;
```

Want a different color scheme? Change:
```css
--color-primary: #10b981; /* Now everything is green instead of blue */
```

## 📐 **Consistent System**
- All form controls use the same padding, borders, and focus styles
- Buttons and inputs feel like they belong together
- Dark mode automatically supported
- Professional focus indicators throughout

## 🛠️ **Smart Utilities**
- Flexbox utilities (`.flex`, `.justify-center`, `.items-center`)
- Spacing utilities (`.m-4`, `.p-2`, `.mt-3`)
- Display utilities (`.block`, `.hidden`, `.w-full`)
- Color utilities (`.text-primary`, `.bg-success`)

## 💡 **Educational Comments**
Every section is thoroughly documented so developers understand:
- Why each rule exists
- How the variables work together
- How to customize for their needs
