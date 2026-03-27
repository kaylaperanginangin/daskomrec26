<?php

namespace App\Http\Middleware;

use App\Models\Configuration;
use App\Models\Stage;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckConfiguration
{
    /**
     * Check if the given configuration flag is enabled for the current stage.
     * If not, redirect to user home.
     *
     * @param  string  $flag  One of: pengumuman_on, isi_jadwal_on, puzzles_on
     */
    public function handle(Request $request, Closure $next, string $flag): Response
    {
        $currentStage = Stage::where('current_stage', true)->first();

        if (!$currentStage) {
            return redirect('/User/home');
        }

        $configuration = Configuration::where('stage_id', $currentStage->id)->first();

        if (!$configuration || !$configuration->{$flag}) {
            return redirect('/User/home');
        }

        return $next($request);
    }
}
