<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Order</title>
    <style>
        * {
            font-family: DejaVu Sans, sans-serif;
        }

        body {
            font-size: 11px;
            color: #1e293b;
            margin: 0;
        }

        .header {
            border-bottom: 2px solid #16a34a;
            padding-bottom: 10px;
            margin-bottom: 14px;
        }

        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #166534;
        }

        .header p {
            margin: 4px 0 0;
            color: #64748b;
        }

        table.summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }

        table.summary td {
            width: 33.33%;
            border: 1px solid #e2e8f0;
            padding: 10px;
        }

        table.summary .label {
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
        }

        table.summary .value {
            font-size: 15px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 2px;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
        }

        table.data th {
            background: #f1f5f9;
            text-align: left;
            padding: 7px 8px;
            border: 1px solid #e2e8f0;
            font-size: 10px;
            text-transform: uppercase;
            color: #475569;
        }

        table.data td {
            padding: 7px 8px;
            border: 1px solid #e2e8f0;
        }

        .right {
            text-align: right;
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
        <h1>Laporan Order - POS Bengkel</h1>
        <p>Periode: {{ $start->translatedFormat('d F Y') }} s/d {{ $end->translatedFormat('d F Y') }}</p>
    </div>

    <table class="summary">
        <tr>
            @foreach ($summary as $item)
                <td>
                    <div class="label">{{ $item['label'] }}</div>
                    <div class="value">
                        @if ($item['format'] === 'currency')
                            Rp {{ number_format($item['value'], 0, ',', '.') }}
                        @else
                            {{ number_format($item['value'], 0, ',', '.') }}
                        @endif
                    </div>
                </td>
            @endforeach
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th>No</th>
                <th>Kode Order</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Metode</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($orders as $index => $order)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $order->kode_order }}</td>
                    <td>{{ $order->tanggal->translatedFormat('d M Y') }}</td>
                    <td>{{ $order->pelanggan }}</td>
                    <td>{{ $order->metode_pembayaran }}</td>
                    <td class="right">Rp {{ number_format($order->grand_total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="empty">Tidak ada order pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
