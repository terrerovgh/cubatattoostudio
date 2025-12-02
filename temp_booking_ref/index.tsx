import React from 'react';
import ReactDOM from 'react-dom/client';
import InkFlowBookingWidget from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Example of a parent website embedding the booking widget
const ParentWebsite = () => {
  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      {/* Parent Website Navigation */}
      <nav className="border-b border-zinc-800 py-4 px-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-widest uppercase">Tattoo Studio</div>
        <ul className="flex gap-6 text-sm font-medium text-zinc-400">
          <li className="hover:text-white cursor-pointer">Portfolio</li>
          <li className="hover:text-white cursor-pointer">Artists</li>
          <li className="text-white border-b border-primary">Book Now</li>
          <li className="hover:text-white cursor-pointer">Contact</li>
        </ul>
      </nav>

      <section className="py-20 text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Book Your Appointment</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Ready to get inked? Use our advanced AI-powered booking system to visualize your design
          and secure your slot with one of our master artists.
        </p>
      </section>

      {/* Embedding the Booking Widget Section */}
      <section className="max-w-5xl mx-auto mb-20 px-4">
        <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
          {/* The Widget */}
          <InkFlowBookingWidget 
            className="w-full h-[800px]" 
            onBookingComplete={(data) => console.log("Booking Completed:", data)}
          />
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-10 text-center text-zinc-600 text-sm">
        &copy; 2024 Tattoo Studio. All rights reserved.
      </footer>
    </div>
  );
};

root.render(
  <React.StrictMode>
    <ParentWebsite />
  </React.StrictMode>
);