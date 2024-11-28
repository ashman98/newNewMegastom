<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Описание вашего сайта" />
        <meta name="keywords" content="ключевые слова, React, пример" />
        <meta name="author" content="Ваше имя" />

        <link rel="icon" type="image/png" href="{{ config('app.url') }}favicon.ico/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="{{ config('app.url') }}favicon.ico/favicon.svg" />
        <link rel="shortcut icon" href="{{ config('app.url') }}favicon.ico/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="{{ config('app.url') }}favicon.ico/apple-touch-icon.png" />
        <link rel="manifest" href="{{ config('app.url') }}favicon.ico/site.webmanifest" />

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">


        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
{{--        @viteReactRefresh--}}
{{--	 @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])--}}
        @vite(['resources/js/app.jsx'])

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
