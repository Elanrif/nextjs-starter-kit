"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "./CodeBlock";

const docsCategories = [
  {
    id: "nvm",
    name: "NVM",
    icon: "🔧",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    content: {
      title: "Node Version Manager",
      description: "Manage multiple Node.js versions easily",
      warning:
        "If Node.js is already installed on your machine, you must uninstall it first before installing NVM.",
      link: "https://www.nvmnode.com/guide/download.html",
      commands: [
        { label: "Check current version", code: "nvm current" },
        { label: "Install specific version", code: "nvm install 20" },
        { label: "Use specific version", code: "nvm use 20" },
      ],
    },
  },
  {
    id: "eslint",
    name: "ESLint",
    icon: "🔍",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    content: {
      title: "ESLint",
      description:
        "Static code analysis tool for identifying problematic patterns",
      commands: [
        { label: "Install ESLint", code: "npm install eslint --save-dev" },
      ],
      scripts: {
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
    },
  },
  {
    id: "husky",
    name: "Husky",
    icon: "🐶",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    content: {
      title: "Husky",
      description: "Git hooks made easy for better commits",
      commands: [
        { label: "Install Husky", code: "npm install husky --save-dev" },
        { label: "Initialize Husky", code: "npx husky init" },
      ],
      hooks: {
        "pre-commit": `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install lint-staged`,
        "commit-msg": `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1`,
      },
    },
  },
  {
    id: "prettier",
    name: "Prettier",
    icon: "✨",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    content: {
      title: "Lint-Staged & Prettier",
      description: "Automatic code formatting on commit",
      commands: [
        {
          label: "Install packages",
          code: "npm install lint-staged prettier --save-dev",
        },
      ],
      scripts: {
        check: "npx prettier --check .",
        format: "npx prettier --write .",
      },
      tips: [
        "npm run check → Check if code is properly formatted",
        "npm run format → Automatically format all files",
      ],
    },
  },
  {
    id: "commitlint",
    name: "Commitlint",
    icon: "📝",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    content: {
      title: "Commitlint",
      description: "Enforce conventional commit messages",
      commands: [
        {
          label: "Install Commitlint",
          code: "npm install @commitlint/cli @commitlint/config-conventional --save-dev",
        },
        {
          label: "Create config",
          code: "echo \"module.exports = { extends: ['@commitlint/config-conventional'] };\" > commitlint.config.js",
        },
      ],
      examples: [
        "feat: add new feature",
        "fix: resolve bug issue",
        "docs: update documentation",
        "style: format code",
        "refactor: restructure code",
      ],
    },
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    icon: "🎨",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    content: {
      title: "shadcn/ui",
      description: "Beautiful components built with Radix UI and Tailwind CSS",
      commands: [
        { label: "Initialize shadcn/ui", code: "npx shadcn@latest init" },
        {
          label: "Add components",
          code: "npx shadcn@latest add button input card",
        },
        {
          label: "Add multiple",
          code: "npx shadcn@latest add button input card dialog",
        },
      ],
      link: "https://ui.shadcn.com/docs/components",
    },
  },
  {
    id: "axios",
    name: "Axios & Logger",
    icon: "🌐",
    color: "from-blue-500 to-teal-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    content: {
      title: "Axios & Next-Logger (Pino)",
      description: "HTTP client and structured logging for Next.js",
      commands: [
        {
          label: "Install all packages",
          code: "npm install axios next-logger pino pino-pretty",
        },
      ],
      codeExample: `// Axios - HTTP Client
import axios from "axios";

const response = await axios.get("/api/users");

const response = await axios.post(
  "/api/users",
  { name: "John" },
  { headers: { Authorization: \`Bearer \${token}\` } }
);

// Logger - Structured Logging
import { createLogger } from "@/lib/logger";

const logger = createLogger("UserService");
logger.info({ userId: 1 }, "User fetched");
logger.error({ err: error }, "Failed to fetch");`,
      tips: [
        "Axios: Promise-based HTTP client with interceptors",
        "Pino: Fast structured JSON logging",
        "Use pino-pretty for readable logs in development",
      ],
      link: "https://axios-http.com/docs/intro",
    },
  },
];

