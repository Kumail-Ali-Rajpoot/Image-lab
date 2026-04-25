'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion,useSpring,useTransform,AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import InfiniteLinesWrapper from '@/components/hooks/InfiniteLinesWrapper'
import { useRouter } from 'next/navigation'
import Loading from '@/app/loading'
const addUser = async (session:any,password:string) => {
    if(!session?.user?.email){
        return {success:false,error:"Session not found or email missing",alreadyExists:false};
    }
    const res = await fetch("/api/unique-user",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user?.email,
      }),
    })
    if(!res.ok) {
      console.log("data is not fetched")
      return {success:false,error:"User data not fetched!",alreadyExists:false}
    }
    const isUser = await res.json();
    if(isUser.success) {
      return {success:false,error:"User already exists",alreadyExists:true}
    }else {
      const response = await fetch("/api/add-user",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
          password,
          
        }),

      });
      if(response.ok) {
          return {success:true,alreadyExists:false};
      }else {
          return {success:false,error:"Failed to add user",alreadyExists:false};
      }
    }
}

export default function page() {
  const router = useRouter();
  const [processing,setProcessing] = React.useState<boolean>(false);
  const {data:session ,isPending} = authClient.useSession();
  const [userExistsLoading,setUserExistsLoading] = React.useState<boolean>(true);
  const x1 = useSpring(50, {
    stiffness:20,
    damping:10,
    mass:2
  });
  const x2 = useSpring(50, {
    stiffness:20,
    damping:10,
    mass:2
  });
  React.useEffect(()=>{
    async function userAlreadtExists() {
      if(!session?.user?.email || isPending) {
        router.replace("/")
          return;
        }
      try {
        const userData = await fetch("/api/unique-user",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
          }),
        })
        if(!userData.ok) {
          toast("Error!",{ 
            description: "User data not fetched!",
          });
          return
        }
        const isUser = await userData.json();
        if(isUser.success) {
          router.replace("/protected-dashboard");
          return;
        }else {
          setUserExistsLoading(false);
        }
      }catch(err) {
        toast("Error!",{ 
          description: "User data not fetched!",
        });
        setUserExistsLoading(false);
        return;
      }
    }
    userAlreadtExists();
  },[session])
  const x1Transform = useTransform(x1,(v)=>`inset(0% ${v}% 0% ${v}%)`);
  const x2Transform = useTransform(x2,(v)=>`inset(0% ${v}% 0% ${v}%)`);
  if (userExistsLoading)
      return <Loading />
  else
    return (
        <InfiniteLinesWrapper 
        parentContClassName='min-h-screen'
        childContClassName='flex relative p-0 items-center justify-center'>
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.7}}
            className='absolute h-full w-full'>
                <Image src="https://t4.ftcdn.net/jpg/07/33/60/37/360_F_733603725_KjI5XMCM5nYV3NBzN4XJ6joszlriXf9O.jpg" 
                fill
                className='w-full object-fill absolute -z-10'
                unoptimized
                alt="logo" priority />
            </motion.div>
            <motion.div
            initial={{clipPath:"inset(0 50% 0 50%)",transitionDelay:0.4}}
            style={{clipPath:x1Transform}}
            transition={{duration:1}}
            layout
            onViewportEnter={()=>{
                setTimeout(()=>{
                    x1.set(0);
                },200)
            }
            }
            viewport={{once:true}}
             className='absolute w-full bg-card/50 backdrop-blur-xs border-y flex flex-col items-center justify-center'>
                <h1 className="text-lg border-x p-2 text-center font-mono">Set your account password</h1>                
                <motion.form
                layout
                onSubmit={async (e: React.FormEvent<HTMLFormElement>)=>{
                    e.preventDefault();
                    setProcessing(true);
                    const formData:FormData = new FormData(e.currentTarget);
                    const password:string = formData.get("password") as string;
                    const confirmPassword:string = formData.get("confirmPassword") as string;
                    if(password !== confirmPassword){
                        toast("Passwords do not match!",{
                            description:"Please try again",
                        });
                        setProcessing(false)
                        return;
                    }else if(password == "") {
                      toast("Password cannot be empty!",{
                        description:"Please try again",
                      });
                      setProcessing(false)
                      return;
                    }else if (password.length < 8) {
                      toast("Password must be at least 8 characters long!",{
                        description:"Please try again",
                      });
                      setProcessing(false)
                      return;
                    }
                    if(!session?.user?.email){
                        toast("Error!",{ 
                            description: "Session not found or email missing",
                        });
                        setProcessing(false);
                        router.replace("/");
                        return;
                    }
                    const output:any = await addUser(session,password as string);
                    if(!output?.success){
                        toast("Error!",{ 
                            description: output?.error || "Failed to save user details",
                        });
                        setProcessing(false);
                        if(output?.alreadyExists){
                            router.replace("/protected-dashboard");
                        }
                        return; // Stop here on failure, don't play animation
                    }
                    
                    toast("Password set successfully!",{
                        description:"You can now login to your account",
                    });
                    x1.set(50);
                    setTimeout(()=>{
                        x2.set(0);
                    },1500);
                    setProcessing(false);
                }}
                className='flex flex-col  gap-2 w-md border-x border-t p-2'>
                    <Input type="password" 
                    name='password'
                    placeholder="Password ********" />
                    <Input type="password"
                    name='confirmPassword'
                    placeholder="Confirm Password *******" />
                    <Button 
                    disabled={processing}
                    type="submit">{processing?"Submitting...":"Submit"}</Button>
                </motion.form>
                <AnimatePresence>
                {
                processing?
                <motion.div
                layout
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.5}}
                className='p-5 flex flex-col text-center w-full'>
                    <motion.h1
                    layout
                    className='text-lg'>Processing...</motion.h1>
                    <motion.p
                    layout
                    className='text-sn text-muted-foreground'>
                        Wait till password and your user does not store in database
                    </motion.p>
                </motion.div>:""           
                }
                </AnimatePresence>
            </motion.div>
            <motion.div
            style={{clipPath:x2Transform}}
            transition={{duration:1,delay:0.4}}
            viewport={{once:true}}
             className='absolute w-full bg-card/50 backdrop-blur-xs border-y flex flex-col items-center justify-center'>
                <span className='flex px-1 py-3 flex-col items-center gap-2 text-center border-x'>
                <h1 className="text-lg p-2 text-center font-mono">Thanks for setting password</h1> 
                <p className='text-muted-foreground text-sm'>This step was for security of your images and to add your acount in our list.</p> 
                <Button onClick={()=>router.replace("/protected-dashboard")}>Go to Dashboard</Button>             
                </span>
            </motion.div>
        </InfiniteLinesWrapper>
  )
}