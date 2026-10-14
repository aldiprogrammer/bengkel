<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title inertia>{{ config('app.name', 'POS Bengkel') }}</title>

    <meta name="theme-color" content="#16a34a">
    <meta name="color-scheme" content="light">
    <meta name="application-name" content="{{ config('app.name', 'POS Bengkel') }}">
    <meta name="description" content="Sistem manajemen bengkel untuk pelanggan, work order, stok sparepart, kasir, dan laporan.">

    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'POS Bengkel') }}">

    <link rel="manifest" href="{{ route('pwa.manifest') }}">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png">
    <link rel="icon" href="/favicon.ico">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="h-full bg-slate-100 font-sans text-slate-900 antialiased">
    @inertia
</body>
</html>
