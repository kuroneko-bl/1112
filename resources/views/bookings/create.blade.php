<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Создание заявки</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100 p-6 font-sans">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4">Новая заявка</h1>

        <form action="{{ route('bookings.store') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Помещение</label>
                <select name="room_type" class="w-full border-gray-300 rounded-md p-2 border">
                    <option value="">-- Выберите --</option>
                    <option value="Аудитория" {{ old('room_type') == 'Аудитория' ? 'selected' : '' }}>Аудитория</option>
                    <option value="Коворкинг" {{ old('room_type') == 'Коворкинг' ? 'selected' : '' }}>Коворкинг</option>
                    <option value="Кинозал" {{ old('room_type') == 'Кинозал' ? 'selected' : '' }}>Кинозал</option>
                </select>
                @error('room_type') <span class="text-red-500 text-xs block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Дата начала</label>
                <input type="date" name="start_date" value="{{ old('start_date') }}" class="w-full border-gray-300 rounded-md p-2 border">
                @error('start_date') <span class="text-red-500 text-xs block">{{ $message }}</span> @enderror
            </div>

            <div class="mb-5">
                <label class="block text-sm font-medium mb-1">Способ оплаты</label>
                <select name="payment_method" class="w-full border-gray-300 rounded-md p-2 border">
                    <option value="">-- Выберите --</option>
                    <option value="На месте" {{ old('payment_method') == 'Наличные' ? 'selected' : '' }}>Наличные</option>
                    <option value="СБП" {{ old('payment_method') == 'СБП' ? 'selected' : '' }}>СБП</option>
                </select>
                @error('payment_method') <span class="text-red-500 text-xs block">{{ $message }}</span> @enderror
            </div>

            <button type="submit" class="w-full bg-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-700">
                Отправить заявку
            </button>
        </form>

        <div class="mt-4 text-center">
            <a href="{{ route('dashboard') }}" class="text-blue-600 text-sm hover:underline">← Назад в кабинет</a>
        </div>
    </div>
</body>
</html>