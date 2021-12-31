<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
 
class ValidationController extends Controller
{
    
	public function store(Request $request)
	{	
 
		if($request->hasFile('file'))
			$request->file('file')->store('files', 'public');	
 
		return response()->json($request->all());
 
	}
 
}