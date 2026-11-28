/**
 * Raja Studios — Verified Services, Machinery & Equipment Catalog
 * 
 * Strict Compliance:
 * - Only verified core capabilities are listed.
 * - No unconfirmed machine models or fabricated technical claims.
 * - All entries are dynamically overrideable via Admin Management / MongoDB.
 */

export const INITIAL_SERVICES = [
    {
        id: 'uv-printing',
        slug: 'uv-printing',
        title: 'UV Printing Services',
        badge: 'Industrial Direct-to-Substrate',
        category: 'UV Printing',
        categoryKey: 'uv-printing',
        tagline: 'High-precision UV cured printing with vivid color fastness and razor-sharp clarity',
        description: 'Our industrial flatbed UV printing delivers durable, scratch-resistant prints with instant UV LED curing. From custom acrylic plaques and wooden mementos to personalized gift items and promotional merchandise, we produce gallery-quality reproductions on virtually any flat substrate.',
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/uv-printing.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        videoType: 'local',
        equipmentName: 'Flatbed UV Production System',
        equipmentSpecs: ['Multi-layer white ink foundation', 'Instant UV LED ink curing', 'Substrates up to 100mm height'],
        features: [
            'Direct printing on acrylic, wood, canvas, glass & PVC',
            'Fade-resistant and moisture-tolerant UV ink',
            'High-definition color fidelity with rich white under-layer',
            'Supports single bespoke gifts or bulk production'
        ],
        actionLabel: 'Enquire for UV Printing',
        enquiryType: 'printing',
        isFeatured: true,
        displayOrder: 1
    },
    {
        id: 'laser-cutting',
        slug: 'laser-cutting',
        title: 'Laser Cutting & Custom Fabrication',
        badge: 'Micron Precision Cutting',
        category: 'Laser Cutting',
        categoryKey: 'laser-cutting',
        tagline: 'Computer-guided precision cutting and detailed surface engraving for bespoke creations',
        description: 'Transform acrylic sheets, MDF wood, leather, and specialty materials into intricate personalized frames, architectural model components, decorative cake toppers, and custom corporate crests with clean, polished edge finishes.',
        coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/laser-cutting.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        videoType: 'local',
        equipmentName: 'Precision CO2 Laser Fabrication Unit',
        equipmentSpecs: ['Computer-calibrated optics', 'Clean polished acrylic edge cut', 'Rotary engraving capability'],
        features: [
            'Custom acrylic photo frame borders and stands',
            'Intricate wooden nameplates, logos & event decor',
            'Smooth flame-polished edges without manual sanding',
            'Rapid prototype and production turnaround'
        ],
        actionLabel: 'Enquire for Laser Cutting',
        enquiryType: 'printing',
        isFeatured: true,
        displayOrder: 2
    },
    {
        id: 'epson-printing',
        slug: 'epson-printing',
        title: 'Epson Wide-Format Fine Art Printing',
        badge: 'Master Studio Quality',
        category: 'Epson Printing',
        categoryKey: 'epson-printing',
        tagline: 'Archival studio-grade photo enlargement and museum-quality canvas reproduction',
        description: 'Engineered for photographers, artists, and families who demand authentic color reproduction. Using genuine Epson archival ink sets on premium luster, matte, metallic, and canvas media to ensure your portraits remain vibrant for generations.',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Epson Professional Wide-Format Printer',
        equipmentSpecs: ['Multi-color archival pigment ink', 'UltraChrome print head technology', 'Micro-droplet tonal transitions'],
        features: [
            'Archival museum-grade photo and portrait printing',
            'Luster, glossy, matte, textured & canvas substrates',
            'Ultra-high optical density for deep blacks and lifelike skin tones',
            'Large format enlargements up to wide display scales'
        ],
        actionLabel: 'Request Print Quote',
        enquiryType: 'printing',
        isFeatured: true,
        displayOrder: 3
    },
    {
        id: 'laptop-service',
        slug: 'laptop-service',
        title: 'Laptop Service & Hardware Repair',
        badge: 'Certified Diagnostic Lab',
        category: 'Laptop Servicing',
        categoryKey: 'laptop-repair',
        tagline: 'Comprehensive hardware diagnostics, chip-level troubleshooting, and system optimization',
        description: 'Our dedicated electronics servicing department handles complete laptop care: hardware component replacement (screens, keyboards, batteries, hinges), thermal paste re-application, motherboard diagnostic checks, SSD/RAM upgrades, and virus/OS cleanup.',
        coverImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/laptop-service.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        videoType: 'local',
        equipmentName: 'ESD-Safe Hardware Testing & Repair Station',
        equipmentSpecs: ['Digital diagnostic multimeters', 'Precision thermal imaging camera', 'Regulated soldering & rework suite'],
        features: [
            'No-obligation hardware health inspection & diagnostics',
            'Display panel, keyboard, trackpad & battery replacements',
            'Deep thermal cooling clean & premium paste application',
            'High-speed SSD upgrades and data migration assistance'
        ],
        actionLabel: 'Book a Laptop Service',
        enquiryType: 'laptop',
        isFeatured: true,
        displayOrder: 4
    },
    {
        id: 'custom-gifts',
        slug: 'custom-gifts',
        title: 'Personalized Gifts & Boutique Hampers',
        badge: 'Handcrafted With Love',
        category: 'Gift Production',
        categoryKey: 'gifts',
        tagline: 'Customized luxury photo frames, LED acrylic lamps, wooden clocks & bespoke gift sets',
        description: 'Crafting unforgettable keepsakes for birthdays, weddings, anniversaries, and corporate milestones. Each gift is designed, personalized with your photographs, laser-finished or UV-printed in our studio, and packaged in signature velvet and gold boxes.',
        coverImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Studio Gifting Fabrication Workshop',
        equipmentSpecs: ['Precision mount cutters', 'Thermal heat press machines', 'UV flatbed personalization'],
        features: [
            'Direct access to our live interactive photo customizer',
            'Custom Spotify acrylic plaques & LED photo night lamps',
            'Museum-style solid wood framed portraits',
            'Ready for delivery across Tamil Nadu and pan-India'
        ],
        actionLabel: 'Explore Gift Collection',
        enquiryType: 'general',
        externalRoute: '/shop',
        isFeatured: true,
        displayOrder: 5
    },
    {
        id: 'video-editing',
        slug: 'video-editing',
        title: 'Cinematic Video Editing & Post-Production',
        badge: 'Award-Caliber Grading',
        category: 'Video Editing',
        categoryKey: 'video-editing',
        tagline: 'Professional storytelling, wedding highlights, viral reels, and broadcast color grading',
        description: 'Turn raw camera clips into captivating cinematic stories. Our post-production suite delivers pacing, Hollywood-grade DaVinci Resolve color grading, multi-mic audio mastering, sound effects design, and dynamic typography for weddings, commercial promos, and YouTube channels.',
        coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Multi-GPU Post-Production Edit Suite',
        equipmentSpecs: ['10-bit color-calibrated IPS monitors', 'Studio audio monitoring monitors', 'High-bandwidth NVMe media array'],
        features: [
            'Full cinematic wedding film & teaser video editing',
            'High-retention Instagram Reels & YouTube Shorts editing',
            'Professional DaVinci Resolve color grading & skin tone balancing',
            'Audio restoration, noise suppression & Foley sound design'
        ],
        actionLabel: 'View Video Editing Portfolio',
        enquiryType: 'general',
        externalRoute: '/video-editing',
        isFeatured: true,
        displayOrder: 6
    },
    {
        id: 'logo-posters',
        slug: 'logo-posters',
        title: 'Brand Logo & Event Poster Design',
        badge: 'Visual Identity',
        category: 'Logo & Posters',
        categoryKey: 'logo-posters',
        tagline: 'Memorable brand identity marks, festive invitation typography, and commercial posters',
        description: 'From timeless wedding invitation suites and high-impact social media creatives to comprehensive brand identity guidelines and corporate logo packages, our design studio crafts distinct visuals that leave a lasting impression.',
        coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Digital Vector Illustration Workstation',
        equipmentSpecs: ['Color-accurate graphics tablets', 'Adobe Creative Cloud design ecosystem', 'Pantone color-matching reference system'],
        features: [
            'Vector logo design with full copyright transfer & master SVG/AI files',
            'Event posters, wedding flex banners & theater invitations',
            'Social media marketing banners & brand stationery',
            'Ready-to-print CMYK output with zero resolution loss'
        ],
        actionLabel: 'View Design Portfolio',
        enquiryType: 'general',
        externalRoute: '/logo-poster-editing',
        isFeatured: true,
        displayOrder: 7
    },
    {
        id: 'photography-services',
        slug: 'photography-services',
        title: 'Studio & On-Location Photography',
        badge: 'High-Fidelity Optics',
        category: 'Photography',
        categoryKey: 'photography',
        tagline: 'Classic portraiture, commercial product imagery, and candid life moments captured with emotion',
        description: 'With controlled studio lighting and premium high-speed prime lenses, we produce soulful portraits, family archives, matrimonial profiles, maternity shoots, and pristine e-commerce product photos with crisp depth and natural tones.',
        coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Studio Lighting & Full-Frame Camera Systems',
        equipmentSpecs: ['Wireless strobe lighting setups', 'Softboxes, diffusers & parabolic umbrellas', 'Prime portrait lenses (f/1.4 - f/1.8)'],
        features: [
            'Indoor studio portraiture & matrimonial portfolio sessions',
            'Commercial product photography for catalog & web stores',
            'Outdoor golden hour lifestyle photography',
            'Professional retouching & color balancing included'
        ],
        actionLabel: 'Book a Photo Shoot',
        enquiryType: 'photography',
        isFeatured: true,
        displayOrder: 8
    },
    {
        id: 'wedding-events',
        slug: 'wedding-events',
        title: 'Wedding & Grand Event Coverage',
        badge: 'Cinematic Storytelling',
        category: 'Wedding & Events',
        categoryKey: 'wedding-events',
        tagline: 'Complete cinematic wedding films, candid moments, reception videography, and drone aerials',
        description: 'Capturing the romance, heritage, and emotions of your special day. Our multi-cinematographer crew operates with quiet discretion, 4K cinema cameras, wireless audio recorders, and stabilized gimbals to ensure every ritual is documented in breathtaking detail.',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoThumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        videoType: 'r2',
        equipmentName: 'Multi-Cam Cinema Production Rig',
        equipmentSpecs: ['3-axis handheld motorized gimbals', 'Dual-channel wireless lavalier audio', 'Ultra-high dynamic range sensors'],
        features: [
            'Traditional & candid wedding photography coverage',
            'Cinematic 4K wedding teaser & comprehensive full event film',
            'Pre-wedding & post-wedding romantic couple shoots',
            'Custom luxury heirloom photo album design & printing'
        ],
        actionLabel: 'Check Event Date Availability',
        enquiryType: 'photography',
        isFeatured: true,
        displayOrder: 9
    },
    {
        id: 'live-streaming',
        slug: 'live-streaming',
        title: 'Multi-Camera Live Streaming & YouTube Live',
        badge: 'Broadcast Engineering',
        category: 'Live Production',
        categoryKey: 'live-streaming',
        tagline: 'Reliable multi-camera live broadcasting to YouTube, Facebook, and private digital audiences',
        description: 'Connect family members abroad or thousands of virtual attendees to your weddings, temple celebrations, corporate conferences, and concerts with multi-angle camera switching, direct soundboard audio mixing, and low-latency bonded streaming.',
        coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/live-streaming.mp4',
        videoThumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
        videoType: 'local',
        equipmentName: 'Live Video Switcher & Streaming Encoder Station',
        equipmentSpecs: ['Multi-HDMI/SDI video switcher', 'Direct console audio balance input', 'Bonded cellular internet backup capability'],
        features: [
            'Full HD multi-angle camera live broadcasting',
            'Custom on-screen event titles, lower-thirds & sponsor logos',
            'Direct YouTube Live link provided to family worldwide prior to event',
            'Full master recording provided immediately post-event'
        ],
        actionLabel: 'Book Live Stream Crew',
        enquiryType: 'streaming',
        isFeatured: true,
        displayOrder: 10
    }
];

