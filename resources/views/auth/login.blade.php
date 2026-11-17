<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход - Конференции.РФ</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100 p-6 font-sans">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Вход в систему</h1>

        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Логин</label>
                <input type="text" name="login" value="{{ old('login') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('login') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-5">
                <label class="block text-sm font-medium mb-1">Пароль</label>
                <input type="password" name="password" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('password') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <button type="submit" class="w-full bg-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                Войти
            </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
            Еще не зарегистрированы? <a href="{{ route('register') }}" class="text-blue-600 hover:underline">Регистрация</a>
        </p>
    </div>
</body>
</html\