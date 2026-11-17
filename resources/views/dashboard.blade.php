<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100 p-6 font-sans">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        {{-- Шапка с приветствием и кнопкой выхода --}}
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Личный кабинет</h1>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="text-red-500 hover:underline text-sm">Выйти</button>
            </form>
        </div>

        <p class="mb-4">Привет, <strong>{{ auth()->user()->first_name }} {{ auth()->user()->last_name }}</strong>!</p>

        {{-- Сообщение об успехе --}}
        @if (session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {{ session('success') }}
            </div>
        @endif

        {{-- Блок кнопок --}}
        <div class="flex gap-4 items-center mb-6">
            @if(auth()->user()->is_admin)
                <a href="{{ route('admin.index') }}" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                    Панель администратора
                </a>
            @endif

            <a href="{{ route('bookings.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                + Создать заявку
            </a>
        </div>

        <h2 class="text-xl font-semibold mb-3">Мои заявки</h2>

        {{-- Если заявок нет --}}
        @if($bookings->isEmpty())
            <p class="text-gray-500">У вас пока нет заявок.</p>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2">Помещение</th>
                            <th class="border p-2">Дата</th>
                            <th class="border p-2">Оплата</th>
                            <th class="border p-2">Статус</th>
                            <th class="border p-2">Отзыв</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($bookings as $booking)
                            <tr>
                                <td class="border p-2">{{ $booking->room_type }}</td>
                                <td class="border p-2">{{ \Carbon\Carbon::parse($booking->start_date)->format('d.m.Y') }}</td>
                                <td class="border p-2">{{ $booking->payment_method }}</td>
                                
                                {{-- Ячейка статуса --}}
                                <td class="border p-2">
                                    @if($booking->status == 'Новая')
                                        <span class="text-blue-600 font-medium">{{ $booking->status }}</span>
                                    @elseif($booking->status == 'Мероприятие назначено')
                                        <span class="text-yellow-600 font-medium">{{ $booking->status }}</span>
                                    @elseif($booking->status == 'Завершено')
                                        <span class="text-green-600 font-medium">{{ $booking->status }}</span>
                                    @endif
                                </td>

                                {{-- Ячейка отзыва --}}
                                <td class="border p-2">
                                    {{-- Показываем форму, если статус Завершено и отзыва еще нет --}}
                                    @if($booking->status == 'Завершено' && empty($booking->review))
                                        <form action="{{ route('bookings.review', $booking->id) }}" method="POST">
                                            @csrf
                                            <textarea name="review" rows="2" class="w-full border p-1 text-sm rounded" placeholder="Оставьте отзыв..."></textarea>
                                            <button type="submit" class="bg-green-500 text-white px-2 py-1 rounded text-xs mt-1 hover:bg-green-600">Отправить</button>
                                        </form>
                                    @endif

                                    {{-- Показываем существующий отзыв --}}
                                    @if($booking->review)
                                        <div class="text-sm text-gray-600 italic">
                                            "{{ $booking->review }}"
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</body>
</html>