export const INITIAL_MACHINERY_VIDEOS = [
    {
        id: 'mach-uv-1',
        title: 'Precision UV Flatbed in Action',
        serviceCategory: 'UV Printing',
        categoryKey: 'uv-printing',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/uv-printing.mp4',
        videoType: 'local',
        equipmentName: 'UV Flatbed Printing Bed',
        duration: '0:45',
        description: 'Watch our UV printer cure vibrant white and full-color pigments directly onto high-gloss clear acrylic sheets.'
    },
    {
        id: 'mach-laser-1',
        title: 'Computer-Calibrated Laser Cutting',
        serviceCategory: 'Laser Cutting',
        categoryKey: 'laser-cutting',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/laser-cutting.mp4',
        videoType: 'local',
        equipmentName: 'CO2 Laser Optical System',
        duration: '0:38',
        description: 'High-speed laser beam slicing intricate custom wooden frame borders with clean, burn-free edge profiles.'
    },
    {
        id: 'mach-epson-1',
        title: 'Fine Art Wide-Format Printing',
        serviceCategory: 'Epson Printing',
        categoryKey: 'epson-printing',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoUrl: '',
        videoType: 'r2',
        equipmentName: 'Epson Archival System',
        duration: '1:12',
        description: 'Micro-droplet printhead laying rich archival pigment on 300gsm textured fine-art portrait canvas.'
    },
    {
        id: 'mach-laptop-1',
        title: 'Laptop Diagnostic & Thermal Service',
        serviceCategory: 'Laptop Servicing',
        categoryKey: 'laptop-repair',
        thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/laptop-service.mp4',
        videoType: 'local',
        equipmentName: 'ESD Electronic Workbench',
        duration: '0:52',
        description: 'Precision teardown, ultrasonic heatsink de-dusting, and thermal compound replacement on a gaming laptop.'
    },
    {
        id: 'mach-stream-1',
        title: 'Multi-Camera Live Broadcast Switching',
        serviceCategory: 'Live Production',
        categoryKey: 'live-streaming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
        videoUrl: '/service-videos/live-streaming.mp4',
        videoType: 'local',
        equipmentName: 'Video Broadcast Console',
        duration: '1:05',
        description: 'Live switching between 3 camera angles during a wedding mandap ceremony with crystal clear digital audio.'
    }
];

