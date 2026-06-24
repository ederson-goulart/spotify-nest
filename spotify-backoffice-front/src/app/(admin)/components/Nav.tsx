"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
}

type NavigationType = "desktop" | "humburguer";

interface NavProps {
  type?: NavigationType;
  navigation: NavigationItem[];
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Nav({ navigation, type = "desktop" }: NavProps) {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    const baseClasses =
      type === "desktop"
        ? "rounded-md px-3 py-2 text-sm font-medium"
        : "block rounded-md px-3 py-2 text-base font-medium";

    const activeClasses =
      pathname === href
        ? "bg-gray-900 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white";

    return classNames(activeClasses, baseClasses);
  };

  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={getLinkClasses(item.href)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
}
