import { component$ } from "@builder.io/qwik";
import { cn } from "~/lib/utils";
import { Link } from "@builder.io/qwik-city";

const MainNav = component$(() => {
  return (
    <nav class={cn("flex items-center space-x-4 lg:space-x-6")}>
      <Link
        href="/examples/dashboard"
        class="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/examples/dashboard"
        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link
        href="/examples/dashboard"
        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Products
      </Link>
      <Link
        href="/examples/dashboard"
        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  );
});

export default MainNav;
