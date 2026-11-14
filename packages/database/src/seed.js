"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const client_1 = require("./client");
const common_1 = require("@ecommerce/common");
/**
 * Database seeder class populating initial categories, products, users, and competitor records.
 */
class DatabaseSeeder {
    prisma = client_1.DatabaseConnection.getInstance();
    passwordHasher = new common_1.PasswordHasher();
    /**
     * Runs the complete seeding routine.
     */
    async seed() {
        const adminPasswordHash = await this.passwordHasher.hash('Admin123!');
        const customerPasswordHash = await this.passwordHasher.hash('Customer123!');
        await this.prisma.user.upsert({
            where: { email: 'admin@kromacommerce.com' },
            update: {},
            create: {
                email: 'admin@kromacommerce.com',
                name: 'System Administrator',
                passwordHash: adminPasswordHash,
                role: 'ADMIN'
            }
        });
        await this.prisma.user.upsert({
            where: { email: 'customer@kromacommerce.com' },
            update: {},
            create: {
                email: 'customer@kromacommerce.com',
                name: 'Alex Johnson',
                passwordHash: customerPasswordHash,
                role: 'CUSTOMER'
            }
        });
        const electronicsCat = await this.prisma.category.upsert({
            where: { slug: 'electronics' },
            update: {},
            create: {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Next-generation electronic devices and hardware.'
            }
        });
        const audioCat = await this.prisma.category.upsert({
            where: { slug: 'audio' },
            update: {},
            create: {
                name: 'Audio',
                slug: 'audio',
                description: 'Studio-grade audio gear and headphones.'
            }
        });
        const wearablesCat = await this.prisma.category.upsert({
            where: { slug: 'wearables' },
            update: {},
            create: {
                name: 'Wearables',
                slug: 'wearables',
                description: 'Smart wearables and health tracking devices.'
            }
        });
        const accessoriesCat = await this.prisma.category.upsert({
            where: { slug: 'accessories' },
            update: {},
            create: {
                name: 'Accessories',
                slug: 'accessories',
                description: 'Essential ergonomic and daily desk accessories.'
            }
        });
        const sampleProducts = [
            {
                name: 'Kroma Noise-Cancelling Wireless Headphones',
                slug: 'kroma-noise-cancelling-headphones',
                description: 'Industry-leading active noise cancellation with 40-hour battery life and studio acoustic balance.',
                price: 199.99,
                inventoryCount: 45,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                categoryId: audioCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/headphones',
                competitorPrice: 229.99
            },
            {
                name: 'Kroma Ultra 4K IPS Gaming Monitor',
                slug: 'kroma-ultra-4k-monitor',
                description: 'Stunning 32-inch 4K UHD display with 144Hz refresh rate, HDR600, and 99% sRGB color accuracy.',
                price: 349.99,
                inventoryCount: 20,
                imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
                categoryId: electronicsCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/monitor',
                competitorPrice: 389.99
            },
            {
                name: 'Kroma Mechanical Wireless Keyboard',
                slug: 'kroma-mechanical-keyboard',
                description: 'Custom hot-swappable tactile switches, CNC aluminum chassis, and low-latency tri-mode connectivity.',
                price: 129.99,
                inventoryCount: 60,
                imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
                categoryId: accessoriesCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/keyboard',
                competitorPrice: 149.99
            },
            {
                name: 'Kroma Precision Optical Mouse',
                slug: 'kroma-precision-optical-mouse',
                description: 'Ultralight 58-gram honeycomb construction with 26K DPI optical sensor and PTFE glide feet.',
                price: 79.99,
                inventoryCount: 85,
                imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
                categoryId: accessoriesCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/mouse',
                competitorPrice: 89.99
            },
            {
                name: 'Kroma Smartwatch Titanium Edition',
                slug: 'kroma-smartwatch-titanium',
                description: 'Grade-5 titanium case, AMOLED sapphire crystal display, ECG heart rate monitor, and 14-day standby.',
                price: 249.99,
                inventoryCount: 30,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                categoryId: wearablesCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/smartwatch',
                competitorPrice: 279.99
            },
            {
                name: 'Kroma High-Fidelity Portable Speaker',
                slug: 'kroma-portable-speaker',
                description: 'Rugged IP67 waterproof Bluetooth speaker delivering 360-degree sound and 24-hour playback.',
                price: 149.99,
                inventoryCount: 40,
                imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
                categoryId: audioCat.id,
                competitorUrl: 'http://localhost:8004/mock-competitor/products/speaker',
                competitorPrice: 169.99
            }
        ];
        for (const prod of sampleProducts) {
            const product = await this.prisma.product.upsert({
                where: { slug: prod.slug },
                update: {
                    price: prod.price,
                    inventoryCount: prod.inventoryCount,
                    competitorUrl: prod.competitorUrl
                },
                create: {
                    name: prod.name,
                    slug: prod.slug,
                    description: prod.description,
                    price: prod.price,
                    inventoryCount: prod.inventoryCount,
                    imageUrl: prod.imageUrl,
                    categoryId: prod.categoryId,
                    competitorUrl: prod.competitorUrl
                }
            });
            const diff = ((prod.competitorPrice - prod.price) / prod.price) * 100;
            await this.prisma.competitorPriceRecord.create({
                data: {
                    productId: product.id,
                    competitorName: 'ElectroStore Express',
                    competitorUrl: prod.competitorUrl,
                    price: prod.competitorPrice,
                    currency: 'usd',
                    differencePercentage: Math.round(diff * 100) / 100
                }
            });
        }
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
async function main() {
    const seeder = new DatabaseSeeder();
    await seeder.seed();
    await client_1.DatabaseConnection.disconnect();
}
if (require.main === module) {
    main().catch(async (e) => {
        console.error(e);
        await client_1.DatabaseConnection.disconnect();
        process.exit(1);
    });
}
//# sourceMappingURL=seed.js.map