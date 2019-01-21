var puppeteer = require('puppeteer');
var baseUrl = 'https://car.autohome.com.cn';
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
(async () => {
    try {
        const browser = await puppeteer.launch({
            headless:true,
            defaultViewport:{
                width:1300,
                height:800
            }
        });
        const page = await browser.newPage();
        page.setUserAgent(userAgent);
        await page.goto(baseUrl);
        await page.waitForSelector(".cartree-letter");
        const Group = await page.$("#cartree");

        let groupBrandData = await Group.$$eval('.cartree-letter',titles => {
            let charGroup = [];
            titles.forEach(function(title){
                let brandList = title.nextElementSibling.children;
                let unitGroup = {
                    title:title.innerText,
                    brandArr:[]
                } 

                for (const brand of brandList) {
                   
                    let brandName = brand.innerText.split('(')[0];

                    let brandHref = brand.firstElementChild.lastElementChild.href;


                    unitGroup.brandArr.push(brandName);
                }
                
                charGroup.push(unitGroup);
            })
            return charGroup;
        });
        console.log(groupBrandData);


        const brandBtn  = await Group.$$("li");
        let topGroup = [];
        for(let i=0;i<brandBtn.length;i++){ 
            await page.goto(baseUrl);
            await page.waitForSelector(".cartree-letter");
            const Group = await page.$("#cartree");
            const brandBtn  = await Group.$$("li");
            const btn =await brandBtn[i];
            const ahref = await btn.$('a');
           
            ahref.click();

            await page.waitForSelector('#cartree dl');
            const cGroup = await page.$("#cartree");
            const dchildren = await cGroup.$$("dl > *");
           
            let subBrandGroup = [];
            let subBrand = {};
            let subBrandName ='';
            let seriesName ='';
            
            for (const d of dchildren) {
                var del = await page.evaluate(function(dc){
                     let dtype  =  dc.nodeName.toLowerCase();
                     let dval = dc.innerText;
                     return {
                         dtype:dtype,
                         dval:dval
                     }
                },d);
                debugger
                if(del.dtype === "dt"){
                    subBrandName = del.dval;
                    subBrand = {
                        subBrandName:subBrandName,
                        carSeries:[]
                    }
                    subBrandGroup.push(subBrand);
                }else{
                    seriesName = del.dval;
                    subBrand.carSeries.push(seriesName);
                }

            }
            topGroup.push(subBrandGroup);
        }
        console.log(topGroup);
        await browser.close();
    } catch (error) {
        console.log(error);
    }
   
  })();