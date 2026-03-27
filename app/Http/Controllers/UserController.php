<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Stage;
use App\Models\CaasStage;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Exports\CaasExport;
use App\Imports\CaasImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = request('perPage', 5); // Default to 5 items per page
        $perPage = in_array($perPage, [5, 10]) ? $perPage : 5; // Validate: only allow 5 or 10
        
        $users = User::with('profile', 'caasStage.stage')
            ->join('caas_stages', 'users.id', '=', 'caas_stages.user_id')
            ->select('users.*')
            ->paginate($perPage);

        $stages = Stage::orderBy('id')->get();
        
        return inertia('Admin/caas', ['users' => $users, 'stages' => $stages]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'nim' => $request->nim,
            'password' => bcrypt($request->nim),
        ]);

        // Create profile
        $user->profile()->create([
            'name' => $request->name,
            'major' => $request->major,
            'class' => $request->class,
            'gender' => $request->gender,
        ]);

        // Create CaasStage with Administration stage (default)
        $administrationStage = Stage::where('name', 'Administration')->first();
        if ($administrationStage) {
            CaasStage::create([
                'user_id' => $user->id,
                'stage_id' => $administrationStage->id,
                'status' => 'PROSES', // Default status
            ]);
        }

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update([
            'nim' => $request->nim,
        ]);

        // Update profile
        $user->profile()->update([
            'name' => $request->name,
            'major' => $request->major,
            'class' => $request->class,
            'gender' => $request->gender,
        ]);

        return back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        User::destroy($user->id);
        return back()
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Export CaAs users to Excel with optional filters
     */
    public function export(Request $request)
    {
        $exportAll = $request->boolean('export_all', true);
        $stageId = $request->input('stage_id');
        $status = $request->input('status');

        $filename = 'CaAs_Manifest_Archive';
        if (!$exportAll) {
            if ($stageId) {
                $stage = Stage::find($stageId);
                if ($stage) {
                    $filename .= '_' . str_replace(' ', '_', $stage->name);
                }
            }
            if ($status) {
                $filename .= '_' . $status;
            }
        }
        $filename .= '.xlsx';

        return Excel::download(new CaasExport($stageId, $status, $exportAll), $filename);
    }

    /**
     * Import CaAs users from Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ], [
            'file.required' => 'Please select a file to import.',
            'file.mimes' => 'File must be in Excel format (.xlsx, .xls, or .csv).',
            'file.max' => 'File size must not exceed 10MB.',
        ]);

        try {
            $import = new CaasImport;
            Excel::import($import, $request->file('file'));
            
            $imported = $import->getImportedCount();
            $skipped = $import->getSkippedCount();
            
            $message = "Successfully imported {$imported} user(s).";
            if ($skipped > 0) {
                $message .= " Skipped {$skipped} duplicate(s).";
            }
            
            return back()->with('success', $message);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];
            
            foreach ($failures as $failure) {
                $errors[] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
            }
            
            return back()->with('error', 'Import validation failed: ' . implode(' | ', array_slice($errors, 0, 5)));
        } catch (\Exception $e) {
            return back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
