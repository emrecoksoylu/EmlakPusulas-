```javascript
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Users, FileText, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EmlakPusulası",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TRY"
    },
    "description": "Emlak danışmanları için geliştirilmiş portföy takip, müşteri yönetimi ve sözleşme hazırlama asistanı."
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="px-6 lg:px-8 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Building2 className="h-6 w-6" />
          <span>EmlakPusulası</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">Ücretsiz Başla</Button>
          </Link>
        </nav>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
              Portföylerinizi yönetin, müşteri taleplerini takip edin ve saniyeler içinde profesyonel sözleşmeler hazırlayın.
              Modern emlak danışmanının yeni asistanı.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Hemen Başla <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 lg:px-8 bg-white" id="features">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Neden EmlakPusulası?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Akıllı Portföy Yönetimi</h3>
                <p className="text-gray-600">
                  İlanlarınızı detaylı özelliklerle kaydedin, fotoğraflarınızı yönetin ve anlık durum takibi yapın.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Müşteri İlişkileri (CRM)</h3>
                <p className="text-gray-600">
                  Alıcı ve satıcı taleplerini not edin, otomatik eşleşmeler yakalayın ve müşteri memnuniyetini artırın.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hızlı Sözleşme</h3>
                <p className="text-gray-600">
                  Satış vaadi, kapora ve yetki belgelerini şablonlardan saniyeler içinde oluşturun ve yazdırın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-6 lg:px-8 border-t">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                Güvenli Altyapı
              </h3>
              <p className="text-gray-600">
                Verileriniz şifreli sunucularda saklanır. Sadece siz ve yetki verdiğiniz ekibiniz erişebilir.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Hızlı ve Mobil Uyumlu
              </h3>
              <p className="text-gray-600">
                Ofiste bilgisayardan, sahada cep telefonundan kesintisiz ve hızlı erişim.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500 border-t">
        <p>&copy; {new Date().getFullYear()} EmlakPusulası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
