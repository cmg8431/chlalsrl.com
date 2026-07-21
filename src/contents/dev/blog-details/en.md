---
title: "I rebuilt my blog, a few hundred years later"
description: "After years of putting it off, I finally tore down my blog and rebuilt it. Notes from hand-rolling the toasts, gestures, and comments."
date: "2026-07-22"
tags: ["blog", "interaction", "Next.js"]
---

I rebuilt my blog.
I'd been saying "I should really work on my blog" for years, so it feels like a few hundred years overdue.
The whole point was to write more, but I came to my senses weeks later having written nothing and rebuilt everything else.

In my defense, building it was fun.
The toasts, the gestures, the comments: one by one, I ended up implementing them all by hand.
Not because good libraries don't exist, but because as I went along, the reasons to use one kept disappearing.

Here's what I stepped on during those weeks, with code.
There's a CSS bug that ate half a day, a mascot that survived exactly three minutes, and the answer to why this domain is chlalsrl.com.
The recordings below are the deployed site, captured in a headless browser.

## One capsule instead of toasts

I've never liked UIs where toasts pile up in a corner of the screen.
Link copied, theme changed, comment posted. There's plenty to announce, and it's chaos when each one pops up somewhere different.
So the navigation capsule at the top doubles as the notification channel.
Normally it holds home, search, theme, and language buttons; when there's something to say, it hides the controls and stretches to fit the message, then shrinks back.

![Switching themes makes the capsule stretch to show a message](/posts/blog-details/island.gif)

I hit a wall immediately: CSS cannot animate a transition to `width: auto`.
And since every message has a different width, there's no way to know the target width in advance.
So I used the FLIP technique.
Pin the current width in pixels, then set the target width on the next frame and let the transition run.

```tsx
const target = message
  ? msg.offsetWidth + PADDING * 2
  : controls.offsetWidth + PADDING;

island.style.width = `${island.offsetWidth}px`;
requestAnimationFrame(() => {
  island.style.width = `${target}px`;
});
```

After it collapses, the width has to go back to `auto`.
The home button appears and disappears depending on the page, which changes the controls' width, and a leftover fixed pixel value drifts out of sync.
I ignored this at first and only noticed much later that the capsule was overflowing sideways, but only on the home page.

State management is a store built on a single listener Set, subscribed via `useSyncExternalStore`.
The whole thing is under 70 lines.
The entire design is one separation: messages that appear and vanish, versus context that persists while you stay on a page (like reading progress).
Any component can fire a notification with one `islandStore.notify()` call, so I never have to think about notification UI when adding a feature.

Once the feature worked, I spent more time on the small rules than the feature itself.

- Scroll down and it hides; scroll up and it returns. Movements under 6px are ignored so it doesn't jitter on micro-scrolls
- While a message is showing, scrolling doesn't hide it
- The capsule lives outside any wrapper with `overflow` clipping, because a clipping ancestor breaks `backdrop-filter`

That last item is the half-day bug from the intro.
One day the capsule's blur just vanished, and the capsule's own code looked perfectly fine no matter how long I stared.
The culprit was a single `overflow` clipping line I'd added to a wrapper while tidying the layout.
The bug is always in the file you're not looking at.

## Page transitions

The web hard-cuts every time a page changes.
Compared to native apps this always bothered me, and now there's a standard to fix it: the View Transitions API.
I wired it into Next.js with next-view-transitions.
This isn't something you can build yourself anyway, since it's browser-internal, so here I happily used a library.

![Page transitions moving from home to the post list to a post](/posts/blog-details/view-transition.gif)

Give the wordmark on the home page a `view-transition-name`, and when the page changes the browser snapshots the old and new screens and interpolates just that element into place.
The routing code stays plain links.
Unsupported browsers get an instant transition.
Features like this should quietly disappear where they can't work.

## Swiping between posts on mobile

On mobile, finishing a post means going back to the list to find the next one.
That round trip has always annoyed me.
I wanted to flip sideways like turning a page, and building that turned into the longest-running interaction of this redesign.

Pull the screen sideways while reading and an overlay seeps in from the edge with the previous post's title; pull far enough and release, and you move to that post.
Release halfway and it snaps back.

