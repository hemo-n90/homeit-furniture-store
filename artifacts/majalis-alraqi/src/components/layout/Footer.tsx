import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-black text-primary mb-6">مجالس الراقي</h3>
            <p className="text-secondary-foreground/80 leading-relaxed mb-6">
              نصنع لك مجالس وأثاثاً يعكس ذوقك الرفيع ويليق بضيوفك. جودة لا تضاهى وفخامة تدوم طويلاً.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">روابط سريعة</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/products" className="text-secondary-foreground/80 hover:text-primary transition-colors">المنتجات</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">خدمة العملاء</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-secondary-foreground/80 hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/returns" className="text-secondary-foreground/80 hover:text-primary transition-colors">سياسة الاسترجاع</Link></li>
              <li><Link href="/terms" className="text-secondary-foreground/80 hover:text-primary transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="text-secondary-foreground/80 hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-foreground/80">
                <MapPin className="text-primary mt-1 shrink-0" size={20} />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Phone className="text-primary shrink-0" size={20} />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/80">
                <Mail className="text-primary shrink-0" size={20} />
                <span>info@majalisalraqi.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            جميع الحقوق محفوظة لمجالس الراقي &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mada_Logo.svg/200px-Mada_Logo.svg.png" alt="Mada" className="h-6 object-contain bg-white px-2 py-1 rounded" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6 object-contain bg-white px-2 py-1 rounded" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain bg-white px-2 py-1 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
