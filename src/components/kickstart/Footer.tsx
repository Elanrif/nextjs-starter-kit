import { ROUTES } from "@/utils/routes";
import Link from "next/link";
import {
  Sparkles,
  Github,
  Twitter,
  Mail,
  ExternalLink,
  Heart,
} from "lucide-react";

const footerSections = {
  product: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Documentation", href: "#docs" },
    { label: "Démarrer", href: "#getting-started" },
    {
      label: "Exemples",
      href: "https://github.com/Elanrif/kickstart-nextjs-starter-kit/tree/main/examples",
    },
  ],
  resources: [
    { label: "Next.js Docs", href: "https://nextjs.org/docs" },
    { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    { label: "shadcn/ui", href: "https://ui.shadcn.com" },
    { label: "TypeScript", href: "https://typescriptlang.org" },
  ],
  community: [
    {
      label: "GitHub",
      href: "https://github.com/Elanrif/kickstart-nextjs-starter-kit",
    },
    { label: "Discord", href: "https://discord.gg/nextjs" },
    { label: "Twitter", href: "https://twitter.com/nextjs" },
    {
      label: "Discussions",
      href: "https://github.com/Elanrif/kickstart-nextjs-starter-kit/discussions",
    },
  ],
  legal: [
    {
      label: "Licence MIT",
      href: "https://github.com/Elanrif/kickstart-nextjs-starter-kit/blob/main/LICENSE",
    },
    { label: "Confidentialité", href: "/privacy" },
    { label: "Conditions", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

const { HOME } = ROUTES;

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={HOME} className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Kickstart
              </span>
            </Link>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              Le boilerplate Next.js ultime pour créer des applications web
              modernes, performantes et scalables en quelques minutes.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                {
                  icon: <Github className="w-5 h-5" />,
                  href: "https://github.com/Elanrif/kickstart-nextjs-starter-kit",
                  label: "GitHub",
                },
                {
                  icon: <Twitter className="w-5 h-5" />,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  href: "mailto:contact@kickstart.dev",
                  label: "Email",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerSections).map(([sectionKey, links]) => (
              <div key={sectionKey}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                  {sectionKey === "product"
                    ? "Produit"
                    : sectionKey === "resources"
                      ? "Ressources"
                      : sectionKey === "community"
                        ? "Communauté"
                        : sectionKey === "legal"
                          ? "Légal"
                          : sectionKey}
                </h3>
                <ul className="space-y-4">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                        {link.href.startsWith("http") && (
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400">
              <span>© {new Date().getFullYear()} Kickstart Next.js.</span>
              <span>Créé avec</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>par des développeurs passionnés</span>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Propulsé par</span>
              <div className="flex items-center gap-4">
                {[
                  { name: "Next.js", href: "https://nextjs.org" },
                  { name: "Vercel", href: "https://vercel.com" },
                  { name: "TypeScript", href: "https://typescriptlang.org" },
                ].map((tech, index) => (
                  <a
                    key={index}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {tech.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              🚀 Commencez votre prochain projet avec le meilleur starter kit
              Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
