import React, { useState } from "react"
import { tramerVerileri, type TramerKayit } from "./tramerData"

// ── types ──────────────────────────────────────────────────────────────────
type KullaniciTuru = "acente" | "bolge" | "gm" | null
type Tab =
  | "talepler"
  | "bana-atananlar"
  | "havuzdaki"
  | "taslak"
  | "islemdeki"
  | "tamamlanan"
  | "reddedilen"
  | "yeni-gelen"
  | "uzerimdeki"
  | "gmye-gonderilen"
  | "bilgi-bekleyen"
  | "onay-bekleyen"
  | "teklif-olusturulan"
type NavItem = "kontrol-paneli" | "filo-yonetim" | "talepler"
type View = "list" | "create"

interface OnayKaydi {
  id: number
  konu: string
  oncelik: string
  talepTipi: string
  brans: string
  aracAdedi: string
  eposta: string
  olusturulmaTarihi: string
  durum: "Onay Bekliyor" | "Onaylandı" | "Reddedildi"
}

interface ParkArac {
  id: number
  plaka: string
  aracTipi: string
  modelYili: string
  aracBedeli: string
}

interface MusteriKaydi {
  id: number
  vknTckn: string
  musteriUnvani: string
  kanalKodu: string
  kanalAdi: string
}

interface AcenteKaydi {
  kod: string
  unvan: string
  anaAcente: boolean
}

interface TalepFormData {
  talepTipi: string
  brans: string
  eposta: string
  aracAdedi: string
  kanalAdi: string
  kanalKodu: string
  acenteler: AcenteKaydi[]
  musteriler: MusteriKaydi[]
  parkYeriAraclar: ParkArac[]
  servisShartı: string
  yurtdisiTeminat: string
  elektrikliArac: string
  kisaSureliKiralik: string
  operasyonelKiralik: string
  ikameArac: string
  muafiyet: string
  kilitMekanizmasiLimiti: string
  ferdiKazaOlumLimiti: string
  ferdiKazaSakatlikLimiti: string
  ferdiKazaTedaviLimiti: string
  artanMaliSorumlulukLimiti: string
  dokumanSayisi: number
  policelerTekVade: boolean
  tekVadeTarih: string
  ozelSartlar: string
}

interface Talep {
  id: number
  konu: string
  talepNo: string
  talepTipi: string
  acenteKodu: string
  acenteUnvani: string
  musteriUnvani: string
  vknTckn: string
  bolge: string
  durum: "Yeni" | "Birleştirildi" | "Açık" | "Kapalı"
  oncelik: "Orta" | "Yüksek" | "Düşük"
  atanan: string | null
  broker: string | null
  sonGuncellemeTarihi: string
  slaDurumu: "Normal" | "Riskli" | "Aşıldı"
  kalanSlaSuresi: string
  haberlesmeSayisi: number
  dokumanSayisi: number
  robotDurum?: string
  olusturulmaTarihi: string
  sonMailTarihi: string | null
  parentId?: number
  formData?: TalepFormData
}

// ── sample data ────────────────────────────────────────────────────────────
const taleplerData: Talep[] = []

const havuzData: Talep[] = []


// ── mesaj tipi ────────────────────────────────────────────────────────────
interface Mesaj {
  id: number
  talepId: number
  tur: "ic" | "dis"
  gonderen: string
  gonderenTur: NonNullable<KullaniciTuru>
  metin: string
  tarih: string
}

interface TalepTarihceKaydi {
  talepId: number
  tarih: string
  havuz: string
  durum: string
  islemYapan: string
}

