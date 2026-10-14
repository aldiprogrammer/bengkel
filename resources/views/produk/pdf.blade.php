<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Daftar Produk</title>
    <style>
        * {
            font-family: DejaVu Sans, sans-serif;
        }

        body {
            font-size: 10px;
            color: #1e293b;
            margin: 0;
        }

        .header {
            border-bottom: 2px solid #16a34a;
            padding-bottom: 10px;
            margin-bottom: 12px;
        }

        .header h1 {
            font-size: 17px;
            margin: 0;
            color: #166534;
        }

        .header p {
            margin: 4px 0 0;
            color: #64748b;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
        }

        table.data th {
            background: #f1f5f9;
            text-align: left;
            padding: 6px 7px;
            border: 1px solid #e2e8f0;
            font-size: 9px;
            text-transform: uppercase;
            color: #475569;
        }

        table.data td {
            padding: 6px 7px;
            border: 1px solid #e2e8f0;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .low {
            color: #b45309;
            font-weight: bold;
        }

        .out {
            color: #be123c;
            font-weight: bold;
        }

        .empty {
            text-align: center;
            color: #94a3b8;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daftar Produk - POS Bengkel</h1>
        <p>Dicetak: {{ now()->translatedFormat('d F Y H:i') }} &middot; {{ $produk->count() }} produk</p>
    </div>

    <table class="data">
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th class="center">Stok</th>
                <th class="right">Harga Beli</th>
                <th class="right">Harga Jual</th>
                <th class="center">Diskon</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($produk as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->kode_produk }}</td>
                    <td>{{ $item->nama_produk }}</td>
                    <td>{{ $item->kategori?->nama_kategori ?? '-' }}</td>
                    <td>{{ $item->satuan }}</td>
                    <td class="center {{ $item->stok === 0 ? 'out' : ($item->stok < 2 ? 'low' : '') }}">{{ $item->stok }}</td>
                    <td class="right">Rp {{ number_format($item->harga_beli, 0, ',', '.') }}</td>
                    <td class="right">Rp {{ number_format($item->harga_jual, 0, ',', '.') }}</td>
                    <td class="center">{{ $item->diskon }}%</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="empty">Tidak ada produk untuk ditampilkan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
