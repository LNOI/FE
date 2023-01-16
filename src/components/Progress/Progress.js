import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import './progress.css'

export default function Progress({value_progress}) {
  return (
    <>
      <Box  className='progress_item'>
        <div className='progress_item_pro'>
            <LinearProgress variant={value_progress===100 ? "determinate":"indeterminate"} value={100} />
        </div>
        {
          value_progress===100 ? ( <div className='progress_item_percent' >
          <p>100%</p>
        </div>) : null
        }
      </Box>
    </>
     

  );
}