export function DocsSection() {
  const [activeTab, setActiveTab] = useState("nvm");
  const activeCategory = docsCategories.find((cat) => cat.id === activeTab);

  return (
    <section id="docs" className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-muted/50 via-transparent to-muted/50" />
        <div className="absolute top-1/4 left-0 w-150 h-150 bg-linear-to-r from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-150 h-150 bg-linear-to-l from-pink-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-violet-500/30 text-violet-600 dark:text-violet-400"
          >
            Documentation
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Development{" "}
            <span className="bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Tools Setup
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to configure your development environment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {docsCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === category.id
                  ? `bg-linear-to-r ${category.color} text-white shadow-lg scale-105`
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeCategory && (
          <Card
            className={`max-w-4xl mx-auto overflow-hidden border-2 ${activeCategory.borderColor} bg-card/50 backdrop-blur-sm animate-fade-in-up`}
          >
            <CardContent className="p-8">
              {/* Title */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-xl ${activeCategory.bgColor} flex items-center justify-center text-3xl`}
                >
                  {activeCategory.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {activeCategory.content.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeCategory.content.description}
                  </p>
                </div>
              </div>

              {/* Warning */}
              {activeCategory.content.warning && (
                <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl">⚠️</span>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {activeCategory.content.warning}
                      {activeCategory.content.link && (
                        <a
                          href={activeCategory.content.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-2 text-amber-600 dark:text-amber-400 underline hover:no-underline"
                        >
                          Download NVM →
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Commands */}
              {activeCategory.content.commands && (
                <div className="space-y-4">
                  {activeCategory.content.commands.map((cmd, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        {cmd.label}
                      </p>
                      <CodeBlock code={cmd.code} />
                    </div>
                  ))}
                </div>
              )}

              {/* Code Example */}
              {activeCategory.content.codeExample && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Usage example:
                  </p>
                  <CodeBlock
                    code={activeCategory.content.codeExample}
                    language="typescript"
                  />
                </div>
              )}

              {/* Scripts */}
              {activeCategory.content.scripts && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Add to package.json scripts:
                  </p>
                  <CodeBlock
                    code={JSON.stringify(
                      activeCategory.content.scripts,
                      null,
                      2,
                    )}
                    language="json"
                    filename="package.json"
                  />
                </div>
              )}

              {/* Hooks */}
              {activeCategory.content.hooks && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Git Hooks:
                  </p>
                  {Object.entries(activeCategory.content.hooks).map(
                    ([name, code]) => (
                      <div key={name}>
                        <p className="text-sm text-muted-foreground mb-2">
                          .husky/{name}
                        </p>
                        <CodeBlock code={code} filename={`.husky/${name}`} />
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Tips */}
              {activeCategory.content.tips && (
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    💡 Tips
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    {activeCategory.content.tips.map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commit Examples */}
              {activeCategory.content.examples && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Commit message examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.content.examples.map((example, idx) => (
                      <code
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm font-mono text-foreground"
                      >
                        {example}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Link for shadcn */}
              {activeCategory.id === "shadcn" &&
                activeCategory.content.link && (
                  <div className="mt-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <p className="text-sm text-violet-700 dark:text-violet-300">
                      💡 Browse all available components at{" "}
                      <a
                        href={activeCategory.content.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline font-medium"
                      >
                        ui.shadcn.com
                      </a>
                    </p>
                  </div>
                )}

              {/* Link for axios */}
              {activeCategory.id === "axios" && activeCategory.content.link && (
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📖 Read the full documentation at{" "}
                    <a
                      href={activeCategory.content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline font-medium"
                    >
                      axios-http.com
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
