// Struktur data penyimpan item keranjang
let dataKeranjang = [];

// Fungsi scroll halus ke area menu makanan
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Memasukkan makanan ke dalam array keranjang
function tambahKeKeranjang(nama, harga) {
    const itemEksis = dataKeranjang.find(item => item.nama === nama);

    if (itemEksis) {
        itemEksis.jumlah += 1;
    } else {
        dataKeranjang.push({ nama: nama, harga: harga, jumlah: 1 });
    }

    updateTampilanKeranjang();
    
    // Perilaku Profesional: Berpindah visual fokus langsung ke area keranjang belanjaan
    document.getElementById('keranjang').scrollIntoView({ behavior: 'smooth' });
}

// Menghapus item dari keranjang belanja
function hapusItem(nama) {
    dataKeranjang = dataKeranjang.filter(item => item.nama !== nama);
    updateTampilanKeranjang();
}

// Mengupdate DOM tabel visual keranjang belanja
function updateTampilanKeranjang() {
    const keranjangKosong = document.getElementById('keranjang-kosong');
    const keranjangIsi = document.getElementById('keranjang-isi');
    const listKeranjang = document.getElementById('list-keranjang');
    const totalHargaElement = document.getElementById('total-harga');
    const cartNav = document.getElementById('cart-nav');

    // Update counter angka pada menu navigasi
    const totalItem = dataKeranjang.reduce((sum, item) => sum + item.jumlah, 0);
    cartNav.innerText = `Keranjang (${totalItem})`;

    if (dataKeranjang.length === 0) {
        keranjangKosong.style.display = "block";
        keranjangIsi.style.display = "none";
        return;
    }

    keranjangKosong.style.display = "none";
    keranjangIsi.style.display = "block";

    listKeranjang.innerHTML = "";
    let totalBayar = 0;

    dataKeranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        totalBayar += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.nama}</strong></td>
            <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
            <td>${item.jumlah} Porsi</td>
            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
            <td><button class="btn-hapus" onclick="hapusItem('${item.nama}')">Hapus</button></td>
        `;
        listKeranjang.appendChild(row);
    });

    totalHargaElement.innerText = "Rp " + totalBayar.toLocaleString('id-ID');
}

// Mengirim rincian orderan ke WhatsApp admin
function checkoutWA() {
    if (dataKeranjang.length === 0) return;

    const nomorWA = "6285292275616"; 
    let teksPesanan = "🛑 *PESANAN BARU VIA WEBSITE* 🛑\n\nHalo, saya ingin memesan menu kuliner berikut:\n\n";
    let totalBayar = 0;

    dataKeranjang.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah;
        totalBayar += subtotal;
        teksPesanan += `${index + 1}. *${item.nama}* (${item.jumlah}x) = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    teksPesanan += `\n💵 *Total Pembayaran: Rp ${totalBayar.toLocaleString('id-ID')}*\n\nMohon segera diproses dan dikirimkan detail pembayarannya, terima kasih!`;
    
    window.open("https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(teksPesanan), "_blank");
}