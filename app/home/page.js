import React from 'react'

import HorizontalNav from './horizontal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome , faTelegram} from '@fortawesome/free-brands-svg-icons'
library.add(fas,faTwitter, faFontAwesome)
import Data from './data';
import "./page.css"
const home = () => {
  return (

 <div className="app">
      <div className="main-content">
        <HorizontalNav/>
        <div className='flex sep'>
        <Data/>
        </div>

        {/* Your main content goes here */}
      </div>
      </div>
  )
}

export default home
