import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetHomepageSettings } from "@workspace/api-client-react";

export function Footer() {
  const { t, lang, dir } = useLanguage();
  const { data: settings } = useGetHomepageSettings();
  const logoUrl = settings?.logoUrl;
  const storeName = lang === "ar" ? t.storeName : t.storeNameLatin;
  const email = "info@homeitfurniture.com";
  const phone = "+966 50 000 0000";

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-10 w-auto object-contain rounded-lg"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-black text-lg leading-none">H</span>
                </div>
              )}
              <h3 className="text-xl font-black text-primary">{storeName}</h3>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed mb-6 text-sm">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/products" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.nav.products}</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white">{t.footer.customerService}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.footer.faq}</Link></li>
              <li><Link href="/returns" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.footer.returns}</Link></li>
              <li><Link href="/terms" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/privacy" className="text-secondary-foreground/80 hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold mb-6 text-white">{t.footer.contactUs}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-secondary-foreground/80">
                <MapPin className="text-primary mt-0.5 shrink-0" size={18} />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Phone className="text-primary shrink-0" size={18} />
                <span dir="ltr">{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Mail className="text-primary shrink-0" size={18} />
                <span dir="ltr">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            {t.footer.rights} &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mada_Logo.svg/200px-Mada_Logo.svg.png" alt="Mada" className="h-6 object-contain bg-white px-2 py-1 rounded" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6 object-contain bg-white px-2 py-1 rounded" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain bg-white px-2 py-1 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
