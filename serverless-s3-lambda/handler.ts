import { S3Event } from "aws-lambda"
import { S3 } from "aws-sdk"
import { parse, format } from "fast-csv"



export const loadFile = async (event: S3Event) => {


  const bucket = event.Records[0].s3.bucket.name;
  const file = event.Records[0].s3.object.key;
  const s3 = new S3()
  const params = { Bucket: bucket, Key: file }

  
  const csvFile = s3.getObject(params).createReadStream()
  
  console.log(`File Name: ${file} bucket name ${bucket}`)


  let csvParsePromise = new Promise(() => {

   csvFile
    .pipe(parse({ headers: true, delimiter: ',' }))
    .on('data', (data) => {
      console.log('CPF: ', data['cpf'])
    })
    .on('end', (rowCount: number) => {
      console.log('CSV PROCESS FINISH. TOTAL ROWS: ', rowCount)
    })
    .on('error', (error)=>{
      console.log('CSV ERROR: ', error)
    })


    })

  try {
     await csvParsePromise 
  }
  catch(error) {
      console.log('ERROR PROCESS: ', error);
  } 

  

};
