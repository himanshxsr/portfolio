# Portfolio Implementation Plan

## "Digital Architect" — Himanshu Aashish | Full-Stack & Generative AI Developer

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Project
- [ ] Create Next.js 14 project with App Router (TypeScript)
- [ ] Install core dependencies:
  - `framer-motion` (page transitions, scroll animations)
  - `gsap` + `@gsap/react` (advanced timeline animations)
  - `three` + `@react-three/fiber` + `@react-three/drei` (3D hero)
  - `tailwindcss` + `postcss` + `autoprefixer`
  - `@radix-ui/react-*` (accessible primitives)
  - `lucide-react` (icons)
  - `next-themes` (dark/light mode)
- [ ] Configure Tailwind with custom theme (colors, fonts, spacing)
- [ ] Set up folder structure

### 1.2 Design System & Global Styles
- [ ] Define CSS variables for the color palette
- [ ] Configure fonts: Space Grotesk, Inter, JetBrains Mono via `next/font`
- [ ] Create global styles: reset, scrollbar, selection color, dot-grid background
- [ ] Build Tailwind plugin/extend for glow effects, glassmorphism utilities
- [ ] Set up dark/light mode with `next-themes`

### 1.3 Layout Shell
- [ ] Root layout with providers (theme, animation)
- [ ] Animated navbar (glassmorphism, scroll-aware)
- [ ] Custom animated cursor component
- [ ] Scroll progress bar
- [ ] Footer with social links
- [ ] Page transition wrapper (`AnimatePresence`)
- [ ] Preloader/splash screen animation

---

## Phase 2: Reusable Animation Components

### 2.1 Core Animation Primitives
- [ ] `ScrollReveal` — fade/slide-up on viewport entry
- [ ] `StaggerContainer` + `StaggerItem` — staggered children animations
- [ ] `TextReveal` — letter-by-letter or word-by-word text animation
- [ ] `TypeWriter` — typing effect with rotating strings
- [ ] `MagneticButton` — button that follows cursor on hover
- [ ] `AnimatedCounter` — number count-up animation
- [ ] `ParallaxWrapper` — parallax scroll effect
- [ ] `GlowCard` — card with animated gradient border on hover
- [ ] `TiltCard` — 3D perspective tilt on hover

### 2.2 Section Components
- [ ] `SectionHeader` — numbered section title with code-style decoration (`01. // About`)
- [ ] `AnimatedTabs` — tab switcher with sliding indicator
- [ ] `Timeline` — vertical timeline with SVG path draw
- [ ] `SkillOrbit` — tech icons orbiting a center element
- [ ] `ProjectCard` — expandable project card with shared layout animation
- [ ] `FormField` — input with floating label animation

---

## Phase 3: Page Implementation

### 3.1 Home / Hero Page (`/`)
- [ ] 3D particle/geometry background (React Three Fiber)
- [ ] Name reveal animation (staggered letters)
- [ ] Typing effect for roles
- [ ] CTA buttons with magnetic hover
- [ ] Scroll-down indicator (bouncing chevron)
- [ ] Smooth scroll to next section

### 3.2 About Page (`/about`)
- [ ] Split layout: photo (parallax) + bio text
- [ ] Staggered paragraph fade-in on scroll
- [ ] Animated stats counters (years, projects, technologies)
- [ ] Download resume button with hover animation
- [ ] Decorative code-bracket elements

### 3.3 Skills Page (`/skills`)
- [ ] Category tabs (Frontend, Backend, DevOps, AI/ML) with animated indicator
- [ ] Skill cards grid with 3D tilt effect
- [ ] Animated progress bars/circles filling on scroll
- [ ] Tech icon orbit animation (optional centerpiece)
- [ ] Staggered card entrance

### 3.4 Projects Page (`/projects`)
- [ ] Filter buttons with smooth layout shift (FLIP)
- [ ] Project cards grid with staggered entrance
- [ ] Card hover: 3D tilt + overlay slide-up with details
- [ ] Expand to detail view (shared layout animation or modal)
- [ ] Tech stack badges with sequential pop-in
- [ ] Links to live demo / GitHub

### 3.5 Experience Page (`/experience`)
- [ ] Vertical timeline with SVG line-draw on scroll
- [ ] Alternating left/right cards sliding in
- [ ] Pulsing/glowing timeline nodes on viewport entry
- [ ] Date badges with scale-in animation
- [ ] Company logos with fade-in

### 3.6 Contact Page (`/contact`)
- [ ] Animated form fields (floating labels)
- [ ] Submit button morph (idle → loading → success checkmark)
- [ ] Animated gradient mesh background
- [ ] Social links with staggered bounce-in
- [ ] Optional: 3D globe showing location
- [ ] Toast notification on form success

### 3.7 Blog Page (`/blog`) — Optional / Phase 5
- [ ] Blog card list with staggered fade-up
- [ ] Reading progress bar on individual posts
- [ ] Syntax-highlighted code blocks
- [ ] MDX support for rich content

---

## Phase 4: Data & Content

