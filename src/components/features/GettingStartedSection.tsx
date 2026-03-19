import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Copy,
  Download,
  ArrowRight,
  Terminal,
  Code2,
  Rocket,
} from "lucide-react";

export default function GettingStartedSection() {
  return (
    <section
      id="getting-started"
      className="relative py-10 sm:py-16 bg-emerald-50 overflow-hidden"
    >
      {/* Beautiful Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200 rounded-full opacity-25" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-200 rounded-full opacity-20" />
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-emerald-300 rounded-full opacity-15" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-emerald-100 border border-emerald-300 text-emerald-700">
            <Zap className="w-4 h-4 mr-2" />
            Quick Start
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">Get Started in </span>
            <span className="text-emerald-600">Minutes</span>
          </h2>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Clone the repository and start building your next modern web
            application. Everything is already configured and ready to use.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              step: "01",
              title: "Clone Repository",
              description:
                "Get the complete source code with all configurations included.",
              icon: <Download className="w-6 h-6" />,
              color: "bg-teal-500",
              bgColor: "bg-teal-50",
              borderColor: "border-teal-200",
            },
            {
              step: "02",
              title: "Install Dependencies",
              description:
                "Automatically install all necessary packages and tools.",
              icon: <Code2 className="w-6 h-6" />,
              color: "bg-emerald-500",
              bgColor: "bg-emerald-50",
              borderColor: "border-emerald-200",
            },
            {
              step: "03",
              title: "Start Building",
              description:
                "Launch your development server and start coding immediately.",
              icon: <Rocket className="w-6 h-6" />,
              color: "bg-cyan-500",
              bgColor: "bg-cyan-50",
              borderColor: "border-cyan-200",
            },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div
                className={`${item.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${item.borderColor} group-hover:-translate-y-2`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white mb-6 shadow-md`}
                >
                  {item.icon}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-emerald-300">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Simulation */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gray-900">
            {/* Terminal header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-800/50 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-sm text-gray-400 bg-gray-700/50 px-4 py-1 rounded-md flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Terminal - nextjs-kickstart
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Terminal content */}
            <CardContent className="p-0 bg-gray-900">
              <div className="p-8 font-mono text-sm space-y-4">
                {[
                  {
                    command:
                      "git clone https://github.com/Elanrif/kickstart-nextjs-starter-kit.git",
                    delay: "0s",
                  },
                  { command: "cd kickstart-nextjs-starter-kit", delay: "0.5s" },
                  { command: "npm install", delay: "1s" },
                  { command: "cp .env.example .env.local", delay: "1.5s" },
                  { command: "npm run dev", delay: "2s" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 group opacity-0 animate-fade-in-up"
                    style={{ animationDelay: item.delay }}
                  >
                    <span className="text-emerald-400 mt-0.5">$</span>
                    <code className="text-gray-300 group-hover:text-white transition-colors flex-1">
                      {item.command}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </Button>
                  </div>
                ))}

                <div
                  className="flex items-start gap-3 pt-4 border-t border-gray-700 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "2.5s" }}
                >
                  <span className="text-cyan-400 mt-0.5">→</span>
                  <div className="flex-1 space-y-1">
                    <code className="text-cyan-300 block">
                      Local server ready on http://localhost:3000
                    </code>
                    <code className="text-green-400 block">
                      ✓ Ready in 1.2s
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            size="lg"
            className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/Elanrif/kickstart-nextjs-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Rocket className="w-5 h-5 mr-3" />
              Deploy to Vercel
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 bg-white border-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a
              href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
