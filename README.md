This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## NVM (Node Version Manager)

> ⚠️ **Warning:** If Node.js is already installed on your machine, you must uninstall it first before installing NVM. Download and install NVM from: [https://www.nvmnode.com/guide/download.html](https://www.nvmnode.com/guide/download.html)

### Useful Commands

```bash
# Check the currently active Node.js version
nvm current

# Install a specific Node.js version
nvm install 20

# Use a specific Node.js version
nvm use 20
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

> ⚠️ **Note:** This project uses the `src/` directory structure. If you have `app/` directly at the root instead of `src/app/`, update the path alias in `tsconfig.json`:
>
> ```json
> "paths": {
>   "@/*": ["./*"],              // For app/ at root
>   // "@/*": ["./src/*"],       // For src/app/ structure (current)
>   "@lib/*": ["./src/lib/*"],
>   "@utils/*": ["./src/utils/*"],
>   "@components/*": ["./src/components/*"],
>   "@config/*": ["./src/config/*"],
>   "@hooks/*": ["./src/hooks/*"],
>   "@context/*": ["./src/context/*"],
>   "@app/*": ["./src/app/*"],
>   "~/*": ["./public/*"]
> }
> ```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Development Tools Installation

### ESLint

ESLint is already configured in this project. To install or reinstall it:

```bash
npm install eslint --save-dev
```

### Husky

Husky allows you to set up Git hooks easily. To install and configure it:

```bash
# Install Husky
npm install husky --save-dev

# Initialize Husky
npx husky init

# Add a pre-commit hook (runs lint-staged)
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install lint-staged' > .husky/pre-commit

# Add a commit-msg hook (runs commitlint)
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1' > .husky/commit-msg
```

### Lint-Staged & Prettier

Install lint-staged and prettier for automatic formatting on commit:

```bash
npm install lint-staged prettier --save-dev
```

Add these scripts to your `package.json`:

```json
"scripts": {
  "check": "npx prettier --check .",
  "format": "npx prettier --write ."
}
```

- `npm run check` → Check if code is properly formatted (without modifying)
- `npm run format` → Automatically format all files

### Commitlint

Install commitlint to enforce conventional commit messages:

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# Create commitlint config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

### Shadcn/ui

Shadcn/ui is a collection of reusable components built with Radix UI and Tailwind CSS.

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components (examples)
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# Add multiple components at once
npx shadcn@latest add button input card dialog
```

> 💡 **Tip:** Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
