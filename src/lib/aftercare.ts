import type { AftercareMessageType } from '../types/booking';

// ─── Aftercare Schedule ───────────────────────────────

export interface AftercareStep {
  day: number;
  type: AftercareMessageType;
  subject: string;
  body: string;
}

export function getAftercareSchedule(clientName: string, artistName: string): AftercareStep[] {
  return [
    {
      day: 0,
      type: 'care_instructions',
      subject: `Your Tattoo Aftercare Guide — Cuba Tattoo Studio`,
      body: `Hi ${clientName},

Thank you for trusting ${artistName} at Cuba Tattoo Studio with your new tattoo! Here are your aftercare instructions:

**First 24 Hours:**
• Keep the bandage on for 2-4 hours (or as directed by your artist)
• Gently wash with lukewarm water and fragrance-free soap
• Pat dry with a clean paper towel — never rub
• Apply a thin layer of unscented moisturizer (Aquaphor or similar)

**Days 1-14:**
• Wash 2-3 times daily with gentle soap
• Apply thin layers of moisturizer — don't over-moisturize
• DO NOT pick, scratch, or peel any flaking skin
• Avoid swimming, hot tubs, saunas, and direct sunlight
• Wear loose, breathable clothing over the tattoo
• Sleep on clean sheets

**Days 14-30:**
• Continue moisturizing daily
• Apply SPF 30+ sunscreen when exposed to sun
• The tattoo may look dull during healing — this is normal!

**Contact us immediately if you notice:**
• Excessive redness or swelling after 48 hours
• Pus or unusual discharge
• Fever or signs of infection

Questions? Reply to this email or call us at (505) 492-9806.

— Cuba Tattoo Studio Team`,
    },
    {
      day: 3,
      type: 'check_in',
      subject: `How's Your Tattoo Healing? — Day 3 Check-in`,
      body: `Hi ${clientName},

It's been 3 days since your session with ${artistName}! We wanted to check in on how your tattoo is healing.

By now, you may notice some peeling or flaking — this is completely normal! Remember:
• Don't pick at the flaking skin
• Keep moisturizing with thin layers
• Avoid submerging in water

Is everything looking good? If you have any concerns about your healing, don't hesitate to reach out. We're here to help!

Reply to this email with any questions.

— Cuba Tattoo Studio`,
    },
    {
      day: 7,
      type: 'photo_request',
      subject: `We'd Love to See Your Healed Tattoo! 📸`,
      body: `Hi ${clientName},

Your tattoo from ${artistName} should be well into the healing process by now!

We'd love to see how it's looking — would you mind sending us a quick photo? Healed tattoo photos help us showcase our artists' work and help future clients see what to expect.

Simply reply to this email with a photo, and if you're comfortable, we may feature it on our portfolio (with your permission of course!).

As a thank you, you'll earn **50 loyalty points** just for sharing your healed result.

— Cuba Tattoo Studio`,
    },
    {
      day: 14,
      type: 'review_request',
      subject: `Share Your Experience — Cuba Tattoo Studio`,
      body: `Hi ${clientName},

It's been two weeks since your session with ${artistName}, and we hope you're loving your new tattoo!

If you had a great experience, we'd really appreciate it if you could leave us a review:

⭐ **Google:** https://g.page/cubatattoostudio/review
⭐ **Instagram:** Tag us @cubatattoostudio

Your feedback helps other tattoo enthusiasts find us and supports our amazing artists.

You'll also earn **75 loyalty points** for leaving a review!

Thank you for choosing Cuba Tattoo Studio.

— The Cuba Tattoo Team`,
    },
    {
      day: 30,
      type: 'followup_coupon',
      subject: `A Special Thank You — 10% Off Your Next Session`,
      body: `Hi ${clientName},

It's been a month since your tattoo with ${artistName} — we hope it's fully healed and you're showing it off!

As a valued client, we'd like to offer you **10% off your next session** at Cuba Tattoo Studio.

Use code: **COMEBACK10** when booking online, or just mention it when you call.

This offer is valid for the next 60 days. Whether you're thinking about your next piece, a touch-up, or something completely new — we're ready to create something amazing.

Book your next session: https://cubatattoostudio.com/booking

See you soon!

— Cuba Tattoo Studio`,
    },
  ];
}

// ─── Schedule aftercare messages for a booking ────────

export function generateAftercareMessages(params: {
  bookingId: string;
  clientId: string;
  completedDate: string;
  clientName: string;
  artistName: string;
}): Array<{
  booking_id: string;
  client_id: string;
  day_number: number;
  type: AftercareMessageType;
  channel: 'email';
  status: 'pending';
  scheduled_for: string;
  content: string;
}> {
  const schedule = getAftercareSchedule(params.clientName, params.artistName);
  const baseDate = new Date(params.completedDate);

  return schedule.map((step) => {
    const scheduledDate = new Date(baseDate);
    scheduledDate.setDate(scheduledDate.getDate() + step.day);

    return {
      booking_id: params.bookingId,
      client_id: params.clientId,
      day_number: step.day,
      type: step.type,
      channel: 'email' as const,
      status: 'pending' as const,
      scheduled_for: scheduledDate.toISOString(),
      content: JSON.stringify({ subject: step.subject, body: step.body }),
    };
  });
}
