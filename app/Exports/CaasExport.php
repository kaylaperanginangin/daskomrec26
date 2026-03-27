<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CaasExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $stageId;
    protected $status;
    protected $exportAll;

    public function __construct($stageId = null, $status = null, $exportAll = true)
    {
        $this->stageId = $stageId;
        $this->status = $status;
        $this->exportAll = $exportAll;
    }

    /**
     * Get users with their profiles, optionally filtered by stage and status
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = User::with('profile', 'caasStage.stage')
            ->join('caas_stages', 'users.id', '=', 'caas_stages.user_id')
            ->select('users.*');

        if (!$this->exportAll) {
            if ($this->stageId) {
                $query->where('caas_stages.stage_id', $this->stageId);
            }
            if ($this->status) {
                $query->where('caas_stages.status', $this->status);
            }
        }

        return $query->get();
    }

    /**
     * Define the column headings
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'nama',
            'nim',
            'jurusan',
            'kelas',
            'jenis kelamin',
            'stage',
            'status',
        ];
    }

    /**
     * Map the data for each row
     *
     * @param mixed $user
     * @return array
     */
    public function map($user): array
    {
        return [
            $user->profile->name ?? 'N/A',
            $user->nim,
            $user->profile->major ?? 'N/A',
            $user->profile->class ?? 'N/A',
            $user->profile->gender ?? 'N/A',
            $user->caasStage->stage->name ?? 'N/A',
            $user->caasStage->status ?? 'N/A',
        ];
    }

    /**
     * Apply styles to the worksheet
     *
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet): array
    {
        return [
            // Make the first row bold (headers)
            1 => ['font' => ['bold' => true]],
        ];
    }
}
