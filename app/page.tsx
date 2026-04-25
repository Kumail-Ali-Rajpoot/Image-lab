import SignInBox from "@/components/ui/self/SignInBox";
import ImageContainer from "@/components/ui/self/ImageContainer";

const imagePositions = [
  {
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
    left: "10%",
    top: "15%",
    rotate: "12deg",
    size: "8rem",
  },
  {
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
    right: "15%",
    top: "20%",
    rotate: "-6deg",
    size: "10rem",
  },
  {
    url: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=300&auto=format&fit=crop",
    left: "20%",
    bottom: "15%",
    rotate: "15deg",
    size: "12rem",
  },
  {
    url: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=300&auto=format&fit=crop",
    right: "20%",
    bottom: "20%",
    rotate: "-12deg",
    size: "9rem",
  },
  {
    url: "https://th.bing.com/th/id/R.96c1a6566397efcf7de758fd2a6f116a?rik=LwK4OM1JQPW06A&pid=ImgRaw&r=0",
    left: "45%",
    top: "8%",
    rotate: "5deg",
    size: "7rem",
  }
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