### 4.1 Content Data Files
- [ ] `data/projects.ts` — project entries (title, description, tech, links, image)
- [ ] `data/experience.ts` — work history (company, role, dates, description)
- [ ] `data/skills.ts` — skills by category with proficiency levels
- [ ] `data/social.ts` — social media links
- [ ] `data/personal.ts` — name, bio, stats, resume link

### 4.2 Assets
- [ ] Profile photo (optimized)
- [ ] Project screenshots/thumbnails
- [ ] Favicon + OG image
- [ ] Resume PDF

---

## Phase 5: Polish & Optimization

### 5.1 Performance
- [ ] Lazy load 3D canvas (dynamic import with suspense)
- [ ] Image optimization with Next.js `<Image>` + blur placeholders
- [ ] Code splitting per page
- [ ] Animation only on viewport (IntersectionObserver)
- [ ] Lighthouse audit: target 90+ on all metrics

### 5.2 Accessibility
- [ ] `prefers-reduced-motion` media query support (disable/simplify animations)
- [ ] Keyboard navigation for all interactive elements
- [ ] ARIA labels on custom components
- [ ] Focus indicators styled to match theme
- [ ] Screen reader testing

### 5.3 SEO
- [ ] Next.js Metadata API for all pages (title, description, OG tags)
- [ ] Structured data (JSON-LD for Person)
- [ ] Sitemap generation
- [ ] robots.txt

### 5.4 Responsive Design
- [ ] Mobile-first approach
- [ ] Touch-friendly interactions (no hover-dependent features)
- [ ] Reduced/simplified animations on mobile for performance
- [ ] Hamburger menu with animated open/close
- [ ] Test on: iPhone SE, iPhone 14, iPad, Desktop (1440px+)

---

## Phase 6: Deployment

- [ ] Deploy to Vercel
- [ ] Configure custom domain (if available)
- [ ] Set up analytics (Vercel Analytics or Plausible)
- [ ] Final cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance monitoring

---

## Implementation Order (Recommended)

```
Week 1:  Phase 1 (Setup + Design System + Layout Shell)
Week 2:  Phase 2 (Animation Components Library)
Week 3:  Phase 3.1–3.3 (Home, About, Skills)
Week 4:  Phase 3.4–3.6 (Projects, Experience, Contact)
Week 5:  Phase 4 + Phase 5 (Content, Polish, Optimization)
Week 6:  Phase 6 (Deploy + Final QA)
```

---

## Key Technical Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Framework | Next.js 14 App Router | Best DX, SSR, file-based routing |
| Animation primary | Framer Motion | React-native integration, layout animations |
| Animation advanced | GSAP | Complex timelines, scroll-triggered sequences |
| 3D | React Three Fiber | Declarative Three.js in React |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| State | React Context + hooks | No heavy state needed |
| Forms | React Hook Form + Zod | Validation + type safety |
| Email | Resend or EmailJS | Contact form delivery |
| CMS (blog) | MDX or Contentlayer | Markdown with components |

---

## File Structure

```
e:\Portfolio\
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── experience/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   └── blog/
│       └── page.tsx
├── components/
│   ├── animations/
│   │   ├── ScrollReveal.tsx
│   │   ├── StaggerContainer.tsx
│   │   ├── TextReveal.tsx
│   │   ├── TypeWriter.tsx
│   │   ├── PageTransition.tsx
│   │   └── AnimatedCounter.tsx
│   ├── ui/
│   │   ├── MagneticButton.tsx
│   │   ├── GlowCard.tsx
│   │   ├── TiltCard.tsx
│   │   ├── AnimatedTabs.tsx
│   │   └── FormField.tsx
│   ├── three/
│   │   ├── HeroScene.tsx
│   │   └── Particles.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── ScrollProgress.tsx
│   │   └── Preloader.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── AboutSection.tsx
│       ├── SkillsSection.tsx
│       ├── ProjectsSection.tsx
│       ├── ExperienceTimeline.tsx
│       └── ContactForm.tsx
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   ├── useMousePosition.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── data/
│   ├── projects.ts
│   ├── experience.ts
│   ├── skills.ts
│   ├── social.ts
│   └── personal.ts
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   ├── resume.pdf
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Animation Specifications

| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| Page transition | Route change | 500ms | ease-in-out |
| Scroll reveal | Viewport entry | 600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Text reveal | Viewport entry | 800ms (staggered 30ms/char) | ease-out |
| Card hover tilt | Mouse move | Real-time | spring(stiffness: 300) |
| Counter | Viewport entry | 2000ms | ease-out |
| Timeline draw | Scroll progress | Scroll-linked | linear |
| Button press | Click | 150ms | ease-in |
| Magnetic hover | Mouse proximity | Real-time | spring(damping: 15) |
| Preloader exit | Load complete | 1000ms | cubic-bezier(0.76, 0, 0.24, 1) |

---

## Success Criteria

- [ ] All pages load under 3 seconds on 4G
- [ ] Lighthouse Performance score > 90
- [ ] Zero layout shift (CLS < 0.1)
- [ ] Animations run at 60fps
- [ ] Fully responsive (320px to 2560px)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Works with animations disabled (`prefers-reduced-motion`)
- [ ] Cross-browser compatible

---

*Ready to build. Start with Phase 1 when approved.*
