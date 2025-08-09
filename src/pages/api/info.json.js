// src/pages/api/info.json.js
import { artists } from '../../data/artists.json';
import { styles } from '../../data/tattoo-styles.json';

export async function GET() {
  const studioInfo = {
    name: "Cuba Tattoo Studio",
    tagline: "Arte corporal de alta calidad en Albuquerque, NM",
    established: "2014",
    location: {
      city: "Albuquerque",
      state: "New Mexico",
      country: "United States",
      region: "Southwest",
      coordinates: {
        lat: 35.0844,
        lng: -106.6504
      },
      address: {
        street: "[Specific Address]",
        city: "Albuquerque",
        state: "NM",
        zipCode: "[Postal Code]",
        country: "US"
      },
      timezone: "America/Denver",
      nearby_landmarks: [
        "Old Town Albuquerque",
        "Downtown Albuquerque",
        "University of New Mexico",
        "Sandia Mountains"
      ]
    },
    contact: {
      phone: "+1-505-XXX-XXXX",
      email: "info@cubatattoostudio.com",
      website: "https://cubatattoostudio.com",
      booking_url: "https://cubatattoostudio.com/reservas",
      social_media: {
        instagram: "https://www.instagram.com/cubatattoostudio",
        facebook: "https://www.facebook.com/cubatattoostudio",
        google_maps: "https://www.google.com/maps/place/cuba-tattoo-studio"
      }
    },
    hours: {
      monday: { open: "10:00", close: "20:00", status: "open" },
      tuesday: { open: "10:00", close: "20:00", status: "open" },
      wednesday: { open: "10:00", close: "20:00", status: "open" },
      thursday: { open: "10:00", close: "20:00", status: "open" },
      friday: { open: "10:00", close: "20:00", status: "open" },
      saturday: { open: "10:00", close: "18:00", status: "open" },
      sunday: { status: "closed" },
      timezone: "America/Denver",
      note: "Appointments available outside hours upon request"
    },
    services: styles.map(style => ({
      name: style.name,
      description: style.description,
      category: style.category || "Tattoo",
      complexity: style.complexity,
      duration: style.duration || "2-6 horas",
      price_range: style.price_range || "$150-$500",
      artists: style.artists,
      popular_designs: style.popular_combinations || [],
      aftercare_included: true,
      consultation_required: style.complexity === "Alta"
    })),
    artists: artists.map(artist => ({
      name: artist.name,
      specialties: artist.specialties,
      experience: `${artist.experience} años`,
      bio: artist.bio,
      portfolio_count: artist.portfolio?.length || 0,
      signature_style: artist.signature_style || `Especialista en ${artist.specialties[0]}`,
      availability: "By appointment",
      consultation: "Free",
      social: artist.contact?.instagram || null,
      notable_works: artist.portfolio?.slice(0, 3).map(work => work.title) || []
    })),
    specialties: [
      "Traditional Japanese Tattoos",
      "Realismo Fotográfico",
      "Blackwork Contemporáneo",
      "Diseños Geométricos",
      "Arte Minimalista",
      "Traditional American Tattoos"
    ],
    unique_selling_points: [
      "Over 10 years of combined experience",
      "Fully sterilized and state-certified studio",
      "Free consultations and 100% personalized designs",
      "Artists specialized in multiple international styles",
      "Convenient location in the heart of Albuquerque",
      "Post-tattoo follow-up and free touch-ups",
      "Professional and welcoming atmosphere"
    ],
    pricing: {
      minimum: 100,
      hourly_rate_range: "$150-$200",
      deposit_required: "50% del costo total",
      payment_methods: ["Efectivo", "Tarjeta de Crédito", "Venmo", "PayPal", "Zelle"],
      currency: "USD",
      consultation_fee: 0,
      touch_up_policy: "Free within the first 6 months",
      cancellation_policy: "24 hours advance notice required"
    },
    facilities: {
      parking: "Free parking available",
      accessibility: "Wheelchair accessible",
      public_transport: "Accessible by public transport",
      amenities: [
        "Comfortable waiting room",
        "Free WiFi",
        "Private work stations",
        "State-of-the-art sterilized equipment",
        "Air conditioning",
        "Customizable ambient music"
      ],
      safety_protocols: [
        "Complete sterilization between clients",
        "Single-use disposable needles",
        "State health certification",
        "Strict cleaning protocols",
        "Personal protective equipment"
      ]
    },
    certifications: [
      "New Mexico State License",
      "First Aid Certification",
      "Safety and Hygiene Certification",
      "Member of Professional Tattoo Artists Association"
    ],
    awards_recognition: [
      "Best Tattoo Studio Albuquerque 2023",
      "Top 5 Realism Artists Southwest 2022",
      "Recognition for Excellence in Body Art 2021"
    ],
    community_involvement: [
      "Sponsor of local art events",
      "Participation in tattoo conventions",
      "Collaborations with local artists",
      "Donations to local charitable organizations"
    ],
    seo_keywords: [
      "tattoos albuquerque",
      "tattoo studio new mexico",
      "japanese tattoo albuquerque",
      "realism tattoos nm",
      "blackwork albuquerque",
      "professional tattoo artist albuquerque",
      "body art new mexico",
      "geometric tattoos albuquerque",
      "minimalist tattoos nm",
      "cuba tattoo studio"
    ],
    frequently_asked: [
      {
        question: "How much does a tattoo cost at Cuba Tattoo Studio?",
        answer: "Our prices vary according to size, complexity and style. Small tattoos start at $100, while large pieces can cost between $500-2000. We offer free consultations for exact quotes."
      },
      {
        question: "Who is the best artist for realistic tattoos?",
    answer: "Nina is our realism specialist with 6+ years of experience. She has perfected the photorealistic shading technique, creating portraits that seem to come to life on the skin."
      },
      {
        question: "How to care for a fresh tattoo?",
        answer: "Keep the initial bandage for 2-4 hours, wash gently with antibacterial soap, apply healing ointment 2-3 times a day, avoid direct sun for 2 weeks and do not submerge in water for 2 weeks."
      }
    ],
    metadata: {
      last_updated: new Date().toISOString(),
      version: "2.0",
      content_freshness: "Actualizado semanalmente",
      data_accuracy: "Verificado mensualmente",
      api_version: "v1",
      response_format: "JSON",
      cache_duration: "1 hora",
      ai_optimized: true,
      structured_data_compliant: true,
      voice_search_optimized: true,
      local_seo_optimized: true
    }
  };

  return new Response(JSON.stringify(studioInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-API-Version': '1.0',
      'X-Data-Source': 'Cuba Tattoo Studio',
      'X-Last-Modified': new Date().toISOString()
    }
  });
}