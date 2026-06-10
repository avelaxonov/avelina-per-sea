# BUILD BRIEF: Avelina, per sea — Personal Portfolio Website
**For: Avelina Axonov | avelina-per-sea.github.io**

---

## What to Build

A dynamic, scroll-animated single-page portfolio website hosted on GitHub Pages. The site serves as a personal portfolio and researcher presence — similar in structure to a professor or graduate researcher's personal site, but with a creative, non-template aesthetic. It has two identities running through it: STEM (primary) and Writing/Humanities (secondary), distinguished by palette shifts rather than labels.

**Tech stack:** HTML + CSS + Vanilla JavaScript. No frameworks required. Use GSAP or AOS.js for scroll animations. No WordPress. No static templates.

---

## Identity

**Site owner:** Avelina Axonov
**Site name:** Avelina, per sea
**GitHub username:** `avelina-per-sea`
**Domain:** `avelina-per-sea.github.io`

**Tagline:**
> "Marine ecology, engineering, and everything in between — *per sea.*"

**Tone:** Direct, slightly dry, quietly witty. Professional but not sterile. Puns are earned, not performed.

---

## Design Specification

### Colour Palette — Sea Glass
Darker background throughout. Sea glass = frosted aqua, muted teal, blue-green tones.

| Role | Name | Hex |
|------|------|-----|
| Background (dark sections) | Deep sea glass | `#0D2B2E` |
| Background (mid) | Dark teal | `#1A3C40` |
| Background (light sections) | Frosted sea glass | `#E8F0EF` |
| Accent — primary | Sea glass aqua | `#6BBFBE` |
| Accent — warm | Weathered amber | `#C49A5A` |
| Text on dark | Off-white | `#EEF2F1` |
| Text on light | Near-black | `#1C2625` |
| Borders / dividers | Sea glass pale | `#A8CECE` |

Dark sections: Hero, Fieldwork, Contact.
Light sections: About, Portfolio, Publications, Writing, Teaching, Awards.
The palette shift signals the two identities without labeling them.

### Typography — No Serif Fonts
- **Display / headings:** Raleway (Google Fonts) — elegant, humanist sans, screen-friendly
- **Body text:** Inter (Google Fonts) — clean, highly readable
- **Code / specs / captions:** DM Mono (Google Fonts) — for PCB specs, coordinates, depth readings, code snippets

Do NOT use: Montserrat, Lora, Cambria, Times New Roman, or any serif font.

### Animations
- Scroll-triggered fade-in + slight upward slide on section entry (use AOS.js or GSAP ScrollTrigger)
- **Signature element:** A thin horizontal line — the transect line — that draws itself left-to-right across the screen between major sections (CSS animation or JS canvas). This references the ecological field method she uses and gives the site structural rhythm.
- Animated number counters in the About stats (count up when scrolled into view)
- Parallax on full-bleed photography sections
- Hover micro-interactions on project cards: slight lift + `#6BBFBE` border glow
- NO autoplay video, NO particle effects, NO excessive motion
- Respect `prefers-reduced-motion` media query

### Navigation
Sticky navbar that appears on scroll (not present initially). Links: Research · Portfolio · Field · Writing · CV. Logo/name in top-left.

---

## Site Structure — Section by Section

---

### SECTION 1: HERO
**Full screen. Dark palette. `#0D2B2E` background.**

Layout:
- Large name: **AVELINA AXONOV** (Raleway, bold, off-white)
- Site name below: **Avelina, per sea** — displayed with the comma, smaller than the name, sea glass aqua `#6BBFBE`
- Descriptor: *Marine ecologist · Engineer · Writer* (light, spaced)
- Background: placeholder for one full-bleed field/underwater/lab photo [USER WILL PROVIDE]
- Subtle scroll-down indicator (animated chevron or thin line)

---

### SECTION 2: ABOUT
**Light palette. Two-column layout.**

**Left column — Bio:**

