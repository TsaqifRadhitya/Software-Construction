<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class authController extends Controller
{
    public function login(Request $request){
        try{
            $validated = $request->validate([
            'email' => ['required','email'],
            'password' => ['required']
        ]);

        $user = User::whereEmail($validated['email'])->first();

        if($user == null){
            return $this->apiErrorResponse(null,401,"Invalid Credential");
        }

        if(!Hash::check($validated['password'],$user->password)){
            return $this->apiErrorResponse(null,401,"Invalid Credential");
        }

        return $this->apiSuccessResponse([
            'token' => $user->createToken('access_token')->plainTextToken
        ]);
        }catch(ValidationException $e){
            return $this->apiErrorResponse($e->errors(),400,"Validation Exception");
        }
    }
}
