"use client";

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";

import { useAuth } from "@/features/auth/AuthProvider";
import Container from "./Container";
import KruzoLogo from "./KruzoLogo";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { text: "Home", url: "/" },
  { text: "Process Documents", url: "/upload" },
  { text: "Developers", url: "/developers", secondary: true },
  { text: "Contact", url: "/contact" },
];

const AccountMenu: React.FC = () => {
  const { user, credits, logout } = useAuth();
  if (!user) return null;
  const name = user.full_name || user.email;
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <Menu as="div" className="relative">
      <MenuButton className="account-button" aria-label="Open account menu">
        <span aria-hidden="true">{initial}</span>
      </MenuButton>
      <Transition as={Fragment} enter="transition-opacity duration-100" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-75" leaveFrom="opacity-100" leaveTo="opacity-0">
        <MenuItems anchor="bottom end" className="z-[70] mt-2 w-64 rounded-md border border-border bg-card p-2 shadow-md [--anchor-gap:8px]">
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="mt-1 text-xs text-muted">{credits ? `${credits.balance} Credits` : "Credit balance unavailable"}</p>
          </div>
          <MenuItem>
            <Link href="/results" className="account-menu-item">History</Link>
          </MenuItem>
          <MenuItem>
            <button type="button" className="account-menu-item w-full text-left" onClick={logout}>Sign out</button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

const Header: React.FC = () => {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const { user, credits, loading, logout } = useAuth();
  const isActive = (url: string) => url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b">
      <Container className="!px-0">
        <nav className="flex h-16 items-center justify-between px-5" aria-label="Primary navigation">
          <Link href="/" onClick={() => setIsOpen(false)} aria-label="Kruzo Document AI home"><KruzoLogo /></Link>
          <div className="hidden items-center gap-5 lg:flex">
            <ul className="flex items-center gap-5">
              {navigation.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className={clsx("app-nav-link", item.secondary && "text-sm font-medium text-muted", isActive(item.url) && "is-active")} aria-current={isActive(item.url) ? "page" : undefined}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
            {!loading && (user ? <AccountMenu /> : <Link href="/login" className="text-sm font-semibold">Sign in</Link>)}
            <ThemeToggle compact />
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {user && <AccountMenu />}
            <ThemeToggle compact />
            <button type="button" className="brand-button brand-button-secondary h-10 w-10 p-0" aria-controls="mobile-menu" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
              {isOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </nav>
      </Container>

      <Transition show={isOpen} enter="transition-opacity duration-100" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-75" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div id="mobile-menu" className="site-mobile-menu border-t lg:hidden">
          <Container>
            <ul className="grid gap-1 py-3">
              {navigation.map((item) => (
                <li key={item.url}><Link href={item.url} className={clsx("block rounded px-3 py-2 text-sm font-semibold", item.secondary ? "text-muted" : "text-foreground", isActive(item.url) && "bg-card-muted")} onClick={() => setIsOpen(false)}>{item.text}</Link></li>
              ))}
              {!loading && !user && <li><Link href="/login" className="block rounded px-3 py-2 text-sm font-semibold" onClick={() => setIsOpen(false)}>Sign in</Link></li>}
              {user && (
                <li className="mt-1 border-t border-border px-3 pt-3">
                  <p className="truncate text-sm font-semibold">{user.full_name || user.email}</p>
                  <p className="mt-1 text-xs text-muted">{credits ? `${credits.balance} Credits` : ""}</p>
                  <div className="mt-2 flex gap-4">
                    <Link href="/results" className="text-sm font-semibold" onClick={() => setIsOpen(false)}>History</Link>
                    <button type="button" className="text-sm font-semibold" onClick={() => { logout(); setIsOpen(false); }}>Sign out</button>
                  </div>
                </li>
              )}
            </ul>
          </Container>
        </div>
      </Transition>
    </header>
  );
};

export default Header;
