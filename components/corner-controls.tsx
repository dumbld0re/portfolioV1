"use client";

import { Infinity as InfinityIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { siteCopy } from "@/content/site";
import {
  useHasLanguages,
  useLanguageOrDefault,
} from "@/components/language-provider";
import { LanguageSwitch } from "@/components/language-switch";
import {
  getServerSnapshot,
  getSnapshot,
  setBoring,
  subscribe,
} from "@/lib/boring-store";
import { stripLanguage } from "@/lib/i18n";
import * as loop from "@/lib/loop-store";
import * as sound from "@/lib/sound";
import { cn } from "@/lib/utils";

const corner =
  "fixed bottom-4 z-40 hidden lg:flex items-center gap-6 rounded-full bg-background/85 px-4 py-1.5 font-mono text-sm backdrop-blur-sm print:hidden";
const control = "text-muted-foreground transition-colors hover:text-foreground";

// Small text controls pinned to the bottom right: the language switch, which
// shows once the header is out of sight so the language can be changed from
// anywhere on the page, and on the home page's first screen the ∞ loop
// switch. Boring mode and sound are in the home page's footer.
export function CornerControls() {
  const labels = siteCopy[useLanguageOrDefault()];
  const hasLanguages = useHasLanguages();
  const loopOn = useSyncExternalStore(
    loop.subscribe,
    loop.getSnapshot,
    loop.getServerSnapshot,
  );
  const path = stripLanguage(usePathname());
  // Only the home page loops (components/page-loop.tsx).
  const home = path === "/";
  // A post's text runs down the left edge, so "say hello" stays out of it there.
  const reading = path.startsWith("/posts/");
  // The posts list and the projects pages keep only the language pill, at every width.
  const projects =
    path.startsWith("/projects") || path === "/posts" || path === "/things";
  // Posts are English-only, so on one the language switch would do nothing.
  const languages = hasLanguages && !reading;

  // Inside a place on the home page there is no loop, so no ∞ either
  // (components/explore/shelf.ts marks <html> while one is open).
  const [placeOpen, setPlaceOpen] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setPlaceOpen(root.hasAttribute("data-place-open"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-place-open"] });
    return () => observer.disconnect();
  }, []);

  // The header has its own language link, so the one down here only comes
  // in once the header has scrolled off the screen. On phones and tablets the
  // footer carries the languages too, so the floating one steps aside again
  // when the footer comes into view, instead of sitting on top of it.
  const [headerGone, setHeaderGone] = useState(false);
  const [footerHere, setFooterHere] = useState(false);
  useEffect(() => {
    // The home page's loop echo carries a second header (components/page-loop.tsx).
    const headers = [...document.querySelectorAll("header")];
    const footer = document.querySelector("[data-site-footer]");
    const seen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === footer) setFooterHere(entry.isIntersecting);
        else if (entry.isIntersecting) seen.add(entry.target);
        else seen.delete(entry.target);
      }
      setHeaderGone(seen.size === 0);
    });
    headers.forEach((el) => observer.observe(el));
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, [loopOn]);
  const languageSwitch = languages && headerGone;
  const floating = languageSwitch && !footerHere;
  const fade = (shown: boolean) =>
    cn(
      "transition-opacity duration-300",
      !shown && "pointer-events-none opacity-0",
    );

  return (
    <>
      {languages && (
        <div
          inert={!floating}
          className={cn(
            "fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-[calc(0.75rem+env(safe-area-inset-right))] z-40 flex items-center rounded-full bg-background/85 px-2 font-mono text-sm text-muted-foreground backdrop-blur-sm print:hidden",
            !projects && "lg:hidden",
            // The home page has the languages at its top and in its footer already.
            home && "hidden",
            fade(floating),
          )}
        >
          <LanguageSwitch
            className={cn(control, "px-2 py-2.5")}
            currentClassName="px-2 py-2.5"
          />
        </div>
      )}
      {/* Wide screens: the languages and the loop, nothing else; the boring
          and sound switches live in the home page's footer. */}
      {!projects && (
        <div
          className={cn(corner, "right-3", fade(languageSwitch || (home && !placeOpen)))}
          inert={!languageSwitch && !(home && !placeOpen)}
        >
          {languages && (
            <span
              inert={!languageSwitch}
              className={cn(
                "flex items-center gap-2.5 text-muted-foreground",
                fade(languageSwitch),
              )}
            >
              <LanguageSwitch className={control} />
            </span>
          )}
          {home && !placeOpen && (
            <button
              type="button"
              role="switch"
              aria-checked={loopOn}
              aria-label={labels.loopLabel}
              title={labels.loopLabel.toLowerCase()}
              onClick={() => loop.setLoop(!loopOn)}
              className={cn(
                control,
                "-my-1 py-1",
                loopOn && "text-primary hover:text-primary",
              )}
            >
              <InfinityIcon
                aria-hidden="true"
                className="size-[1.6em]"
                strokeWidth={1.75}
              />
            </button>
          )}
        </div>
      )}
    </>
  );
}

/** "boring: off  sound: off": the two switches in the footer
 *  (components/site-footer.tsx). */
export function ModeSwitches({ className = control }: { className?: string }) {
  const labels = siteCopy[useLanguageOrDefault()];
  const boring =
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== "off";
  const soundOn = useSyncExternalStore(
    sound.subscribe,
    sound.getSnapshot,
    sound.getServerSnapshot,
  );

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={boring}
        aria-label={labels.boringLabel}
        onClick={() => setBoring(!boring)}
        className={className}
      >
        {labels.boring.toLowerCase()}:{" "}
        <span className={boring ? "text-primary" : undefined}>
          {boring ? labels.on : labels.off}
        </span>
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={soundOn}
        aria-label={labels.soundLabel}
        data-sound-switch=""
        onClick={() => sound.setSound(!soundOn)}
        className={className}
      >
        {labels.sound}:{" "}
        <span className={soundOn ? "text-primary" : undefined}>
          {soundOn ? labels.on : labels.off}
        </span>
      </button>
    </>
  );
}
