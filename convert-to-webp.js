const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'assets');

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const webpPath = fullPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
                if (!fs.existsSync(webpPath)) {
                    try {
                        console.log(`Converting: ${fullPath} -> ${webpPath}`);
                        await sharp(fullPath)
                            .webp({ quality: 80 })
                            .toFile(webpPath);
                        
                        // Excluir a imagem original após a conversão com sucesso
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted original: ${fullPath}`);
                    } catch (err) {
                        console.error(`Error converting ${fullPath}:`, err);
                    }
                }
            }
        }
    }
}

processDirectory(imagesDir)
    .then(() => console.log('Conversion complete!'))
    .catch(err => console.error('Error during conversion:', err));
