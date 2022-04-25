const http=require('http');
const fs=require('fs');
const requests=require('requests');
const indexfile=fs.readFileSync('index.html','utf-8');
const replace=(indexfile,orival)=>{
   let convert=Number(orival.main.temp)-273.15;
   convert=convert.toFixed(2);
   let convert1=Number(orival.main.temp_min)-273.15;
   convert1=convert1.toFixed(2);
   let convert2=Number(orival.main.temp_max)-273.15;
   convert2=convert2.toFixed(2);
   let temperature=indexfile.replace('{%temp%}',convert);
   temperature=temperature.replace('{%tempmin%}',convert1);
   temperature=temperature.replace('{%tempmax%}',convert2);
   temperature=temperature.replace('{%location%}',orival.name);
   temperature=temperature.replace('{%country%}',orival.sys.country);
  //  temperature=temperature.replace('{%getstatus%}',orival.weather[0].main);
   return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url==='/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=08e28f291d16d88c21671cdb93444d33")
       .on('data', (chunk)=>{
         const objdata=JSON.parse(chunk);
         const arrdata=[objdata];
         const getData=arrdata.map((val)=>replace(indexfile,val)).join(" ");
         res.write(getData);
        // console.log(getData);
     })
.on('end', (err)=>{
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
    }
    else{
      res.end('File not found');
    }
})
server.listen(8000,'127.0.0.1');