> I am an undergraduate at Wake Forest University completing a B.S. in Engineering (Mechanical and Electrical & Computer Engineering concentrations), a B.A. in Japanese Language & Culture, and a Biology minor, with graduation in December 2026. My research sits at the intersection of behavioral marine ecology and engineering instrumentation — I build the sensors, then take them into the field. My work has included designing waterproof PCB housings for reef video transects in Belize and studying red blood cell electrophysiology in a BSL2 lab. A native Russian and English speaker with advanced Japanese, I have conducted fieldwork and study in Japan, Belize, Hawaii, South Korea, and Maine — with upcoming programs in Tbilisi and Antarctica. Outside the lab, I crochet, study linguistics, and play flute.

Pull quote styled separately: *"Reef-search, per sea."*

**Right column — Animated stats (count up on scroll):**
- 5 languages spoken
- 25+ logged dives
- 6 countries for fieldwork and study
- 2 papers submitted / in preparation
- 215+ credits by graduation
- 1 crocheted cuttlefish *(Easter egg — reveal on hover)*

**Photo:** field or lab context. [USER WILL PROVIDE]

---

### SECTION 3: RESEARCH
**Dark palette. Organized by PROJECT, not by lab.**

Note: PI situation is in transition (Dr. Luthy departing, joining Dr. Silman's lab summer 2026). Project-first framing is more accurate and avoids confusion.

Each project links to its own sub-page.

---

#### Project A: Underwater Instrumentation for Reef Ecology
*Wake Forest University — Dr. Kyle Luthy Lab / Dr. Miles Silman Lab*

- Designed and fabricated custom PCBs for environmental data logging and pressure sensing
- Evaluated camera systems via signal-to-noise and contrast testing for long-duration underwater imaging
- Designed **Balistes** — hydrodynamic boat-towed underwater camera housing for seafloor transect imaging
- Designed **Holothuria** — waterproof PCB-based depth sensor and data recorder
- Field deployment and testing at Lighthouse Reef Atoll, Belize
- Developing next-generation modular housing for improved manufacturability
- Collaboration with M.S. student Madison DiGiloramo (Dr. Silman lab)
- Forthcoming paper: *"Tow and Tell"* — camera housing system paper (first author, summer 2026)

---

#### Project B: Red Blood Cell Electrophysiology
*Wake Forest University — Dr. Erin Henslee Lab, Summer 2022 (BSL2)*

- Studied electrophysiological properties of red blood cells to evaluate storage effects
- Operated dielectrophoresis (DEP) microchip systems and zeta-potential measurement equipment
- Sample preparation: centrifugation, washing, microscopy, cell counting
- Poster: BMES Annual Conference, October 2022, San Antonio, TX
- Paper: *Experimental Handling Effects on Red Blood Cell Electrophysiological Properties* — Electrophoresis (submitted November 2024, under review)

---

### SECTION 4: ENGINEERING PORTFOLIO
**Light palette. Card grid layout. Each card links to its own sub-page.**

Sub-pages contain: description, photos of assembly/testing/deployment, technical specs, code links where applicable.

| Card Name | Short Description |
|-----------|------------------|
| **Balistes** | Hydrodynamic boat-towed underwater camera housing for seafloor transect imaging. Named for the triggerfish genus. |
| **Holothuria** | Waterproof PCB-based depth sensor and recorder. Named for the sea cucumber genus. Deployed in Belize. |
| **Thermopod** | Heat-resistant capsule with Arduino PCB, thermocouple sensors, and datalogger. Built for drone-deployed wildfire data collection. |
| **Winchcraft** | Senior capstone drone winch system (team lead). The name is intentional. |
| **Saturn** | Pressure sensor PCB board. *[Owner to add description]* |
| **Crepusculum** | Independent study project. Named for the Latin word for twilight. *[Owner to add description]* |
| **Self-Watering Plant System** | EGR 311 final project. Sensor-driven closed-loop feedback system for automated plant irrigation. |
| **Balistes Scale Tool** | MATLAB app — automated laser-dot scaling tool for benthic transect photos from the Balistes housing. |
| **Species Counter** | MATLAB app (GUI, uifigure) — photo annotation tool for counting species in reef survey images. Exports CSV. |
| **Wordle v2** | MATLAB app (GUI, uifigure) — fully functional Wordle game with colored tile grid, virtual keyboard, multiplayer mode, and stats. |
| **Slavic Folklore Trivia** | MATLAB — 10-question interactive trivia on Russian and Slavic folklore. |
| **Rock-Paper-Scissors** | MATLAB — classic game with replay loop. |

---

### SECTION 5: FIELDWORK
**Full-bleed photography. Dark palette. STEM fieldwork only.**

*(Personal diving trips excluded. Richter fieldwork is in the Writing section.)*

Locations with brief descriptors:

**Lighthouse Reef Atoll, Belize**
Coral reef transects · SCUBA surveys · conch and sea cucumber population counts · camera housing deployment and field testing

**Bigelow Laboratory for Ocean Sciences, Maine**
CTD profiler operations · chlorophyll and plankton sampling · salinity–density analysis in R · microscopy identification

Photo layout: masonry grid or horizontal scroll gallery. Owner's photos only. [PHOTOS TO BE PROVIDED]

Stats bar:
*25+ logged dives · Advanced Open Water, SSI · certified: photography/videography, navigation, night diving*

Punchline placed subtly: *"Going deep."*

---

### SECTION 6: PUBLICATIONS & PRESENTATIONS
**Clean list. Light palette.**

**Papers:**
- Joseph, Swimmer, Dickerson, Sherwin, Powers, **Axonov**, Pichataro, Johnson, Henslee. *Experimental Handling Effects on Red Blood Cell Electrophysiological Properties.* Electrophoresis (submitted Nov 2024, under review).
- **Axonov, A.** et al. *Tow and Tell: [subtitle TBD].* Camera housing system paper. *(Forthcoming, summer 2026)*
- Additional first-author and co-author submissions in preparation. *(Forthcoming, summer 2026)*

**Posters & Talks:**
- Swimmer, Joseph, Dickerson, Sherwin, Powers, **Axonov** et al. Dielectrophoresis Reveals Dynamic Changes in RBCs Due to Experimental Handling. BMES Annual Conference, Oct 2022, San Antonio, TX.
- **Axonov, A.** "Surviving the Sea of Homogeneity: The Study of Ryukyuan Culture of Okinawa, Japan." URECA Day, WFU, September 2024.

**Digital:**
- Richter Project interactive gallery: [akseaa21.wixsite.com/richterproject](https://akseaa21.wixsite.com/richterproject)

**CV download button.** [PDF TO BE PROVIDED]

---

### SECTION 7: WRITING & IDEAS
**Do not label this section "Humanities." Title: "Writing & Ideas" or just "Writing."**
**Palette shifts to mid-tone — signals a different register without announcing it.**

Three areas, equal in dignity:

#### Academic Writing
- **"Garden of Women"** — Honors thesis, EAL 376 (in progress). *[Owner to add framing — 2–3 sentences]*
- **"Flowers for Sale"** — Japanese major senior thesis. *[Owner to add framing — 2–3 sentences]*
- **Conservation Writing, Lighthouse Reef Atoll** — ENV 391 individual study (in progress). Brief note.
- **"Surviving the Sea of Homogeneity"** — Richter Scholar independent research. Okinawa, Hokkaido, Hawaii. Ryukyuan and Ainu cultural preservation. [Link to interactive gallery]

#### Poetry & Creative Writing
- 1–3 poems displayed. *[Owner to select and provide]*
- Brief non-apologetic framing: why she writes. *[Owner to write — 1–2 sentences]*
- Option to link to a sub-page with more work later.

#### Photography
- Personal/artistic photography, distinct from fieldwork documentation.
- Curated: 6–10 images maximum.
- Displayed as a clean grid. No captions required.
- *[Owner to provide]*

---

### SECTION 8: TEACHING & OUTREACH
**Compact. Light palette. Single column or two-column list.**

- **Teaching Assistant, EGR 311** — Control Systems & Instrumentation, Winter 2025–present. Grading, lab redesign, pedagogy collaboration.
- **Teaching Assistant, Pre-College Programs** — WFU Engineering Institute, Summers 2023–2024. Hands-on engineering lectures, mentorship, site visits.
- **Russian Peer Tutor** — Fall 2022–present, WFU CLASS Center. One-on-one instruction from elementary through advanced.
- **Study Abroad Ambassador** — Fall 2025–present, WFU Center for Global Programs.
- **Russian ↔ English Interpreter** — Community, legal, and institutional contexts. Refugee assistance, visiting delegations, faith-based settings.
- **Japanese Studies Club Secretary** — Fall 2024–present.
- **Engineering Prosthetics Club President** — Fall 2021–Spring 2023. Designed and fabricated wrist-driven prosthetic hands.
- **Innovation Studio Student Manager & Social Media Lead** — Winter 2022–Spring 2025. Managed makerspace staff, equipment training, and outreach.

---

### SECTION 9: AWARDS & RECOGNITION
**Single compact section. No individual pages.**

- Dean's List — every eligible semester, Fall 2021–Spring 2025
- Benjamin A. Gilman International Scholarship — $5,000, U.S. Dept. of State (Summer 2025)
- Innovation Award — WFU Dept. of Engineering (May 2025)
- First Place, "2 Minutes to Win It" Pitch Competition — $1,000, CEO at UNC Greensboro (March 2025)
- Richter Scholarship — $6,000, WFU (Summer 2024)
- Third Place, 37th Duke Japanese Speech Contest, Level II (March 2024)
- Certificate in Music with Honors — Flute Performance, School of Music, Novorossiysk, Russia (May 2016)

---

### SECTION 10: CONTACT
**Dark palette. Clean and minimal.**

- Email: akseaa21@wfu.edu *(update to personal email post-graduation)*
- GitHub: github.com/avelina-per-sea
- ORCID: *[to be set up before first submission — orcid.org]*
- LinkedIn: linkedin.com/in/avelina-axonov-907259235

Closing punchline:
*"Open to research collaborations, fieldwork opportunities, and well-timed fish puns."*

---

## Punchlines — Place Throughout as Pull Quotes / Easter Eggs

These are NOT section headers. They appear as subtle styled pull quotes, footnotes, or hover-reveal micro-copy:

| Line | Where |
|------|-------|
| *"Per sea."* | About section tagline |
| *"Reef-search in progress."* | Research section intro |
| *"Tow and tell."* | Near Balistes project card |
| *"Thank you for schooling us."* | Teaching section |
| *"Wrasse to the occasion."* | Fieldwork or bio blurb |
| *"Littoral truth."* | Writing / conservation area |
| *"Squid pro quo."* | Publications or collaborations |
| *"Going deep."* | Fieldwork section |
| *"Sensor and sensibility."* | Engineering portfolio intro |

---

## Languages Listed (for About or CV section)

- Russian — native
- English — native-level
- Japanese — advanced
- Ukrainian — receptive fluency
- Arabic — elementary
- Spanish — elementary

---

## Content Still Needed from Owner

**Photos:**
- [ ] Hero image (field, underwater, or lab — not a portrait)
- [ ] Belize fieldwork photos
- [ ] Bigelow / Maine fieldwork photos
- [ ] BSL2 lab photos
- [ ] Project photos: Balistes housing, Holothuria PCB, Thermopod, Winchcraft, Saturn, Crepusculum, self-watering plant system
- [ ] Artsy/personal photography (6–10 curated images)

**Text:**
- [ ] Saturn project description (2–4 sentences)
- [ ] Crepusculum project description (2–4 sentences)
- [ ] "Garden of Women" framing (2–3 sentences)
- [ ] "Flowers for Sale" framing (2–3 sentences)
- [ ] 1–3 poems selected
- [ ] 1–2 sentence framing for the poetry sub-section
- [ ] Personal photography artist statement (optional)

**Technical:**
- [ ] CV exported as PDF
- [ ] ORCID account created
- [ ] GitHub account created: username `avelina-per-sea`
- [ ] Repository created: `avelina-per-sea.github.io`
- [ ] MATLAB code files reviewed and uploaded to GitHub repos

---

## Final Note to the Builder

The site should feel like it was made by someone who names her depth sensor after a sea cucumber (*Holothuria*), her camera housing after a triggerfish (*Balistes*), her capstone team after Salem witch trials (*Winchcraft*), and her camera housing paper after a children's activity (*Tow and Tell*). The wit is quiet, the science is real, and the two sides of this person — the one who builds PCBs and the one who writes poetry — should coexist on this site without either apologizing for the other.

It should not feel like a template.
