# Md. Meherab Hossen — Portfolio

A responsive portfolio for a mechanical engineer and CFD researcher, with a navy-and-mint design inspired by [Brittany Chiang’s v4 portfolio](https://github.com/bchiang7/v4).

**Website:** https://cfdmeherabhossen.github.io/meherab-portfolio/

## Included

- About, keyboard-accessible experience tabs, and featured research.
- Complete research notes, validation figures, and seven benchmark references.
- Two simulation videos with native playback controls.
- Six engineering projects with their original PDF reports.
- Education, skills, credentials, laboratory gallery, achievements, and publication status.
- CV download, personal and work email links, GitHub, and ResearchGate.
- Mobile navigation, image viewer, reduced-motion support, and local fonts.

## Preview locally

Open index.html directly, or use Node.js 18 or later for a local server. No package installation is needed.

    node scripts/serve.mjs

Open http://127.0.0.1:4173/meherab-portfolio/ in your browser. The server supports video byte-range requests.

## Verify and build

    node scripts/build.mjs

This checks duplicate IDs, internal anchors and linked local files, then copies the static website into dist/. You may also use npm start, npm run build and npm run preview if npm is installed.

## GitHub Pages

In this repository, open Settings → Pages. Choose “Deploy from a branch”, then main and / (root), and save. The website uses relative asset links and works under the repository URL. Keep index.html and assets/ at the repository root. Do not upload dist/ inside another folder.

## Update your content

- Edit index.html for biography, research, experience and projects.
- Edit assets/css/style.css for the appearance.
- Edit assets/js/main.js for navigation, tabs and the image viewer.
- Replace the CV at assets/files/Meherab Hossen CV.pdf. The supplied PDF is retained unchanged; its older wording can be updated in the CV source separately.
- The video filenames are case-sensitive: assets/videos/meherab.MP4 and assets/videos/meherab1.mp4.
- Keep the research bibliography distinguishable from your own publications. The portfolio lists your manuscripts as in preparation.

## Credits

The visual design, colour palette, font assets and layout direction are based on [Brittany Chiang](https://brittanychiang.com) and the v4 template supplied in the workspace. The original MIT notice is retained in LICENSE and attribution appears in the footer. Engineering content, photographs, reports and videos are retained from the original [Meherab Hossen portfolio](https://github.com/cfdmeherabhossen/meherabhossen).
