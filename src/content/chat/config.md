---
assistantName: "Virtual Concierge"
modalTitle: "Studio Guide"
welcomeMessage: "Hi! I'm your studio concierge. How can I help you today?"
inputPlaceholder: "Type your question..."
quickActions:
  - label: "📅 Book Appointment"
    prompt: "How can I book an appointment?"
  - label: "🖼️ Our Artists"
    prompt: "Tell me about your artists."
  - label: "� Location"
    prompt: "Where is the studio located?"
  - label: "💵 Pricing"
    prompt: "How much does a tattoo cost?"
staticResponses:
  - trigger: "Where is the studio located?"
    response: "We are located at: **Cuba Tattoo Studio**, 123 Ink Street, Havana Key, FL. Located right next to the Coffee Spot!"
  - trigger: "How much does a tattoo cost?"
    response: "Our minimum is **$100**. Hourly rates vary by artist ($150-$250/hr). For a precise quote, please book a consultation or use the 'Book Appointment' flow to send us your details!"
  - trigger: "What are your hours?"
    response: "We are open **Tuesday - Sunday** from **11:00 AM to 8:00 PM**. We are closed on Mondays."
  - trigger: "Tell me about your artists."
    response: "We have three amazing resident artists: **David** (Realism & Blackwork), **Nina** (Fine Line & Floral), and **Karli** (Traditional & Color). You can view their full portfolios in the 'Artists' section!"
bookingSteps:
  - key: "age"
    question: 
      - "Awesome! I'd love to help you set that up. First things first—are you 18 or older?"
      - "Let's get started! Just a quick legal check: are you 18 or older?"
      - "Excited to work on this with you. I need to confirm first: are you at least 18?"
      - "To book a session, I just need to verify: are you 18+?"
    type: "option"
    options: ["Yes, I am 18+", "Not yet"]
  - key: "artist"
    question: 
      - "Great. Do you have a specific artist in mind for your session, or are you looking for a recommendation?"
      - "Do you know who you'd like to work with, or should we match you with the best fit?"
      - "Is there a particular artist from our team you're hoping to book with?"
      - "Who's your preferred artist? Or select 'No preference' if you're open!"
    type: "option"
    options: ["David", "Nina", "Karli", "No preference"]
  - key: "placement"
    question: 
      - "Got it. Where on your body are you thinking of placing this masterpiece?"
      - "Where are we putting this new ink? (Arm, Leg, Back, etc.)"
      - "What's the placement you have in mind?"
      - "Where is this going to live forever? Pick a spot!"
    type: "option"
    options: ["Arm", "Leg", "Back", "Chest", "Other"]
  - key: "placement_image"
    question: 
      - "Mind sharing a photo of the area? It helps us visualize the canvas (and cover-ups if needed)."
      - "If you can, upload a quick pic of the spot. It helps the artist prepare."
      - "Could you show us the area? A photo helps a ton with sizing and flow."
      - "Photo time! Can you snap a picture of where you want the tattoo?"
    type: "image"
  - key: "size"
    question: 
      - "And roughly what size are you envisioning?"
      - "How big are we talking? Small detail or big statement?"
      - "What dimensions do you have in mind?"
      - "Size-wise, what are you looking for?"
    type: "option"
    options: ["Small (<3in)", "Medium (3-6in)", "Large (>6in)", "Full Sleeve/Back"]
  - key: "style"
    question: 
      - "Almost done with the basics. What style are you envisioning for this?"
      - "What vibe are we going for? (Realism, Trad, etc.)"
      - "Help us understand the look: What's your preferred style?"
      - "Style check: Realism, Fine Line, or something else?"
    type: "option"
    options: ["Realism", "Traditional", "Fine Line", "Blackwork", "Not sure / Open to advice"]
  - key: "idea"
    question: 
      - "Perfect. Last detail: Tell me a bit about your idea. What are we making today? (Feel free to describe the subject, mood, or elements)"
      - "Now for the fun part: What's the concept? Describe your idea!"
      - "Tell me about the design. What exactly do you want to get tattooed?"
      - "I'm all ears. What's the idea behind this piece?"
    type: "text"
  - key: "reference_image"
    question: 
      - "Optionally, do you have any reference images or sketches for your idea?"
      - "Got any reference pics? Upload them here if you do!"
      - "Do you have any inspiration photos or sketches to spark the design?"
      - "Visuals help! Feel free to attach a reference image."
    type: "image"
  - key: "name"
    question: 
      - "Thanks! Now, who am I specifically creating this dossier for? (Your full name)"
      - "Almost done. What's your full name for the booking file?"
      - "May I have your name to put on this request?"
      - "Who is this booking for? Your full name, please."
    type: "text"
  - key: "phone"
    question: 
      - "And a phone number? (Optional, just type 'Skip' if you prefer email only)"
      - "Best number to text you at? (Or just say 'Skip')"
      - "Do you have a phone number for quick updates? (Optional)"
      - "Phone number? (We promise not to spam, just for scheduling)"
    type: "text"
    errorMessage:
      - "That doesn't look like a standard US number. Please enter 10 digits or type 'Skip'."
      - "Oops! I need a 10-digit number (e.g., 5551234567). Try again?"
      - "Please verify the number. It should be 10 digits long."
  - key: "email"
    question: 
      - "What is the best email address to reach you at?"
      - "Where should we send the confirmation? (Email address)"
      - "What's your email?"
      - "We'll need an email to finalize everything. What's yours?"
    type: "text"
    errorMessage:
      - "That doesn't look like a valid email. Please check the format (name@example.com)."
      - "Hmm, I can't accept that email. Can you double-check it?"
      - "Please enter a valid email address so we can reach you."
  - key: "appointment"
    question: 
      - "Let's check the calendar! Please select a date and time that works for you."
      - "When would you like to come in? Pick a slot from the calendar below."
      - "Available slots are shown below. Which one do you prefer?"
    type: "date"
  - key: "verification_code"
    question: 
      - "I've sent a 6-digit verification code to your email. Please verify it so I can finalize your dossier."
      - "Check your inbox! I sent a code. What is it?"
      - "Security first. I sent a code to your email, please type it here."
      - "Just sent a verification code. Please enter it to confirm it's you."
    type: "text"
    errorMessage:
      - "The code should be exactly 6 digits. Please check your email and try again."
      - "That code seems incorrect. It needs to be a 6-digit number."
      - "Invalid code format. Please enter the 6 digits I sent you."
---
You are a friendly and professional studio concierge for Cuba Tattoo Studio. 
Your goal is to help clients feel welcome and informed.
Use a natural, human-like tone—avoid robotic phrases like "As an AI".
Answer questions directly and helpfully using the provided context.
If the user asks about something not in your knowledge base, kindly suggest they contact the studio directly.
Keep responses concise but warm.
