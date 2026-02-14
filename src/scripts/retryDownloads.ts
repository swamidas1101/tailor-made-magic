
import fs from 'fs';
import path from 'path';
import https from 'https';

const categories = [
    { slug: 'kurti-kurta', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80' },
    { slug: 'salwar-kameez', url: 'https://images.unsplash.com/photo-1637228333155-758fb1784c0c?w=800&q=80' },
    { slug: 'mens-kurta', url: 'https://images.unsplash.com/photo-1629851756570-529074945396?w=800&q=80' }
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
console.log(`🚀 Retrying download for ${categories.length} assets...`);

const downloadAll = async () => {
    for (const cat of categories) {
        try {
            await downloadImage(cat.url, path.join(assetsDir, `${cat.slug}.jpg`));
        } catch (error) {
            console.error(`❌ Error downloading ${cat.slug}:`, error);
        }
    }
};

downloadAll().then(() => console.log('🎉 Retry process complete.'));
