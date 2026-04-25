import React from 'react';

export default function loading() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex border p-2 flex-col items-center gap-2'>
                <h1 className='text-md flex items-center gap-2 font-bold'>
                    <div className="w-3 h-3 rounded-full border-foreground border-2 border-dashed animate-spin" />
                     Please wait... 
                </h1>
                <p className='text-sm text-muted-foreground'>While data is fetching wait...</p>
            </div>
        </div>
    )
}