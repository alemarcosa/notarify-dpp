import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Ensure Users exist
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const editorPassword = await bcrypt.hash('Editor123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@notarify.io' },
    update: {},
    create: {
      email: 'admin@notarify.io',
      passwordHash: adminPassword,
      firstName: 'Marco',
      lastName: 'Rossi',
      role: 'ADMIN',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@notarify.io' },
    update: {},
    create: {
      email: 'editor@notarify.io',
      passwordHash: editorPassword,
      firstName: 'Elena',
      lastName: 'Bianchi',
      role: 'EDITOR',
    },
  });

  console.log(`👤 Users seeded: ${admin.email} (Admin), ${editor.email} (Editor)`);

  // 2. Sample Products with full nested relations
  const products = [
    {
      name: 'Milano Artisan Handbag',
      sku: 'LUX-MIL-001',
      serialNumber: 'SN-IT-2024-0098',
      category: 'Fashion & Luxury',
      description:
        'Handcrafted vegetable-tanned full-grain calfskin leather bag made in Florence by master artisans. Certified zero toxic chemical finishing with recyclable brass alloy accents.',
      countryOfOrigin: 'Italy',
      productionDate: new Date('2024-03-15'),
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      materials: [
        { name: 'Vegetable-Tanned Calfskin Leather', percentage: 88, countryOfOrigin: 'Italy', recyclable: true },
        { name: 'Solid Brass Buckles', percentage: 8, countryOfOrigin: 'Italy', recyclable: true },
        { name: 'Organic Cotton Inner Lining', percentage: 4, countryOfOrigin: 'Portugal', recyclable: true },
      ],
      sustainability: {
        carbonFootprint: 18.4,
        waterConsumption: 95.0,
        recycledMaterialPercentage: 15,
        repairabilityScore: 9,
        recyclable: true,
      },
      certifications: [
        {
          name: 'Leather Working Group (Gold Rated)',
          issuingAuthority: 'LWG Auditing Protocol',
          issueDate: new Date('2023-09-01'),
          expirationDate: new Date('2026-09-01'),
        },
        {
          name: 'OEKO-TEX Standard 100',
          issuingAuthority: 'OEKO-TEX International',
          issueDate: new Date('2024-01-10'),
          expirationDate: new Date('2025-01-10'),
        },
      ],
      documents: [
        { title: 'Leather Care & Maintenance Guide', type: 'USER_MANUAL' as const },
        { title: 'Lifetime Craftsmanship Warranty', type: 'WARRANTY' as const },
      ],
      isPublished: true,
    },
    {
      name: 'Eco-Smart Merino Wool Knitwear',
      sku: 'TEX-ECO-002',
      serialNumber: 'SN-PT-2024-4412',
      category: 'Textiles',
      description:
        'Zero-waste seamlessly 3D-knitted pullover using 100% regenerated merino wool fibers. Closed-loop water washing cycle and undyed botanical pigments.',
      countryOfOrigin: 'Portugal',
      productionDate: new Date('2024-05-10'),
      status: 'PUBLISHED' as const,
      createdById: editor.id,
      materials: [
        { name: 'Post-Consumer Regenerated Merino Wool', percentage: 95, countryOfOrigin: 'Portugal', recyclable: true },
        { name: 'Natural Natural-Rubber Elastic Hem', percentage: 5, countryOfOrigin: 'Spain', recyclable: true },
      ],
      sustainability: {
        carbonFootprint: 4.8,
        waterConsumption: 18.5,
        recycledMaterialPercentage: 95,
        repairabilityScore: 10,
        recyclable: true,
      },
      certifications: [
        {
          name: 'Global Recycled Standard (GRS)',
          issuingAuthority: 'Textile Exchange',
          issueDate: new Date('2023-11-15'),
          expirationDate: new Date('2025-11-15'),
        },
        {
          name: 'Cradle to Cradle Certified (Silver)',
          issuingAuthority: 'C2CPII',
          issueDate: new Date('2024-02-01'),
          expirationDate: new Date('2026-02-01'),
        },
      ],
      documents: [
        { title: 'Care & Washing Instructions', type: 'USER_MANUAL' as const },
      ],
      isPublished: true,
    },
    {
      name: 'Aethelgard Automatic Chronograph',
      sku: 'WAT-CHRO-003',
      serialNumber: 'SN-CH-7788-001',
      category: 'Watches & Jewelry',
      description:
        'Swiss-assembled automatic precision timepiece with recycled surgical stainless steel casing and sapphire crystal. Fully modular caliber designed for 50+ year serviceability.',
      countryOfOrigin: 'Switzerland',
      productionDate: new Date('2024-01-20'),
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      materials: [
        { name: 'Recycled 316L Surgical Stainless Steel', percentage: 72, countryOfOrigin: 'Germany', recyclable: true },
        { name: 'Synthetic Sapphire Crystal', percentage: 12, countryOfOrigin: 'Switzerland', recyclable: false },
        { name: 'Brass & Nickel Movement Components', percentage: 16, countryOfOrigin: 'Switzerland', recyclable: true },
      ],
      sustainability: {
        carbonFootprint: 12.2,
        waterConsumption: 42.0,
        recycledMaterialPercentage: 70,
        repairabilityScore: 10,
        recyclable: true,
      },
      certifications: [
        {
          name: 'COSC Chronometer Certification',
          issuingAuthority: 'Contrôle Officiel Suisse des Chronomètres',
          issueDate: new Date('2024-01-15'),
          expirationDate: null,
        },
        {
          name: 'Responsible Jewellery Council (RJC)',
          issuingAuthority: 'RJC International',
          issueDate: new Date('2023-06-10'),
          expirationDate: new Date('2026-06-10'),
        },
      ],
      documents: [
        { title: 'Chronograph Operating Manual', type: 'USER_MANUAL' as const },
        { title: '10-Year International Movement Warranty', type: 'WARRANTY' as const },
        { title: 'Caliber Technical Datasheet', type: 'TECHNICAL_DATASHEET' as const },
      ],
      isPublished: true,
    },
    {
      name: 'Nordic Oak Minimalist Lounge Chair',
      sku: 'FUR-NOK-004',
      serialNumber: 'SN-DK-2024-1102',
      category: 'Furniture',
      description:
        'Ergonomic lounge chair crafted from FSC-certified European solid white oak with non-toxic water-based matte lacquer. Flat-pack design assembled with disassemblable wooden joints.',
      countryOfOrigin: 'Denmark',
      productionDate: new Date('2024-04-02'),
      status: 'DRAFT' as const,
      createdById: editor.id,
      materials: [
        { name: 'FSC Solid White Oak', percentage: 85, countryOfOrigin: 'Denmark', recyclable: true },
        { name: 'Natural Latex Cushioning', percentage: 10, countryOfOrigin: 'Germany', recyclable: true },
        { name: 'Hemp Fabric Upholstery', percentage: 5, countryOfOrigin: 'France', recyclable: true },
      ],
      sustainability: {
        carbonFootprint: 22.0,
        waterConsumption: 35.0,
        recycledMaterialPercentage: 20,
        repairabilityScore: 9,
        recyclable: true,
      },
      certifications: [
        {
          name: 'FSC 100% Forest Stewardship',
          issuingAuthority: 'Forest Stewardship Council',
          issueDate: new Date('2023-08-12'),
          expirationDate: new Date('2027-08-12'),
        },
      ],
      documents: [
        { title: 'Assembly & Disassembly Guide', type: 'USER_MANUAL' as const },
      ],
      isPublished: false,
    },
    {
      name: 'Bio-Active Botanical Face Serum',
      sku: 'COS-BIO-005',
      serialNumber: 'SN-FR-2024-8831',
      category: 'Cosmetics',
      description:
        'Cold-pressed botanical serum packaged in 100% infinite-recyclable amber glass with ocean-bound plastic dropper pump. Vegan, cruelty-free, COSMOS Organic certified.',
      countryOfOrigin: 'France',
      productionDate: new Date('2024-06-01'),
      status: 'DRAFT' as const,
      createdById: admin.id,
      materials: [
        { name: 'Organic Cold-Pressed Plant Oils', percentage: 70, countryOfOrigin: 'France', recyclable: true },
        { name: 'Amber Borosilicate Glass Bottle', percentage: 25, countryOfOrigin: 'Germany', recyclable: true },
        { name: 'Post-Consumer Recycled Polymer Dropper', percentage: 5, countryOfOrigin: 'Italy', recyclable: true },
      ],
      sustainability: {
        carbonFootprint: 1.8,
        waterConsumption: 8.0,
        recycledMaterialPercentage: 30,
        repairabilityScore: 3,
        recyclable: true,
      },
      certifications: [
        {
          name: 'COSMOS Organic Standard',
          issuingAuthority: 'Ecocert Greenlife',
          issueDate: new Date('2024-03-01'),
          expirationDate: new Date('2025-03-01'),
        },
      ],
      documents: [
        { title: 'Safety Assessment & Ingredient Datasheet', type: 'TECHNICAL_DATASHEET' as const },
      ],
      isPublished: false,
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existing) {
      console.log(`ℹ️ Product ${p.sku} already exists, skipping.`);
      continue;
    }

    const { materials, sustainability, certifications, documents, isPublished, ...productData } = p;

    // Create placeholder dummy file uploads for documents so FKs are valid
    const createdDocs = [];
    for (const doc of documents) {
      const fileRecord = await prisma.fileUpload.create({
        data: {
          originalName: `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`,
          storagePath: `uploads/sample/${doc.type.toLowerCase()}.pdf`,
          mimeType: 'application/pdf',
          sizeBytes: 1024 * 350,
        },
      });
      createdDocs.push({
        title: doc.title,
        type: doc.type,
        fileId: fileRecord.id,
      });
    }

    // Create sample product
    const product = await prisma.product.create({
      data: {
        ...productData,
        materials: {
          create: materials.map((m, idx) => ({ ...m, sortOrder: idx })),
        },
        sustainability: {
          create: sustainability,
        },
        certifications: {
          create: certifications.map((c) => ({
            name: c.name,
            issuingAuthority: c.issuingAuthority,
            issueDate: c.issueDate,
            expirationDate: c.expirationDate,
          })),
        },
        documents: {
          create: createdDocs,
        },
      },
    });

    console.log(`✅ Created product: ${product.name} [${product.sku}]`);

    if (isPublished) {
      const passportUuid = uuidv4();
      const passport = await prisma.productPassport.create({
        data: {
          productId: product.id,
          passportUuid,
          version: 1,
          qrCodePath: `uploads/qrcodes/${passportUuid}.png`,
          status: 'ACTIVE',
          publishedAt: new Date(),
        },
      });

      // Seed realistic scan events spread across last 14 days
      const browsers = ['Google Chrome', 'Apple Safari', 'Mozilla Firefox', 'Microsoft Edge'];
      const oss = ['iOS', 'Android', 'macOS', 'Windows'];
      const countries = ['Italy', 'Germany', 'France', 'United States', 'Switzerland', 'United Kingdom'];

      const scanRecords = [];
      const numScans = Math.floor(Math.random() * 25) + 15; // 15 to 40 scans per product

      for (let s = 0; s < numScans; s++) {
        const daysAgo = Math.floor(Math.random() * 14);
        const hoursAgo = Math.floor(Math.random() * 24);
        const date = new Date(Date.now() - (daysAgo * 86400000 + hoursAgo * 3600000));

        scanRecords.push({
          passportId: passport.id,
          scannedAt: date,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          operatingSystem: oss[Math.floor(Math.random() * oss.length)],
          browserLanguage: 'en-US,en;q=0.9,it;q=0.8',
          country: countries[Math.floor(Math.random() * countries.length)],
        });
      }

      await prisma.scanEvent.createMany({ data: scanRecords });
      console.log(`   📱 Passport created with UUID: ${passportUuid} (${numScans} scans)`);
    }
  }

  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
