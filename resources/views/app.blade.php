<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Описание вашего сайта" />
        <meta name="keywords" content="ключевые слова, React, пример" />
        <meta name="author" content="Ваше имя" />

        <link rel="icon" type="image/png" href="{{ asset('favicon-96x96.png') }}" sizes="96x96" />
{{--        <link rel="icon" type="image/png" href="{{ config('app.url') }}favicon.ico/favicon-96x96.png" sizes="96x96" />--}}
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}" />
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}" />
        <link rel="manifest" href="{{ asset('site.webmanifest') }}" />


{{--        <meta property="og:title" content="Megastom" />--}}
{{--        <meta property="og:description" content="Стомотологическая клиника" />--}}
{{--        <meta property="og:image" content="{{ asset('megastomFB.jpg')}}" />--}}
{{--        <meta property="og:url" content="{{ config('app.url') }}" />--}}
{{--        <meta property="og:type" content="website" />--}}
{{--        <meta property="og:locale" content="ru_RU" />--}}
{{--        <meta property="og:site_name" content="Megaastom" />--}}

{{--        <!-- Twitter Cards -->--}}
{{--        <meta name="twitter:title" content="Megastom" />--}}
{{--        <meta name="twitter:description" content="Стомотологическая клиника" />--}}
{{--        <meta name="twitter:image" content="{{ asset('megastom.jpg')}}" />--}}
{{--        <meta name="twitter:card" content="summary_large_image" />--}}
{{--        <meta name="twitter:site" content="@Megastom" />--}}

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">


        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
{{--        @vite(['resources/js/app.jsx'])--}}

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
