'use client'
import React from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import DynamicIcon from '../hooks/DynamicIcons'
import Image from 'next/image'
import InfiniteLinesWrapper from '../hooks/InfiniteLinesWrapper'
import { SelfDialog } from '../ui/self/SelfDialog'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { motion,AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'
import { useMeasure } from 'react-use';

const InstructionsList = [
  {
    title: "Important Instructions",
    list: [
      "Can you change the name of image later.",
      "Even data is protected but we suggest you to not upload your personal images here which may cause of privacy leak!",
    ]
  },
  {
    title: "Your data",
    list: [
      "Your data is stored on cloud database which is under out security.",
      "No one can access it instead of web owner.",
      "Instead of this we suggest you to be careful.",
    ]
  }  
]
export default function ImageForm() {
  const router = useRouter();
  const params = useParams();
  const folderName = decodeURIComponent(params.name as string);
  const [choosenImages,setChoosenImages] = React.useState<string[] | null>(null)
  const [rawImagesData,setRawImagesData] = React.useState<File[] | null>(null)
  const [isLoading,setIsLoading] = React.useState<boolean>(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [choosenMeasureRef,choosenBounds] = useMeasure();
  const choosenImagesContent = React.useMemo(()=>{
    return choosenImages && (
                <motion.div
                initial={{opacity:0,clipPath:"inset(100% 0% 100% 0%)"}}
                animate={{opacity:1,clipPath:"inset(0% 0% 0% 0%)"}}
                exit={{height:0,opacity:0,margin:0,padding:0,border:"0px",clipPath:"inset(100% 0% 100% 0%)",
                  transition:{duration:0.3,ease:"easeInOut"}
                }}
                transition={{
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                }}
                className='flex flex-col overflow-hidden w-full p-3 gap-3 border rounded-md bg-muted/10'>
                  <h1 className='text-sm font-semibold text-muted-foreground px-1'>Images to upload</h1>
                  <div className='w-full flex flex-wrap max-h-40 overflow-y-auto scrollbar-hide gap-2 p-1'>
                    <AnimatePresence mode='popLayout'>
                    {choosenImages.map((img,index)=>(
                      <motion.div 
                        layout
                        key={`${img}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          delay: index * 0.02 
                        }}
                        className='relative group border rounded-sm overflow-hidden bg-background shadow-sm'
                      >
                        <Image 
                          src={img}
                          alt={'preview'}
                          width={80}
                          height={80}
                          className="object-cover aspect-square"
                          unoptimized
                        />
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                  <Button 
                  type='button'
                  onClick={()=>{
                    setChoosenImages(null)
                    if(fileInputRef.current){
                      fileInputRef.current.value = ""
                    }
                  }}
                  variant={"destructive"}>Remove All</Button>
                </motion.div>
              )
  },[choosenImages])

  const handleImagesChange = (e:any) => {
    const rawImages = e.target.files as File[];
    setRawImagesData(rawImages)
    const images = Array.from(rawImages).map(img => URL.createObjectURL(img));
    setChoosenImages(images);
  }
  const handleSubmit = (e:any)=>{
    e.preventDefault()
    setIsLoading(true);
      const formImages = rawImagesData as File[];
      if (!formImages || formImages.length === 0) {
        toast.error("No images selected", {
          description: "Please select at least one image to upload."
        });
        setIsLoading(false);
        return; 
      }
      const formImagesArray = Array.from(formImages);
      try {
        const promises = [];
        while (formImagesArray.length !== 0) {
          const formData = new FormData()
          const img = formImagesArray.splice(0,1);
          formData.append("images",img[0])
          formData.append("folderName",folderName as string);
          const promise:Promise<any[]> = new Promise((resolve:any,reject:any)=>{
            fetch("/api/image-upload",{
              method:"POST",
              body:formData
            }).then((res)=>{
              if(res.ok){
                resolve(res)
              }else{
                reject(res)
              }
            }).catch((err)=>{
              reject(err)
            })
          })
          promises.push(promise);
          toast.promise(promise,{
            loading: "Uploading images...",
            success: "Images uploaded successfully",
            error: "Failed to upload images",
          })
        }
        Promise.allSettled(promises).finally(()=>{
          setChoosenImages(null);
          setRawImagesData(null);
          if(fileInputRef.current){
            fileInputRef.current.value = ""
          }
          setIsLoading(false);
        });
    }catch(err:any) {
        toast("Failed to upload",{
          description: err as string
        })
        setIsLoading(false);
      }
    }
  return (
    <InfiniteLinesWrapper
      parentContClassName='border-t'
      childContClassName='p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative min-h-screen'
      >
      <motion.form
      layout
      key={"image-form"}
      onSubmit={(e:any)=>{handleSubmit(e)}} className='p-2 sm:p-3 md:p-4 border-t border-r flex flex-col justify-center items-center gap-2'>
        <motion.div layout key={"image-form-div"} className='w-full bg-card flex flex-col gap-2 border rounded-sm shadow-xs shadow-blue-800 p-2'>

          <motion.div
          className='row-span-2 w-full'
          layout
          key={"image-form-div-row"}>
            <Button variant={"outline"} 
            onClick={()=>{
              router.back();
            }}
            type='button'
            className='group absolute top-2 left-2'>
              <div className='rounded-xs p-0.5 flex transition-all duration-200 group-hover:-translate-x-1 group-active:-translate-x-2'>
                <DynamicIcon iconName='ArrowLeft' />
              </div>
              Back
            </Button>            
            {/* Select Image */}
          <Label htmlFor='image' className='w-full flex flex-col'>
            <div className='w-full flex flex-col items-center justify-center gap-2 p-2 border'>
              <DynamicIcon iconName="Upload"/>
              <span className='text-lg font-bold'>Upload Images</span>
              <p className='text-muted-foreground'>Click here to upload images</p>
            </div>
          </Label>
          </motion.div>
            <motion.section
            layout
            animate={{height: choosenBounds?.height || 0}}
            className="overflow-hidden"
            >
              <div ref={choosenMeasureRef as any}>
                <AnimatePresence>
                  {choosenImagesContent}
                </AnimatePresence>
              </div>
            </motion.section>
          <Input 
          ref={fileInputRef}
          onChange={handleImagesChange}
          className='hidden'
          type="file"
          disabled={isLoading}
          multiple={true} id="image" name="images" />
          <motion.div layout className='border w-full hidden sm:block'>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {
                InstructionsList.map((d,key)=>(
                  <section className='p-1 ' key={key}>
                  <h1 className='font-mono border p-1 text-sm'>{d.title}</h1>
                  <ol className='list-decimal text-xs border-x border-b list-inside p-1'>
                    {
                      d.list.map((li,i)=>(
                        <li key={i}>{li}</li>
                      ))
                    }
                  </ol>
                </section>
                ))
              }
            </div>
          </motion.div>
          <SelfDialog title='More about data:' 
          description='As you read important instructions and about your data then we want to confirm that you no need to be worried because you can store your harmless images on our website like as your personal storage. We will use your images only for your reference and will not use it anywhere else.' 
          onlyOk={true}>
            <Button variant="outline" type="button" className='w-full'>More about</Button>
          </SelfDialog>
          <Button type="submit"
          className='w-full'
          disabled={isLoading}
          >
              <DynamicIcon iconName="Upload"/> {isLoading?"Uploading...":"Upload"}
          </Button>
        </motion.div>
      </motion.form>
      <div className='relative hidden md:block'>
        <Image 
        src="/unique-illustrated-image.png"
        alt='preview'
        width={1000}
        height={1000}
        unoptimized
        fetchPriority="high"
        className='h-screen w-full object-cover'
        />
      </div>
    </InfiniteLinesWrapper>
  )
}
