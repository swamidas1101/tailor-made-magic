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
    <footer className="bg-foreground text-background pattern-fabric">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold leading-none">Tailo</h3>
                <p className="text-xs text-background/60">Premium Tailoring</p>
              </div>
            </Link>
            <p className="text-background/70 text-sm mb-6 max-w-sm">
              Experience the art of bespoke tailoring. From traditional designs to modern styles, 
              we craft garments that celebrate your unique style.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@tailo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Tailo. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/60">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/login" className="hover:text-accent transition-colors">Business Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
