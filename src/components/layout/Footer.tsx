import { Link } from "react-router-dom";
import { Scissors, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Blouse Stitching", path: "/category/blouse" },
    { name: "Kurti Designs", path: "/category/kurti" },
    { name: "Saree Alterations", path: "/category/saree" },
    { name: "Uniforms", path: "/uniforms" },
    { name: "Men's Tailoring", path: "/mens" },
  ],
  company: [
    { name: "About Us", path: "/about" },
    { name: "Our Tailors", path: "/tailors" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ],
  support: [
    { name: "How It Works", path: "/how-it-works" },
    { name: "Measurement Guide", path: "/measurements" },
    { name: "FAQs", path: "/faqs" },
    { name: "Terms & Conditions", path: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer - Compact on mobile */}
        <div className="py-8 md:py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand - Full width on mobile */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Scissors className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-display font-bold leading-none text-white">Tailo</h3>
              </div>
            </Link>
            <p className="text-white/80 text-xs md:text-sm mb-4 max-w-xs">
              Premium tailoring for modern styles. Craft garments that celebrate your unique style.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Services - Compact list */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm text-white">Services</h4>
            <ul className="space-y-1 md:space-y-1.5">
              {footerLinks.services.slice(0, 4).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs md:text-sm text-white/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm text-white">Support</h4>
            <ul className="space-y-1 md:space-y-1.5">
              {footerLinks.support.slice(0, 4).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs md:text-sm text-white/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Hidden on mobile, shown on lg */}
          <div className="hidden lg:block">
            <h4 className="font-semibold mb-3 text-sm text-white">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-white/80">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-white/80">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>hello@tailo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="py-4 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Tailo. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/70">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
