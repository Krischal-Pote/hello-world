import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const navigate = useNavigate();
  const [role, setRole] = useState(session?.user.role || "user");

  useEffect(() => {
    setRole(session?.user?.role ?? "user");
  }, [session]);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["services", "how-it-works", "stories"];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleHashNavigation = (hash: string) => {
    closeMenu();
    setActiveSection(hash); // Set active immediately on click

    if (window.location.pathname !== "/") {
      navigate({ to: "/" }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      });
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Helper function to get button classes based on active state
  const getNavButtonClass = (sectionId: string) => {
    const baseClass =
      "font-medium cursor-pointer bg-transparent border-none transition-colors";
    const isActive = activeSection === sectionId;

    return `${baseClass} ${isActive
      ? "text-primary font-semibold"
      : "text-[var(--text-secondary)] hover:text-primary"
      }`;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-lg shadow-lg"
        : "bg-white/90 backdrop-blur-md"
        } shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <img
              src="/logo/logo.png"
              alt="DharmaBhav icon"
              className="w-32 h-32"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => handleHashNavigation("services")}
              className={getNavButtonClass("services")}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => handleHashNavigation("how-it-works")}
              className={getNavButtonClass("how-it-works")}
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleHashNavigation("stories")}
              className={getNavButtonClass("stories")}
            >
              Devotee Stories
            </button>
            {session && (
              <Link
                to="/profile"
                className="text-[var(--text-secondary)] hover:text-primary transition-colors font-medium"
                activeProps={{
                  className: "text-primary font-semibold",
                }}
              >
                Profile
              </Link>
            )}
            {session && (role === "admin" || role === "shopkeeper") && (
              <Link
                to="/fulfillment/items-management"
                className="text-[var(--text-secondary)] hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:block">
            {session ? (
              <button
                onClick={() => {
                  sessionStorage.removeItem("userRole");
                  signOut();
                }}
                className="bg-gradient-primary text-on-primary shadow-md hover:shadow-orange"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn.social({ provider: "google" })}
                className="bg-gradient-primary text-on-primary shadow-md hover:shadow-orange"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <title>Google Logo</title>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            )}
          </div>

          <button
            ref={buttonRef}
            type="button"
            className="md:hidden text-[var(--text-primary)] hover:text-primary rounded-lg transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{isMenuOpen ? "Close menu" : "Open menu"}</title>
              {isMenuOpen ? (
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

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden py-4 border-t border-[var(--border)] bg-white/95 backdrop-blur-lg"
          >
            <div className="flex flex-col gap-4 px-2">
              <button
                type="button"
                onClick={() => handleHashNavigation("services")}
                className={`transition-all py-2 px-4 rounded-lg font-medium text-left ${activeSection === "services"
                  ? "text-primary font-semibold bg-[var(--surface-elevated)]"
                  : "text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--surface-elevated)]"
                  }`}
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => handleHashNavigation("how-it-works")}
                className={`transition-all py-2 px-4 rounded-lg font-medium text-left ${activeSection === "how-it-works"
                  ? "text-primary font-semibold bg-[var(--surface-elevated)]"
                  : "text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--surface-elevated)]"
                  }`}
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleHashNavigation("stories")}
                className={`transition-all py-2 px-4 rounded-lg font-medium text-left ${activeSection === "stories"
                  ? "text-primary font-semibold bg-[var(--surface-elevated)]"
                  : "text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--surface-elevated)]"
                  }`}
              >
                Devotee Stories
              </button>
              {session && (
                <Link
                  to="/profile"
                  className="text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--surface-elevated)] transition-all py-2 px-4 rounded-lg font-medium"
                  onClick={closeMenu}
                  activeProps={{
                    className:
                      "text-primary font-semibold bg-[var(--surface-elevated)]",
                  }}
                >
                  Profile
                </Link>
              )}
              {session && (role === "admin" || role === "shopkeeper") && (
                <Link
                  to="/fulfillment/items-management"
                  className="text-[var(--text-secondary)] hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}

              <div className="pt-2 px-4">
                {session ? (
                  <button
                    className="w-full bg-gradient-primary text-on-primary shadow-md hover:shadow-orange transition-all duration-300"
                    onClick={() => {
                      sessionStorage.removeItem("userRole");
                      signOut();
                      closeMenu();
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      signIn.social({ provider: "google" });
                      closeMenu();
                    }}
                    className="w-full bg-gradient-primary text-on-primary shadow-md hover:shadow-orange transition-all duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <title>Google Logo</title>
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
