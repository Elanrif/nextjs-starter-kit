"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@components/kickstart/auth/SignOutButton";
import { ROUTES } from "@/utils/routes";
import { useSession } from "@/hooks/use.session";
import { Sparkles } from "lucide-react";

const navLinks = [
  { href: "#docs", label: "Documentation" },
  { href: "#getting-started", label: "Démarrer" },
  { href: "#features", label: "Fonctionnalités" },
];

const { HOME, SIGN_IN, SIGN_UP } = ROUTES;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session, isLoading, error, invalidate } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={HOME}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-linear-to-br from-pink-400 to-purple-500 rounded-full animate-pulse" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kickstart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Auth Buttons (show/hide by session) */}
            <div className="flex items-center gap-4">
              {(() => {
                if (isLoading) {
                  return (
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-20 bg-gray-300 animate-pulse rounded-md"></div>
                      <div className="h-8 w-24 bg-gray-300 animate-pulse rounded-md"></div>
                    </div>
                  );
                }

                if (session && !error) {
                  return (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <SignOutButton
                        variant="destructive"
                        onSignOut={invalidate}
                      />
                    </>
                  );
                }

                return (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={SIGN_IN}>Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={SIGN_UP}>Register</Link>
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 px-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a
                  href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <a href="https://vercel.com/new" target="_blank" rel="noopener">
                  Deploy
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
