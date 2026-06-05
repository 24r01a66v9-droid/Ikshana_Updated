/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import MissionVision from "./components/MissionVision";
import WhatWeDo from "./components/WhatWeDo";
import Impact from "./components/Impact";
import PastEvents from "./components/PastEvents";
import Gallery from "./components/Gallery";
import SeekHelp from "./components/SeekHelp";
import Reviews from "./components/Reviews";
import SupportUs from "./components/SupportUs";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen selection:bg-brand-red selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <About />
          <MissionVision />
          <WhatWeDo />
          <Impact />
          <PastEvents />
          <Gallery />
          <SeekHelp />
          <Reviews />
          <SupportUs />
          {/* Team section could be added here later */}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
