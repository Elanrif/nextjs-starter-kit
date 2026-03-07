"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Code2,
  Palette,
  Database,
  Smartphone,
  Globe,
  Lock,
  Rocket,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";

const features = [
  {
    category: "Performance",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    items: [
      "Next.js 15 App Router",
      "Server Components optimisés",
      "Streaming & Suspense",
      "Image optimization intégrée",
    ],
  },
  {
    category: "Développement",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    items: [
      "TypeScript strict mode",
      "ESLint + Prettier configurés",
      "Husky Git hooks",
      "Hot reload instantané",
    ],
  },
  {
    category: "Interface Utilisateur",
    icon: <Palette className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    items: [
      "Tailwind CSS 4",
      "shadcn/ui components",
      "Design system cohérent",
      "Dark mode inclus",
    ],
  },
  {
    category: "Authentification",
    icon: <Shield className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    items: [
      "Session management",
      "JWT tokens sécurisés",
      "Middleware de protection",
      "Routes protégées",
    ],
  },
  {
    category: "Base de Données",
    icon: <Database className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    items: [
      "ORM moderne intégré",
      "Migrations automatiques",
      "Type safety complet",
      "Queries optimisées",
    ],
  },
  {
    category: "Déploiement",
    icon: <Globe className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    items: [
      "Vercel ready",
      "Docker support",
      "CI/CD configuré",
      "Analytics intégrées",
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 -left-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-700">
            <Settings className="w-4 h-4 mr-2" />
            Fonctionnalités Intégrées
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900">Tout ce dont vous avez besoin</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              prêt à l'emploi
            </span>
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Un starter kit complet avec les meilleures technologies et pratiques
            modernes. Plus besoin de passer des heures à configurer votre
            environnement de développement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Category */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                  {feature.category}
                </h3>

                {/* Feature List */}
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} mt-2 flex-shrink-0`}
                      />
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            {
              icon: <Rocket className="w-8 h-8" />,
              number: "15+",
              label: "Composants UI",
              color: "text-blue-600",
            },
            {
              icon: <Users className="w-8 h-8" />,
              number: "100%",
              label: "TypeScript",
              color: "text-purple-600",
            },
            {
              icon: <Lock className="w-8 h-8" />,
              number: "0",
              label: "Config Required",
              color: "text-emerald-600",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              number: "∞",
              label: "Possibilités",
              color: "text-pink-600",
            },
          ].map((stat, index) => (
            <div key={index} className="group">
              <div
                className={`${stat.color} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
              <div
                className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}
              >
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
