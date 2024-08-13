import React, { useState } from 'react';
import AWS from 'aws-sdk';

function InputDownload () {
  const [template, setTemplate] = useState('BeatsHealthLambdasCSV');

  AWS.config.update({
    accessKeyId: 'AKIAXSDOIPFODFFLWIMP',
    secretAccessKey : 'ohtosN4mcCmSneMH0LegyP2UB3XRF2GZH4fQ4dsQ+pVuT'
  });

const handleClick = (e) => {
    e.preventDefault();
  };

  const handleDownload = () => {
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'beats-bulk-payer-mapping-dev',
      Key: 'BeatsHealthLambdasCSV',
    };


    function downloadBlob(blob, name = 'BeatsHealthLambdasCSV.csv') {
      // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
      const blobUrl = URL.createObjectURL(blob);
      // Create a link element
      const link = document.createElement('a');
      // Set link's href to point to the Blob URL
      link.href = blobUrl;
      link.download = name;
      // Append link to the body
      document.body.appendChild(link);
      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      // Remove link from body
      document.body.removeChild(link);
    }

    //s3.getObject(params, (err, data) => {

    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        let csvBlob = new Blob([data.fields.toString()], {
          type: 'text/csv;charset=utf-8;',
        });
        downloadBlob(csvBlob, `${template}`);
      }
    });

}

  return (
    <>
      <form className='bg-white my-4' onSubmit={handleClick}>
        <input
          type='submit'
          value='Download'
          className='btn btn-primary btn-block mt-3'
          onClick={handleDownload}
        />
      
      </form>
    </>
  );
};

export default InputDownload;