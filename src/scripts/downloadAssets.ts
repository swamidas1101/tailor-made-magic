
import fs from 'fs';
import path from 'path';
import https from 'https';

const categories = [
    { slug: 'formal-shirts', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
    { slug: 'blouse-designs', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
    { slug: 'lehenga', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80' },
    { slug: 'trousers-pants', url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80' },
    { slug: 'kurti-kurta', url: 'https://images.unsplash.com/photo-1616686705030-c36136d8331d?w=800&q=80' },
    { slug: 'suits', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
    { slug: 'gown-evening-wear', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80' },
    { slug: 'blazers', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80' },
    { slug: 'salwar-kameez', url: 'https://images.unsplash.com/photo-1585994017637-23dc03cf95eb?w=800&q=80' },
    { slug: 'half-saree', url: 'https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?w=800&q=80' },
    { slug: 'sherwanis', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80' },
    { slug: 'mens-kurta', url: 'https://images.unsplash.com/photo-1598553658252-8716b92473c3?w=800&q=80' },
    { slug: 'saree-alterations', url: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&q=80' },
    { slug: 'shorts', url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80' }
];

const downloadImage = (url: string, filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status Code ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${path.basename(filename)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => { });
            reject(err);
        });
    });
};

const assetsDir = path.join(process.cwd(), 'public', 'assets', 'categories');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

console.log(`🚀 Starting download of ${categories.length} category assets to ${assetsDir}...`);

const downloadAll = async () => {
    for (const cat of categories) {
        try {
            await downloadImage(cat.url, path.join(assetsDir, `${cat.slug}.jpg`));
        } catch (error) {
            console.error(`❌ Error downloading ${cat.slug}:`, error);
        }
    }
};

downloadAll().then(() => console.log('🎉 All downloads processed.'));
