<?php

namespace App\DataTables;

use App\Models\Patient;
use Carbon\Carbon;
use http\Exception\RuntimeException;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Html\Editor\Editor;
use Yajra\DataTables\Html\Editor\Fields;
use Yajra\DataTables\Services\DataTable;

class PatientsDataTable extends DataTable
{
    /**
     * Build the DataTable class.
     *
     * @param QueryBuilder $query Results from query() method.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
//            ->addColumn('action', 'patients.action')
            ->setRowId('id')
            ->editColumn('created_at', function($data){
            return Carbon::createFromFormat('Y-m-d H:i:s', $data->created_at)->format('d-m-Y'); })
            ;
    }

    /**
     * Get the query source of dataTable.
     */
    public function query(Patient $model): QueryBuilder
    {
        return $model->newQuery()->orderBy('created_at', 'desc'); ;
    }

    /**
     * Optional method if you want to use the html builder.
     */
    public function html(): HtmlBuilder
    {
        return $this->builder()
                    ->setTableId('patients-table')
                    ->columns($this->getColumns())
                    ->minifiedAjax()
                    //->dom('Bfrtip')
                    ->orderBy(1)
                    ->selectStyleSingle()
                    ->buttons([
                        Button::make('excel'),
                        Button::make('csv'),
//                        Button::make('pdf'),
                        Button::make('print'),
                        Button::make('reset'),
                        Button::make('reload')
                    ])->parameters([
                'dom'          => 'Bfrtip',
                'buttons'      => [
                    'export', 'print', 'reset', 'reload',
                    '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Add patient
                    </button>'
                ],
                'responsive' => true, // Включение отзывчивости
            ]);
    }

    /**
     * Get the dataTable columns definition.
     */
    public function getColumns(): array
    {
        return [
//            Column::computed('action')
//                  ->exportable(false)
//                  ->printable(false)
//                  ->width(60)
//                  ->addClass('text-center'),
            Column::make('name')->responsivePriority(1)->addClass('text-center'),  // Этот столбец будет скрыт последним
            Column::make('surname')->responsivePriority(2)->addClass('text-center'),  // Этот столбец будет скрыт первым
            Column::make('phone')->responsivePriority(3)->addClass('text-center'),   // Этот столбец будет скрыт раньше
            Column::make('address')->responsivePriority(4)->addClass('text-center'),  // Скрывается первым
            Column::make('city')->responsivePriority(5)->addClass('text-center'),    // Скрывается позже
            Column::make('created_at')->responsivePriority(6)->addClass('text-center'), // Последний столбец, который будет скрыт

//            Column::make('updated_at'),
        ];

    }

    /**
     * Get the filename for export.
     */
    protected function filename(): string
    {
        return 'Patients_' . date('YmdHis');
    }
}
