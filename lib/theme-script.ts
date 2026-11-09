// Applies the theme before the first paint, in <head>. next-themes sets the
// same class, but its script sits inside <body> where the ThemeProvider is, so
// the browser could paint one white frame in dark mode before it ran. Same
// rules as the providers in app/[lang]/layout.tsx and app/library/layout.tsx:
// the saved choice ("theme" in localStorage), dark by default, "system"
// following the OS. Once the <head> is parsed it also sets the browser-bar
// color to match, since the static theme-color metas only know the OS scheme
// (values mirror --background in globals.css).
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("theme")||"dark";if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t!=="dark"&&t!=="light")t="dark";d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t;document.addEventListener("DOMContentLoaded",function(){var c=t==="dark"?"#1a1a1a":"#ffffff";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=c})})}catch(e){}})()`
