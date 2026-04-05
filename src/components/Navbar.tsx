"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-serif text-2xl text-gold">
            AutoFlow
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/catalog"
              className="text-muted hover:text-foreground transition-colors"
            >
              Catalogue
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Parametres
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
