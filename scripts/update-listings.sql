-- Mevcut ilanların priceNumeric alanını doldur
UPDATE "Listing"
SET "priceNumeric" = CAST(REGEXP_REPLACE(price, '[^0-9.]', '', 'g') AS DECIMAL)
WHERE "priceNumeric" IS NULL AND price IS NOT NULL;

-- Test için örnek ilanlar ekle (eğer yoksa)
INSERT INTO "Listing" (id, title, description, price, "priceNumeric", location, features, "imageUrl", status, source, "roomCount", "agentId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Beşiktaş 3+1 Kiralık Daire',
    'Deniz manzaralı, yeni binada 3+1 daire',
    '15.000.000',
    15000000,
    'Beşiktaş, İstanbul',
    'Asansör, Otopark, Güvenlik',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'active',
    'Internal',
    '3+1',
    (SELECT id FROM "Agent" LIMIT 1),
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Listing" WHERE title = 'Beşiktaş 3+1 Kiralık Daire');

INSERT INTO "Listing" (id, title, description, price, "priceNumeric", location, features, "imageUrl", status, source, "roomCount", "agentId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Şişli 2+1 Satılık Daire',
    'Metro yakını, merkezi konumda 2+1',
    '8.500.000',
    8500000,
    'Şişli, İstanbul',
    'Asansör, Balkon',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'active',
    'Internal',
    '2+1',
    (SELECT id FROM "Agent" LIMIT 1),
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Listing" WHERE title = 'Şişli 2+1 Satılık Daire');

INSERT INTO "Listing" (id, title, description, price, "priceNumeric", location, features, "imageUrl", status, source, "roomCount", "agentId", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    'Kadıköy 3+1 Lüks Daire',
    'Denize sıfır, lüks rezidans',
    '18.000.000',
    18000000,
    'Kadıköy, İstanbul',
    'Havuz, Spor Salonu, Güvenlik',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'active',
    'Internal',
    '3+1',
    (SELECT id FROM "Agent" LIMIT 1),
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Listing" WHERE title = 'Kadıköy 3+1 Lüks Daire');
