<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Barcode Produk</title>
    <style>
        @page {
            margin: 8mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #0f172a;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        td.label {
            width: 33.33%;
            height: 30mm;
            padding: 2mm;
            border: 0.4pt dashed #94a3b8;
            text-align: center;
            vertical-align: middle;
        }

        img.barcode {
            display: block;
            margin: 0 auto 1mm;
        }

        .kode {
            font-size: 8.5pt;
            font-weight: bold;
        }

        .nama {
            font-size: 7pt;
            color: #475569;
        }

        .empty {
            padding: 12mm 0;
            text-align: center;
            font-size: 10pt;
            color: #64748b;
        }
    </style>
</head>
<body>
    @if ($labels->isEmpty())
        <p class="empty">Tidak ada produk yang cocok dengan filter yang dipilih.</p>
    @else
        <table>
            @foreach ($labels->chunk(3) as $row)
                <tr>
                    @foreach ($row as $label)
                        <td class="label">
                            @if ($label['barcode'])
                                <img
                                    class="barcode"
                                    src="data:image/png;base64,{{ $label['barcode'] }}"
                                    style="width: {{ $label['width'] }}mm; height: {{ $label['height'] }}mm;"
                                    alt="{{ $label['kode_produk'] }}"
                                >
                            @endif
                            <div class="kode">{{ $label['kode_produk'] }}</div>
                            <div class="nama">{{ Str::limit($label['nama_produk'], 40) }}</div>
                        </td>
                    @endforeach
                    @for ($i = $row->count(); $i < 3; $i++)
                        <td class="label" style="border-color: transparent;"></td>
                    @endfor
                </tr>
            @endforeach
        </table>
    @endif
</body>
</html>