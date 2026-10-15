# Fonts

`og/archivo-expanded-bold.ttf` and `og/archivo-regular.ttf` are static Latin instances of the same font for the
Open Graph images (`lib/og.tsx`; Satori needs static TTF/OTF).

`archivo-variable.woff2` is Archivo (SIL Open Font License 1.1, see `OFL.txt`), self-hosted through
`next/font/local` in `lib/fonts.ts`. It is the Google Fonts variable font reduced to what the site uses:

- axes limited to weight 400–700 and width 100–125 % (fontTools `instancer`);
- Latin-1 (U+0020–007E, U+00A0–00FF) plus typographic punctuation – — ‘ ’ “ ” • … € ™ ← → −;
- layout features kern, liga, calt, ccmp, locl, mark, mkmk, tnum, lnum, case.

88 KB → 46 KB compared with the full-range Google Fonts file. Characters outside the subset (rare
accented letters) fall back to the system sans-serif.

## Arabic

`public/fonts/arabic-sans-{400,700}.v1.woff2` are subsets of **IBM Plex Sans Arabic** (SIL OFL 1.1, see
`public/fonts/OFL-ibm-plex-sans-arabic.txt`), Arabic block, presentation forms and joiners only (U+0600–06FF,
U+FB50–FDFF, U+FE70–FEFC, U+200C–200F). The licence reserves the name "Plex", and a subset is a modified version,
so the files are renamed **"Al Bayan Arabic Sans"** internally and in CSS. They are declared with
`@font-face` in `app/globals.css` and preloaded by the `[locale]` layout on `/ar` only (≈ 66 KB for both
weights, instead of ≈ 150 KB across six files with next/font, which also shipped Plex's Latin faces).
Weight 500 requests resolve to 400 in Arabic. Bump the `.v1` suffix if the files change — `/fonts/*`
is served immutable.
