<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CaasStage;
use App\Models\Configuration;
use App\Models\Stage;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    /**
     * Display the announcement page with user's current stage status and messages.
     */
    public function index()
    {
        $user = Auth::user();

        // Get the user's CaasStage record (unique per user, covers past & current stages)
        $caasStage = CaasStage::where('user_id', $user->id)->first();

        if (!$caasStage) {
            return inertia('User/announcement', [
                'userStatus' => 'pending',
                'successMessage' => '',
                'failMessage' => '',
                'link' => '',
                'shiftEnabled' => false,
                'announcementEnabled' => false,
                'stageName' => '',
            ]);
        }

        // Get the stage associated with the user's result
        $stage = Stage::find($caasStage->stage_id);

        if (!$stage) {
            return inertia('User/announcement', [
                'userStatus' => 'pending',
                'successMessage' => '',
                'failMessage' => '',
                'link' => '',
                'shiftEnabled' => false,
                'announcementEnabled' => false,
                'stageName' => '',
            ]);
        }

        // Determine user status based on CaasStage
        $userStatus = $caasStage->status === 'LOLOS' ? 'passed' : 'failed';

        // Get the configuration for the user's stage
        $configuration = Configuration::where('stage_id', $stage->id)->first();

        return inertia('User/announcement', [
            'userStatus' => $userStatus,
            'successMessage' => $stage->success_message ?? '',
            'failMessage' => $stage->fail_message ?? '',
            'link' => $stage->link ?? '',
            'shiftEnabled' => $configuration?->isi_jadwal_on ?? false,
            'announcementEnabled' => $configuration?->pengumuman_on ?? false,
            'stageName' => $stage->name ?? '',
        ]);
    }
}
