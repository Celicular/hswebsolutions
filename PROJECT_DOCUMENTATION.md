# HS Web Solutions - Project Documentation

## Project Overview
HS Web Solutions is a professional web development services company, offering website and application development with a focus on quality, security, and client satisfaction.

## Project Structure
- **Frontend Framework**: Next.js (v15.3.0)
- **UI Libraries**: 
  - Framer Motion for animations
  - GSAP for advanced animations
  - React Icons for iconography
  - Swiper for carousels/sliders
- **Database**: MySQL (mysql2 package)

## Color Palette

### Light Mode
- Background: `#e0f2fe` (Light blue)
- Background Darker: `#0f172a` (Dark blue)
- Foreground: `#333333` (Dark gray)
- Primary: `#4CAF50` (Green)
- Primary Hover: `#45A049` (Darker green)
- Accent: `#FF8C00` (Orange)
- Link: `#2196F3` (Blue)
- Link Hover: `#1976D2` (Darker blue)
- Secondary Text: `#757575` (Medium gray)
- Border: `#E0E0E0` (Light gray)
- Input Background: `#FFFFFF` (White)
- Error: `#D32F2F` (Red)
- Card Background: `#FFFFFF` (White)

### Dark Mode
- Background: `#0f172a` (Dark blue)
- Background Darker: `#0a1224` (Darker blue)
- Foreground: `#F5F5F5` (Off-white)
- Secondary Text: `#BBBBBB` (Light gray)
- Border: `#333333` (Dark gray)
- Input Background: `#1e293b` (Dark blue-gray)
- Card Background: `#1e293b` (Dark blue-gray)

### Feature Card Colors
- Purple: `#673AB7`
- Teal: `#009688`
- Blue: `#2196F3`
- Orange: `#FF5722`
- Turquoise: `#00B0A3`
- Green: `#8BC34A`

## Typography
- Primary Font: Geist Sans
- Monospace Font: Geist Mono

## Layout Structure
The application follows a component-based architecture with the following main sections:

1. **Navbar** - Fixed navigation bar with:
   - Logo
   - Navigation links
   - Theme toggle (Light/Dark mode)
   - Contact sidebar toggle

2. **Hero Section** - Main landing section

3. **Main Content Sections**:
   - Process Flowchart
   - Transformation Slider
   - Stats Counter
   - Key Features
   - Industries Served
   - Clients Section
   - Why Choose Us Section
   - Google Ads Section
   - Pricing Section
   - CTA Banner

4. **Footer** - Contact information and additional links

## Key Features
1. **Data Backup** - Regular, secure backups
2. **Data Protection** - Security measures
3. **Quality Deliverance** - Excellence in projects
4. **Dedicated Team** - Committed professionals
5. **Professional Support** - Round-the-clock assistance
6. **Affordable Pricing** - Competitive rates

## Page Structure
The main application is client-side rendered with Next.js, using:
- Dynamic imports for performance optimization
- Suspense for lazy loading components
- CSS modules for styling

## Animations
- Fade-in animations for elements as they enter the viewport
- Slide-in animations for cards and sections
- Hover effects on interactive elements
- GSAP for more complex animations

## Responsive Design
The website is fully responsive with:
- Mobile-friendly navigation
- Responsive grid layouts
- Viewport-specific styling

## Theme Support
- Light and dark mode support
- Theme preference stored in localStorage
- System preference detection

## Asset Structure
- Public directory contains:
  - Images
  - SVG files
  - Client logos
  - Favicon

## Contact Form
- Integrated in the sidebar
- Form validation for:
  - Name
  - Email
  - Mobile number
- Success and error handling

## Performance Optimizations
- Dynamic imports for code splitting
- Lazy loading of components
- Image optimization with Next.js Image component

## Special Elements
- Animated background particles
- Hexagon patterns for visual interest
- Custom scrollbars
- Drop shadows and glow effects
- Custom loading indicators 