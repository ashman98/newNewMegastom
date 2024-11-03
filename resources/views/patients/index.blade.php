@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="card">
            <div class="card-header">Manage Patients</div>
            <div class="card-body">
                {{ $dataTable->table() }}
            </div>
        </div>
    </div>
@endsection

{{--@push('scripts')--}}
{{--    {{ $dataTable->scripts(attributes: ['type' => 'module']) }}--}}
{{--@endpush--}}

@push('scripts')
    {{ $dataTable->scripts(attributes: ['type' => 'module']) }}
{{--    {{ $dataTable->scripts() }}--}}
{{--    <script>--}}
{{--        $(document).ready(function() {--}}
{{--            var table = $('#patients-table').DataTable();--}}

{{--            // Обработка клика по строке--}}
{{--            $('#patients-table tbody').on('click', 'tr', function() {--}}
{{--                var data = table.row(this).data(); // Получаем данные строки--}}
{{--                var patientId = data[0]; // Предполагаем, что ID пациента находится в первом столбце--}}

{{--                // Перенаправляем на страницу просмотра пациента--}}
{{--                window.location.href = '/patients/' + patientId; // Замените на нужный вам URL--}}
{{--            });--}}
{{--        });--}}
{{--    </script>--}}
@endpush



<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Добавить пациента</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="{{ route('patients.store') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="name" class="form-label">Имя</label>
                        <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>
                        @error('name')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="mb-3">
                        <label for="surname" class="form-label">Фамилия</label>
                        <input id="surname" type="text" class="form-control @error('surname') is-invalid @enderror" name="surname" value="{{ old('surname') }}" required>
                        @error('surname')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Телефон</label>
                        <input id="phone" type="text" class="form-control @error('phone') is-invalid @enderror" name="phone" value="{{ old('phone') }}" required>
                        @error('phone')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
{{--                    <div class="mb-3">--}}
{{--                        <label for="dob" class="form-label">Дата рождения</label>--}}
{{--                        <input id="dob" type="date" class="form-control @error('dob') is-invalid @enderror" name="dob" value="{{ old('dob') }}" required>--}}
{{--                        @error('dob')--}}
{{--                        <div class="invalid-feedback">{{ $message }}</div>--}}
{{--                        @enderror--}}
{{--                    </div>--}}
                    <div class="mb-3">
                        <label for="city" class="form-label">Город</label>
                        <input id="city" type="text" class="form-control @error('city') is-invalid @enderror" name="city" value="{{ old('city') }}" required>
                        @error('city')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Адрес</label>
                        <input id="address" type="text" class="form-control @error('address') is-invalid @enderror" name="address" value="{{ old('address') }}" required>
                        @error('address')
                        <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="submit" class="btn btn-primary">Добавить пациента</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