// ── shared UI helpers ──────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">
      {children}
    </h3>
  )
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-1.5 cursor-pointer group">
            <div
              onClick={() => onChange(o)}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === o ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"
              }`}
            >
              {value === o && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </div>
            <span className="text-xs text-gray-700">{o}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ── Login Screen ──────────────────────────────────────────────────────────
const KULLANICI_AD_MAP: Record<NonNullable<KullaniciTuru>, string> = {
  acente: "ase123456",
  bolge: "Bölge Kullanıcısı",
  gm: "GM Kullanıcısı",
}

function GirisEkrani({ onGiris }: { onGiris: (tur: KullaniciTuru, ad: string) => void }) {
  const [secilenTur, setSecilenTur] = useState<KullaniciTuru>(null)
  const [hata, setHata] = useState("")

  const turBilgileri: { tur: NonNullable<KullaniciTuru>; label: string; ikon: React.ReactNode; aciklama: string }[] = [
    {
      tur: "acente",
      label: "Acente",
      aciklama: "Acente kullanıcı girişi",
      ikon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      tur: "bolge",
      label: "Bölge",
      aciklama: "Bölge müdürlüğü girişi",
      ikon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      tur: "gm",
      label: "Genel Müdürlük",
      aciklama: "Genel müdürlük girişi",
      ikon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  const handleGiris = () => {
    if (!secilenTur) { setHata("Lütfen kullanıcı türünü seçiniz."); return }
    onGiris(secilenTur, KULLANICI_AD_MAP[secilenTur])
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">A</div>
            <span className="text-white font-bold text-2xl tracking-wide">AstraFilo</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Sigorta Talep<br />Yönetim Sistemi
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-sm">
            Kasko, nakliyat ve tüm sigorta taleplerinizi tek platformdan yönetin. Hızlı, güvenli ve şeffaf.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            "Anlık talep takibi ve onay süreci",
            "Çok kullanıcılı rol yönetimi",
            "Excel entegrasyonu ve raporlama",
          ].map((m) => (
            <div key={m} className="flex items-center gap-3 text-blue-100 text-sm">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Sağ panel - form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo mobil */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
            <span className="text-blue-600 font-bold text-lg">AstraFilo</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Hoş geldiniz</h2>
          <p className="text-gray-500 text-sm mb-8">Devam etmek için kullanıcı türünü seçin ve giriş yapın.</p>

          {/* Kullanıcı türü seçimi */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kullanıcı Türü</p>
            <div className="grid grid-cols-3 gap-2">
              {turBilgileri.map((t) => (
                <button
                  key={t.tur}
                  onClick={() => setSecilenTur(t.tur)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    secilenTur === t.tur
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t.ikon}
                  <span className="text-xs font-semibold leading-tight text-center">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {hata && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700 mt-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
              </svg>
              {hata}
            </div>
          )}

          <button
            onClick={handleGiris}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors mt-4"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Dosya Ekleme ──────────────────────────────────────────────────────────
function DosyaEkleme({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [dosyalar, setDosyalar] = useState<File[]>([])
  const [surukle, setSurukle] = useState(false)

  const ekle = (files: FileList | null) => {
    if (!files) return
    setDosyalar((prev) => {
      const yeniDosyalar = [...prev, ...Array.from(files)]
      onCountChange?.(yeniDosyalar.length)
      return yeniDosyalar
    })
  }

  const kaldir = (idx: number) =>
    setDosyalar((prev) => {
      const yeniDosyalar = prev.filter((_, i) => i !== idx)
      onCountChange?.(yeniDosyalar.length)
      return yeniDosyalar
    })

  const formatBoyut = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const ikonTur = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase()
    if (["pdf"].includes(ext ?? "")) return "pdf"
    if (["xls", "xlsx"].includes(ext ?? "")) return "excel"
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "")) return "image"
    return "file"
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <SectionTitle>Dosya Ekle</SectionTitle>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setSurukle(true) }}
        onDragLeave={() => setSurukle(false)}
        onDrop={(e) => { e.preventDefault(); setSurukle(false); ekle(e.dataTransfer.files) }}
        className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 px-6 transition-colors cursor-pointer ${
          surukle ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
        }`}
        onClick={() => document.getElementById("dosya-input")?.click()}
      >
        <input
          id="dosya-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => ekle(e.target.files)}
        />
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${surukle ? "bg-blue-100" : "bg-gray-100"}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={surukle ? "#2563eb" : "#6b7280"} strokeWidth="2">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          {surukle ? "Dosyayı bırakın" : "Dosya sürükleyin veya seçin"}
        </p>
        <p className="text-xs text-gray-400">PDF, Excel, Word, resim — maks. 20 MB</p>
      </div>

      {/* Dosya listesi */}
      {dosyalar.length > 0 && (
        <div className="mt-4 space-y-2">
          {dosyalar.map((dosya, i) => {
            const tur = ikonTur(dosya.name)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 group">
                {/* İkon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  tur === "pdf" ? "bg-red-100 text-red-600" :
                  tur === "excel" ? "bg-green-100 text-green-700" :
                  tur === "image" ? "bg-purple-100 text-purple-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  {tur === "pdf" ? "PDF" : tur === "excel" ? "XLS" : tur === "image" ? "IMG" : "DOC"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium truncate">{dosya.name}</p>
                  <p className="text-xs text-gray-400">{formatBoyut(dosya.size)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); kaldir(i) }}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 pt-1">{dosyalar.length} dosya seçildi</p>
        </div>
      )}
    </div>
  )
}

// ── Kontrol Paneli ────────────────────────────────────────────────────────
function KontrolPaneli({ onayHavuzu, onDurumGuncelle }: {
  onayHavuzu: OnayKaydi[]
  onDurumGuncelle: (id: number, durum: OnayKaydi["durum"]) => void
}) {
  const bekleyenler = onayHavuzu.filter((k) => k.durum === "Onay Bekliyor").length
  const onaylananlar = onayHavuzu.filter((k) => k.durum === "Onaylandı").length
  const reddedilenler = onayHavuzu.filter((k) => k.durum === "Reddedildi").length

  const durumStyle: Record<OnayKaydi["durum"], string> = {
    "Onay Bekliyor": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Onaylandı": "bg-green-100 text-green-700 border-green-200",
    "Reddedildi": "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <main className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Özet kartları */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Onay Bekleyen", value: bekleyenler, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
            { label: "Onaylanan", value: onaylananlar, color: "text-green-600", bg: "bg-green-50 border-green-200" },
            { label: "Reddedilen", value: reddedilenler, color: "text-red-500", bg: "bg-red-50 border-red-200" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
              <p className="text-xs font-medium text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Onay Havuzu tablosu */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Onay Havuzu</h2>
            {bekleyenler > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-bold">
                {bekleyenler} bekliyor
              </span>
            )}
          </div>

          {onayHavuzu.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="mx-auto mb-3 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-gray-400">Henüz onaya gönderilmiş kayıt yok.</p>
              <p className="text-xs text-gray-400 mt-1">Filo Talebi Oluştur ile yeni talep gönderin.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Konu</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Talep Tipi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Branş</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Araç Adedi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Öncelik</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tarih</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Durum</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {onayHavuzu.map((kayit) => (
                  <tr key={kayit.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-2 leading-snug">{kayit.konu}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">{kayit.talepTipi || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">{kayit.brans || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs font-mono">{kayit.aracAdedi || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        kayit.oncelik === "Yüksek" ? "bg-red-500 text-white" :
                        kayit.oncelik === "Orta" ? "bg-orange-500 text-white" :
                        "bg-green-500 text-white"
                      }`}>
                        {kayit.oncelik}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">{kayit.olusturulmaTarihi}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${durumStyle[kayit.durum]}`}>
                        {kayit.durum}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {kayit.durum === "Onay Bekliyor" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onDurumGuncelle(kayit.id, "Onaylandı")}
                            className="px-3 py-1 text-xs font-semibold text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => onDurumGuncelle(kayit.id, "Reddedildi")}
                            className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Reddet
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}

// ── Talep Oluştur Page ─────────────────────────────────────────────────────
interface TalepSubmitData extends Omit<OnayKaydi, "id" | "olusturulmaTarihi" | "durum"> {
  formData: TalepFormData
}

function TalepOlusturPage({ onBack, onSubmit }: { onBack: () => void; onSubmit: (kayit: TalepSubmitData) => void }) {
  const [konu, setKonu] = useState("")
  const [kanalAdi, setKanalAdi] = useState("")
  const [kanalKodu, setKanalKodu] = useState("")
  const [musteriVknTckn, setMusteriVknTckn] = useState("")
  const [musteriUnvani, setMusteriUnvani] = useState("")
  const [musteriler, setMusteriler] = useState<MusteriKaydi[]>([])
  const [musteriNextId, setMusteriNextId] = useState(1)
  const [musteriKontrolMesaji, setMusteriKontrolMesaji] = useState("")
  const [acenteAramaKodu, setAcenteAramaKodu] = useState("")
  const [acenteKontrolMesaji, setAcenteKontrolMesaji] = useState("")
  const [acenteler, setAcenteler] = useState<AcenteKaydi[]>([
    { kod: "320000", unvan: "Emre Acentelik", anaAcente: true },
  ])
  const [aracAdedi, setAracAdedi] = useState("")
  const [sifirArac, setSifirArac] = useState(false)
  const [oncelik, setOncelik] = useState("Orta")
  const [talepTipi, setTalepTipi] = useState("")
  const [brans, setBrans] = useState("")
  const [eposta] = useState("acentemail@gmail.com")
  const [parkYeriAraclar, setParkYeriAraclar] = useState<ParkArac[]>([{ id: 1, plaka: "", aracTipi: "", modelYili: "", aracBedeli: "" }])
  const [parkNextId, setParkNextId] = useState(2)
  const [servisShartı, setServisShartı] = useState("")
  const [yurtdisiTeminat, setYurtdisiTeminat] = useState("")
  const [elektrikliArac, setElektrikliArac] = useState("")
  const [kisaSureliKiralik, setKisaSureliKiralik] = useState("")
  const [operasyonelKiralik, setOperasyonelKiralik] = useState("")
  const [ikameArac, setIkameArac] = useState("")
  const [muafiyet, setMuafiyet] = useState("")
  const [kilitMekanizmasiLimiti, setKilitMekanizmasiLimiti] = useState("")
  const [ferdiKazaOlumLimiti, setFerdiKazaOlumLimiti] = useState("")
  const [ferdiKazaSakatlikLimiti, setFerdiKazaSakatlikLimiti] = useState("")
  const [ferdiKazaTedaviLimiti, setFerdiKazaTedaviLimiti] = useState("")
  const [artanMaliSorumlulukLimiti, setArtanMaliSorumlulukLimiti] = useState("")
  const [policelerTekVade, setPolicelerTekVade] = useState(false)
  const [tekVadeTarih, setTekVadeTarih] = useState("")
  const [ozelSartlar, setOzelSartlar] = useState("")
  const [dokumanSayisi, setDokumanSayisi] = useState(0)
  // 100+ araç bilgileri
  const [gecenYilKaskoFiyati, setGecenYilKaskoFiyati] = useState("")
  const [gecenYilPolicheTeminat, setGecenYilPolicheTeminat] = useState("")
  const [muafiyetBilgisi, setMuafiyetBilgisi] = useState("")
  const [yurtdisiCekmeMasraf, setYurtdisiCekmeMasraf] = useState("")
  const [servisKullanimi, setServisKullanimi] = useState("")
  const [onarimServisi, setOnarimServisi] = useState("")
  const [cikmaParca, setCikmaParca] = useState("")
  const [trafikUretimi, setTrafikUretimi] = useState("")
  const [hedefFiyat, setHedefFiyat] = useState("")

  const parkAracGuncelle = (id: number, alan: keyof ParkArac, deger: string) => {
    setParkYeriAraclar((prev) => prev.map((a) => a.id === id ? { ...a, [alan]: deger } : a))
  }

  const parkAracEkle = () => {
    setParkYeriAraclar((prev) => [...prev, { id: parkNextId, plaka: "", aracTipi: "", modelYili: "", aracBedeli: "" }])
    setParkNextId((n) => n + 1)
  }

  const parkAracSil = (id: number) => {
    setParkYeriAraclar((prev) => prev.filter((a) => a.id !== id))
  }

  const musteriSorgulaVeEkle = () => {
    const vkn = musteriVknTckn.trim()
    const kod = kanalKodu.trim()

    if (vkn === "1111") {
      setMusteriKontrolMesaji("Müşteri de Karaliste/sürprim olması nedeniyle süreç durdurulmuştur. Satış Müdürlüğü ile görüşülmesi gerekmektedir")
      return
    }
    if (!vkn || !musteriUnvani.trim() || !kod || !kanalAdi.trim()) {
      setMusteriKontrolMesaji("VKN/TCKN, müşteri ünvanı, kanal kodu ve kanal adı alanlarını doldurunuz.")
      return
    }
    if (musteriler.some((musteri) => musteri.vknTckn === vkn)) {
      setMusteriKontrolMesaji("Bu VKN/TCKN listeye daha önce eklenmiştir.")
      return
    }
    if (musteriler.some((musteri) => musteri.kanalKodu.toLocaleLowerCase("tr-TR") === kod.toLocaleLowerCase("tr-TR"))) {
      setMusteriKontrolMesaji("Bu kanal kodu ile daha önce bir müşteri eklenmiştir. Mükerrer kanal kaydı oluşturulamaz.")
      return
    }

    setMusteriler((prev) => [
      ...prev,
      {
        id: musteriNextId,
        vknTckn: vkn,
        musteriUnvani: musteriUnvani.trim(),
        kanalKodu: kod,
        kanalAdi: kanalAdi.trim(),
      },
    ])
    setMusteriNextId((id) => id + 1)
    setMusteriVknTckn("")
    setMusteriUnvani("")
    setKanalKodu("")
    setKanalAdi("")
    setMusteriKontrolMesaji("")
  }

  const acenteAraVeEkle = () => {
    const kod = acenteAramaKodu.trim()
    if (!kod) {
      setAcenteKontrolMesaji("Aramak istediğiniz acente kodunu giriniz.")
      return
    }
    if (acenteler.some((acente) => acente.kod === kod)) {
      setAcenteKontrolMesaji("Bu acente talebe daha önce eklenmiştir.")
      return
    }

    const testAcenteleri: Record<string, string> = {
      "320001": "Atlas Sigorta Aracılık",
      "320002": "Marmara Güvence Acenteliği",
      "320003": "Pusula Sigorta Hizmetleri",
    }
    setAcenteler((prev) => [
      ...prev,
      {
        kod,
        unvan: testAcenteleri[kod] ?? `Test Acente ${kod}`,
        anaAcente: false,
      },
    ])
    setAcenteAramaKodu("")
    setAcenteKontrolMesaji("")
  }

  const excelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const satirlar = text.split("\n").filter(Boolean)
      const baslik = satirlar[0]?.toLowerCase() ?? ""
      const startIdx = baslik.includes("plaka") ? 1 : 0
      const yeni: ParkArac[] = satirlar.slice(startIdx).map((satir, i) => {
        const cols = satir.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ""))
        return { id: parkNextId + i, plaka: cols[0] ?? "", aracTipi: cols[1] ?? "", modelYili: cols[2] ?? "", aracBedeli: cols[3] ?? "" }
      }).filter((a) => a.plaka)
      if (yeni.length > 0) {
        setParkYeriAraclar((prev) => [...prev.filter((a) => a.plaka), ...yeni])
        setParkNextId((n) => n + yeni.length)
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const aracAdediSayi = parseInt(aracAdedi) || 0
  const buyukFiloMu = aracAdediSayi >= 100

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1"

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Geri
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <h1 className="text-lg font-bold text-gray-900">Filo Talebi Oluştur</h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Temel Bilgiler ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionTitle>Temel Bilgiler</SectionTitle>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className={labelCls}>Konu <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={konu}
                  onChange={(e) => setKonu(e.target.value)}
                  placeholder="Talep konusunu giriniz"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Öncelik</label>
                <select value={oncelik} onChange={(e) => setOncelik(e.target.value)} className={inputCls}>
                  <option>Düşük</option>
                  <option>Orta</option>
                  <option>Yüksek</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Talep Tipi</label>
                <select value={talepTipi} onChange={(e) => setTalepTipi(e.target.value)} className={inputCls}>
                  <option value="">Seçiniz</option>
                  <option>Yenileme Teklifi</option>
                  <option>Yeni Teklif</option>
                  <option>Poliçe İptali</option>
                  <option>Hasar Bildirimi</option>
                  <option>Bilgi Talebi</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Branş</label>
                <select value={brans} onChange={(e) => setBrans(e.target.value)} className={inputCls}>
                  <option value="">Seçiniz</option>
                  <option>Kasko</option>
                  <option>Karma Talep</option>
                  <option>Nakliyat</option>
                  <option>Yangın</option>
                  <option>Sağlık</option>
                  <option>Trafik</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>E-posta</label>
                <input
                  type="email"
                  value={eposta}
                  readOnly
                  aria-readonly="true"
                  className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          {/* ── Kanal & Müşteri Bilgileri ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Kanal & Müşteri Bilgileri</h3>
                <p className="text-xs text-gray-400 mt-1">{musteriler.length} müşteri eklendi</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                Manuel kontrol
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-xs text-amber-800">
              Birden fazla müşteri için ortaklık veya yönetim kurulu başkanı ibaresinin bulunduğu TSG belgesinin iletilmesi gerekmektedir.
            </div>

            <div className="rounded-xl border border-gray-200 p-4 mb-5">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className={labelCls}>Acente Koduyla Ara</label>
                  <input
                    type="text"
                    value={acenteAramaKodu}
                    onChange={(e) => { setAcenteAramaKodu(e.target.value); setAcenteKontrolMesaji("") }}
                    placeholder="Örn. 320001"
                    className={inputCls}
                  />
                </div>
                <button
                  type="button"
                  onClick={acenteAraVeEkle}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" strokeLinecap="round" />
                  </svg>
                  Acente Ara ve Ekle
                </button>
              </div>

              {acenteKontrolMesaji && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {acenteKontrolMesaji}
                </div>
              )}

              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Acente Kodu</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Acente Ünvanı</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">Rol</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {acenteler.map((acente) => (
                      <tr key={acente.kod} className="border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2.5 text-xs font-mono font-semibold text-gray-700">{acente.kod}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-700">{acente.unvan}</td>
                        <td className="px-3 py-2.5">
                          {acente.anaAcente ? (
                            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                              Talebi Oluşturan
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Ek Acente</span>
                          )}
                        </td>
                        <td className="px-2 py-2.5">
                          {!acente.anaAcente && (
                            <button
                              type="button"
                              onClick={() => setAcenteler((prev) => prev.filter((kayit) => kayit.kod !== acente.kod))}
                              className="flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                              title="Acenteyi kaldır"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Müşteri Ekle</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-4 gap-3 items-end">
              <div>
                <label className={labelCls}>VKN / TCKN</label>
                <input
                  type="text"
                  value={musteriVknTckn}
                  onChange={(e) => {
                    const vkn = e.target.value
                    setMusteriVknTckn(vkn)
                    setMusteriKontrolMesaji("")
                    if (vkn.trim() === "2222") {
                      setMusteriUnvani("Anadolu Sigorta")
                      setKanalKodu("3254")
                      setKanalAdi("Test")
                    } else if (vkn.trim() === "3333") {
                      setMusteriUnvani("Mavi Lojistik A.Ş.")
                      setKanalKodu("7812")
                      setKanalAdi("Kurumsal Satış")
                    }
                  }}
                  placeholder="VKN veya TCKN"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Müşteri Ünvanı</label>
                <input
                  type="text"
                  value={musteriUnvani}
                  onChange={(e) => { setMusteriUnvani(e.target.value); setMusteriKontrolMesaji("") }}
                  placeholder="Firma adı"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Kanal Kodu</label>
                <input
                  type="text"
                  value={kanalKodu}
                  onChange={(e) => { setKanalKodu(e.target.value); setMusteriKontrolMesaji("") }}
                  placeholder="Kanal kodu"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Kanal Adı</label>
                <input
                  type="text"
                  value={kanalAdi}
                  onChange={(e) => { setKanalAdi(e.target.value); setMusteriKontrolMesaji("") }}
                  placeholder="Kanal adı"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={musteriSorgulaVeEkle}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4M11 8v6m-3-3h6" strokeLinecap="round" />
                </svg>
                VKN Sorgula ve Listeye Ekle
              </button>
            </div>

            {musteriKontrolMesaji && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
                </svg>
                {musteriKontrolMesaji}
              </div>
            )}

            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">VKN / TCKN</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Müşteri Ünvanı</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Kanal Kodu</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Kanal Adı</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {musteriler.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-xs text-gray-400">
                        Henüz müşteri eklenmedi.
                      </td>
                    </tr>
                  ) : musteriler.map((musteri) => (
                    <tr key={musteri.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2.5 text-xs font-mono font-semibold text-gray-700">{musteri.vknTckn}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700">{musteri.musteriUnvani}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-gray-600">{musteri.kanalKodu}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">{musteri.kanalAdi}</td>
                      <td className="px-2 py-2.5">
                        <button
                          type="button"
                          onClick={() => setMusteriler((prev) => prev.filter((kayit) => kayit.id !== musteri.id))}
                          className="flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                          title="Müşteriyi kaldır"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ── Araç Adedi ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-gray-800">Araç Filosu</h3>
              <label className="flex items-center gap-2 cursor-pointer select-none ml-2">
                <div
                  onClick={() => setSifirArac((v) => !v)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${sifirArac ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
                >
                  {sifirArac && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-gray-600">Sıfır araç adeti</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Araç Adedi <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={aracAdedi}
                  onChange={(e) => setAracAdedi(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              {sifirArac && (
                <div>
                  <label className={labelCls}>Sıfır Araç Adeti</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
              )}
            </div>
            {buyukFiloMu && (
              <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-xs text-blue-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
                100 üstü araç parkı için ek bilgiler formu aşağıda görünmektedir.
              </div>
            )}
          </div>

          {/* ── Park Yeri Bilgisi ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Park Yeri Bilgisi</h3>
                <p className="text-xs text-gray-400 mt-0.5">{parkYeriAraclar.filter((a) => a.plaka).length} araç girildi</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Excel import */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4 4 4-4M12 4v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Excel / CSV İçe Aktar
                  <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={excelImport} />
                </label>
                {/* Şablon indir */}
                <button
                  onClick={() => {
                    const csv = "Plaka,Araç Tipi,Model Yılı,Araç Bedeli\n34ABC123,Otomobil,2022,500000\n"
                    const a = document.createElement("a")
                    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
                    a.download = "park_yeri_sablonu.csv"
                    a.click()
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Şablon İndir
                </button>
              </div>
            </div>

            {/* Tablo */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 w-8">#</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Plaka</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Araç Tipi</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Model Yılı</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600">Araç Bedeli (₺)</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {parkYeriAraclar.map((arac, idx) => (
                    <tr key={arac.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 text-xs text-gray-400 font-mono">{idx + 1}</td>
                      <td className="px-2 py-1.5">
                        <input
                          value={arac.plaka}
                          onChange={(e) => parkAracGuncelle(arac.id, "plaka", e.target.value.toUpperCase())}
                          placeholder="34 ABC 123"
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-blue-400 bg-white placeholder:normal-case placeholder:text-gray-400"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={arac.aracTipi}
                          onChange={(e) => parkAracGuncelle(arac.id, "aracTipi", e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                        >
                          <option value="">Seçiniz</option>
                          <option>Otomobil</option>
                          <option>Minibüs</option>
                          <option>Kamyonet</option>
                          <option>Kamyon</option>
                          <option>Otobüs</option>
                          <option>İş Makinesi</option>
                          <option>Çekici</option>
                          <option>Traktör</option>
                          <option>Motosiklet</option>
                          <option>Diğer</option>
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={arac.modelYili}
                          onChange={(e) => parkAracGuncelle(arac.id, "modelYili", e.target.value)}
                          placeholder="2024"
                          maxLength={4}
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={arac.aracBedeli}
                          onChange={(e) => parkAracGuncelle(arac.id, "aracBedeli", e.target.value)}
                          placeholder="0"
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        {parkYeriAraclar.length > 1 && (
                          <button
                            onClick={() => parkAracSil(arac.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={parkAracEkle}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Satır Ekle
            </button>
          </div>

          {/* ── Teminat & Servis Seçenekleri ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionTitle>Teminat & Servis Seçenekleri</SectionTitle>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <div>
                <RadioGroup
                  label="Hangi servis şartı talep ediliyor?"
                  options={[
                    "Anlaşmalı yetkili ve özel servis",
                    "Anlaşmalı özel servis",
                    "3 yaş sınırlı servis",
                    "Tüm özel servisler",
                  ]}
                  value={servisShartı}
                  onChange={setServisShartı}
                />
                <RadioGroup
                  label="Yurtdışı teminatı isteniyor mu?"
                  options={["Evet", "Hayır"]}
                  value={yurtdisiTeminat}
                  onChange={setYurtdisiTeminat}
                />
                <RadioGroup
                  label="Elektrikli araç var mı?"
                  options={["Evet", "Hayır"]}
                  value={elektrikliArac}
                  onChange={setElektrikliArac}
                />
                <RadioGroup
                  label="Kısa süreli kiralık mı?"
                  options={["Evet", "Hayır"]}
                  value={kisaSureliKiralik}
                  onChange={setKisaSureliKiralik}
                />
              </div>
              <div>
                <RadioGroup
                  label="Operasyonel kiralık mı?"
                  options={["Evet", "Hayır"]}
                  value={operasyonelKiralik}
                  onChange={setOperasyonelKiralik}
                />
                <RadioGroup
                  label="İkame araç teminatı isteniyor mu?"
                  options={["Evet", "Hayır"]}
                  value={ikameArac}
                  onChange={setIkameArac}
                />
                <div className="mb-4">
                  <label className={labelCls}>Kilit Mekanizması Limiti</label>
                  <select
                    value={kilitMekanizmasiLimiti}
                    onChange={(e) => setKilitMekanizmasiLimiti(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Limit seçiniz</option>
                    <option value="40.000 TL">40.000 TL</option>
                    <option value="50.000 TL">50.000 TL</option>
                    <option value="60.000 TL">60.000 TL</option>
                  </select>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Muafiyet isteniyor mu?
                  </p>
                  <p className="text-xs text-gray-400 mb-2">Rent a Car sözleşmeleri standart %2 muafiyet ile değerlendirilmektedir.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Hayır", "%1", "%2", "%5", "%10", "Tutar"].map((o) => (
                      <button
                        key={o}
                        onClick={() => setMuafiyet(o)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          muafiyet === o
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Koltuk Ferdi Kaza Teminatı</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Ölüm Limiti", value: ferdiKazaOlumLimiti, setValue: setFerdiKazaOlumLimiti },
                      { label: "Sürekli Sakatlık Limiti", value: ferdiKazaSakatlikLimiti, setValue: setFerdiKazaSakatlikLimiti },
                      { label: "Tedavi Giderleri Limiti", value: ferdiKazaTedaviLimiti, setValue: setFerdiKazaTedaviLimiti },
                    ].map((alan) => (
                      <div key={alan.label}>
                        <label className={labelCls}>{alan.label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={alan.value}
                            onChange={(e) => alan.setValue(e.target.value)}
                            placeholder="0"
                            className={`${inputCls} pr-8`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">₺</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Artan Mali Sorumluluk Teminatı</label>
                  <select
                    value={artanMaliSorumlulukLimiti}
                    onChange={(e) => setArtanMaliSorumlulukLimiti(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Limit seçiniz</option>
                    <option value="5.000.000 TL">5.000.000 TL</option>
                    <option value="10.000.000 TL">10.000.000 TL</option>
                    <option value="15.000.000 TL">15.000.000 TL</option>
                    <option value="20.000.000 TL">20.000.000 TL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Poliçe & Özel Şartlar ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <SectionTitle>Poliçe & Özel Şartlar</SectionTitle>
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setPolicelerTekVade(!policelerTekVade)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    policelerTekVade ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  }`}
                >
                  {policelerTekVade && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">Poliçeler tek vadede toplanacaktır</span>
              </label>
              {policelerTekVade && (
                <input
                  type="date"
                  value={tekVadeTarih}
                  onChange={(e) => setTekVadeTarih(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
                />
              )}
            </div>
            <div>
              <label className={labelCls}>Poliçeye basılmasını istediğiniz Özel Şartları yazınız</label>
              <textarea
                value={ozelSartlar}
                onChange={(e) => setOzelSartlar(e.target.value)}
                rows={6}
                placeholder="Özel şartlarınızı buraya yazınız..."
                className={`${inputCls} resize-none bg-yellow-50 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-100`}
              />
            </div>
          </div>

          {/* ── Dosya Ekleme ── */}
          <DosyaEkleme onCountChange={setDokumanSayisi} />

          {/* ── 100+ Araç Bilgileri (koşullu) ── */}
          {buyukFiloMu && (
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">100 Üstü Araç Parkı için Ek Bilgiler</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Not: Fiyat çalışması standart taksitlendirme planı kapsamında yapılacaktır.</p>
              <div className="space-y-3">
                {[
                  { label: "Geçen yılki kasko fiyatı", value: gecenYilKaskoFiyati, set: setGecenYilKaskoFiyati },
                  { label: "Geçen yılki poliçe teminat şartları", value: gecenYilPolicheTeminat, set: setGecenYilPolicheTeminat },
                  { label: "Muafiyet bilgisi", value: muafiyetBilgisi, set: setMuafiyetBilgisi },
                  { label: "Yurt dışı var ise önceki yıl alınan çekme kurtarma masraf miktarı ve adedi", value: yurtdisiCekmeMasraf, set: setYurtdisiCekmeMasraf },
                  { label: "Servis kullanımı/alışkanlığı (Yetki-Özel servis kullanım adetleri)", value: servisKullanimi, set: setServisKullanimi },
                  { label: "Kendilerine ait onarım servisi var mı?", value: onarimServisi, set: setOnarimServisi },
                  { label: "Onarımlarda çıkma parça, yan sanayi veya eşdeğer parça kullanılıyor mu?", value: cikmaParca, set: setCikmaParca },
                  { label: "Trafik üretimi alınacak mı?", value: trafikUretimi, set: setTrafikUretimi },
                  { label: "Bu yılki hedef fiyat", value: hedefFiyat, set: setHedefFiyat },
                ].map(({ label, value, set }) => (
                  <div key={label} className="grid grid-cols-[1fr_240px] gap-3 items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-xs text-gray-700">{label}</span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder="Açıklama"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-white placeholder:text-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Uyarı notları ── */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-bold text-yellow-800 mb-2">Önemli Notlar</p>
            {[
              "Açık Hasar Tutarları için varsa detaylı bilgi verilmesi rica olunur",
              "Sözleşmede fiyat/oran revizyonları için rakip firma yazılı teklif iletilmesi gerekmektedir.",
              "Farklı kanala ait yürürlükte poliçe ve son 3 ay içerisinde oluşturulmuş teklif varsa yetki formu gerekmektedir.",
              "Binde fiyat talep edilmesi halinde mutlaka araç bedellerinin iletilmesi gerekmektedir.",
            ].map((n) => (
              <div key={n} className="flex items-start gap-2 text-xs text-yellow-800">
                <span className="text-yellow-500 mt-0.5 shrink-0">→</span>
                {n}
              </div>
            ))}
          </div>

          {/* ── Footer Buttons ── */}
          <div className="flex justify-end gap-3 pb-2">
            <button
              onClick={onBack}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={() => {
                if (!konu.trim()) return
                onSubmit({
                  konu, oncelik, talepTipi, brans, aracAdedi, eposta,
                  formData: {
                    talepTipi, brans, eposta, aracAdedi,
                    kanalAdi, kanalKodu, acenteler, musteriler,
                    parkYeriAraclar,
                    servisShartı, yurtdisiTeminat, elektrikliArac,
                    kisaSureliKiralik, operasyonelKiralik, ikameArac,
                    muafiyet, kilitMekanizmasiLimiti,
                    ferdiKazaOlumLimiti, ferdiKazaSakatlikLimiti, ferdiKazaTedaviLimiti,
                    artanMaliSorumlulukLimiti, dokumanSayisi,
                    policelerTekVade, tekVadeTarih, ozelSartlar,
                  },
                })
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Onaya Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── sub-components ─────────────────────────────────────────────────────────
function DurumBadge({ durum }: { durum: Talep["durum"] }) {
  if (durum === "Birleştirildi") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-purple-300 text-purple-700 bg-white">
        Birleştirildi
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-300 text-blue-600 bg-white">
      Yeni
    </span>
  )
}

function OncelikBadge({ oncelik }: { oncelik: Talep["oncelik"] }) {
  const colors: Record<Talep["oncelik"], string> = {
    Orta: "bg-orange-500 text-white",
    Yüksek: "bg-red-500 text-white",
    Düşük: "bg-green-500 text-white",
  }
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${colors[oncelik]}`}>
      {oncelik}
    </span>
  )
}

function RowActions({ onDetails, onGMeAktar, gmAktarildi }: {
  onDetails: () => void
  onGMeAktar?: () => void
  gmAktarildi?: boolean
}) {
  return (
    <div className="flex items-center gap-2 justify-end">
      {onGMeAktar && (
        gmAktarildi ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            GM'ye Aktarıldı
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onGMeAktar() }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            title="Genel Müdürlüğe Aktar"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            GM'ye Aktar
          </button>
        )
      )}
      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Geçmiş">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Ata" onClick={onDetails}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Yanıtla">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="text-gray-400 hover:text-gray-600 transition-colors" title="İlet">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 5l7 7-7 7M5 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

function TalepTable({ data, onRowClick, onSahiplen, onGMeAktar, onTeklifOlusturuldu, teklifOlusturabilir, gmAktarilanIds, kullaniciTuru, robotDurumlar, onTramerTikla }: {
  data: Talep[]
  onRowClick: (t: Talep) => void
  onSahiplen?: (t: Talep) => void
  onGMeAktar?: (t: Talep) => void
  onTeklifOlusturuldu?: (t: Talep) => void
  teklifOlusturabilir?: boolean
  gmAktarilanIds?: Set<number>
  kullaniciTuru?: KullaniciTuru
  robotDurumlar?: Record<number, string>
  onTramerTikla?: (t: Talep) => void
}) {
  const robotGoster = kullaniciTuru === "gm"
  const [toastMesaj, setToastMesaj] = useState<string | null>(null)
  const [teklifiModal, setTeklifiModal] = useState<Talep | null>(null)
  const [ozelFiyat, setOzelFiyat] = useState("")
  const [ozelIndirim, setOzelIndirim] = useState("")
  const [fiyatTipi, setFiyatTipi] = useState<"fiyat" | "indirim">("indirim")

  const sozlesmeTeklifiOlustur = (talep: Talep, e: React.MouseEvent) => {
    e.stopPropagation()
    setOzelFiyat("")
    setOzelIndirim("")
    setFiyatTipi("indirim")
    setTeklifiModal(talep)
  }

  const teklifiOnayla = () => {
    if (!teklifiModal) return
    const talep = teklifiModal
    setTeklifiModal(null)
    setToastMesaj(talep.talepNo)
    onTeklifOlusturuldu?.(talep)
    setTimeout(() => setToastMesaj(null), 5000)
  }
  return (
    <div className="bg-white rounded border border-gray-200 overflow-x-auto">
      <table className="min-w-max w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {[
              "Talep No",
              "Durum",
              "Konu",
              "Talep Tipi",
              "Acente Kodu",
              "Acente Unvanı",
              "Müşteri Ünvanı",
              "VKN/TCKN",
              "Bölge",
              "Oluşturulma Tarihi",
              "Son Güncelleme Tarihi",
              "Talep Sahibi",
              ...(robotGoster ? ["SLA Durumu", "Kalan SLA Süresi"] : []),
              "Öncelik",
            ].map((baslik) => (
              <th key={baslik} className="text-left px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">{baslik}</th>
            ))}
            {robotGoster && <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">Tramer</th>}
            <th className="text-right px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={robotGoster ? 17 : 14} className="py-16 text-center text-gray-500 text-sm">
                Veri bulunamadı
              </td>
            </tr>
          ) : data.map((talep) => (
            <tr key={talep.id} className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors cursor-pointer">
              <td className="px-3 py-3 text-blue-700 font-mono text-xs font-semibold whitespace-nowrap">{talep.talepNo}</td>
              <td className="px-3 py-3"><DurumBadge durum={talep.durum} /></td>
              <td className="px-3 py-3 max-w-xs">
                <div className="flex items-start gap-2">
                  {talep.parentId && (
                    <svg className="mt-0.5 shrink-0 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <button onClick={() => onRowClick(talep)} className="text-blue-600 hover:text-blue-800 font-medium text-left hover:underline leading-snug">
                    {talep.konu}
                  </button>
                  {talep.parentId && (
                    <span className="shrink-0 text-xs border border-blue-300 text-blue-600 rounded px-1.5 py-0.5">#{talep.parentId}</span>
                  )}
                  <svg className="shrink-0 mt-0.5 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
              </td>
              <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">{talep.talepTipi || "—"}</td>
              <td className="px-3 py-3 text-xs text-gray-600 font-mono whitespace-nowrap">{talep.acenteKodu || "—"}</td>
              <td className="px-3 py-3 text-xs text-gray-700 whitespace-nowrap">{talep.acenteUnvani || "—"}</td>
              <td className="px-3 py-3 text-xs text-gray-700 whitespace-nowrap">{talep.musteriUnvani || "—"}</td>
              <td className="px-3 py-3 text-xs text-gray-600 font-mono whitespace-nowrap">{talep.vknTckn || "—"}</td>
              <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">{talep.bolge || "—"}</td>
              <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{talep.olusturulmaTarihi}</td>
              <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{talep.sonGuncellemeTarihi}</td>
              <td className="px-3 py-3">
                {talep.atanan ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">{talep.atanan[0]}</span>
                    <span className="text-gray-700 text-xs">{talep.atanan}</span>
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">Atanmadı</span>
                )}
              </td>
              {robotGoster && (
                <>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold ${
                      talep.slaDurumu === "Aşıldı"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : talep.slaDurumu === "Riskli"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        talep.slaDurumu === "Aşıldı" ? "bg-red-500" : talep.slaDurumu === "Riskli" ? "bg-amber-500" : "bg-green-500"
                      }`} />
                      {talep.slaDurumu}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">{talep.kalanSlaSuresi}</td>
                </>
              )}
              <td className="px-3 py-3"><OncelikBadge oncelik={talep.oncelik} /></td>
              {robotGoster && (
                <td className="px-3 py-3 text-xs">
                  {(() => {
                    const durum = robotDurumlar?.[talep.id]
                    if (!durum) return <span className="text-gray-300">—</span>
                    const isGeldi = durum.includes("geldi")
                    return (
                      <span
                        onClick={isGeldi && onTramerTikla ? (e) => { e.stopPropagation(); onTramerTikla(talep) } : undefined}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-medium border transition-colors whitespace-nowrap ${
                          isGeldi
                            ? "bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {isGeldi ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
                        )}
                        {durum}
                        {isGeldi && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                    )
                  })()}
                </td>
              )}
              <td className="px-3 py-3">
                <div className="flex items-center justify-end gap-2">
                  {kullaniciTuru === "gm" && teklifOlusturabilir && (
                    <button
                      onClick={(e) => sozlesmeTeklifiOlustur(talep, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sözleşme Teklifi Oluştur
                    </button>
                  )}
                  {onSahiplen && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSahiplen(talep) }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sahiplen
                    </button>
                  )}
                  <RowActions
                    onDetails={() => onRowClick(talep)}
                    onGMeAktar={onGMeAktar ? () => onGMeAktar(talep) : undefined}
                    gmAktarildi={gmAktarilanIds?.has(talep.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sözleşme Teklifi Modal */}
      {teklifiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setTeklifiModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Başlık */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-base">Sözleşme Teklifi Oluştur</h2>
                  <p className="text-blue-200 text-xs mt-0.5">{teklifiModal.talepNo} · {teklifiModal.konu}</p>
                </div>
                <button onClick={() => setTeklifiModal(null)} className="text-blue-200 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Tip seçimi */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fiyatlandırma Türü</p>
                <div className="grid grid-cols-2 gap-2">
                  {([["indirim", "Özel İndirim", "%"], ["fiyat", "Özel Fiyat", "₺"]] as const).map(([val, label, simge]) => (
                    <button
                      key={val}
                      onClick={() => setFiyatTipi(val)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        fiyatTipi === val
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold ${fiyatTipi === val ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}>{simge}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Oran / Tutar girişi */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                  {fiyatTipi === "indirim" ? "İndirim Oranı (%)" : "Özel Fiyat (₺)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={fiyatTipi === "indirim" ? "100" : undefined}
                    value={fiyatTipi === "indirim" ? ozelIndirim : ozelFiyat}
                    onChange={(e) => fiyatTipi === "indirim" ? setOzelIndirim(e.target.value) : setOzelFiyat(e.target.value)}
                    placeholder={fiyatTipi === "indirim" ? "Örn: 15" : "Örn: 25000"}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-lg font-bold text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">
                    {fiyatTipi === "indirim" ? "%" : "₺"}
                  </span>
                </div>
                {fiyatTipi === "indirim" && ozelIndirim && Number(ozelIndirim) > 100 && (
                  <p className="text-xs text-red-500 mt-1">İndirim oranı 100%'ü geçemez.</p>
                )}
              </div>

              {/* Özet */}
              {((fiyatTipi === "indirim" && ozelIndirim) || (fiyatTipi === "fiyat" && ozelFiyat)) && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 border border-gray-200">
                  <span className="font-medium text-gray-800">{teklifiModal.talepNo}</span> için{" "}
                  {fiyatTipi === "indirim"
                    ? <><span className="text-blue-600 font-bold">%{ozelIndirim}</span> özel indirim</>
                    : <><span className="text-blue-600 font-bold">₺{Number(ozelFiyat).toLocaleString("tr-TR")}</span> özel fiyat</>
                  }{" "}
                  uygulanarak teklif oluşturulacak.
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setTeklifiModal(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                İptal
              </button>
              <button
                onClick={teklifiOnayla}
                disabled={fiyatTipi === "indirim" ? !ozelIndirim || Number(ozelIndirim) > 100 : !ozelFiyat}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Teklifi Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast bildirimi */}
      {toastMesaj && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3 bg-gray-900 text-white rounded-xl shadow-2xl px-5 py-4 max-w-md">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-white">
                <span className="text-green-400">{toastMesaj}</span> için sözleşme teklifi oluşturulmuştur.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Astar platformu üzerinden kontrol sağlayabilirsiniz.</p>
            </div>
            <button onClick={() => setToastMesaj(null)} className="ml-2 text-gray-500 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tramer Verileri Sayfası ───────────────────────────────────────────────
function TramerSayfasi({ talepKonu, onKapat }: { talepKonu: string; onKapat: () => void }) {
  const [aramaMetni, setAramaMetni] = useState("")
  const [secilenSatir, setSecilenSatir] = useState<TramerKayit | null>(null)
  const [silinenler, setSilinenler] = useState<Set<number>>(new Set())
  const [aktifSekme, setAktifSekme] = useState<"ozet" | "detay">("ozet")

  const aktifVeri = tramerVerileri.filter((r) => !silinenler.has(r.sira))

  const filtreli = aktifVeri.filter((r) => {
    if (!aramaMetni) return true
    const q = aramaMetni.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const satirSil = (sira: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSilinenler((prev) => new Set([...prev, sira]))
    if (secilenSatir?.sira === sira) setSecilenSatir(null)
  }

  const hasarVar = (r: TramerKayit) => !!r.hasarDosyaNo
  const n = (v: string) => parseFloat(v) || 0

  // ── Özet hesaplamalar ──
  const toplam = aktifVeri.length
  const toplamBedel = aktifVeri.reduce((s, r) => s + n(r.kaskoBedeeli), 0)
  const ortalamaBedel = toplam ? toplamBedel / toplam : 0
  const hasarTutarToplam = aktifVeri.reduce((s, r) => s + n(r.toplamMasraf), 0)
  const hasarDosyaSayisi = aktifVeri.filter(hasarVar).length
  const frekans = toplam ? hasarDosyaSayisi / toplam : 0
  const ortalamaHasar = hasarDosyaSayisi ? hasarTutarToplam / hasarDosyaSayisi : 0
  const nrp = hasarTutarToplam > 0 ? hasarTutarToplam / toplam : 0
  const aracTuruDagilimi = Object.entries(
    aktifVeri.reduce<Record<string, number>>((dagilim, kayit) => {
      const aracTuru = kayit.aracTuru || "Belirtilmemiş"
      dagilim[aracTuru] = (dagilim[aracTuru] ?? 0) + 1
      return dagilim
    }, {}),
  ).sort(([, adetA], [, adetB]) => adetB - adetA)

  // ── Yıl bazında pivot ──
  const yillar = [...new Set(aktifVeri.map((r) => r.baslangicYil))].filter(Boolean).sort((a, b) => b.localeCompare(a))
  const yilPivot = yillar.map((yil) => {
    const satirlar = aktifVeri.filter((r) => r.baslangicYil === yil)
    const hasarTutar = satirlar.reduce((s, r) => s + n(r.toplamMasraf), 0)
    const hasarDosya = satirlar.filter(hasarVar).length
    const aracSayisi = satirlar.length
    const ortHasar = hasarDosya ? hasarTutar / hasarDosya : 0
    const frek = aracSayisi ? hasarDosya / aracSayisi : 0
    const yilNrp = hasarTutar > 0 ? hasarTutar / aracSayisi : 0
    return { yil, hasarTutar, hasarDosya, aracSayisi, ortHasar, frek, yilNrp }
  })
  const genelToplam = {
    hasarTutar: yilPivot.reduce((s, r) => s + r.hasarTutar, 0),
    hasarDosya: yilPivot.reduce((s, r) => s + r.hasarDosya, 0),
    aracSayisi: yilPivot.reduce((s, r) => s + r.aracSayisi, 0),
    ortHasar: hasarDosyaSayisi ? hasarTutarToplam / hasarDosyaSayisi : 0,
    frek: toplam ? hasarDosyaSayisi / toplam : 0,
    yilNrp: hasarTutarToplam > 0 ? hasarTutarToplam / toplam : 0,
  }

  const para = (v: number) => "₺" + v.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  const yuzde = (v: number) => (v * 100).toFixed(1) + "%"

  const kolonlar: { key: keyof TramerKayit; label: string; genislik?: string }[] = [
    { key: "sira", label: "#", genislik: "w-10" },
    { key: "plaka", label: "Plaka", genislik: "min-w-[100px]" },
    { key: "musteriAd", label: "Müşteri", genislik: "min-w-[220px]" },
    { key: "aracTuru", label: "Araç Türü", genislik: "min-w-[100px]" },
    { key: "modelYili", label: "Model Yılı", genislik: "min-w-[80px]" },
    { key: "kaskoBedeeli", label: "Kasko Bedeli", genislik: "min-w-[120px]" },
    { key: "policeNo", label: "Poliçe No", genislik: "min-w-[160px]" },
    { key: "sirket", label: "Şirket", genislik: "min-w-[200px]" },
    { key: "acenteUnvani", label: "Acente", genislik: "min-w-[200px]" },
    { key: "policeBaslangic", label: "Pol. Başlangıç", genislik: "min-w-[110px]" },
    { key: "policeBitis", label: "Pol. Bitiş", genislik: "min-w-[100px]" },
    { key: "kademe", label: "Kademe", genislik: "min-w-[70px]" },
    { key: "hasarDosyaDurum", label: "Hasar Durum", genislik: "min-w-[100px]" },
    { key: "hasarDosyaNo", label: "Hasar Dosya No", genislik: "min-w-[140px]" },
    { key: "hasarTarih", label: "Hasar Tarihi", genislik: "min-w-[100px]" },
    { key: "toplamMasraf", label: "Toplam Masraf", genislik: "min-w-[120px]" },
    { key: "toplamOdeme", label: "Toplam Ödeme", genislik: "min-w-[120px]" },
    { key: "kusurOrani", label: "Kusur %", genislik: "min-w-[70px]" },
    { key: "urunTipi", label: "Ürün Tipi", genislik: "min-w-[80px]" },
    { key: "zeyilTuruAciklama", label: "Zeyil Türü", genislik: "min-w-[160px]" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shrink-0">
        <button onClick={onKapat} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Geri
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Tramer Verileri</h1>
            <p className="text-xs text-gray-500 truncate max-w-xs">{talepKonu}</p>
          </div>
        </div>
        {/* Sekmeler */}
        <div className="flex gap-1 ml-4 bg-gray-100 rounded-lg p-1">
          {([["ozet", "Özet & Analiz"], ["detay", "Detay Tablo"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setAktifSekme(id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${aktifSekme === id ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4 4 4-4M12 4v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Excel&apos;e Aktar
          </button>
        </div>
      </div>

      {/* ── ÖZET SEKMESİ ── */}
      {aktifSekme === "ozet" && (
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* KPI Kartları */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Yürürlükteki Araçlar — Genel Özet</h2>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
              {[
                { label: "Araç Sayısı", value: String(toplam), sub: "Yürürlükte", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                { label: "Toplam Araç Bedeli", value: para(toplamBedel), sub: "Yürürlükte", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                { label: "Ortalama Araç Bedeli", value: para(ortalamaBedel), sub: "Yürürlükte", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                { label: "Hasar Tutarı", value: hasarTutarToplam > 0 ? para(hasarTutarToplam) : "₺0", sub: "Toplam", color: hasarTutarToplam > 0 ? "text-red-600" : "text-gray-500", bg: hasarTutarToplam > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200" },
                { label: "Hasar Dosya Sayısı", value: String(hasarDosyaSayisi), sub: "Toplam", color: hasarDosyaSayisi > 0 ? "text-red-600" : "text-gray-500", bg: hasarDosyaSayisi > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200" },
              ].map((k) => (
                <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
                  <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                  <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4 mt-3">
              {[
                { label: "Frekans", value: yuzde(frekans), color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
                { label: "Ortalama Hasar", value: ortalamaHasar > 0 ? para(ortalamaHasar) : "₺0", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
                { label: "Net Risk Prim (NRP)", value: nrp > 0 ? para(nrp) : "₺0", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
                { label: "Ortalama Sigorta Bedeli", value: para(ortalamaBedel), color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              ].map((k) => (
                <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
                  <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                  <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Araç kullanım tipi dağılımı */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Araç Kullanım Tipi Dağılımı</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aracTuruDagilimi.map(([aracTuru, adet]) => (
                <div key={aracTuru} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-gray-600">{aracTuru}</span>
                    <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 px-2 text-sm font-bold text-blue-700">
                      {adet}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">araç</p>
                </div>
              ))}
            </div>
          </div>

          {/* Yıl Bazında Pivot Tablo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tüm Yıllardaki Araçlar — Yıllar Bazında Sonuçları</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Ürün Tipi: Trafik</span>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-amber-50 border-b-2 border-amber-200">
                    <th className="text-left px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Poliçe Başlangıç Yılı</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Hasar Tutarı</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Hasar Dosya Sayısı</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Ortalama Hasar</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Frekans</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Net Risk Prim (NRP)</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Araç Sayısı (Hak edilen)</th>
                    <th className="text-right px-4 py-2.5 font-bold text-amber-800 whitespace-nowrap">Araç Sayısı (Tüm)</th>
                  </tr>
                </thead>
                <tbody>
                  {yilPivot.map((satir, idx) => (
                    <tr key={satir.yil} className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-2.5 font-semibold text-gray-800">{satir.yil}</td>
                      <td className={`px-4 py-2.5 text-right font-mono ${satir.hasarTutar > 0 ? "text-red-600 font-semibold" : "text-gray-400"}`}>
                        {satir.hasarTutar > 0 ? para(satir.hasarTutar) : "₺0"}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono ${satir.hasarDosya > 0 ? "text-red-600 font-semibold" : "text-gray-400"}`}>
                        {satir.hasarDosya}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono ${satir.ortHasar > 0 ? "text-orange-600 font-semibold" : "text-gray-400"}`}>
                        {satir.ortHasar > 0 ? para(satir.ortHasar) : "₺0"}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono ${satir.frek > 0 ? "text-orange-600 font-semibold" : "text-gray-400"}`}>
                        {yuzde(satir.frek)}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono ${satir.yilNrp > 0 ? "text-purple-600 font-semibold" : "text-gray-400"}`}>
                        {satir.yilNrp > 0 ? para(satir.yilNrp) : "₺0"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-700">{satir.aracSayisi}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-700">{satir.aracSayisi}</td>
                    </tr>
                  ))}
                  {/* Genel Toplam */}
                  <tr className="bg-amber-50 border-t-2 border-amber-200 font-bold">
                    <td className="px-4 py-2.5 text-amber-900">Genel Toplam</td>
                    <td className="px-4 py-2.5 text-right font-mono text-red-700">{genelToplam.hasarTutar > 0 ? para(genelToplam.hasarTutar) : "₺0"}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-red-700">{genelToplam.hasarDosya}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-orange-700">{genelToplam.ortHasar > 0 ? para(genelToplam.ortHasar) : "₺0"}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-orange-700">{yuzde(genelToplam.frek)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-purple-700">{genelToplam.yilNrp > 0 ? para(genelToplam.yilNrp) : "₺0"}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-900">{genelToplam.aracSayisi}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-900">{genelToplam.aracSayisi}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAY SEKMESİ ── */}
      {aktifSekme === "detay" && (
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)} placeholder="Plaka, poliçe no, şirket ara..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
            </div>
            <span className="text-xs text-gray-400">{filtreli.length} kayıt</span>
          </div>

          <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white">
            <table className="text-xs border-collapse" style={{ minWidth: "2400px" }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-800 text-white">
                  {kolonlar.map((k) => (
                    <th key={k.key} className={`text-left px-3 py-2.5 font-semibold whitespace-nowrap ${k.genislik ?? ""}`}>{k.label}</th>
                  ))}
                  <th className="px-3 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {filtreli.map((kayit, idx) => (
                  <tr key={kayit.sira} onClick={() => setSecilenSatir(kayit)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors group ${
                      hasarVar(kayit) ? "bg-red-50/40 hover:bg-red-50" : idx % 2 === 0 ? "bg-white hover:bg-blue-50/40" : "bg-gray-50/50 hover:bg-blue-50/40"
                    } ${secilenSatir?.sira === kayit.sira ? "ring-2 ring-inset ring-blue-400" : ""}`}>
                    {kolonlar.map((k) => (
                      <td key={k.key} className={`px-3 py-2 whitespace-nowrap ${k.key === "plaka" ? "font-mono font-semibold text-gray-800" : "text-gray-700"}`}>
                        {k.key === "hasarDosyaDurum" && kayit[k.key] ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">Hasarlı</span>
                        ) : k.key === "toplamMasraf" && kayit[k.key] ? (
                          <span className="font-semibold text-red-600">{Number(kayit[k.key]).toLocaleString("tr-TR")} ₺</span>
                        ) : k.key === "toplamOdeme" && kayit[k.key] ? (
                          <span className="font-semibold text-green-700">{Number(kayit[k.key]).toLocaleString("tr-TR")} ₺</span>
                        ) : k.key === "kaskoBedeeli" && kayit[k.key] ? (
                          <span>{Number(kayit[k.key]).toLocaleString("tr-TR")} ₺</span>
                        ) : k.key === "zeyilTuruAciklama" && kayit[k.key] !== "Poliçe" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{kayit[k.key]}</span>
                        ) : (
                          <span>{kayit[k.key] || <span className="text-gray-300">—</span>}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right">
                      <button onClick={(e) => satirSil(kayit.sira, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all" title="Satırı sil">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Satır detay panel */}
      {secilenSatir && aktifSekme === "detay" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-400 shadow-2xl z-20" style={{ maxHeight: "35vh", overflowY: "auto" }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-lg text-blue-700">{secilenSatir.plaka}</span>
                <span className="text-sm text-gray-600">{secilenSatir.aracTuru} · {secilenSatir.modelYili}</span>
                {hasarVar(secilenSatir) && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Hasarlı Araç</span>}
              </div>
              <button onClick={() => setSecilenSatir(null)} className="text-gray-400 hover:text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-xs">
              {[
                { l: "Müşteri", v: secilenSatir.musteriAd },
                { l: "Poliçe No", v: secilenSatir.policeNo },
                { l: "Şirket", v: secilenSatir.sirket },
                { l: "Acente", v: secilenSatir.acenteUnvani },
                { l: "Kasko Bedeli", v: secilenSatir.kaskoBedeeli ? para(n(secilenSatir.kaskoBedeeli)) : "—" },
                { l: "Motor No", v: secilenSatir.motorNo },
                { l: "Şasi No", v: secilenSatir.sasiNo },
                { l: "Kademe", v: secilenSatir.kademe },
                { l: "Pol. Başlangıç", v: secilenSatir.policeBaslangic },
                { l: "Pol. Bitiş", v: secilenSatir.policeBitis },
                { l: "Hasar Dosya No", v: secilenSatir.hasarDosyaNo || "—" },
                { l: "Hasar Tarihi", v: secilenSatir.hasarTarih || "—" },
                { l: "Toplam Masraf", v: secilenSatir.toplamMasraf ? para(n(secilenSatir.toplamMasraf)) : "—" },
                { l: "Toplam Ödeme", v: secilenSatir.toplamOdeme ? para(n(secilenSatir.toplamOdeme)) : "—" },
                { l: "Kusur Oranı", v: secilenSatir.kusurOrani ? "%" + secilenSatir.kusurOrani : "—" },
                { l: "Zeyil Türü", v: secilenSatir.zeyilTuruAciklama || "—" },
              ].map(({ l, v }) => (
                <div key={l}><span className="text-gray-400 block">{l}</span><span className="font-medium text-gray-800">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── İletişim Sekmesi ──────────────────────────────────────────────────────
function IletisimSekmesi({
  talepId, tur, mesajlar, kullaniciAdi, kullaniciTuru, onMesajGonder,
}: {
  talepId: number
  tur: "ic" | "dis"
  mesajlar: Mesaj[]
  kullaniciAdi: string
  kullaniciTuru: KullaniciTuru
  onMesajGonder: (m: Omit<Mesaj, "id">) => void
}) {
  const [metin, setMetin] = useState("")
  const altRef = React.useRef<HTMLDivElement>(null)

  const benimMesajlarim = mesajlar.filter((m) => m.talepId === talepId && m.tur === tur)

  // İç iletişim: sadece bölge ve gm yazabilir
  const yazabilir = tur === "dis" || kullaniciTuru === "bolge" || kullaniciTuru === "gm"

  const avatarRenk: Record<NonNullable<KullaniciTuru>, string> = {
    acente: "bg-orange-500",
    bolge: "bg-blue-600",
    gm: "bg-purple-600",
  }
  const turLabel: Record<NonNullable<KullaniciTuru>, string> = {
    acente: "Acente",
    bolge: "Bölge",
    gm: "GM",
  }

  const simdi = () => {
    const now = new Date()
    return `${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
  }

  const gonder = () => {
    const t = metin.trim()
    if (!t || !kullaniciTuru) return
    onMesajGonder({
      talepId,
      tur,
      gonderen: kullaniciAdi,
      gonderenTur: kullaniciTuru,
      metin: t,
      tarih: simdi(),
    })
    setMetin("")
    setTimeout(() => altRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Mesaj listesi */}
      <div className="flex-1 overflow-y-auto space-y-1 pb-4">
        {benimMesajlarim.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">Henüz mesaj yok.</p>
            {!yazabilir && <p className="text-xs text-gray-400 mt-1">Bu kanalı görüntüleme yetkiniz var.</p>}
          </div>
        ) : (
          benimMesajlarim.map((m) => (
            <div key={m.id} className="group">
              <div className="flex items-start gap-3 py-3 px-1">
                <div className={`w-8 h-8 rounded-full ${avatarRenk[m.gonderenTur]} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                  {m.gonderen[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{m.gonderen}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      m.gonderenTur === "gm" ? "bg-purple-100 text-purple-600" :
                      m.gonderenTur === "bolge" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>{turLabel[m.gonderenTur]}</span>
                    <span className="text-xs text-gray-400 ml-auto">{m.tarih}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-800 leading-relaxed inline-block max-w-full">
                    {m.metin}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2" strokeLinecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/></svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-100 mx-1" />
            </div>
          ))
        )}
        <div ref={altRef} />
      </div>

      {/* Yazma alanı */}
      {yazabilir ? (
        <div className="border-t border-gray-200 pt-4 shrink-0">
          <div className="flex items-end gap-3">
            <div className={`w-8 h-8 rounded-full ${avatarRenk[kullaniciTuru!]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {kullaniciAdi[0]?.toUpperCase()}
            </div>
            <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100">
              <textarea
                value={metin}
                onChange={(e) => setMetin(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); gonder() } }}
                placeholder={tur === "ic" ? "İç mesaj yazın… (Enter ile gönder)" : "Mesaj yazın… (Enter ile gönder)"}
                rows={2}
                className="w-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none bg-white"
              />
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-gray-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="hover:text-gray-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2" strokeLinecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/></svg>
                  </button>
                </div>
                <button
                  onClick={gonder}
                  disabled={!metin.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 pt-4 shrink-0">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            İç iletişim kanalı yalnızca Bölge ve Genel Müdürlük kullanıcılarına açıktır.
          </div>
        </div>
      )}
    </div>
  )
}

// ── Detail Modal ───────────────────────────────────────────────────────────
type DetailTab = "detay" | "dis-iletisim" | "ic-iletisim" | "dosyalar" | "tarihce"

function TalepDetayModal({ talep, onClose, kullaniciTuru, kullaniciAdi, mesajlar, tarihce, onMesajGonder }: {
  talep: Talep
  onClose: () => void
  kullaniciTuru: KullaniciTuru
  kullaniciAdi: string
  mesajlar: Mesaj[]
  tarihce: TalepTarihceKaydi[]
  onMesajGonder: (m: Omit<Mesaj, "id">) => void
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("detay")

  const icSayi = mesajlar.filter((m) => m.talepId === talep.id && m.tur === "ic").length
  const disSayi = mesajlar.filter((m) => m.talepId === talep.id && m.tur === "dis").length

  const tumSekmeler: { id: DetailTab; label: string; gizliAcente?: boolean; sadeceGM?: boolean }[] = [
    { id: "detay", label: "DETAY" },
    { id: "dis-iletisim", label: `DIŞ İLETİŞİM${disSayi > 0 ? ` (${disSayi})` : ""}` },
    { id: "ic-iletisim", label: `İÇ İLETİŞİM${icSayi > 0 ? ` (${icSayi})` : ""}`, gizliAcente: true },
    { id: "dosyalar", label: "DOSYALAR (8)" },
    { id: "tarihce", label: "TALEP TARİHÇESİ", sadeceGM: true },
  ]

  const detailTabs = tumSekmeler.filter((sekme) =>
    (!sekme.gizliAcente || kullaniciTuru !== "acente") &&
    (!sekme.sadeceGM || kullaniciTuru === "gm")
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" style={{ backdropFilter: "blur(2px)" }} />
      <div
        className="relative bg-white shadow-2xl flex flex-col"
        style={{ width: "min(760px, 95vw)", height: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-base font-semibold text-gray-800 mb-1">Talep Detayları {talep.talepNo}</div>
              <div className="text-blue-600 font-medium text-sm leading-snug">{talep.konu}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <RowActions onDetails={() => {}} />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors ml-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-0 mt-4 border-b border-gray-200 -mb-4 overflow-x-auto">
            {detailTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 px-6 py-5 overflow-y-auto flex flex-col" style={{ minHeight: 0 }}>
          {activeTab === "detay" && <DetayForm talep={talep} />}
          {(activeTab === "dis-iletisim" || activeTab === "ic-iletisim") && (
            <IletisimSekmesi
              talepId={talep.id}
              tur={activeTab === "ic-iletisim" ? "ic" : "dis"}
              mesajlar={mesajlar}
              kullaniciAdi={kullaniciAdi}
              kullaniciTuru={kullaniciTuru}
              onMesajGonder={onMesajGonder}
            />
          )}
          {activeTab === "dosyalar" && (
            <div className="text-gray-400 text-sm text-center py-12">Dosya bulunamadı.</div>
          )}
          {activeTab === "tarihce" && kullaniciTuru === "gm" && (
            <div>
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-800">Talep Hareketleri</h3>
                <p className="text-xs text-gray-500 mt-1">Talebin geçtiği havuzlar ve bu havuzlardaki durum değişiklikleri</p>
              </div>
              {tarihce.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-400">
                  Tarihçe kaydı bulunamadı.
                </div>
              ) : (
                <div className="relative ml-2">
                  <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-200" />
                  <div className="space-y-5">
                    {[...tarihce].reverse().map((kayit, index) => (
                      <div key={`${kayit.tarih}-${kayit.havuz}-${index}`} className="relative flex gap-4">
                        <div className="relative z-10 mt-1 w-6 h-6 rounded-full bg-blue-100 border-2 border-white ring-1 ring-blue-200 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        </div>
                        <div className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{kayit.havuz}</p>
                              <p className="text-xs text-blue-700 font-medium mt-1">{kayit.durum}</p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{kayit.tarih}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">İşlemi yapan: <span className="font-medium text-gray-700">{kayit.islemYapan}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

function SelectInput({ value, placeholder }: { value?: string; placeholder?: string }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer hover:border-gray-300">
      <span className={value ? "" : "text-gray-400"}>{value || placeholder}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value?: string }) {
  return (
    <FormField label={label}>
      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50 text-sm text-gray-700 min-h-[36px]">
        {value || <span className="text-gray-400">—</span>}
      </div>
    </FormField>
  )
}

function DetayForm({ talep }: { talep: Talep }) {
  const fd = talep.formData

  const RO = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
      <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-800 min-h-[36px]">
        {value || <span className="text-gray-400">—</span>}
      </div>
    </div>
  )

  const SecHeader = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide pt-2 pb-1 border-b border-gray-100 mb-3">{children}</h4>
  )

  const oncelikRenk: Record<string, string> = {
    Yüksek: "bg-red-500",
    Orta: "bg-orange-500",
    Düşük: "bg-green-500",
  }

  return (
    <div className="space-y-5 text-sm">

      {/* Temel Bilgiler */}
      <div>
        <SecHeader>Temel Bilgiler</SecHeader>
        <div className="space-y-3">
          <RO label="Konu" value={talep.konu} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Öncelik</p>
              <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${oncelikRenk[talep.oncelik] ?? "bg-orange-500"}`} />
                <span className="text-sm text-gray-800">{talep.oncelik}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Durum</p>
              <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-800">{talep.durum}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RO label="Talep Tipi" value={fd?.talepTipi} />
            <RO label="Branş" value={fd?.brans} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RO label="E-posta" value={fd?.eposta} />
            <RO label="Araç Adedi" value={fd?.aracAdedi} />
          </div>
        </div>
      </div>

      {/* Kanal & Müşteri */}
      <div>
        <SecHeader>Kanal & Müşteri Bilgileri</SecHeader>
        <div className="space-y-3">
          {fd?.acenteler?.length ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Acente Kodu</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Acente Ünvanı</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {fd.acenteler.map((acente) => (
                    <tr key={acente.kod} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 font-mono font-semibold text-gray-700">{acente.kod}</td>
                      <td className="px-3 py-2 text-gray-700">{acente.unvan}</td>
                      <td className="px-3 py-2 text-gray-500">{acente.anaAcente ? "Talebi Oluşturan" : "Ek Acente"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {fd?.musteriler?.length ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">VKN / TCKN</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Müşteri Ünvanı</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Kanal Kodu</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-500">Kanal Adı</th>
                  </tr>
                </thead>
                <tbody>
                  {fd.musteriler.map((musteri) => (
                    <tr key={musteri.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 font-mono font-semibold text-gray-700">{musteri.vknTckn}</td>
                      <td className="px-3 py-2 text-gray-700">{musteri.musteriUnvani}</td>
                      <td className="px-3 py-2 font-mono text-gray-600">{musteri.kanalKodu}</td>
                      <td className="px-3 py-2 text-gray-600">{musteri.kanalAdi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <RO label="Kanal Adı" value={fd?.kanalAdi} />
              <RO label="Kanal Kodu" value={fd?.kanalKodu} />
            </div>
          )}
        </div>
      </div>

      {/* Park Yeri Bilgisi */}
      <div>
        <SecHeader>
          Park Yeri Bilgisi
          {fd && fd.parkYeriAraclar?.filter((a) => a.plaka).length > 0 && (
            <span className="text-blue-500 normal-case ml-1">({fd.parkYeriAraclar.filter((a) => a.plaka).length} araç)</span>
          )}
        </SecHeader>
        {fd && fd.parkYeriAraclar?.filter((a) => a.plaka).length > 0 ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">#</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">Plaka</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">Araç Tipi</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">Model Yılı</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-500">Araç Bedeli (₺)</th>
                </tr>
              </thead>
              <tbody>
                {fd.parkYeriAraclar.filter((a) => a.plaka).map((a, i) => (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2 text-gray-400 font-mono">{i + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-gray-800">{a.plaka}</td>
                    <td className="px-3 py-2 text-gray-700">{a.aracTipi || <span className="text-gray-300">—</span>}</td>
                    <td className="px-3 py-2 text-gray-700">{a.modelYili || <span className="text-gray-300">—</span>}</td>
                    <td className="px-3 py-2 text-gray-700">{a.aracBedeli ? Number(a.aracBedeli).toLocaleString("tr-TR") : <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-400">—</div>
        )}
      </div>

      {/* Teminat & Servis */}
      <div>
        <SecHeader>Teminat & Servis Seçenekleri</SecHeader>
        <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-100">
          {[
            { label: "Servis Şartı", value: fd?.servisShartı },
            { label: "Yurtdışı Teminatı", value: fd?.yurtdisiTeminat },
            { label: "Elektrikli Araç", value: fd?.elektrikliArac },
            { label: "Kısa Süreli Kiralık", value: fd?.kisaSureliKiralik },
            { label: "Operasyonel Kiralık", value: fd?.operasyonelKiralik },
            { label: "İkame Araç Teminatı", value: fd?.ikameArac },
            { label: "Muafiyet", value: fd?.muafiyet },
            { label: "Kilit Mekanizması Limiti", value: fd?.kilitMekanizmasiLimiti },
            { label: "Artan Mali Sorumluluk Limiti", value: fd?.artanMaliSorumlulukLimiti },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-gray-500">{label}</span>
              <span className={`font-semibold ${value ? "text-gray-700" : "text-gray-300"}`}>{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Koltuk Ferdi Kaza */}
      <div>
        <SecHeader>Koltuk Ferdi Kaza Teminatı</SecHeader>
        <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-100">
          {[
            { label: "Ölüm Limiti", value: fd?.ferdiKazaOlumLimiti },
            { label: "Sürekli Sakatlık Limiti", value: fd?.ferdiKazaSakatlikLimiti },
            { label: "Tedavi Giderleri Limiti", value: fd?.ferdiKazaTedaviLimiti },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-gray-500">{label}</span>
              <span className={`font-semibold ${value ? "text-gray-700" : "text-gray-300"}`}>
                {value ? `${Number(value).toLocaleString("tr-TR")} ₺` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Poliçe & Özel Şartlar */}
      <div>
        <SecHeader>Poliçe & Özel Şartlar</SecHeader>
        <div className="mb-3">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs border ${fd?.policelerTekVade ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {fd?.policelerTekVade
              ? <>Poliçeler tek vadede toplanacaktır{fd.tekVadeTarih && <span className="ml-2 font-semibold">{fd.tekVadeTarih}</span>}</>
              : "Poliçeler tek vadede toplanmayacaktır"}
          </div>
        </div>
        <div className="border border-yellow-200 rounded-lg px-3 py-2 bg-yellow-50 text-sm min-h-[60px] text-gray-800 whitespace-pre-wrap">
          {fd?.ozelSartlar || <span className="text-gray-400">—</span>}
        </div>
      </div>

      {/* Atanan / Broker */}
      <div>
        <SecHeader>Atama Bilgileri</SecHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Atanan</p>
            <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 flex items-center gap-2 min-h-[36px]">
              {talep.atanan ? (
                <>
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{talep.atanan[0]}</span>
                  <span className="text-sm text-gray-800">{talep.atanan}</span>
                </>
              ) : <span className="text-gray-400 text-sm">—</span>}
            </div>
          </div>
          <RO label="Broker" value={talep.broker ?? undefined} />
        </div>
      </div>

    </div>
  )
}

// ── Filo Üretim Süreci ────────────────────────────────────────────────────
interface FiloOzelSart {
  id: number
  metin: string
  baskiDili: string
  eklenmeTarihi: string
}

interface FiloTarihceKaydi {
  id: number
  tarih: string
  islem: string
  aciklama: string
  kullanici: string
  tur?: "teklif" | "revizyon" | "police" | "ek" | "yenileme"
  numara?: string
  baslangic?: string
  bitis?: string
}

function FiloNotBolumu({ baslik, aciklama, notlar, onChange }: {
  baslik: string
  aciklama: string
  notlar: FiloOzelSart[]
  onChange: (notlar: FiloOzelSart[]) => void
}) {
  const [metin, setMetin] = useState("")
  const [baskiDili, setBaskiDili] = useState("Türkçe - 500")
  const [secilenId, setSecilenId] = useState<number | null>(null)
  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

  const ekle = () => {
    if (!metin.trim()) return
    onChange([...notlar, { id: Date.now(), metin: metin.trim(), baskiDili, eklenmeTarihi: new Date().toLocaleDateString("tr-TR") }])
    setMetin("")
  }

  const guncelle = () => {
    if (!secilenId || !metin.trim()) return
    onChange(notlar.map((not) => not.id === secilenId ? { ...not, metin: metin.trim(), baskiDili } : not))
    setSecilenId(null)
    setMetin("")
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-bold text-gray-800">{baslik}</h3>
        <p className="mt-0.5 text-xs text-gray-400">{aciklama}</p>
      </div>
      <div className="p-5">
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">Notlar</label>
        <textarea value={metin} onChange={(e) => setMetin(e.target.value)} rows={4} placeholder="Not metnini giriniz..." className={`${inputCls} resize-none`} />
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="w-full sm:w-64">
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">Baskı Dili</label>
            <select value={baskiDili} onChange={(e) => setBaskiDili(e.target.value)} className={inputCls}>
              <option>Türkçe - 500</option><option>İngilizce - 501</option><option>Almanca - 502</option>
            </select>
          </div>
          <button onClick={ekle} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Ekle</button>
          <button onClick={guncelle} disabled={!secilenId} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 disabled:opacity-40">Güncelle</button>
          <button onClick={() => { setMetin(""); setSecilenId(null) }} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">Temizle</button>
        </div>
      </div>
      <div className="border-t border-gray-100">
        {notlar.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">Henüz not eklenmedi.</div>
        ) : (
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 text-gray-600">
              <th className="px-3 py-3 text-left font-semibold">Metin</th>
              <th className="px-3 py-3 text-left font-semibold">Eklenme Tarihi</th>
              <th className="px-3 py-3 text-left font-semibold">Baskı Dili</th>
              <th className="w-20 px-3 py-3" />
            </tr></thead>
            <tbody>{notlar.map((not) => (
              <tr key={not.id} onClick={() => { setSecilenId(not.id); setMetin(not.metin); setBaskiDili(not.baskiDili) }} className={`cursor-pointer border-t border-gray-100 hover:bg-blue-50/40 ${secilenId === not.id ? "bg-blue-50/70" : ""}`}>
                <td className="max-w-xl px-3 py-3 text-gray-700">{not.metin}</td>
                <td className="px-3 py-3 text-gray-500">{not.eklenmeTarihi}</td>
                <td className="px-3 py-3 text-gray-500">{not.baskiDili}</td>
                <td className="px-3 py-3 text-right"><button onClick={(e) => { e.stopPropagation(); onChange(notlar.filter((kayit) => kayit.id !== not.id)); if (secilenId === not.id) setSecilenId(null) }} className="font-medium text-gray-400 hover:text-red-500">Sil</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </section>
  )
}

interface FiloUretimKaydi {
  id: number
  sozlesmeAdi: string
  sozlesmeNo: string
  policeNo?: string
  versiyon: number
  yenileme: number
  urunAdi: string
  policeTipi: string
  baslangic: string
  bitis: string
  policeBitisTarihi?: string
  kullanici: string
  durum: string
  yaratan: string
  atanan: string
  acenteAdi: string
  kontakNo: string
  kontakAdi: string
  onayStatusu: "Onaylandı" | "Onay Bekliyor" | "Reddedildi"
  onaylayan: string
  onayTarihi: string
  kontaklar?: FiloKontakKaydi[]
  acenteler?: AcenteKaydi[]
  araclar?: FiloAracDetayi[]
  ozelSartlar?: FiloOzelSart[]
  hasarOzelNotlar?: FiloOzelSart[]
  asistanOzelNotlar?: FiloOzelSart[]
  tarihce?: FiloTarihceKaydi[]
  odemeTipi?: string
  odemeKosullari?: string[]
}

const filoUretimBaslangicVerisi: FiloUretimKaydi[] = []

const bosFiloFiltreleri = {
  sozlesmeAdi: "",
  sozlesmeNo: "",
  urunAdi: "",
  kontakNo: "",
  acenteAdi: "",
  kontakAdi: "",
  onayStatusu: "",
  atanan: "",
}

interface FiloKontakKaydi {
  id: number
  no: string
  ad: string
}

interface FiloAracDetayi {
  id: number
  primTipi: string
  indirimYuzdesi: string
  sabitPrim: string
  ozelFiyatOrani: string
  tumTeminatlarDahil: boolean
  ekDonanimlarDahil: boolean
  tasinanEmtiaDahil: boolean
  kullanimTipi: string
  kullanimSekli: string
  aracDetayBilgileri: boolean
  operasyonelKiralik: boolean
  kiralik: boolean
  kuryeKargo: boolean
  acenteKomisyonu: string
  anadoluHizmetDahil: boolean
  teminatBilgileri: boolean
  kilitMekanizmasiLimiti: string
  koltukOlumDurumu: string
  koltukOlumLimiti: string
  koltukSakatlikDurumu: string
  koltukSakatlikLimiti: string
  koltukTedaviDurumu: string
  koltukTedaviLimiti: string
  artanMaliSorumlulukDurumu: string
  artanMaliSorumlulukLimiti: string
  maneviTazminatDurumu: string
  maneviTazminatLimiti: string
  hukuksalKorumaDurumu: string
  hukuksalKorumaLimiti: string
  anadoluHizmetDurumu: string
  anadoluHizmetPaketi: string
}

const bosFiloAraci: Omit<FiloAracDetayi, "id"> = {
  primTipi: "Özel İndirim",
  indirimYuzdesi: "",
  sabitPrim: "",
  ozelFiyatOrani: "",
  tumTeminatlarDahil: false,
  ekDonanimlarDahil: false,
  tasinanEmtiaDahil: false,
  kullanimTipi: "Otomobil (Sürücü Dahil 9 Koltuk)",
  kullanimSekli: "",
  aracDetayBilgileri: false,
  operasyonelKiralik: false,
  kiralik: false,
  kuryeKargo: false,
  acenteKomisyonu: "",
  anadoluHizmetDahil: true,
  teminatBilgileri: false,
  kilitMekanizmasiLimiti: "40.000 TL",
  koltukOlumDurumu: "Zorunlu",
  koltukOlumLimiti: "10000",
  koltukSakatlikDurumu: "Zorunlu",
  koltukSakatlikLimiti: "10000",
  koltukTedaviDurumu: "Önerilen",
  koltukTedaviLimiti: "10000",
  artanMaliSorumlulukDurumu: "Zorunlu",
  artanMaliSorumlulukLimiti: "10000000",
  maneviTazminatDurumu: "Zorunlu",
  maneviTazminatLimiti: "2500000",
  hukuksalKorumaDurumu: "Zorunlu",
  hukuksalKorumaLimiti: "40000",
  anadoluHizmetDurumu: "Zorunlu",
  anadoluHizmetPaketi: "Anadolu Hizmet - İkamesiz",
}

function FiloUretimOlusturPage({ onBack, onSave, initialKayit, kayitModu = "normal" }: {
  onBack: () => void
  onSave: (kayit: FiloUretimKaydi) => void
  initialKayit?: FiloUretimKaydi | null
  kayitModu?: "normal" | "ek"
}) {
  const isoTarih = (tarih: Date) =>
    `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, "0")}-${String(tarih.getDate()).padStart(2, "0")}`
  const altiAySonrasi = (tarih: string) => {
    const hesaplananTarih = new Date(`${tarih}T00:00:00`)
    hesaplananTarih.setMonth(hesaplananTarih.getMonth() + 6)
    return isoTarih(hesaplananTarih)
  }
  const sistemTarihi = isoTarih(new Date())
  const inputTarihi = (tarih?: string) => {
    if (!tarih) return ""
    const parcalar = tarih.split("/")
    return parcalar.length === 3 ? parcalar.reverse().join("-") : tarih
  }

  const [sozlesmeAdi, setSozlesmeAdi] = useState(initialKayit?.sozlesmeAdi ?? "")
  const [baslangic, setBaslangic] = useState(kayitModu === "ek" ? sistemTarihi : inputTarihi(initialKayit?.baslangic) || sistemTarihi)
  const [bitis, setBitis] = useState(kayitModu === "ek" ? altiAySonrasi(sistemTarihi) : inputTarihi(initialKayit?.bitis) || altiAySonrasi(sistemTarihi))
  const [policeBitisTarihi, setPoliceBitisTarihi] = useState(inputTarihi(initialKayit?.policeBitisTarihi) || altiAySonrasi(sistemTarihi))
  const [sozlesmeParametreleriAcik, setSozlesmeParametreleriAcik] = useState(Boolean(initialKayit?.policeBitisTarihi))
  const [kontakNo, setKontakNo] = useState("")
  const [kontakAdi, setKontakAdi] = useState("")
  const [kontaklar, setKontaklar] = useState<FiloKontakKaydi[]>(
    initialKayit?.kontaklar ?? (initialKayit?.kontakNo ? [{ id: 1, no: initialKayit.kontakNo, ad: initialKayit.kontakAdi }] : [])
  )
  const [acenteKodu, setAcenteKodu] = useState("")
  const [acenteler, setAcenteler] = useState<AcenteKaydi[]>(
    initialKayit?.acenteler ?? [{ kod: "320000", unvan: "Emre Acentelik", anaAcente: true }]
  )
  const [aracFormu, setAracFormu] = useState(bosFiloAraci)
  const [araclar, setAraclar] = useState<FiloAracDetayi[]>(initialKayit?.araclar ?? [])
  const [ozelSartlar, setOzelSartlar] = useState<FiloOzelSart[]>(initialKayit?.ozelSartlar ?? [])
  const [hasarOzelNotlar, setHasarOzelNotlar] = useState<FiloOzelSart[]>(initialKayit?.hasarOzelNotlar ?? [])
  const [asistanOzelNotlar, setAsistanOzelNotlar] = useState<FiloOzelSart[]>(initialKayit?.asistanOzelNotlar ?? [])
  const [odemeTipi, setOdemeTipi] = useState(initialKayit?.odemeTipi ?? "Nakit")
  const [odemeKosullari, setOdemeKosullari] = useState<string[]>(initialKayit?.odemeKosullari ?? [])
  const [hata, setHata] = useState("")
  const [aktifAdim, setAktifAdim] = useState<1 | 2 | 3 | 4>(1)

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  const labelCls = "mb-1.5 block text-xs font-semibold text-gray-600"
  const tarihFormatla = (tarih: string) => tarih ? tarih.split("-").reverse().join("/") : ""

  const aracAlaniGuncelle = <K extends keyof typeof aracFormu>(alan: K, deger: (typeof aracFormu)[K]) =>
    setAracFormu((prev) => ({ ...prev, [alan]: deger }))

  const kontakEkle = () => {
    if (!kontakNo.trim() || !kontakAdi.trim()) return
    if (kontaklar.some((kontak) => kontak.no === kontakNo.trim())) return
    setKontaklar((prev) => [...prev, { id: Date.now(), no: kontakNo.trim(), ad: kontakAdi.trim() }])
    setKontakNo("")
    setKontakAdi("")
  }

  const acenteEkle = () => {
    const kod = acenteKodu.trim()
    if (!kod || acenteler.some((acente) => acente.kod === kod)) return
    const unvanlar: Record<string, string> = {
      "320001": "Atlas Sigorta Aracılık",
      "320002": "Marmara Güvence Acenteliği",
      "320003": "Pusula Sigorta Hizmetleri",
    }
    setAcenteler((prev) => [...prev, { kod, unvan: unvanlar[kod] ?? `Test Acente ${kod}`, anaAcente: false }])
    setAcenteKodu("")
  }

  const aracEkle = () => {
    if (!aracFormu.kullanimTipi || !aracFormu.primTipi) return
    setAraclar((prev) => [...prev, { ...aracFormu, id: Date.now() }])
    setAracFormu(bosFiloAraci)
  }

  const birinciAdimTamam = Boolean(sozlesmeAdi.trim() && baslangic && bitis && kontaklar.length && acenteler.length)
  const ikinciAdimTamam = araclar.length > 0

  const adimaGit = (adim: 1 | 2 | 3 | 4) => {
    if (adim >= 2 && !birinciAdimTamam) {
      setHata("Devam etmek için sözleşme bilgilerini tamamlayıp en az bir kontak ekleyiniz.")
      return
    }
    if (adim >= 3 && !ikinciAdimTamam) {
      setHata("Devam etmek için en az bir araç bilgisi ekleyiniz.")
      return
    }
    setHata("")
    setAktifAdim(adim)
  }

  const kaydet = (kayitTipi: "teklif" | "police") => {
    if (!sozlesmeAdi.trim() || !baslangic || !bitis) {
      setHata("Sözleşme adı, başlangıç tarihi ve bitiş tarihi zorunludur.")
      return
    }
    if (kontaklar.length === 0) {
      setHata("En az bir kontak ekleyiniz.")
      return
    }
    if (araclar.length === 0) {
      setHata("En az bir araç bilgisi ekleyiniz.")
      return
    }
    const id = initialKayit?.id ?? Date.now()
    const [anaNumara, mevcutRevizyon = "00"] = initialKayit?.sozlesmeNo.split("/") ?? []
    let sozlesmeNo = `${String(id).slice(-10).padStart(10, "0")}/00`
    if (initialKayit) {
      sozlesmeNo = kayitModu === "normal"
        ? `${anaNumara}/${String(Number(mevcutRevizyon) + 1).padStart(2, "0")}`
        : initialKayit.sozlesmeNo
    }

    let policeNo: string | undefined
    if (kayitModu === "ek" && initialKayit) {
      const parcalar = (initialKayit.policeNo || `${initialKayit.sozlesmeNo}/00`).split("/")
      policeNo = `${parcalar.slice(0, 2).join("/")}/${String(Number(parcalar[2] ?? "00") + 1).padStart(2, "0")}`
    } else if (kayitTipi === "police") {
      policeNo = `${sozlesmeNo}/00`
    }
    const tarihce: FiloTarihceKaydi[] = [
      ...(initialKayit?.tarihce ?? []),
      {
        id: Date.now(),
        tarih: new Date().toLocaleString("tr-TR"),
        islem: kayitModu === "ek"
          ? "Sözleşme eki oluşturuldu"
          : initialKayit
          ? "Revizyon oluşturuldu"
          : kayitTipi === "police" ? "Poliçe oluşturuldu" : "Teklif oluşturuldu",
        aciklama: kayitModu === "ek"
          ? `${policeNo} numaralı sözleşme eki oluşturuldu.`
          : initialKayit
          ? `${initialKayit.sozlesmeNo} numaralı kayıt ${sozlesmeNo} olarak revize edildi.`
          : `${sozlesmeNo} numaralı ${kayitTipi === "police" ? "poliçe" : "teklif"} kaydı oluşturuldu.`,
        kullanici: "MS4329",
        tur: kayitModu === "ek" ? "ek" : initialKayit ? "revizyon" : kayitTipi,
        numara: kayitModu === "ek" || kayitTipi === "police" ? policeNo : sozlesmeNo,
        baslangic: tarihFormatla(baslangic),
        bitis: tarihFormatla(bitis),
      },
    ]
    onSave({
      id,
      sozlesmeAdi: sozlesmeAdi.trim(),
      sozlesmeNo,
      policeNo,
      versiyon: initialKayit && kayitModu === "normal" ? initialKayit.versiyon + 1 : initialKayit?.versiyon ?? 1,
      yenileme: initialKayit?.yenileme ?? 0,
      urunAdi: "Kasko",
      policeTipi: araclar[0].kullanimTipi,
      baslangic: tarihFormatla(baslangic),
      bitis: tarihFormatla(bitis),
      policeBitisTarihi: sozlesmeParametreleriAcik ? tarihFormatla(policeBitisTarihi) : undefined,
      kullanici: "MS4329",
      durum: kayitModu === "ek" || kayitTipi === "police" ? "Sözleşme Poliçe" : "Sözleşme Teklifi",
      yaratan: "MS4329",
      atanan: "",
      acenteAdi: acenteler[0]?.unvan ?? "",
      kontakNo: kontaklar[0].no,
      kontakAdi: kontaklar[0].ad,
      onayStatusu: "Onay Bekliyor",
      onaylayan: "",
      onayTarihi: "",
      kontaklar,
      acenteler,
      araclar,
      ozelSartlar,
      hasarOzelNotlar,
      asistanOzelNotlar,
      tarihce,
      odemeTipi,
      odemeKosullari,
    })
  }

  const secimKutulari: Array<{ alan: keyof typeof aracFormu; label: string }> = [
    { alan: "tumTeminatlarDahil", label: "Fiyata Tüm Teminatlar Dahil" },
    { alan: "ekDonanimlarDahil", label: "Fiyata Ek Donanımlar Dahil" },
    { alan: "tasinanEmtiaDahil", label: "Fiyata Taşınan Emtia Dahil" },
  ]
  const teknikSecimler: Array<{ alan: keyof typeof aracFormu; label: string }> = [
    { alan: "aracDetayBilgileri", label: "Araç Detay Bilgileri" },
    { alan: "operasyonelKiralik", label: "Operasyonel Kiralık" },
    { alan: "kiralik", label: "Kiralık" },
    { alan: "kuryeKargo", label: "Kurye / Kargo Aracı" },
    { alan: "anadoluHizmetDahil", label: "Anadolu Hizmet Dahil" },
    { alan: "teminatBilgileri", label: "Teminat Bilgileri" },
  ]
  const odemeSecenekleri: Record<string, string[]> = {
    Nakit: ["Nakit, 1 Taksit", "Nakit, 2 Taksit", "Nakit, 3 Taksit", "Nakit, 4 Taksit", "Nakit, %25 Peşin + 5 Taksit", "Nakit, %25 Peşin + 6 Taksit"],
    "Mail order": ["Mail order, 1 Taksit", "Mail order, 2 Taksit", "Mail order, 3 Taksit", "Mail order, 4 Taksit", "Mail order, 5 Taksit", "Mail order, %25 Peşin + 5 Taksit", "Mail order, %25 Peşin + 6 Taksit"],
    "Sanal POS": ["Sanal POS, 1 Taksit", "Sanal POS, 2 Taksit", "Sanal POS, 3 Taksit", "Sanal POS, 4 Taksit"],
    "Otomatik Ödeme": ["Otomatik Ödeme, 1 Taksit", "Otomatik Ödeme, 2 Taksit", "Otomatik Ödeme, 3 Taksit", "Otomatik Ödeme, 4 Taksit", "Otomatik Ödeme, %25 Peşin + 5 Taksit", "Otomatik Ödeme, %25 Peşin + 6 Taksit"],
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900">{kayitModu === "ek" ? "Sözleşme Eki Oluştur" : initialKayit ? "Filo Üretim Kaydını Güncelle" : "Yeni Filo Üretim Kaydı"}</h2>
            <p className="text-xs text-gray-400">{kayitModu === "ek" ? "Mevcut bilgiler yeni sözleşme ekine taşındı" : initialKayit ? `${initialKayit.sozlesmeNo} numaralı teklif revize edilecek` : "Sözleşme, paydaş ve araç bilgilerini tamamlayın"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">İptal</button>
          {aktifAdim > 1 && (
            <button onClick={() => adimaGit((aktifAdim - 1) as 1 | 2 | 3)} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">Geri</button>
          )}
          {aktifAdim < 4 ? (
            <button onClick={() => adimaGit((aktifAdim + 1) as 2 | 3 | 4)} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Devam Et</button>
          ) : kayitModu === "ek" ? (
            <button onClick={() => kaydet("police")} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Sözleşme Ekini Kaydet
            </button>
          ) : (
            <>
              <button onClick={() => kaydet("teklif")} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Teklif Oluştur
              </button>
              <button onClick={() => kaydet("police")} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">
                Poliçelendir
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        {hata && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{hata}</div>
        )}

        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {([
            [1, "Sözleşme ve Paydaşlar"],
            [2, "Araç Bilgileri"],
            [3, "Özel Şartlar ve Notlar"],
            [4, "Ödeme Koşulları"],
          ] as const).map(([adim, label]) => (
            <button
              key={adim}
              onClick={() => adimaGit(adim)}
              className={`flex items-center justify-center gap-2 border-r border-gray-100 px-3 py-3 text-xs font-semibold last:border-r-0 ${
                aktifAdim === adim ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                aktifAdim === adim ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>{adim}</span>
              {label}
            </button>
          ))}
        </div>

        {aktifAdim === 1 && (
          <>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-800">Sözleşme Bilgileri</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>Sözleşme Adı <span className="text-red-500">*</span></label>
              <input value={sozlesmeAdi} onChange={(e) => { setSozlesmeAdi(e.target.value); setHata("") }} placeholder="Sözleşme adını giriniz" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Başlangıç Tarihi <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={baslangic}
                onChange={(e) => {
                  const yeniBaslangic = e.target.value
                  setBaslangic(yeniBaslangic)
                  if (yeniBaslangic) {
                    const otomatikBitis = altiAySonrasi(yeniBaslangic)
                    setBitis(otomatikBitis)
                    setPoliceBitisTarihi(otomatikBitis)
                  }
                  setHata("")
                }}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Bitiş Tarihi <span className="text-red-500">*</span></label>
              <input type="date" value={bitis} min={baslangic} onChange={(e) => { setBitis(e.target.value); setHata("") }} className={inputCls} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Kontaklar</h3>
              <span className="text-xs text-gray-400">{kontaklar.length} kontak</span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input value={kontakNo} onChange={(e) => setKontakNo(e.target.value)} placeholder="Kontak no" className={inputCls} />
              <input value={kontakAdi} onChange={(e) => setKontakAdi(e.target.value)} placeholder="Kontak adı" className={inputCls} />
              <button onClick={kontakEkle} className="rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-700" title="Kontak ekle">+</button>
            </div>
            <div className="mt-3 space-y-2">
              {kontaklar.length === 0 ? <p className="rounded-lg bg-gray-50 py-5 text-center text-xs text-gray-400">Henüz kontak eklenmedi.</p> : kontaklar.map((kontak) => (
                <div key={kontak.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div><p className="text-xs font-semibold text-gray-700">{kontak.ad}</p><p className="text-xs text-gray-400">{kontak.no}</p></div>
                  <button onClick={() => setKontaklar((prev) => prev.filter((kayit) => kayit.id !== kontak.id))} className="text-gray-300 hover:text-red-500">×</button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Acenteler</h3>
              <span className="text-xs text-gray-400">{acenteler.length} acente</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input value={acenteKodu} onChange={(e) => setAcenteKodu(e.target.value)} placeholder="Acente koduyla ara" className={inputCls} />
              <button onClick={acenteEkle} className="rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700">Ara ve Ekle</button>
            </div>
            <div className="mt-3 space-y-2">
              {acenteler.map((acente) => (
                <div key={acente.kod} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div><p className="text-xs font-semibold text-gray-700">{acente.unvan}</p><p className="text-xs font-mono text-gray-400">{acente.kod}</p></div>
                  {acente.anaAcente ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">Ana Acente</span> : (
                    <button onClick={() => setAcenteler((prev) => prev.filter((kayit) => kayit.kod !== acente.kod))} className="text-gray-300 hover:text-red-500">×</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={sozlesmeParametreleriAcik}
              onChange={(e) => setSozlesmeParametreleriAcik(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Sözleşme Parametreleri</h3>
              <p className="text-xs text-gray-400">Poliçe üretim parametrelerini kullanmak için seçiniz</p>
            </div>
          </label>
          {sozlesmeParametreleriAcik && (
            <div className="mt-4 max-w-sm border-t border-gray-100 pt-4">
              <label className={labelCls}>Poliçe Bitiş Tarihi</label>
              <input type="date" value={policeBitisTarihi} min={baslangic} onChange={(e) => setPoliceBitisTarihi(e.target.value)} className={inputCls} />
            </div>
          )}
        </section>
          </>
        )}

        {aktifAdim === 2 && (
          <>
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-bold text-gray-800">Araç Bilgileri</h3>
            <p className="mt-0.5 text-xs text-gray-400">Prim ve teknik detayları girerek araçları sözleşmeye ekleyin</p>
          </div>

          <div className="p-5">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Prim Detayları</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className={labelCls}>Prim Tipi</label>
                <select
                  value={aracFormu.primTipi}
                  onChange={(e) => setAracFormu((prev) => ({
                    ...prev,
                    primTipi: e.target.value,
                    indirimYuzdesi: "",
                    sabitPrim: "",
                    ozelFiyatOrani: "",
                  }))}
                  className={inputCls}
                >
                  <option>Özel İndirim</option><option>Sabit Prim</option><option>Özel Fiyat</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>İndirim Yüzdesi</label>
                <input
                  type="number"
                  value={aracFormu.indirimYuzdesi}
                  readOnly={aracFormu.primTipi !== "Özel İndirim"}
                  onChange={(e) => aracAlaniGuncelle("indirimYuzdesi", e.target.value)}
                  className={`${inputCls} ${aracFormu.primTipi !== "Özel İndirim" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className={labelCls}>Sabit Prim</label>
                <input
                  type="number"
                  value={aracFormu.sabitPrim}
                  readOnly={aracFormu.primTipi !== "Sabit Prim"}
                  onChange={(e) => aracAlaniGuncelle("sabitPrim", e.target.value)}
                  className={`${inputCls} ${aracFormu.primTipi !== "Sabit Prim" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className={labelCls}>Özel Fiyat Oranı</label>
                <input
                  type="number"
                  value={aracFormu.ozelFiyatOrani}
                  readOnly={aracFormu.primTipi !== "Özel Fiyat"}
                  onChange={(e) => aracAlaniGuncelle("ozelFiyatOrani", e.target.value)}
                  className={`${inputCls} ${aracFormu.primTipi !== "Özel Fiyat" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {secimKutulari.map(({ alan, label }) => (
                <label key={alan} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <input type="checkbox" checked={Boolean(aracFormu[alan])} onChange={(e) => aracAlaniGuncelle(alan, e.target.checked)} className="rounded border-gray-300" />
                  {label}
                </label>
              ))}
            </div>

            <div className="my-5 h-px bg-gray-100" />
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Araç Teknik Detayları</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelCls}>Kullanım Tipi</label>
                <select value={aracFormu.kullanimTipi} onChange={(e) => aracAlaniGuncelle("kullanimTipi", e.target.value)} className={inputCls}>
                  <option>Otomobil (Sürücü Dahil 9 Koltuk)</option><option>Kamyonet</option><option>Kamyon</option><option>Çekici</option><option>Minibüs</option><option>Otobüs</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Kullanım Şekli</label>
                <select value={aracFormu.kullanimSekli} onChange={(e) => aracAlaniGuncelle("kullanimSekli", e.target.value)} className={inputCls}>
                  <option value="">Seçim</option><option>Hususi</option><option>Ticari</option><option>Resmi</option>
                </select>
              </div>
              <div><label className={labelCls}>Acente Komisyon %</label><input type="number" value={aracFormu.acenteKomisyonu} onChange={(e) => aracAlaniGuncelle("acenteKomisyonu", e.target.value)} className={inputCls} /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {teknikSecimler.map(({ alan, label }) => (
                <label key={alan} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <input type="checkbox" checked={Boolean(aracFormu[alan])} onChange={(e) => aracAlaniGuncelle(alan, e.target.checked)} className="rounded border-gray-300" />
                  {label}
                </label>
              ))}
            </div>

            <div className="my-5 h-px bg-gray-100" />
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Teminat Detayları</h4>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelCls}>Kilit Mekanizması Limiti</label>
                <select
                  value={aracFormu.kilitMekanizmasiLimiti}
                  onChange={(e) => aracAlaniGuncelle("kilitMekanizmasiLimiti", e.target.value)}
                  className={inputCls}
                >
                  <option>40.000 TL</option>
                  <option>50.000 TL</option>
                  <option>60.000 TL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold text-gray-700">Koltuk Ferdi Kaza</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { label: "Ölüm", durum: "koltukOlumDurumu", limit: "koltukOlumLimiti" },
                    { label: "Sürekli Sakatlık", durum: "koltukSakatlikDurumu", limit: "koltukSakatlikLimiti" },
                    { label: "Tedavi", durum: "koltukTedaviDurumu", limit: "koltukTedaviLimiti" },
                  ].map((satir) => (
                    <div key={satir.label} className="grid grid-cols-[1fr_130px_150px] items-center gap-2 px-3 py-2.5">
                      <span className="text-xs font-medium text-gray-700">{satir.label}</span>
                      <select
                        value={String(aracFormu[satir.durum as keyof typeof aracFormu])}
                        onChange={(e) => setAracFormu((prev) => ({ ...prev, [satir.durum]: e.target.value }))}
                        className={inputCls}
                      >
                        <option>Zorunlu</option><option>Önerilen</option><option>İsteğe Bağlı</option>
                      </select>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={String(aracFormu[satir.limit as keyof typeof aracFormu])}
                          onChange={(e) => setAracFormu((prev) => ({ ...prev, [satir.limit]: e.target.value }))}
                          className={`${inputCls} pr-8 text-right`}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₺</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-bold text-gray-700">Sorumluluk ve Hizmet Teminatları</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { label: "Artan Mali Sorumluluk", durum: "artanMaliSorumlulukDurumu", limit: "artanMaliSorumlulukLimiti", options: ["5000000", "10000000", "15000000", "20000000", "9999999999"] },
                    { label: "Artan Mali Sorumluluk Manevi Tazminat", durum: "maneviTazminatDurumu", limit: "maneviTazminatLimiti", options: ["1000000", "2500000", "5000000"] },
                    { label: "Hukuksal Koruma", durum: "hukuksalKorumaDurumu", limit: "hukuksalKorumaLimiti", options: ["40000", "50000", "60000"] },
                    {
                      label: "Anadolu Hizmet",
                      durum: "anadoluHizmetDurumu",
                      paket: "anadoluHizmetPaketi",
                      paketOptions: [
                        "Anadolu Hizmet Hususi Otomobil 7/48 (Anadolu Grup 1) Pert Dahil",
                        "Anadolu Hizmet Hususi Otomobil 7/48 (Anadolu Grup 2) Pert Dahil",
                        "Anadolu Hizmet - İkamesiz",
                        "Anadolu Hizmet Hususi 15/48 Otomobil (Anadolu Grup 1) Pert Dahil",
                        "Anadolu Hizmet Hususi 30/48 Otomobil (Anadolu Grup 1) Pert Dahil",
                        "Anadolu Hizmet Hususi 15/48 Otomobil (Anadolu Grup 2) Pert Dahil",
                        "Anadolu Hizmet Hususi 30/48 Otomobil (Anadolu Grup 2) Pert Dahil",
                        "Anadolu Hizmet Hususi Otomobil 7/48 (Anadolu Grup 3) Pert Dahil",
                        "Anadolu Hizmet Hususi Otomobil 15/48 (Anadolu Grup 3) Pert Dahil",
                        "Anadolu Hizmet Hususi Otomobil 30/48 (Anadolu Grup 3) Pert Dahil",
                      ],
                    },
                  ].map((satir) => (
                    <div key={satir.label} className="grid grid-cols-[1fr_120px_230px] items-center gap-2 px-3 py-2.5">
                      <span className="text-xs font-medium text-gray-700">{satir.label}</span>
                      <select
                        value={String(aracFormu[satir.durum as keyof typeof aracFormu])}
                        onChange={(e) => setAracFormu((prev) => ({ ...prev, [satir.durum]: e.target.value }))}
                        className={inputCls}
                      >
                        <option>Zorunlu</option><option>Önerilen</option><option>İsteğe Bağlı</option>
                      </select>
                      {satir.paket && satir.paketOptions ? (
                        <select
                          value={String(aracFormu[satir.paket as keyof typeof aracFormu])}
                          onChange={(e) => setAracFormu((prev) => ({ ...prev, [satir.paket as string]: e.target.value }))}
                          className={inputCls}
                          title={String(aracFormu[satir.paket as keyof typeof aracFormu])}
                        >
                          {satir.paketOptions.map((paket) => <option key={paket}>{paket}</option>)}
                        </select>
                      ) : satir.limit && satir.options ? (
                        <select
                          value={String(aracFormu[satir.limit as keyof typeof aracFormu])}
                          onChange={(e) => setAracFormu((prev) => ({ ...prev, [satir.limit as string]: e.target.value }))}
                          className={`${inputCls} text-right`}
                        >
                          {satir.options.map((limit) => <option key={limit} value={limit}>{Number(limit).toLocaleString("tr-TR")} TL</option>)}
                        </select>
                      ) : (
                        <span className="px-3 text-xs text-gray-400">Limit uygulanmıyor</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={aracEkle} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <span className="text-lg leading-none">+</span> Araç Ekle
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100">
            {araclar.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">Henüz araç bilgisi eklenmedi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-xs">
                  <thead><tr className="bg-gray-50 text-gray-600">
                    {["#", "Kullanım Tipi", "Kullanım Şekli", "Prim Tipi", "Kilit Limiti", "AMS Limiti", "İndirim %", "Sabit Prim", "Özel Fiyat %", "Komisyon %", ""].map((baslik) => <th key={baslik} className="px-3 py-3 text-left font-semibold">{baslik}</th>)}
                  </tr></thead>
                  <tbody>{araclar.map((arac, index) => (
                    <tr key={arac.id} className="border-t border-gray-100">
                      <td className="px-3 py-3 text-gray-400">{index + 1}</td>
                      <td className="px-3 py-3 font-semibold text-gray-700">{arac.kullanimTipi}</td>
                      <td className="px-3 py-3 text-gray-600">{arac.kullanimSekli || "—"}</td>
                      <td className="px-3 py-3 text-gray-600">{arac.primTipi}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{arac.kilitMekanizmasiLimiti}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{Number(arac.artanMaliSorumlulukLimiti).toLocaleString("tr-TR")} TL</td>
                      <td className="px-3 py-3 text-gray-600">{arac.indirimYuzdesi || "—"}</td>
                      <td className="px-3 py-3 text-gray-600">{arac.sabitPrim || "—"}</td>
                      <td className="px-3 py-3 text-gray-600">{arac.ozelFiyatOrani || "—"}</td>
                      <td className="px-3 py-3 text-gray-600">{arac.acenteKomisyonu || "—"}</td>
                      <td className="px-3 py-3"><button onClick={() => setAraclar((prev) => prev.filter((kayit) => kayit.id !== arac.id))} className="text-gray-300 hover:text-red-500">Sil</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </section>
          </>
        )}

        {aktifAdim === 3 && (
          <>
        <FiloNotBolumu
          baslik="Özel Şartlar"
          aciklama="Sözleşmeye basılacak özel şart ve notları ekleyin"
          notlar={ozelSartlar}
          onChange={setOzelSartlar}
        />
        <FiloNotBolumu
          baslik="Hasar Özel Notları"
          aciklama="Hasar süreçlerinde dikkate alınacak özel notları ekleyin"
          notlar={hasarOzelNotlar}
          onChange={setHasarOzelNotlar}
        />
        <FiloNotBolumu
          baslik="Asistan Özel Notları"
          aciklama="Asistan hizmetlerinde kullanılacak özel notları ekleyin"
          notlar={asistanOzelNotlar}
          onChange={setAsistanOzelNotlar}
        />
          </>
        )}

        {aktifAdim === 4 && (
          <>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800">Ödeme Koşulları</h3>
          <p className="mt-0.5 text-xs text-gray-400">Ödeme tipini seçerek kullanılabilecek taksit seçeneklerini belirleyin</p>
          <div className="mt-4 max-w-sm">
            <label className={labelCls}>Ödeme Tipi</label>
            <select
              value={odemeTipi}
              onChange={(e) => {
                setOdemeTipi(e.target.value)
                setOdemeKosullari([])
              }}
              className={inputCls}
            >
              {Object.keys(odemeSecenekleri).map((tip) => <option key={tip}>{tip}</option>)}
            </select>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            <div className="grid grid-cols-[64px_1fr] border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
              <span>Dahil</span><span>Ödeme Koşulu</span>
            </div>
            <div className="divide-y divide-gray-100">
              {odemeSecenekleri[odemeTipi].map((kosul) => (
                <label key={kosul} className="grid cursor-pointer grid-cols-[64px_1fr] items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50/40">
                  <input
                    type="checkbox"
                    checked={odemeKosullari.includes(kosul)}
                    onChange={(e) => setOdemeKosullari((prev) =>
                      e.target.checked ? [...prev, kosul] : prev.filter((secili) => secili !== kosul)
                    )}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>{kosul}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
          </>
        )}
      </div>
    </main>
  )
}

function FiloUretimGoruntulePage({ kayit, onBack, onUpdate, onSozlesmeEki }: {
  kayit: FiloUretimKaydi
  onBack: () => void
  onUpdate: (kayit: FiloUretimKaydi) => void
  onSozlesmeEki: () => void
}) {
  const [aktifSekme, setAktifSekme] = useState<"sozlesme" | "arac" | "notlar" | "odeme" | "tarihce">("sozlesme")
  const [islemTipi, setIslemTipi] = useState<"ek" | "yenileme" | null>(null)
  const [secilenTarihce, setSecilenTarihce] = useState<FiloTarihceKaydi | null>(null)
  const isoTarih = (tarih: Date) =>
    `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, "0")}-${String(tarih.getDate()).padStart(2, "0")}`
  const sistemTarihi = isoTarih(new Date())
  const altiAySonrasi = new Date()
  altiAySonrasi.setMonth(altiAySonrasi.getMonth() + 6)
  const [islemBaslangic, setIslemBaslangic] = useState(sistemTarihi)
  const [islemBitis, setIslemBitis] = useState(isoTarih(altiAySonrasi))
  const tarihFormatla = (tarih: string) => tarih.split("-").reverse().join("/")
  const policeKaydiMi = kayit.durum === "Sözleşme Poliçe"
  const tarihceKayitlari = (kayit.tarihce ?? []).filter((olay) =>
    policeKaydiMi
      ? ["police", "ek", "yenileme"].includes(olay.tur ?? "")
      : ["teklif", "revizyon"].includes(olay.tur ?? "")
  )
  const bilgi = (label: string, value?: React.ReactNode) => (
    <div>
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <div className="min-h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">{value || "—"}</div>
    </div>
  )

  const islemiKaydet = () => {
    if (!islemTipi) return
    const tarihceKaydi: FiloTarihceKaydi = {
      id: Date.now(),
      tarih: new Date().toLocaleString("tr-TR"),
      islem: islemTipi === "ek" ? "Sözleşme eki oluşturuldu" : "Sözleşme yenilendi",
      aciklama: islemTipi === "ek"
        ? "Sözleşme bilgileri yeni ek kaydına taşındı."
        : `Sözleşme ${kayit.yenileme + 1}. yenileme dönemine aktarıldı.`,
      kullanici: "MS4329",
      tur: islemTipi,
      numara: islemTipi === "ek" ? kayit.policeNo : kayit.sozlesmeNo,
      baslangic: tarihFormatla(islemBaslangic),
      bitis: tarihFormatla(islemBitis),
    }

    if (islemTipi === "ek") {
      const numaraParcalari = (kayit.policeNo || `${kayit.sozlesmeNo}/00`).split("/")
      const mevcutEk = Number(numaraParcalari[2] ?? "00")
      const ekAnaNumara = numaraParcalari.slice(0, 2).join("/")
      onUpdate({
        ...kayit,
        policeNo: `${ekAnaNumara}/${String(mevcutEk + 1).padStart(2, "0")}`,
        baslangic: tarihFormatla(islemBaslangic),
        bitis: tarihFormatla(islemBitis),
        tarihce: [...(kayit.tarihce ?? []), {
          ...tarihceKaydi,
          aciklama: `${ekAnaNumara}/${String(mevcutEk + 1).padStart(2, "0")} numaralı sözleşme eki oluşturuldu.`,
        }],
      })
    } else {
      onUpdate({
        ...kayit,
        yenileme: kayit.yenileme + 1,
        baslangic: tarihFormatla(islemBaslangic),
        bitis: tarihFormatla(islemBitis),
        tarihce: [...(kayit.tarihce ?? []), tarihceKaydi],
      })
    }
    setIslemTipi(null)
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900">Filo Üretim Kaydı</h2>
            <p className="text-xs text-gray-400">{kayit.sozlesmeNo} · Salt okunur görüntüleme</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onSozlesmeEki} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">Sözleşme Eki</button>
          <button onClick={() => setIslemTipi("yenileme")} className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100">Sözleşme Yenileme</button>
          <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Kapat</button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <div className="grid grid-cols-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {([
            ["sozlesme", "Sözleşme ve Paydaşlar"],
            ["arac", "Araç Bilgileri"],
            ["notlar", "Özel Şartlar ve Notlar"],
            ["odeme", "Ödeme Koşulları"],
            ["tarihce", "Ek Tarihçe"],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setAktifSekme(id)} className={`px-4 py-3 text-sm font-semibold ${aktifSekme === id ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}>{label}</button>
          ))}
        </div>

        {islemTipi && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">{islemTipi === "ek" ? "Yeni Sözleşme Eki" : "Sözleşme Yenileme"}</h3>
                <p className="mt-1 text-xs text-blue-700">Mevcut sözleşmedeki tüm bilgiler yeni kayda taşınacaktır.</p>
              </div>
              <button onClick={() => setIslemTipi(null)} className="text-blue-400 hover:text-blue-700">×</button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-blue-800">Başlangıç Tarihi</label>
                <input type="date" value={islemBaslangic} onChange={(e) => setIslemBaslangic(e.target.value)} className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-blue-800">Bitiş Tarihi</label>
                <input type="date" value={islemBitis} min={islemBaslangic} onChange={(e) => setIslemBitis(e.target.value)} className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={islemiKaydet} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                {islemTipi === "ek" ? "Sözleşme Ekini Oluştur" : "Yenilemeyi Oluştur"}
              </button>
            </div>
          </section>
        )}

        {aktifSekme === "sozlesme" && (
          <>
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-800">Sözleşme Bilgileri</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {bilgi("Sözleşme Adı", kayit.sozlesmeAdi)}
                {bilgi("Teklif No", kayit.sozlesmeNo)}
                {bilgi("Poliçe No", kayit.policeNo)}
                {bilgi("Başlangıç Tarihi", kayit.baslangic)}
                {bilgi("Bitiş Tarihi", kayit.bitis)}
                {bilgi("Poliçe Bitiş Tarihi", kayit.policeBitisTarihi)}
                {bilgi("Durum", kayit.durum)}
                {bilgi("Versiyon", kayit.versiyon)}
                {bilgi("Yaratan", kayit.yaratan)}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-800">Kontaklar</h3>
                <div className="space-y-2">{(kayit.kontaklar ?? []).map((kontak) => (
                  <div key={kontak.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"><p className="text-sm font-medium text-gray-700">{kontak.ad}</p><p className="text-xs text-gray-400">{kontak.no}</p></div>
                ))}</div>
              </section>
              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-800">Acenteler</h3>
                <div className="space-y-2">{(kayit.acenteler ?? []).map((acente) => (
                  <div key={acente.kod} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"><p className="text-sm font-medium text-gray-700">{acente.unvan}</p><p className="text-xs text-gray-400">{acente.kod}</p></div>
                ))}</div>
              </section>
            </div>
          </>
        )}

        {aktifSekme === "arac" && (
          <div className="space-y-4">
            {(kayit.araclar ?? []).length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-400">Araç bilgisi bulunmuyor.</div>
            ) : (kayit.araclar ?? []).map((arac, index) => (
              <section key={arac.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-800">Araç {index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {bilgi("Kullanım Tipi", arac.kullanimTipi)}
                  {bilgi("Kullanım Şekli", arac.kullanimSekli)}
                  {bilgi("Prim Tipi", arac.primTipi)}
                  {bilgi("İndirim Yüzdesi", arac.indirimYuzdesi ? `%${arac.indirimYuzdesi}` : "—")}
                  {bilgi("Sabit Prim", arac.sabitPrim ? `${arac.sabitPrim} TL` : "—")}
                  {bilgi("Özel Fiyat Oranı", arac.ozelFiyatOrani ? `%${arac.ozelFiyatOrani}` : "—")}
                  {bilgi("Acente Komisyonu", arac.acenteKomisyonu ? `%${arac.acenteKomisyonu}` : "—")}
                  {bilgi("Kilit Mekanizması Limiti", arac.kilitMekanizmasiLimiti)}
                  {bilgi("Koltuk Ferdi Kaza - Ölüm", `${Number(arac.koltukOlumLimiti).toLocaleString("tr-TR")} TL · ${arac.koltukOlumDurumu}`)}
                  {bilgi("Koltuk Ferdi Kaza - Sakatlık", `${Number(arac.koltukSakatlikLimiti).toLocaleString("tr-TR")} TL · ${arac.koltukSakatlikDurumu}`)}
                  {bilgi("Koltuk Ferdi Kaza - Tedavi", `${Number(arac.koltukTedaviLimiti).toLocaleString("tr-TR")} TL · ${arac.koltukTedaviDurumu}`)}
                  {bilgi("Artan Mali Sorumluluk", `${Number(arac.artanMaliSorumlulukLimiti).toLocaleString("tr-TR")} TL · ${arac.artanMaliSorumlulukDurumu}`)}
                  {bilgi("Manevi Tazminat", `${Number(arac.maneviTazminatLimiti).toLocaleString("tr-TR")} TL · ${arac.maneviTazminatDurumu}`)}
                  {bilgi("Hukuksal Koruma", `${Number(arac.hukuksalKorumaLimiti).toLocaleString("tr-TR")} TL · ${arac.hukuksalKorumaDurumu}`)}
                  {bilgi("Anadolu Hizmet", `${arac.anadoluHizmetPaketi} · ${arac.anadoluHizmetDurumu}`)}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    ["Tüm Teminatlar", arac.tumTeminatlarDahil],
                    ["Ek Donanımlar", arac.ekDonanimlarDahil],
                    ["Taşınan Emtia", arac.tasinanEmtiaDahil],
                    ["Operasyonel Kiralık", arac.operasyonelKiralik],
                    ["Kiralık", arac.kiralik],
                    ["Kurye / Kargo", arac.kuryeKargo],
                    ["Anadolu Hizmet", arac.anadoluHizmetDahil],
                    ["Teminat Bilgileri", arac.teminatBilgileri],
                  ].filter(([, secili]) => secili).map(([label]) => (
                    <span key={String(label)} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{label}</span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {aktifSekme === "notlar" && (
          <div className="space-y-4">
            {[
              ["Özel Şartlar", kayit.ozelSartlar ?? []],
              ["Hasar Özel Notları", kayit.hasarOzelNotlar ?? []],
              ["Asistan Özel Notları", kayit.asistanOzelNotlar ?? []],
            ].map(([baslik, notlar]) => (
              <section key={String(baslik)} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-800">{String(baslik)}</h3>
                {(notlar as FiloOzelSart[]).length === 0 ? (
                  <p className="py-5 text-center text-sm text-gray-400">Kayıt bulunmuyor.</p>
                ) : (
                  <div className="space-y-2">{(notlar as FiloOzelSart[]).map((not) => (
                    <div key={not.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
                      <p className="text-sm text-gray-700">{not.metin}</p>
                      <p className="mt-1 text-xs text-gray-400">{not.baskiDili} · {not.eklenmeTarihi}</p>
                    </div>
                  ))}</div>
                )}
              </section>
            ))}
          </div>
        )}

        {aktifSekme === "odeme" && (
          <div className="space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-800">Ödeme Koşulları</h3>
              <p className="mb-4 text-xs text-gray-400">Ödeme tipi: {kayit.odemeTipi || "—"}</p>
              {(kayit.odemeKosullari ?? []).length === 0 ? (
                <p className="py-5 text-center text-sm text-gray-400">Ödeme koşulu seçilmemiş.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {(kayit.odemeKosullari ?? []).map((kosul) => (
                    <div key={kosul} className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-800">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-xs text-white">✓</span>
                      {kosul}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {aktifSekme === "tarihce" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-bold text-gray-800">{policeKaydiMi ? "Ek Tarihçesi" : "Teklif Tarihçesi"}</h3>
            <p className="mb-5 text-xs text-gray-400">{policeKaydiMi ? "Poliçe ve sözleşme ekleri" : "Teklif ve revizyon kayıtları"}</p>

            {secilenTarihce && (
              <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Salt Okunur Sözleşme Görünümü</p>
                    <h4 className="mt-1 font-mono text-base font-bold text-blue-900">{secilenTarihce.numara}</h4>
                  </div>
                  <button onClick={() => setSecilenTarihce(null)} className="text-blue-400 hover:text-blue-700">×</button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                  {bilgi("Sözleşme Adı", kayit.sozlesmeAdi)}
                  {bilgi("Başlangıç Tarihi", secilenTarihce.baslangic || kayit.baslangic)}
                  {bilgi("Bitiş Tarihi", secilenTarihce.bitis || kayit.bitis)}
                  {bilgi("Araç Sayısı", kayit.araclar?.length ?? 0)}
                </div>
                <p className="mt-3 text-xs text-blue-700">Bu ek; sözleşmenin kontak, acente, araç, teminat ve özel not bilgilerini taşır.</p>
              </div>
            )}

            {tarihceKayitlari.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">Henüz tarihçe kaydı bulunmuyor.</div>
            ) : (
              <div className="space-y-3">{[...tarihceKayitlari].reverse().map((olay) => (
                <div key={olay.id} className="flex gap-3 rounded-xl border border-gray-200 p-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{olay.islem}</p>
                        {olay.numara && (
                          <button onClick={() => setSecilenTarihce(olay)} className="mt-1 font-mono text-xs font-semibold text-blue-700 hover:underline">
                            {olay.numara}
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{olay.tarih}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{olay.aciklama}</p>
                    <p className="mt-2 text-xs text-gray-400">Kullanıcı: {olay.kullanici}</p>
                  </div>
                </div>
              ))}</div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

function FiloUretimPage() {
  const [filtreAcik, setFiltreAcik] = useState(false)
  const [kayitlar, setKayitlar] = useState<FiloUretimKaydi[]>(filoUretimBaslangicVerisi)
  const [yeniKayitAcik, setYeniKayitAcik] = useState(false)
  const [duzenlenenKayit, setDuzenlenenKayit] = useState<FiloUretimKaydi | null>(null)
  const [goruntulenenKayit, setGoruntulenenKayit] = useState<FiloUretimKaydi | null>(null)
  const [kayitModu, setKayitModu] = useState<"normal" | "ek">("normal")
  const [filtreler, setFiltreler] = useState(bosFiloFiltreleri)
  const [uygulananFiltreler, setUygulananFiltreler] = useState(bosFiloFiltreleri)
  const [secilenler, setSecilenler] = useState<Set<number>>(new Set())

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
  const labelCls = "mb-1.5 block text-xs font-semibold text-gray-600"

  const filtreliKayitlar = kayitlar.filter((kayit) =>
    (!uygulananFiltreler.sozlesmeAdi || kayit.sozlesmeAdi.toLocaleLowerCase("tr-TR").includes(uygulananFiltreler.sozlesmeAdi.toLocaleLowerCase("tr-TR"))) &&
    (!uygulananFiltreler.sozlesmeNo || kayit.sozlesmeNo.includes(uygulananFiltreler.sozlesmeNo)) &&
    (!uygulananFiltreler.urunAdi || kayit.urunAdi === uygulananFiltreler.urunAdi) &&
    (!uygulananFiltreler.kontakNo || kayit.kontakNo.toLocaleLowerCase("tr-TR").includes(uygulananFiltreler.kontakNo.toLocaleLowerCase("tr-TR"))) &&
    (!uygulananFiltreler.acenteAdi || kayit.acenteAdi === uygulananFiltreler.acenteAdi) &&
    (!uygulananFiltreler.kontakAdi || kayit.kontakAdi.toLocaleLowerCase("tr-TR").includes(uygulananFiltreler.kontakAdi.toLocaleLowerCase("tr-TR"))) &&
    (!uygulananFiltreler.onayStatusu || kayit.onayStatusu === uygulananFiltreler.onayStatusu) &&
    (!uygulananFiltreler.atanan || kayit.atanan === uygulananFiltreler.atanan)
  )

  const filtreGuncelle = (alan: keyof typeof filtreler, deger: string) =>
    setFiltreler((prev) => ({ ...prev, [alan]: deger }))

  const secimiGuncelle = (id: number) =>
    setSecilenler((prev) => prev.has(id) ? new Set() : new Set([id]))

  const secileniKopyala = () => {
    const kaynak = kayitlar.find((kayit) => secilenler.has(kayit.id))
    if (!kaynak) return
    const yeniId = Math.max(...kayitlar.map((kayit) => kayit.id)) + 1
    setKayitlar((prev) => [{
      ...kaynak,
      id: yeniId,
      sozlesmeAdi: `${kaynak.sozlesmeAdi} - Kopya`,
      sozlesmeNo: `${String(Date.now() + yeniId).slice(-10).padStart(10, "0")}/00`,
      policeNo: undefined,
      versiyon: 1,
      durum: "Sözleşme Teklifi",
      onayStatusu: "Onay Bekliyor",
      onaylayan: "",
      onayTarihi: "",
    }, ...prev])
    setSecilenler(new Set())
  }

  const duzenlemeyiAc = () => {
    if (secilenler.size !== 1) return
    const kayit = kayitlar.find((item) => secilenler.has(item.id))
    if (!kayit) return
    setDuzenlenenKayit(kayit)
    setKayitModu("normal")
    setYeniKayitAcik(true)
  }

  const goruntulemeyiAc = () => {
    if (secilenler.size !== 1) return
    const kayit = kayitlar.find((item) => secilenler.has(item.id))
    if (kayit) setGoruntulenenKayit(kayit)
  }

  const exceleAktar = () => {
    const basliklar = ["Sözleşme Adı", "Teklif No", "Poliçe No", "Versiyon", "Yenileme", "Ürün Adı", "Poliçe Tipi", "Başlangıç", "Bitiş", "Kullanıcı", "Durum", "Yaratan"]
    const satirlar = filtreliKayitlar.map((kayit) => [
      kayit.sozlesmeAdi, kayit.sozlesmeNo, kayit.policeNo ?? "", kayit.versiyon, kayit.yenileme, kayit.urunAdi,
      kayit.policeTipi, kayit.baslangic, kayit.bitis, kayit.kullanici, kayit.durum,
      kayit.yaratan,
    ])
    const csv = [basliklar, ...satirlar].map((satir) => satir.map((hucre) => `"${String(hucre).replaceAll("\"", "\"\"")}"`).join(",")).join("\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }))
    link.download = "filo-uretim-listesi.csv"
    link.click()
  }

  if (goruntulenenKayit) {
    return (
      <FiloUretimGoruntulePage
        kayit={goruntulenenKayit}
        onBack={() => setGoruntulenenKayit(null)}
        onUpdate={(guncelKayit) => {
          setKayitlar((prev) => prev.map((kayit) => kayit.id === guncelKayit.id ? guncelKayit : kayit))
          setGoruntulenenKayit(guncelKayit)
        }}
        onSozlesmeEki={() => {
          setDuzenlenenKayit(goruntulenenKayit)
          setGoruntulenenKayit(null)
          setKayitModu("ek")
          setYeniKayitAcik(true)
        }}
      />
    )
  }

  if (yeniKayitAcik) {
    return (
      <FiloUretimOlusturPage
        initialKayit={duzenlenenKayit}
        kayitModu={kayitModu}
        onBack={() => {
          setYeniKayitAcik(false)
          setDuzenlenenKayit(null)
          setKayitModu("normal")
        }}
        onSave={(kayit) => {
          setKayitlar((prev) =>
            duzenlenenKayit
              ? prev.map((item) => item.id === kayit.id ? kayit : item)
              : [kayit, ...prev]
          )
          setYeniKayitAcik(false)
          setDuzenlenenKayit(null)
          setKayitModu("normal")
          setSecilenler(new Set())
        }}
      />
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-5">
      <div className="space-y-4">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <button
            onClick={() => setFiltreAcik((acik) => !acik)}
            className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 text-left"
          >
            <div>
              <h2 className="text-sm font-bold text-gray-800">Filtre Seçimi</h2>
              <p className="mt-0.5 text-xs text-gray-400">Sözleşme ve onay kayıtlarını filtreleyin</p>
            </div>
            <svg className={`text-gray-400 transition-transform ${filtreAcik ? "rotate-180" : ""}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {filtreAcik && (
            <div className="p-5">
              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className={labelCls}>Sözleşme Adı</label>
                  <input value={filtreler.sozlesmeAdi} onChange={(e) => filtreGuncelle("sozlesmeAdi", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teklif Numarası</label>
                  <input value={filtreler.sozlesmeNo} onChange={(e) => filtreGuncelle("sozlesmeNo", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Ürün Adı</label>
                  <select value={filtreler.urunAdi} onChange={(e) => filtreGuncelle("urunAdi", e.target.value)} className={inputCls}>
                    <option value="">Seçim</option>
                    <option>Kasko</option>
                    <option>Trafik</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Kontak No</label>
                  <input value={filtreler.kontakNo} onChange={(e) => filtreGuncelle("kontakNo", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Acente Adı</label>
                  <select value={filtreler.acenteAdi} onChange={(e) => filtreGuncelle("acenteAdi", e.target.value)} className={inputCls}>
                    <option value="">Seçim</option>
                    {[...new Set(kayitlar.map((kayit) => kayit.acenteAdi))].map((acente) => <option key={acente}>{acente}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Kontak Adı</label>
                  <input value={filtreler.kontakAdi} onChange={(e) => filtreGuncelle("kontakAdi", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Onay Statüsü</label>
                  <select value={filtreler.onayStatusu} onChange={(e) => filtreGuncelle("onayStatusu", e.target.value)} className={inputCls}>
                    <option value="">Seçim</option>
                    <option>Onaylandı</option>
                    <option>Onay Bekliyor</option>
                    <option>Reddedildi</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Atanan Kullanıcı</label>
                  <select value={filtreler.atanan} onChange={(e) => filtreGuncelle("atanan", e.target.value)} className={inputCls}>
                    <option value="">Seçim</option>
                    {[...new Set(kayitlar.map((kayit) => kayit.atanan))].map((atanan) => <option key={atanan}>{atanan}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button onClick={() => setUygulananFiltreler(filtreler)} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">Filtrele</button>
                <button onClick={() => { setFiltreler(bosFiloFiltreleri); setUygulananFiltreler(bosFiloFiltreleri) }} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">Temizle</button>
                <button onClick={() => filtreGuncelle("kontakAdi", filtreler.kontakNo ? "Hakan Demir" : "")} className="ml-auto rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100">Kontak Arama</button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => { setDuzenlenenKayit(null); setKayitModu("normal"); setYeniKayitAcik(true) }} title="Yeni kayıt" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
              </button>
              <button onClick={duzenlemeyiAc} title="Kaydı güncelle" disabled={secilenler.size !== 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={goruntulemeyiAc} title="Görüntüle" disabled={secilenler.size !== 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></svg>
              </button>
              <button onClick={secileniKopyala} disabled={secilenler.size !== 1} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30">Kopyala</button>
            </div>
            <button onClick={exceleAktar} className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" strokeLinecap="round" /></svg>
              Excel&apos;e Aktar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  {["Sözleşme Adı", "Teklif No", "Poliçe No", "Versiyon", "Yenileme", "Ürün Adı", "Poliçe Tipi", "Başlangıç", "Bitiş", "Kullanıcı", "Durum", "Yaratan"].map((baslik) => (
                    <th key={baslik} className="px-3 py-3 text-left font-semibold whitespace-nowrap">{baslik}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtreliKayitlar.length === 0 ? (
                  <tr><td colSpan={12} className="py-14 text-center text-sm text-gray-400">Filtrelere uygun kayıt bulunamadı.</td></tr>
                ) : filtreliKayitlar.map((kayit) => (
                  <tr
                    key={kayit.id}
                    onClick={() => secimiGuncelle(kayit.id)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50/40 ${secilenler.has(kayit.id) ? "bg-blue-50/80 ring-1 ring-inset ring-blue-200" : ""}`}
                  >
                    <td className="px-3 py-3 font-semibold text-blue-700 whitespace-nowrap">{kayit.sozlesmeAdi}</td>
                    <td className="px-3 py-3 font-mono text-gray-700">{kayit.sozlesmeNo}</td>
                    <td className="px-3 py-3 font-mono text-gray-700 whitespace-nowrap">{kayit.policeNo || "—"}</td>
                    <td className="px-3 py-3 text-right text-gray-600">{kayit.versiyon}</td>
                    <td className="px-3 py-3 text-right text-gray-600">{kayit.yenileme}</td>
                    <td className="px-3 py-3 text-gray-700">{kayit.urunAdi}</td>
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{kayit.policeTipi}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{kayit.baslangic}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{kayit.bitis}</td>
                    <td className="px-3 py-3 font-mono text-gray-600">{kayit.kullanici}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 font-medium whitespace-nowrap ${
                        kayit.durum === "Sözleşme Poliçe"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}>{kayit.durum}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-gray-600">{kayit.yaratan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            <span>{filtreliKayitlar.length} kayıt gösteriliyor</span>
            <span>{secilenler.size} kayıt seçildi</span>
          </div>
        </section>
      </div>
    </main>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [kullaniciTuru, setKullaniciTuru] = useState<KullaniciTuru>(null)
  const [kullaniciAdi, setKullaniciAdiState] = useState("")
  const [activeNav, setActiveNav] = useState<NavItem>("talepler")
  const [activeTab, setActiveTab] = useState<Tab>("talepler")
  const [selectedTalep, setSelectedTalep] = useState<Talep | null>(null)
  const [view, setView] = useState<View>("list")
  const [onayHavuzu, setOnayHavuzu] = useState<OnayKaydi[]>([])
  const [nextId, setNextId] = useState(1)
  // Shared pools — survive user switches so acente→bölge flow works
  const [acenteIslemdekiTalepler, setAcenteIslemdekiTalepler] = useState<Talep[]>([])
  const [acenteTamamlananTalepler, setAcenteTamamlananTalepler] = useState<Talep[]>([])
  const [dinamikHavuz, setDinamikHavuz] = useState<Talep[]>([])
  const [dinamikBanaAtanan, setDinamikBanaAtanan] = useState<Talep[]>([])
  const [bolgeTamamlananTalepler, setBolgeTamamlananTalepler] = useState<Talep[]>([])
  const [gmAktarilanIds, setGmAktarilanIds] = useState<Set<number>>(new Set())
  const [gmUzerimdekiTalepler, setGmUzerimdekiTalepler] = useState<Talep[]>([])
  const [gmTeklifOlusturulanTalepler, setGmTeklifOlusturulanTalepler] = useState<Talep[]>([])
  const [gmTamamlananTalepler, setGmTamamlananTalepler] = useState<Talep[]>([])
  const [robotDurumlar, setRobotDurumlar] = useState<Record<number, string>>({})
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([])
  const [talepTarihcesi, setTalepTarihcesi] = useState<TalepTarihceKaydi[]>([])
  const [mesajNextId, setMesajNextId] = useState(1)
  const [tramerSayfasiTalep, setTramerSayfasiTalep] = useState<Talep | null>(null)

  const handleCikis = () => {
    setGirisYapildi(false)
    setKullaniciTuru(null)
    setKullaniciAdiState("")
    setActiveNav("talepler")
    setActiveTab("talepler")
    setView("list")
    setSelectedTalep(null)
  }

  if (!girisYapildi) {
    return (
      <GirisEkrani
        onGiris={(tur, ad) => {
          setKullaniciTuru(tur)
          setKullaniciAdiState(ad)
          setGirisYapildi(true)
          // Bölge girişinde havuzdaki talepler sekmesini aç
          if (tur === "bolge") {
            setActiveNav("talepler")
            setActiveTab("yeni-gelen")
          } else if (tur === "acente") {
            setActiveNav("talepler")
            setActiveTab("islemdeki")
          } else if (tur === "gm") {
            setActiveNav("talepler")
            setActiveTab("yeni-gelen")
          }
        }}
      />
    )
  }

  const simdi = () => {
    const now = new Date()
    return `${now.getDate()} ${["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"][now.getMonth()]} ${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
  }

  const tarihceKaydiEkle = (
    talepId: number,
    kayitlar: Array<Omit<TalepTarihceKaydi, "talepId" | "tarih" | "islemYapan">>,
    tarih = simdi(),
  ) => {
    setTalepTarihcesi((prev) => [
      ...prev,
      ...kayitlar.map((kayit) => ({
        ...kayit,
        talepId,
        tarih,
        islemYapan: kullaniciAdi,
      })),
    ])
  }

  const handleOnayGonder = (data: TalepSubmitData) => {
    const tarih = simdi()
    const yeniTalep: Talep = {
      id: nextId,
      konu: data.konu,
      talepNo: `TLP-${new Date().getFullYear()}-${String(nextId).padStart(6, "0")}`,
      talepTipi: data.talepTipi,
      acenteKodu: data.formData.acenteler[0]?.kod ?? "",
      acenteUnvani: data.formData.acenteler[0]?.unvan || (kullaniciTuru === "acente" ? kullaniciAdi : ""),
      musteriUnvani: data.formData.musteriler[0]?.musteriUnvani ?? "",
      vknTckn: data.formData.musteriler[0]?.vknTckn ?? "",
      bolge: "",
      durum: "Yeni",
      oncelik: (data.oncelik as Talep["oncelik"]) || "Orta",
      atanan: kullaniciTuru === "bolge" ? kullaniciAdi : null,
      broker: null,
      sonGuncellemeTarihi: tarih,
      slaDurumu: "Normal",
      kalanSlaSuresi: "24 saat",
      haberlesmeSayisi: 0,
      dokumanSayisi: data.formData.dokumanSayisi,
      olusturulmaTarihi: tarih,
      sonMailTarihi: tarih,
      formData: data.formData,
    }

    if (kullaniciTuru === "acente") {
      // Acente işlem havuzu + bölge yeni gelen talepler havuzu
      setAcenteIslemdekiTalepler((prev) => [yeniTalep, ...prev])
      setDinamikHavuz((prev) => [yeniTalep, ...prev])
      // Robot havuza düşer düşmez tetiklenir
      const tid = nextId
      setRobotDurumlar((prev) => ({ ...prev, [tid]: "Tramer verileri istendi" }))
      setTimeout(() => setRobotDurumlar((prev) => ({ ...prev, [tid]: "Tramer verileri geldi" })), 4000)
      tarihceKaydiEkle(nextId, [
        { havuz: "Acente / İşlemdeki Talepler", durum: "Onaya gönderildi" },
        { havuz: "Bölge / Yeni Gelen Talepler", durum: "Sahiplenme bekliyor" },
      ], tarih)
      setActiveNav("talepler")
      setActiveTab("islemdeki")
    } else if (kullaniciTuru === "bolge") {
      setDinamikBanaAtanan((prev) => [yeniTalep, ...prev])
      tarihceKaydiEkle(nextId, [
        { havuz: "Bölge / Üzerimdeki Talepler", durum: "Bölge tarafından oluşturuldu" },
      ], tarih)
      setActiveNav("talepler")
      setActiveTab("uzerimdeki")
    } else {
      setOnayHavuzu((prev) => [{ ...data, id: nextId, olusturulmaTarihi: tarih, durum: "Onay Bekliyor" }, ...prev])
      tarihceKaydiEkle(nextId, [
        { havuz: "Genel Müdürlük / Onay Bekleyen Talepler", durum: "Onay bekliyor" },
      ], tarih)
      setActiveNav("kontrol-paneli")
    }
    setNextId((n) => n + 1)
    setView("list")
  }

  const handleMesajGonder = (m: Omit<Mesaj, "id">) => {
    setMesajlar((prev) => [...prev, { ...m, id: mesajNextId }])
    setMesajNextId((n) => n + 1)
  }

  const handleGMeAktar = (talep: Talep) => {
    if (gmAktarilanIds.has(talep.id)) return
    const tarih = simdi()
    setDinamikHavuz((prev) => prev.map((kayit) =>
      kayit.id === talep.id ? { ...kayit, sonGuncellemeTarihi: tarih } : kayit
    ))
    setDinamikBanaAtanan((prev) => prev.map((kayit) =>
      kayit.id === talep.id ? { ...kayit, sonGuncellemeTarihi: tarih } : kayit
    ))
    setAcenteIslemdekiTalepler((prev) => prev.map((kayit) =>
      kayit.id === talep.id ? { ...kayit, sonGuncellemeTarihi: tarih } : kayit
    ))
    setOnayHavuzu((prev) => [
      {
        id: talep.id,
        konu: talep.konu,
        oncelik: talep.oncelik,
        talepTipi: talep.formData?.talepTipi ?? "",
        brans: talep.formData?.brans ?? "",
        aracAdedi: talep.formData?.aracAdedi ?? "",
        eposta: talep.formData?.eposta ?? "",
        olusturulmaTarihi: tarih,
        durum: "Onay Bekliyor",
      },
      ...prev,
    ])
    setGmAktarilanIds((prev) => new Set([...prev, talep.id]))
    tarihceKaydiEkle(talep.id, [
      { havuz: "Bölge / GM'ye Gönderilen Talepler", durum: "Genel Müdürlüğe gönderildi" },
      { havuz: "Genel Müdürlük / Yeni Gelen Talepler", durum: "Sahiplenme bekliyor" },
    ], tarih)
  }

  const handleSahiplen = (talep: Talep) => {
    const tarih = simdi()
    setDinamikHavuz((prev) => prev.filter((kayit) => kayit.id !== talep.id))
    setDinamikBanaAtanan((prev) => {
      if (prev.some((kayit) => kayit.id === talep.id)) return prev
      return [{ ...talep, atanan: kullaniciAdi, sonGuncellemeTarihi: tarih }, ...prev]
    })
    tarihceKaydiEkle(talep.id, [
      { havuz: "Bölge / Üzerimdeki Talepler", durum: "Sahiplenildi" },
    ], tarih)
    setActiveTab("uzerimdeki")
  }

  const handleGMSahiplen = (talep: Talep) => {
    const tarih = simdi()
    setGmUzerimdekiTalepler((prev) => {
      if (prev.some((kayit) => kayit.id === talep.id)) return prev
      return [{ ...talep, atanan: kullaniciAdi, sonGuncellemeTarihi: tarih }, ...prev]
    })
    tarihceKaydiEkle(talep.id, [
      { havuz: "Genel Müdürlük / Üzerimdeki Talepler", durum: "Sahiplenildi" },
    ], tarih)
    setActiveTab("uzerimdeki")
  }

  const handleGMTeklifOlusturuldu = (talep: Talep) => {
    const tarih = simdi()
    const guncelTalep = { ...talep, sonGuncellemeTarihi: tarih }
    const acenteTalebiMi = acenteIslemdekiTalepler.some((kayit) => kayit.id === talep.id)
    setAcenteIslemdekiTalepler((prev) => prev.filter((kayit) => kayit.id !== talep.id))
    if (acenteTalebiMi) {
      setAcenteTamamlananTalepler((prev) =>
        prev.some((kayit) => kayit.id === talep.id) ? prev : [guncelTalep, ...prev]
      )
    }
    setDinamikHavuz((prev) => prev.filter((kayit) => kayit.id !== talep.id))
    setDinamikBanaAtanan((prev) => prev.filter((kayit) => kayit.id !== talep.id))
    setBolgeTamamlananTalepler((prev) =>
      prev.some((kayit) => kayit.id === talep.id) ? prev : [guncelTalep, ...prev]
    )
    setGmUzerimdekiTalepler((prev) => prev.filter((kayit) => kayit.id !== talep.id))
    setGmTamamlananTalepler((prev) => {
      if (prev.some((kayit) => kayit.id === talep.id)) return prev
      return [guncelTalep, ...prev]
    })
    tarihceKaydiEkle(talep.id, [
      { havuz: "Genel Müdürlük / Tamamlanan Talepler", durum: "Sözleşme teklifi oluşturuldu" },
    ], tarih)
    setActiveTab("tamamlanan")
  }

  const handleDurumGuncelle = (id: number, durum: OnayKaydi["durum"]) => {
    setOnayHavuzu((prev) => prev.map((k) => k.id === id ? { ...k, durum } : k))
  }

  const onayBekleyenSayi = onayHavuzu.filter((k) => k.durum === "Onay Bekliyor").length

  const standartTabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "talepler", label: "Talepler" },
    { id: "bana-atananlar", label: "Bana Atananlar" },
    { id: "havuzdaki", label: "Havuzdaki Talepler" },
  ]

  const acenteTabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "taslak", label: "Taslak Talepler" },
    { id: "islemdeki", label: "İşlemdeki Talepler", badge: acenteIslemdekiTalepler.length || undefined },
    { id: "tamamlanan", label: "Tamamlanan Talepler", badge: acenteTamamlananTalepler.length || undefined },
    { id: "reddedilen", label: "Reddedilen Talepler" },
  ]

  const bolgeTabs: { id: Tab; label: string; badge?: number }[] = [
    {
      id: "yeni-gelen",
      label: "Yeni Gelen Talepler",
      badge: dinamikHavuz.filter((talep) => !gmAktarilanIds.has(talep.id)).length || undefined,
    },
    {
      id: "uzerimdeki",
      label: "Üzerimdeki Talepler",
      badge: dinamikBanaAtanan.filter((talep) => !gmAktarilanIds.has(talep.id)).length || undefined,
    },
    {
      id: "gmye-gonderilen",
      label: "GM'ye Gönderilen Talepler",
      badge: gmAktarilanIds.size || undefined,
    },
    { id: "tamamlanan", label: "Tamamlanan Talepler", badge: bolgeTamamlananTalepler.length || undefined },
  ]

  const gmTabs: { id: Tab; label: string; badge?: number }[] = [
    {
      id: "yeni-gelen",
      label: "Yeni Gelen Talepler",
      badge: Math.max(0, gmAktarilanIds.size - gmUzerimdekiTalepler.length - gmTeklifOlusturulanTalepler.length - gmTamamlananTalepler.length) || undefined,
    },
    { id: "uzerimdeki", label: "Üzerimdeki Talepler", badge: gmUzerimdekiTalepler.length || undefined },
    { id: "bilgi-bekleyen", label: "Bilgi Bekleyen Talepler" },
    { id: "onay-bekleyen", label: "Onay Bekleyen Talepler" },
    {
      id: "teklif-olusturulan",
      label: "Teklif Oluşturulan Talepler",
      badge: gmTeklifOlusturulanTalepler.length || undefined,
    },
    { id: "tamamlanan", label: "Tamamlanan Talepler", badge: gmTamamlananTalepler.length || undefined },
  ]

  const tabs =
    kullaniciTuru === "acente" ? acenteTabs :
    kullaniciTuru === "bolge" ? bolgeTabs :
    kullaniciTuru === "gm" ? gmTabs :
    standartTabs

  const acenteHavuzAciklamalari: Partial<Record<Tab, string>> = {
    taslak: "Henüz gönderimi tamamlanmamış talepler",
    islemdeki: "Bölge veya Genel Müdürlük tarafından değerlendirilen talepler",
    tamamlanan: "Teklif oluşturulmuş ve süreci tamamlanmış talepler",
    reddedilen: "Red ile sonuçlanan talepler",
  }

  const bolgeHavuzAciklamalari: Partial<Record<Tab, string>> = {
    "yeni-gelen": "Acenteler tarafından gönderilen ve henüz sahiplenilmemiş talepler",
    uzerimdeki: "Tarafınızdan sahiplenilmiş ve değerlendirmesi devam eden talepler",
    "gmye-gonderilen": "Genel Müdürlük değerlendirmesine aktardığınız talepler",
    tamamlanan: "Süreci tamamlanan talepler",
  }

  const gmHavuzAciklamalari: Partial<Record<Tab, string>> = {
    "yeni-gelen": "Bölge tarafından gönderilen ve henüz sahiplenilmemiş talepler",
    uzerimdeki: "Tarafınızdan sahiplenilmiş ve değerlendirmesi devam eden talepler",
    "bilgi-bekleyen": "Acente veya Bölgeden ek bilgi beklenen talepler",
    "onay-bekleyen": "Yönetici veya ikinci onay gerektiren talepler",
    "teklif-olusturulan": "Üretim sistemine başarıyla aktarılan talepler",
    tamamlanan: "Süreci tamamlanan talepler",
  }

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    {
      id: "kontrol-paneli",
      label: "Kontrol Paneli",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "filo-yonetim",
      label: "Filo Üretim Süreci",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 17h18M5 17l1.5-7h11L19 17M8 10l1-3h6l1 3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
        </svg>
      ),
    },
    {
      id: "talepler",
      label: "Filo Yönetim Süreci",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  const tumBolgeTalepleri = [...dinamikHavuz, ...dinamikBanaAtanan]
  const gmyeGonderilenTalepler = tumBolgeTalepleri.filter((talep, index, talepler) =>
    gmAktarilanIds.has(talep.id) && talepler.findIndex((kayit) => kayit.id === talep.id) === index
  )
  const gmIslemeAlinanIds = new Set([
    ...gmUzerimdekiTalepler.map((talep) => talep.id),
    ...gmTeklifOlusturulanTalepler.map((talep) => talep.id),
    ...gmTamamlananTalepler.map((talep) => talep.id),
  ])
  const gmYeniGelenTalepler = gmyeGonderilenTalepler.filter((talep) => !gmIslemeAlinanIds.has(talep.id))

  const tableData =
    kullaniciTuru === "acente" && activeTab === "islemdeki" ? acenteIslemdekiTalepler :
    kullaniciTuru === "acente" && activeTab === "tamamlanan" ? acenteTamamlananTalepler :
    kullaniciTuru === "acente" && ["taslak", "reddedilen"].includes(activeTab) ? [] :
    kullaniciTuru === "bolge" && activeTab === "yeni-gelen" ? dinamikHavuz.filter((talep) => !gmAktarilanIds.has(talep.id)) :
    kullaniciTuru === "bolge" && activeTab === "uzerimdeki" ? dinamikBanaAtanan.filter((talep) => !gmAktarilanIds.has(talep.id)) :
    kullaniciTuru === "bolge" && activeTab === "gmye-gonderilen" ? gmyeGonderilenTalepler :
    kullaniciTuru === "bolge" && activeTab === "tamamlanan" ? bolgeTamamlananTalepler :
    kullaniciTuru === "gm" && activeTab === "yeni-gelen" ? gmYeniGelenTalepler :
    kullaniciTuru === "gm" && activeTab === "uzerimdeki" ? gmUzerimdekiTalepler :
    kullaniciTuru === "gm" && activeTab === "teklif-olusturulan" ? gmTeklifOlusturulanTalepler :
    kullaniciTuru === "gm" && activeTab === "tamamlanan" ? gmTamamlananTalepler :
    kullaniciTuru === "gm" && ["bilgi-bekleyen", "onay-bekleyen"].includes(activeTab) ? [] :
    activeTab === "talepler" ? taleplerData :
    activeTab === "havuzdaki" ? [...dinamikHavuz, ...havuzData] :
    activeTab === "bana-atananlar" ? dinamikBanaAtanan :
    []

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-lg">A</div>
            <span className="text-blue-600 font-bold text-lg tracking-wide">AstraFilo</span>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-gray-100">
          <button
            onClick={() => setView("create")}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-3 py-2.5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Filo Talebi Oluştur
          </button>
        </div>

        <nav className="flex-1 py-3 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setView("list") }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                activeNav === item.id && view === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === "kontrol-paneli" && onayBekleyenSayi > 0 && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-400 text-white text-xs font-bold">
                  {onayBekleyenSayi}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-gray-900">
            {view === "create"
              ? "Yeni Filo Talebi"
              : activeNav === "kontrol-paneli"
                ? "Kontrol Paneli"
                : activeNav === "filo-yonetim"
                  ? "Filo Üretim Süreci"
                  : "Filo Yönetim Süreci"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-gray-600 border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-50">TR</button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {kullaniciAdi[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{kullaniciAdi}</span>
              <button
                onClick={handleCikis}
                title="Çıkış Yap"
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        {view === "create" ? (
          <TalepOlusturPage onBack={() => setView("list")} onSubmit={handleOnayGonder} />
        ) : activeNav === "kontrol-paneli" ? (
          <KontrolPaneli onayHavuzu={onayHavuzu} onDurumGuncelle={handleDurumGuncelle} />
        ) : activeNav === "filo-yonetim" ? (
          <FiloUretimPage />
        ) : (
          <main className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex justify-end gap-2 mb-4">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                EXCEL&apos;E AKTAR
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                YENİLE
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.828V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.172a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                FİLTRELER
              </button>
              <button className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                İPTAL
              </button>
            </div>
            <div className="flex gap-0 border-b border-gray-200 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {kullaniciTuru === "acente" && acenteHavuzAciklamalari[activeTab] && (
              <div className="flex items-center gap-2 mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5m0-8h.01" strokeLinecap="round" />
                </svg>
                {acenteHavuzAciklamalari[activeTab]}
              </div>
            )}
            {kullaniciTuru === "bolge" && bolgeHavuzAciklamalari[activeTab] && (
              <div className="flex items-center gap-2 mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5m0-8h.01" strokeLinecap="round" />
                </svg>
                {bolgeHavuzAciklamalari[activeTab]}
              </div>
            )}
            {kullaniciTuru === "gm" && gmHavuzAciklamalari[activeTab] && (
              <div className="flex items-center gap-2 mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5m0-8h.01" strokeLinecap="round" />
                </svg>
                {gmHavuzAciklamalari[activeTab]}
              </div>
            )}
            <TalepTable
              data={tableData}
              onRowClick={setSelectedTalep}
              onSahiplen={
                kullaniciTuru === "bolge" && activeTab === "yeni-gelen" ? handleSahiplen :
                kullaniciTuru === "gm" && activeTab === "yeni-gelen" ? handleGMSahiplen :
                undefined
              }
              onGMeAktar={kullaniciTuru === "bolge" && (activeTab === "yeni-gelen" || activeTab === "uzerimdeki") ? handleGMeAktar : undefined}
              onTeklifOlusturuldu={kullaniciTuru === "gm" ? handleGMTeklifOlusturuldu : undefined}
              teklifOlusturabilir={kullaniciTuru === "gm" && activeTab === "uzerimdeki"}
              gmAktarilanIds={gmAktarilanIds}
              kullaniciTuru={kullaniciTuru}
              robotDurumlar={robotDurumlar}
              onTramerTikla={kullaniciTuru === "gm" ? setTramerSayfasiTalep : undefined}
            />
          </main>
        )}
      </div>

      {tramerSayfasiTalep && (
        <TramerSayfasi
          talepKonu={tramerSayfasiTalep.konu}
          onKapat={() => setTramerSayfasiTalep(null)}
        />
      )}

      {selectedTalep && (
        <TalepDetayModal
          talep={selectedTalep}
          onClose={() => setSelectedTalep(null)}
          kullaniciTuru={kullaniciTuru}
          kullaniciAdi={kullaniciAdi}
          mesajlar={mesajlar}
          tarihce={talepTarihcesi.filter((kayit) => kayit.talepId === selectedTalep.id)}
          onMesajGonder={handleMesajGonder}
        />
      )}
    </div>
  )
}
