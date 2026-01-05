
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding mock data...')

    // 1. Create Default Agent
    const agent = await prisma.agent.upsert({
        where: { email: 'demo@emlakpusulasi.com' },
        update: {},
        create: {
            email: 'demo@emlakpusulasi.com',
            name: 'Emre Emlak',
            password: await require('bcryptjs').hash('demo123456', 10),
            role: 'user',
        },
    })

    // 1b. Create Admin Agent
    const admin = await prisma.agent.upsert({
        where: { email: 'coksoyluemre@gmail.com' },
        update: { role: 'admin' },
        create: {
            email: 'coksoyluemre@gmail.com',
            name: 'Emre Çoksoylu',
            password: await require('bcryptjs').hash('5212emre', 10),
            role: 'admin',
        },
    })

    // 1c. Create More Agents
    const agents = [
        { email: 'ayse.emlak@example.com', name: 'Ayşe Kaya', password: await require('bcryptjs').hash('demo123', 10), role: 'user' },
        { email: 'mehmet.danisman@example.com', name: 'Mehmet Demir', password: await require('bcryptjs').hash('demo123', 10), role: 'user' },
    ]

    for (const a of agents) {
        await prisma.agent.upsert({
            where: { email: a.email },
            update: {},
            create: a,
        })
    }

    console.log('Additional agents created.')

    // 2. Create Customers
    const customers = [
        { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '0555 111 22 33', status: 'active', notes: '3+1 daire arıyor, bütçe 5M' },
        { name: 'Ayşe Demir', email: 'ayse@example.com', phone: '0532 999 88 77', status: 'lead', notes: 'Yatırımlık dükkan bakıyor' },
        { name: 'Mehmet Öz', phone: '0544 444 55 66', status: 'buyer', notes: 'Kredi işlemleri bekleniyor' },
        { name: 'Zeynep Kaya', email: 'zeynep@example.com', status: 'seller', notes: 'Etilerdeki dairesini satmak istiyor' },
        { name: 'Ali Vural', status: 'closed', notes: 'Satış tamamlandı, tapu devredildi.' },
        { name: 'Canan Sarı', status: 'closed', notes: 'Vazgeçti.' },
        { name: 'Murat Aydın', email: 'murat@example.com', phone: '0533 222 11 00', status: 'active', notes: 'Kiralık villa bakıyor, bütçe 100K' },
        { name: 'Selin Yıldız', email: 'selin@example.com', status: 'lead', notes: 'Yatırım için ticari mülk sordu.' },
        { name: 'Hakan Demir', phone: '0542 333 44 55', status: 'buyer', notes: 'Beşiktaş tarafında 2+1 bakıyor.' },
    ]

    for (const c of customers) {
        await prisma.customer.create({
            data: {
                ...c,
                agentId: agent.id,
            },
        })
    }

    console.log('Customers created.')

    // 3. Create Listings
    const listings = [
        {
            title: 'Beşiktaş Merkezde Yenilenmiş 3+1 Lüks Daire',
            price: '12.500.000',
            location: 'Beşiktaş, İstanbul',
            description: 'Tamamen tadilatlı, masrafsız, metroya 5dk yürüme mesafesinde harika bir daire. Yatırım değeri yüksek.',
            features: 'Kombi,Parke Zemin,Çelik Kapı,Duşakabin',
            m2Gross: 145,
            m2Net: 120,
            roomCount: '3+1',
            buildingAge: '21+',
            floorLocation: '3. Kat',
            heatingType: 'Kombi',
            bathroomCount: 2,
            balcony: true,
            furnished: false,
            usageStatus: 'Boş',
            dues: 750,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        },
        {
            title: 'Kadıköy Moda Sahilde 2+1 Deniz Manzaralı',
            price: '18.000.000',
            location: 'Kadıköy, İstanbul',
            description: 'Moda sahiline sıfır, eşsiz manzaralı, geniş balkonlu ferah daire.',
            features: 'Deniz Manzarası,Balkon,Asansör,Otopark',
            m2Gross: 110,
            m2Net: 95,
            roomCount: '2+1',
            buildingAge: '11-20',
            floorLocation: '5. Kat',
            heatingType: 'Merkezi',
            bathroomCount: 1,
            balcony: true,
            furnished: true,
            usageStatus: 'Mülk Sahibi',
            dues: 1500,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        },
        {
            title: 'Ataşehir Finans Merkezi Yakını Stüdyo',
            price: '4.200.000',
            location: 'Ataşehir, İstanbul',
            description: 'Yüksek kira getirili, site içerisinde güvenlikli ve havuzlu stüdyo daire.',
            features: 'Güvenlik,Havuz,Spor Salonu',
            m2Gross: 55,
            m2Net: 45,
            roomCount: 'Studio',
            buildingAge: '1-5',
            floorLocation: '12. Kat',
            heatingType: 'Merkezi Pay Ölçer',
            bathroomCount: 1,
            balcony: false,
            furnished: true,
            usageStatus: 'Kiracılı',
            dues: 2000,
            creditSuitable: false,
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        },
        {
            title: 'Sarıyer Zekeriyaköyde Müstakil Villa',
            price: '45.000.000',
            location: 'Sarıyer, İstanbul',
            description: 'Ormanla iç içe, 5+2, özel havuzlu ve geniş bahçeli tam müstakil villa.',
            features: 'Havuz,Bahçe,Şömine,Güvenlik,Otopark',
            m2Gross: 450,
            m2Net: 380,
            roomCount: '5+2',
            buildingAge: '5-10',
            floorLocation: 'Bahçe Dubleks',
            heatingType: 'Yerden',
            bathroomCount: 4,
            balcony: true,
            furnished: false,
            usageStatus: 'Boş',
            dues: 5000,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        },
        {
            title: 'Beykoz Konaklarında Satılık 6+2 Özel Villa',
            price: '85.000.000',
            location: 'Beykoz, İstanbul',
            description: 'Beykoz Konakları içerisinde, orman manzaralı, asansörlü ve akıllı ev sistemli.',
            features: 'Asansör,Akıllı Ev,Orman Manzarası,Havuz',
            m2Gross: 650,
            m2Net: 550,
            roomCount: '6+2',
            buildingAge: '11-20',
            floorLocation: 'Müstakil',
            heatingType: 'Yerden Isıtma',
            bathroomCount: 6,
            balcony: true,
            furnished: false,
            usageStatus: 'Boş',
            dues: 7500,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
        },
        {
            title: 'Kadıköy Bağdat Caddesi Yakını 4+1 Sıfır Daire',
            price: '28.000.000',
            location: 'Erenköy, İstanbul',
            description: 'Bağdat caddesine 2. parselde, sıfır bina, geniş balkonlu ve kapalı otoparklı.',
            features: 'Kapalı Otopark,Geniş Balkon,Ebeveyn Banyosu',
            m2Gross: 185,
            m2Net: 160,
            roomCount: '4+1',
            buildingAge: '0 (Sıfır)',
            floorLocation: '8. Kat',
            heatingType: 'Merkezi (Pay Ölçer)',
            bathroomCount: 2,
            balcony: true,
            furnished: false,
            usageStatus: 'Boş',
            dues: 1200,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f09f0a2901?w=800&q=80',
        },
        {
            title: 'Şişli Bomontide Kiralık Lux Residence 1+1',
            price: '65.000',
            location: 'Bomonti, İstanbul',
            description: 'Anthill Residence içerisinde, Hilton manzaralı, full eşyalı ve lüks dekorasyonlu.',
            features: 'Spor Salonu,Resepsiyon,Vale,Eşyalı',
            m2Gross: 85,
            m2Net: 70,
            roomCount: '1+1',
            buildingAge: '5-10',
            floorLocation: '25. Kat',
            heatingType: 'Merkezi (Pay Ölçer)',
            bathroomCount: 1,
            balcony: false,
            furnished: true,
            usageStatus: 'Boş',
            dues: 4500,
            creditSuitable: true,
            imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        }
    ]

    for (const l of listings) {
        await prisma.listing.create({
            data: {
                ...l,
                source: 'Internal',
                agentId: agent.id,
            },
        })
    }

    console.log('Listings created.')

    // 4. Create Mock Error Reports
    const reports = [
        {
            title: 'Resim Yükleme Hatası',
            description: 'İlan eklerken 5MB üzeri resimlerde hata alıyorum. Sayfa yanıt vermiyor.',
            status: 'open',
            agentEmail: 'demo@emlakpusulasi.com'
        },
        {
            title: 'Müşteri Kaydı Silinemiyor',
            description: 'Eski bir müşteriyi silmek istediğimde "Veritabanı hatası" uyarısı çıkıyor.',
            status: 'in-progress',
            agentEmail: 'ayse.emlak@example.com'
        },
        {
            title: 'Sözleşme PDF Çıkartma Sorunu',
            description: 'Kira sözleşmesini PDF olarak kaydet dediğimde Türkçe karakterler bozuk çıkıyor.',
            status: 'resolved',
            agentEmail: 'demo@emlakpusulasi.com'
        },
        {
            title: 'Dashboard Yükleme Hızı',
            description: 'İlan sayım 50yi geçince dashboard çok yavaş açılmaya başladı.',
            status: 'open',
            agentEmail: 'mehmet.danisman@example.com'
        }
    ]

    for (const r of reports) {
        const reporter = await prisma.agent.findUnique({ where: { email: r.agentEmail } })
        if (reporter) {
            await (prisma as any).errorReport.create({
                data: {
                    title: r.title,
                    description: r.description,
                    status: r.status,
                    agentId: reporter.id
                }
            })
        }
    }

    console.log('Mock error reports created.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