export const INITIAL_EQUIPMENT = [
    {
        id: 'eq-uv-printer',
        name: 'Industrial UV Flatbed Printer',
        category: 'UV Printing',
        photoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        description: 'Commercial flatbed system engineered for direct printing onto glass, acrylic, wood, canvas, and metallic promotional gifts with instant UV LED curing lamps.',
        capabilities: [
            'Direct-to-substrate printing up to 10cm thickness',
            'Dense opaque white ink foundation layer',
            'Instant UV curing with zero drying waiting time',
            'Vivid color saturation resistant to sunlight fading'
        ]
    },
    {
        id: 'eq-laser-cutter',
        name: 'Precision CO2 Laser Cutting & Engraving Suite',
        category: 'Laser Cutting',
        photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        description: 'Digital computer-guided laser system delivering sub-millimeter cutting accuracy on cast acrylic, engineered woods, leather, and craft papers.',
        capabilities: [
            'Flame-polished acrylic edge finish directly from cut',
            'Micro-scale vector engraving on wood and acrylic surfaces',
            'Bespoke gift silhouette & custom frame profiling',
            'High repeatable precision for corporate volume orders'
        ]
    },
    {
        id: 'eq-epson-printer',
        name: 'Epson Wide-Format Fine Art Photo Printer',
        category: 'Epson Printing',
        photoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        description: 'Museum-grade photo reproduction engine equipped with archival pigment inks to deliver lifelike skin tones, deep blacks, and smooth tonal gradients.',
        capabilities: [
            'Archival pigment ink set with longevity ratings',
            'Support for textured watercolor paper & canvas rolls',
            'Wide color gamut reproduction for high-end studio portraits',
            'High-definition micro-piezo drop placement'
        ]
    },
    {
        id: 'eq-laptop-station',
        name: 'ESD-Safe Hardware Diagnostic & Repair Station',
        category: 'Laptop Servicing',
        photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        description: 'Grounded electro-static discharge compliant workstation equipped with diagnostic oscilloscopes, thermal cameras, and micro-soldering tools.',
        capabilities: [
            'Non-destructive laptop teardown and component inspection',
            'Thermal imaging for short-circuit & heat hotspot isolation',
            'High-grade thermal paste application for cooling efficiency',
            'Hardware component testing (Display, SSD, RAM, Battery)'
        ]
    },
    {
        id: 'eq-cinema-cameras',
        name: 'Full-Frame 4K Cinema Camera Rigs & Gimbals',
        category: 'Photography & Wedding',
        photoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        description: 'High-dynamic-range cinema cameras paired with prime optical glass, 3-axis electronic gimbals, and wireless audio lavaliers for wedding and event documentation.',
        capabilities: [
            '4K 10-bit recording with filmic depth of field',
            'Low-light clean capture for evening mandap ceremonies',
            'Smooth motorized tracking shots via 3-axis stabilization',
            'Multi-channel broadcast audio recording'
        ]
    },
    {
        id: 'eq-live-switcher',
        name: 'Multi-Camera Video Switcher & Broadcast Deck',
        category: 'Live Production',
        photoUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80',
        description: 'Digital live production switcher capable of real-time transition mixing between multiple HDMI/SDI cameras, overlaying graphics, and streaming direct to YouTube.',
        capabilities: [
            'Instant multi-camera switching without latency drop',
            'Hardware encoding to YouTube Live and social platforms',
            'Direct soundboard XLR/TRS balance audio mix',
            'Live on-screen custom titles, names & border graphics'
        ]
    }
];
