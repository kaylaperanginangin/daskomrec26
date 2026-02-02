<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Caudex:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Infant:ital,wght@0,300..700;1,300..700&display=swap"
        rel="stylesheet">

    <!-- Favicon -->
    <link href="favicon.ico" rel="icon">

    <!-- Styles / Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead()
</head>

<body>
    @inertia()
</body>

</html>
