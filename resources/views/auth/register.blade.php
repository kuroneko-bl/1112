<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - Конференции.РФ</title>
    {{-- Подключаем стили Tailwind CSS через Vite --}}
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100 p-6 font-sans">
    
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">Регистрация</h1>

        {{-- Блок вывода сообщения об успешной регистрации --}}
        @if (session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif

        {{-- Форма отправляет POST-запрос на маршрут с именем 'register' --}}
        <form action="{{ route('register') }}" method="POST">
            
            {{-- Обязательный CSRF-токен (защита от подделки запросов) --}}
            @csrf

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Логин</label>
                {{-- value="{{ old('login') }}" сохраняет введенное значение при ошибке --}}
                <input type="text" name="login" value="{{ old('login') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                {{-- Директива @error выводит текст ошибки конкретно для этого поля --}}
                @error('login') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Фамилия</label>
                <input type="text" name="last_name" value="{{ old('last_name') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('last_name') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Имя</label>
                <input type="text" name="first_name" value="{{ old('first_name') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('first_name') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Отчество</label>
                <input type="text" name="middle_name" value="{{ old('middle_name') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('middle_name') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Телефон</label>
                <input type="text" name="phone" placeholder="8(999)999-99-99" value="{{ old('phone') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('phone') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('email') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-5">
                <label class="block text-sm font-medium mb-1">Пароль</label>
                <input type="password" name="password" class="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                @error('password') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
            </div>

            <button type="submit" class="w-full bg-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                Создать пользователя
            </button>
        </form>
    </div>

</body>
</html>