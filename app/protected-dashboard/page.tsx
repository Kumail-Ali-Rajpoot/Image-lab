import React from 'react'
import Dashboard from '@/components/base/Dashoard'
import Navbar from '@/components/base/Navbar'
import { Suspense } from 'react'
import Loading from '@/app/loading'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) {
        redirect("/");
    }
    
    // Efficiently check if user exists in the database
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email as string }
    });
    
    if(!user) {
        redirect("/user-manager");
      return (
        <Suspense fallback={<Loading />}>
      <div className='flex h-screen flex-col items-center justify-center'>
        <div className='flex flex-col animate-pulse p-2 border '>
          <h1 className='text-lg font-mono'>Wait till verification</h1>
          <p className='text-muted-foreground text-sm'>This is for security of your data.</p>
        </div>
      </div>
      </Suspense>
  )
} else {
  return (
        <Suspense fallback={<Loading />}>
      <div className=''>
          <Navbar />
          <Dashboard />
    </div>
      </Suspense>
    )
  }
}
