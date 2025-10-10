"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect,useState } from "react";
const page = () => {
    const[loading,setLoading] = useState(true);
    const[send,setSend] = useState(false);
    const router = useRouter();
    useEffect(()=>{
        const timer1 = setTimeout(() => {
            setLoading(false);
            setSend(true);
        }, 3000);
        return ()=>clearTimeout(timer1)
    },[])
    useEffect(()=>{
        if(!send) return
        const timer1 = setTimeout(() => {
            router.push("/")
        }, 1000);
        return ()=>clearTimeout(timer1)
    },[send]);
  return (
    <div className="bg-[#222] w-screen h-screen text-[#d9d9d9] grid grid-rows-1" style={{
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  }}>
    <div className="flex flex-[1] flex-col items-center " >
    <div className="m-[8rem_auto] px-[1.5rem] max-w-[60rem] w-[100%]">
      <h1 className="!text-[2.5rem] font-[500]">unitedshop.in</h1>
    {loading ? 
     <>
      <h2 className="!text-[1.5rem] mb-[2rem] font-[500]">Verifying you are human. This may take a few seconds.</h2>
      <div className="h-[65px] w-[300px]">
          <svg aria-hidden="true" className={"w-12 h-12 text-transparent animate-spin  fill-[#d9d9d9]"} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
      </div>
      <h2 className="text-[1.5rem] my-[2rem] font-[400]">
        unitedshop.su needs to review the security of your connection before proceeding.
      </h2>
      </>
   :
      <div>
      <h2 className="!text-[1.4rem] flex justify-start items-center gap-2 mb-[2rem] ml-[-15px]">
        <img src="./tick.jpg" className="mt-[-7px]" width={"50px"} />
        Verification successful
      </h2>
      <h2 className="!text-[1.5rem] font-[500]">Waiting for unitedshop.su to respond...</h2>
      </div>
    } 
      
    </div>
    </div>
      <div className="footer m-[0_auto] px-[1.5rem] max-w-[60rem] w-[100%] !text-[.75rem]" role="contentinfo">
        <div className="footer-inner py-[1rem] border-t-[1px] border-[#d9d9d9] ">
          <div className="clearfix diagnostic-wrapper mb-[.5rem]">
            <div className="ray-id text-center">
              Ray ID: <code>98c64c9f2abd4056</code>
            </div>
          </div>
          <div className="text-center" id="footer-text">
            Performance &amp; security by{" "}
            <a
              rel="noopener noreferrer"
              href="https://www.cloudflare.com?utm_source=challenge&amp;utm_campaign=m"
              target="_blank"
            >
              Cloudflare
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
