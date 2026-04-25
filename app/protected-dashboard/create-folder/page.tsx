'use client'
import React from 'react'
import InfiniteLinesWrapper from '@/components/hooks/InfiniteLinesWrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { motion,AnimatePresence,useMotionTemplate,useSpring } from 'framer-motion'
import { toast } from 'sonner'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import { useRouter } from 'next/navigation'

export default function Page() {
    const [isExiting,setIsExiting] = React.useState<boolean>(false);
    const router = useRouter();

    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const folderName = formData.get("folder-name")
        const promise = new Promise((resolve,reject)=>{
            try{
                fetch("/api/create-folder",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({folderName})
            }).then((res)=>{
                res.json().then((data)=>{
                    if(data.success){
                        resolve({success:true,message:data.message})
                    }else{
                        reject({success:false,error:data.error})
                    }
                })
            }).catch((error)=>{
                reject(error)
            })
        }catch(err){
            reject(err || "Some error cause while creating folder")
        }
        })
        return promise;
    }

  const springSpeed = {
    stiffness:50,
    damping:30,
    mass:4
  }
  const [shadowColor,setShadowColor] = React.useState("transparent")
  const xOffset = useSpring(0,springSpeed)
  const yOffset = useSpring(0,springSpeed)
  const shadowSpread = useSpring(0,springSpeed)
  const boxShadow = useMotionTemplate`${xOffset}px ${yOffset}px 20px ${shadowSpread}px ${shadowColor}`

  React.useEffect(() => {
    const setTime = setTimeout(() => {
      yOffset.set(6)
      shadowSpread.set(3)
      setShadowColor("rgba(59, 130, 246, 0.4)")
    },3000)
    return () => {
      clearTimeout(setTime)
    }
  },[])

  return (
    <InfiniteLinesWrapper
    parentContClassName='border-t'
    childContClassName='p-0 overflow-hidden relative'
    >
        <div className='absolute h-full w-full'>
            <Image src="/illustrated-landscape.png" 
                width={1000}
                height={1000}
                className='w-full h-screen object-fill'
                unoptimized
                alt="image-lines" 
                />
        </div>
        <AnimatePresence mode="wait" onExitComplete={() => {
            if (isExiting) {
                router.push("/protected-dashboard");
            }
        }}>
            {!isExiting && (
            <motion.div
            key="page-content"
            initial={{clipPath:"inset(0 50% 0 50%)"}}
            animate={{clipPath:"inset(0 0% 0 0%)"}}
            exit={{clipPath:"inset(0 50% 0 50%)"}}
            transition={{duration:1,type:"spring",stiffness:50,damping:15,delay:1}}
            className='w-full bg-background z-10 grid relative md:grid-cols-2 h-screen'>
                <div className='absolute top-2 left-2'>
                    <Button
                    onClick={()=>{
                        setIsExiting(true);
                    }}
                    >
                        <DynamicIcon iconName='ArrowLeft'/> Back
                    </Button>
                </div>
                <section className='flex border-r justify-center items-center'>
                    <motion.form
                    style={{
                        boxShadow
                    }}
                    transition={{duration:1,type:"spring",stiffness:7,damping:10,mass:1,delay:1}}
                    className='bg-card border border-blue-500/20 flex flex-col gap-2 w-full max-w-sm p-4 rounded-sm'
                    onSubmit={(e:React.FormEvent<HTMLFormElement>)=>{
                        const promiseReturned = handleSubmit(e)
                        promiseReturned.then((data:any)=>{
                            if(data.success) {
                                    setIsExiting(true);
                            }
                        })
                        toast.promise(promiseReturned,{
                            loading:"Creating folder...",
                            success:"Folder created successfully",
                            error:"Failed to create folder"
                        })
                    }}>
                        <header className='border p-2'>
                            <h1 className='text-lg font-bold'><span className='text-cyan-500'>Create</span> a Folder</h1>
                            <p className='text-muted-foreground font-mono text-sm'>
                                Create a folder to organize your images.
                            </p>
                        </header>
                        <main className='p-2 flex flex-col gap-2 border'>
                        <Label htmlFor='folder-name'>Folder name</Label>
                        <Input type="text" id="folder-name" name="folder-name" placeholder='Folder name' />

                        <Button type='submit'>Create</Button>
                        </main>
                    </motion.form>
                </section>
                <section className='border-l'>
                    <Image src="/unique-illustrated-image.png" 
                    width={1000}
                    height={1000}
                    className='w-full h-screen object-fill'
                    unoptimized
                    alt="image-lines" 
                    />
                </section>
            </motion.div>
            )}
        </AnimatePresence>
    </InfiniteLinesWrapper>
  )
}