![Pulling a post to the right reveals the previous post's title, and releasing slides over to it](/posts/blog-details/swipe.gif)

No gesture library, just touchstart, touchmove, and touchend.
The event handling itself is nothing.
The hard part was deciding what counts as a swipe.

- Only when horizontal movement exceeds 10px and is more than 1.2× the vertical movement
- If the touch moves more than 12px vertically before qualifying, it's ignored for good. That's scroll intent
- Touches starting on elements with their own horizontal scroll, like code blocks and tables, are ignored
- Once a swipe qualifies, scrolling is locked with `preventDefault()`. The listener must be registered with `passive: false`

The feel of the pull comes from one damping function.

```ts
const THRESHOLD = 88;
const damp = (p: number) =>
  0.32 * Math.min(p, THRESHOLD) + 0.14 * Math.max(0, p - THRESHOLD);
```

If you move the content as far as the finger travels, it slides way too much and feels cheap.
Compressing it to 0.32× up to the threshold and 0.14× beyond is what creates resistance.
Crossing 88px bumps the overlay's tone slightly to signal "release here and you'll navigate."
There's no theory behind these coefficients.
I tuned them by pulling on a real device, and I couldn't find any other way.

On release, the overlay clears and hands off to a View Transitions slide.
The page slides out in the same direction you were pulling, so the gesture and the transition read as one motion.
Reachable posts are prefetched with `router.prefetch`, so there's no wait when you let go.
The snap-back uses `cubic-bezier(0.34, 1.3, 0.5, 1)`, a spring curve that overshoots slightly on the way back.

The visual side wasn't smooth either.
The first version was a busy preview with a circular arrow chip, a mono-font label card, and an amber accent.
Two rewrites later, only the gradient overlay and the post title remain.
The more I piled on, the noisier it looked, so in the end I stripped it all out.

The overlay is rendered straight into body with `createPortal`.
The moment the content gets a `transform`, any `position: fixed` inside it anchors to the content instead of the viewport.
During a swipe the whole page is being pushed by a transform, so an overlay inside it would get pushed along with it.

As an aside: while recording the clip above, I first pulled left and nothing happened.
I assumed it was a bug and opened the code, but it wasn't.
It was the newest post, so there was no next post, and the gesture is designed to refuse when there's nowhere to go.
Blocked by my own guard code.

## Sharing a single sentence

Getting a whole post link shared is nice, but someone sending you one sentence they highlighted from your post is much better.
It means that sentence stayed with them.
So selecting text in a post brings up a share button.

![Selecting text in a post shows a share button that copies a sentence link](/posts/blog-details/highlight.gif)

The server does nothing here.
A URL standard does almost all of it.

```ts
const url = `${location.origin}${location.pathname}#:~:text=${encodeURIComponent(clean)}`;
```

Text Fragments (`#:~:text=`) are natively supported by browsers, so whoever opens the link gets scrolled to the sentence and sees it highlighted automatically.
No database of anchors, no IDs planted in the content.
All my code does is listen to `selectionchange` and show the button when the conditions fit.

- Under 8 characters is ignored. That's closer to an accidental drag
- Over 300 characters is ignored too. That's copying the article, not sharing a sentence
- Selections outside the article body are ignored

The button has `onMouseDown={(e) => e.preventDefault()}` on it.
It didn't at first, and clicking the button dissolved the selection, which made the button vanish mid-click.
It took me a while to understand, because the click wasn't failing, the button was disappearing before the click landed.

Shared sentences are tallied in Supabase along with the post slug.
When several people share the same sentence, it shows up under the post as "sentences readers underlined."
I'm curious myself which sentences will survive.

## Reading settings and the flash

The white flash when you refresh in dark mode is a famous problem.
What nobody seems to mention is that font size settings cause exactly the same one.

Posts have three font sizes and a focus mode, applied as data attributes on `<html>` and saved to localStorage.
The most important code in this feature isn't a React component, it's the inline script that runs before React does.

```js
(function () {
  try {
    var d = document.documentElement, t = localStorage.getItem("theme");
    if (t === "dark" || t === "light") d.dataset.theme = t;
    var s = localStorage.getItem("reading-size");
    if (s === "sm" || s === "lg") d.dataset.readingSize = s;
  } catch (e) {}
})();
```

If applying the saved value waits for hydration, anyone who set their text to large watches it jump from small to large on every refresh.
Same cause as the theme flash, same fix.
Theme or font size, everything gets planted by the same script before first paint.

Focus mode keeps only the paragraphs inside a band around the vertical center of the viewport, 60% tall, and dims the rest.
My eyes tend to wander to other lines in long articles, so this one was built for me first.

![Turning on focus mode keeps only the paragraphs near the center bright](/posts/blog-details/focus-mode.gif)

On every scroll it measures the content blocks with `getBoundingClientRect` and toggles a class based on whether they intersect the band.
The work is throttled with `requestAnimationFrame`, once per frame.
For the few dozen blocks in a post this is plenty, and I still haven't found a reason to switch to IntersectionObserver.

There's one correction.
When a block taller than the band comes through, the plain condition produces a moment where the entire screen goes dim.
So the block closest to center is always kept bright, regardless of the condition.
I only realized this was needed after stopping mid-scroll in the middle of a long paragraph.

## Comments without a backend

I believe requiring login kills comments on a personal blog.
But leave it anonymous and the name field becomes the problem.
People deliberate over what to type and just close the tab.

So the form opens pre-filled with a random nickname.
Press the button next to it and the name re-rolls eight times at 70ms intervals before stopping.
Keep rolling until one feels right.

![Pressing the name roll button spins nicknames like a slot machine](/posts/blog-details/nickname-roll.gif)

Avatars aren't stored anywhere.
They're drawn from a hash of the name string, picking from 16 emoji and 6 background colors, so the same name always gets the same face and a new name gets a new one.
The avatar spinning along while the slot rolls is a side effect of this structure, and it ended up being my favorite part.
Some features come out better than intended.

There's no backend.
The browser calls Supabase REST directly, with permissions left to RLS.
Without env vars, local development falls back to localStorage only, which means it works offline too.
Spam defense starts with a single honeypot input hidden off-screen.
If it gets beaten, I'll play the next move then.

What took longer than the feature was the shape of the input card.
I removed the inner dividers, added a focus ring, walked it back to a neutral tone because the color clashed, and finally swapped the box ring for an underline.
Then I found the global `focus-visible` outline was also hitting text inputs, doubling lines inside the card, and carved out an exception for inputs.
Four style commits piled up on one comment card.
This is what happens when you develop without a designer.

## What's hidden in the search box

⌘K opens the search palette.
Title search and recently viewed posts are the normal part; type a command and it behaves like a terminal.
`help`, `theme dark`, `go blog`, `whoami`, and `qwerty`.

![Typing qwerty 최민기 into the ⌘K palette outputs chlalsrl](/posts/blog-details/command-menu.gif)

Here's the domain secret promised in the intro.
`qwerty` converts Korean text to the letters you'd get typing it on a QWERTY keyboard, and `qwerty 최민기` outputs `chlalsrl`.
Type my name "최민기" without switching your keyboard out of English, and you get chlalsrl.
The downside is that saying the domain out loud always requires the full story, but anyone who hears it remembers it in one shot.

Entering the Konami code with the arrow keys gets a greeting from the capsule, and the dev tools console carries the deployed commit hash.
None of this matters if nobody finds it.
But if someone someday types `sudo` into ⌘K and laughs, that's worth the build.

## Two eyes

The site's icon is a pair of eyes floating on a dark background.
From the favicon to the home screen icon, it's all this face, and it's drawn in code rather than shipped as image files.

The original was drawn once as an SVG, then its proportions were lifted into constants.
Eye size is 0.242× the canvas, pupil is 0.477× the eye, and so on.
That's how the 64px favicon and the 512px home screen icon come out of the same code.
The 512px one is maskable, meaning the OS crops the corners however it likes, but the eyes sit inside the safe zone, so the face survives any crop shape.
And since the design has no letters, icon generation needs no font loading at all.

I wanted the share cards to carry the same identity.
OG images are generated at build time, 1200×630, from each post's title, date, and tags.

![The automatically generated Open Graph image](/posts/blog-details/og-image.png)

This card is on its third version, and this is where the three-minute mascot from the intro comes in.
During this redesign I put the two eyes on the card too, and by the commit log, removed them exactly three minutes later.
Inside 1200×630 the title has to be the protagonist, and the eyes kept stealing the gaze.
I couldn't see it when adding them; the moment they were gone it was obvious.
What remains is a single glow dot in the badge.

## Other things I stepped on

Missteps that didn't fit anywhere above.

- **Entrance animations are pure CSS.** I originally gated them from JS with IntersectionObserver, but on slow devices the first paint and the animation start drifted apart and the motion played twice. Switching to CSS animations with `animation-delay` made it disappear
- **Korean tag pages were 404ing.** I pre-encoded tags with `encodeURIComponent` in `generateStaticParams`, Next encoded them again, and the pages were prerendered at double-encoded paths. Passing the raw values fixed it
- **Dragging in dark mode flashed the screen.** The default inverted selection flips to a large white area on a dark screen. In dark mode it's now a surface with just 26% of the accent color mixed in, plus bright text
- **The body text uses two typefaces.** Geist for Latin and numerals, Pretendard Variable as a dynamic subset for Korean. Order the font stack correctly and they mix within a sentence on their own

The site supports Korean, English, and Japanese; posts without a translation fall back from the requested language to English, then Korean, showing the original.

![The home page in light mode](/posts/blog-details/home-light.png)

![The home page in dark mode](/posts/blog-details/home-dark.png)

## Wrapping up

This isn't a no-libraries manifesto.
For things I can't build myself, like View Transitions, I used a library and will keep doing so.
But everything I hand-rolled this time came in under 200 lines, and the hours I would have spent wrestling a dependency's config went into tuning the behavior exactly how I wanted.

The times helped too.
These days, pairing with AI makes implementations of this size come together fast.
Reading a library's docs now takes about as long as building the thing, and given that trade, I pick the one that fits my hand.
At the scale of a blog, this bargain paid off well.

There's work left.
The resume page still wears its "in progress" badge, and once underlined sentences accumulate, how they're displayed needs another pass.
But the site excuse is gone now.
It took a few hundred years to build, so it's time to write.
