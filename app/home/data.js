"use client"
import React from 'react'
import "./css/data.css"
import Graph from "./graph"
import Chart from "./charts"
 // Adjust the path as needed
function data() {
  return (
    <div className={ 'main-div nohide'}>
      <div className='upcontainer grid grid-cols-3 gap-3'>
        <div className="div1 flex flex-col justify-center items-center"><h3 className='text-lg text'>Your rank on our service</h3><h1 className='my-2 mb-10 text-3xl font-extrabold uppercase'>Bronze user</h1></div>
        <div className="div2 flex flex-col justify-center items-center"><h3 className='text-lg text'>The number of services you have used</h3><h1 className='my-2 mb-10 text-3xl font-extrabold uppercase'>0 times</h1></div>
        <div className="div3 flex flex-col justify-center items-center"><h3 className='text-lg text'>The number of services you have used</h3><h1 className='my-2 mb-10 text-3xl font-extrabold uppercase'>0 times</h1></div>
        </div>   <div className='downcontainer grid gap-3'>
            <div className='div4 flex flex-col items-center'><h1 className='mt-5'>Monthly Usage</h1><Graph/></div>
            <div className='div5'><Chart/></div>
      
     
    </div>
    </div>
  ) 
}

export default data
