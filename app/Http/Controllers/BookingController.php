<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        return view('dashboard', compact('bookings'));
    }

    public function create()
    {

        return view('bookings.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type' => ['required', 'string', 'in:Аудитория,Коворкинг,Кинозал'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            
            'payment_method' => ['required', 'string', 'in:Наличные,СБП'],
        ], [
            'room_type.required' => 'Выберите помещение.',
            'room_type.in' => 'Недопустимый тип помещения.',
            'start_date.required' => 'Укажите дату начала.',
            'start_date.after_or_equal' => 'Дата не может быть в прошлом.',
            'payment_method.required' => 'Выберите способ оплаты.',
        ]);

        Booking::create([
            'user_id' => Auth::id(),
            'room_type' => $validated['room_type'],
            'start_date' => $validated['start_date'],
            'payment_method' => $validated['payment_method'],
            'status' => 'Новая',
        ]);

        return redirect()->route('dashboard')->with('success', 'Заявка создана');
    }
    public function storeReview(Request $request, Booking $booking)
    {
        if ($booking->user_id !== Auth::id() || $booking->status !== 'Завершено') {
            abort(403, 'Вы не можете оставить отзыв для этой заявки.');
        }

        $request->validate([
            'review' => ['required', 'string', 'max:500'],
        ], [
            'review.required' => 'Напишите текст отзыва.',
        ]);

        $booking->update(['review' => $request->review]);

        return back()->with('success', 'Спасибо за ваш отзыв!');
    }
}
