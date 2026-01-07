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
        <section className="py-20 lg:py-32 px-6 lg:px-8 text-center bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          >
            {/* Background decorative elements could go here */}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-6 relative z-10"
          >
            <motion.h1 variants={itemVariants} className="text-4xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Emlak İşinizi <span className="text-blue-600 inline-block">Dijitale Taşıyın</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              <strong>EmlakPusulası</strong>, modern emlak ofislerinin "Dijital Asistanı"dır. Portföylerinizi yönetin, müşteri taleplerini takip edin ve saniyeler içinde yasal sözleşmeler hazırlayın.
            </motion.p>
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-full">
                    Hemen Başla <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 lg:px-8 bg-white" id="features">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-center mb-4">Neden EmlakPusulası?</h2>
              <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Geleneksel defter kayıtlarından kurtulun. İşinizi hızlandıran dijital yeteneklerle tanışın.</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <Building2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Akıllı Portföy Yönetimi</h3>
                <p className="text-gray-600 leading-relaxed">
                  İlanlarınızı detaylı özelliklerle kaydedin, fotoğraflarınızı yönetin. Aktif/Pasif durumlarını tek tıkla değiştirin.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Müşteri İlişkileri (CRM)</h3>
                <p className="text-gray-600 leading-relaxed">
                  Alıcı taleplerini ve bütçelerini not edin. EmlakPusulası sizin için portföyünüzden uygun ilanarı otomatik eşleştirsin.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Hızlı Sözleşme</h3>
                <p className="text-gray-600 leading-relaxed">
                  Satış vaadi, kapora ve yetki belgelerini hukuki şablonlardan saniyeler içinde oluşturun, PDF alın ve yazdırın.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-6 lg:px-8 border-t bg-gray-50/50">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                <ShieldCheck className="h-8 w-8 text-green-600" />
                Güvenli Altyapı
              </h3>
              <p className="text-gray-600">
                Verileriniz 256-bit SSL ile şifreli sunucularda saklanır. Sadece siz ve yetki verdiğiniz ekibiniz erişebilir.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                <Zap className="h-8 w-8 text-amber-500" />
                Hızlı ve Mobil Uyumlu
              </h3>
              <p className="text-gray-600">
                Ofiste, evde veya sahada... Cep telefonunuzdan, tabletinizden tüm işlerinize kesintisiz ve hızlı erişim.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500 border-t bg-white">
        <p>&copy; {new Date().getFullYear()} EmlakPusulası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
