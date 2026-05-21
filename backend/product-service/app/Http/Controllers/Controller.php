<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function apiErrorResponse($error = null,int $statusCode = 500,string $message = 'internal server error'){
        $body = [
            'status' => $statusCode,
            'message' => $message,
        ];

        if($error != null){
            $body['error'] = $error;
        }
        return response()->json($body,$statusCode);
    }

    protected function apiSuccessResponse($data = null,int $statusCode = 200,string $message = 'ok'){
        $body =  [
            'status' => $statusCode,
            'message' => $message,
        ];
        if($data != null){
            $body['data'] = $data;
        }
        return response()->json($body,$statusCode);
    }
}
