// js/scanner.js
let html5QrcodeScanner;

document.addEventListener('DOMContentLoaded', function() {
    // Tarayıcıyı başlat
    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            supportedScanTypes: [
                Html5QrcodeScanType.SCAN_TYPE_QR_CODE,
                Html5QrcodeScanType.SCAN_TYPE_CAMERA
            ]
        },
        false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Barkod tarandı: ${decodedText}`);
    
    // Ürün bilgilerini getir
    getProductInfo(decodedText);
    
    // Sadece ilk taramada durdur (isteğe bağlı)
    // html5QrcodeScanner.clear();
}

function onScanFailure(error) {
    // Hata durumunda sessiz kal, sürekli taramaya devam et
}

// Ürün bilgilerini localStorage'dan getir
async function getProductInfo(barcode) {
    try {
        // localStorage'dan ürünleri al
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.barcode === barcode);
        
        const resultDiv = document.getElementById('result');
        
        if (product) {
            resultDiv.innerHTML = `
                <div class="product-info">
                    <h3>✅ ${product.name}</h3>
                    <p><strong>Fiyat:</strong> ${product.price} TL</p>
                    <p><strong>Açıklama:</strong> ${product.description}</p>
                    <p><strong>Barkod:</strong> ${product.barcode}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-left: 5px solid #f44336;">
                    <h3>❌ Ürün Bulunamadı</h3>
                    <p><strong>Barkod:</strong> ${barcode}</p>
                    <p>Bu ürün sisteme kayıtlı değil. Lütfen admin panelinden ekleyin.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Hata:', error);
        document.getElementById('result').innerHTML = `
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px;">
                <h3>⚠️ Sistem Hatası</h3>
                <p>Lütfen sayfayı yenileyin.</p>
            </div>
        `;
    }
}