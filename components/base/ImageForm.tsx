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
  const params = useParams();
  const folderName = params.name;
  const handleSubmit = (e:any)=>{
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
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
    }
  return (
    <InfiniteLinesWrapper
      parentContClassName='border-t'
      childContClassName='p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative h-screen'
      >
      <form onSubmit={(e:any)=>{handleSubmit(e)}} className='border-t border-r flex flex-col justify-center items-center gap-2 p-2'>
          <Label htmlFor='image' className='w-full'>
            <div className='w-full flex flex-col items-center justify-center gap-2 p-2 border'>
              <DynamicIcon iconName="Upload"/>
              <span className='text-lg font-bold'>Upload Images</span>
              <p className='text-muted-foreground'>Click here to upload images</p>
            </div>
          </Label>
          <Input className='hidden' type="file" multiple={true} id="image" name="images" />
          <div className='border w-full'>
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
          </div>
          <SelfDialog title='More about data:' 
          description='As you read important instructions and about your data then we want to confirm that you no need to be worried because you can store your harmless images on our website like as your personal storage. We will use your images only for your reference and will not use it anywhere else.' 
          onlyOk={true}>
            <Button variant="outline" className='w-full'>More about</Button>
          </SelfDialog>
          <Button type="submit"
          className='w-full'
          >
              <DynamicIcon iconName="Upload"/>Upload
          </Button>
      </form>
      <div>
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
