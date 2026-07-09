import SignInBox from "@/components/ui/self/SignInBox";
import ImageContainer from "@/components/ui/self/ImageContainer";

const imagePositions = [
  {
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
    left: "left-[5%] sm:left-[8%] md:left-[10%] lg:left-[12%]",
    top: "top-[10%] sm:top-[12%] md:top-[15%] lg:top-[18%]",
    rotate: "12deg",
    size: "8rem",
  },
  {
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
    right: "right-[5%] sm:right-[10%] md:right-[15%] lg:right-[18%]",
    top: "top-[12%] sm:top-[16%] md:top-[20%] lg:top-[22%]",
    rotate: "-6deg",
    size: "10rem",
  },
  {
    url: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=300&auto=format&fit=crop",
    left: "left-[8%] sm:left-[12%] md:left-[20%] lg:left-[25%]",
    bottom: "bottom-[8%] sm:bottom-[12%] md:bottom-[15%] lg:bottom-[18%]",
    rotate: "15deg",
    size: "12rem",
  },
  {
    url: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=300&auto=format&fit=crop",
    right: "right-[8%] sm:right-[12%] md:right-[20%] lg:right-[24%]",
    bottom: "bottom-[10%] sm:bottom-[14%] md:bottom-[20%] lg:bottom-[22%]",
    rotate: "-12deg",
    size: "9rem",
  },
  {
    url: "https://th.bing.com/th/id/R.96c1a6566397efcf7de758fd2a6f116a?rik=LwK4OM1JQPW06A&pid=ImgRaw&r=0",
    left: "left-[35%] sm:left-[40%] md:left-[45%] lg:left-[48%]",
    top: "top-[5%] sm:top-[6%] md:top-[8%] lg:top-[10%]",
    rotate: "5deg",
    size: "7rem",
  },
];

export default function Home() {
  return (
   <div className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-gray-50 dark:bg-zinc-950">
      <div className="z-10">
        <SignInBox />
      </div>
      {imagePositions.map((img, index) => (
        <ImageContainer 
          key={index}
          idx={index}
          imgUrl={img.url}
          left={img.left}
          right={img.right}
          top={img.top}
          bottom={img.bottom}
          rotate={img.rotate}
          size={img.size}
        />
      ))}
   </div>
  );
}
