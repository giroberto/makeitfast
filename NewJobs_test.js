require('./src/Arbeit.class');
const fs = require('fs');

function findExistingJobs(newjob, jobList){
        return jobList.filter(
            function(o){
                return o.jobId == newjob ? true : false;
        });
    return false;
}

Feature('NewJobs');

Scenario('NewJobs', async (I) => {
    let jobName, jobPublicationDate, jobEmployer, jobLocation, jobStartDate;
    I.amOnPage('/');
    I.click({xpath : '//span[contains(., \'IT systems analysis, user support, IT sales\')]'});
    I.retry(5, 2).click({xpath: "//label[contains(., 'Software development, programming')]"});
    I.click({xpath: '//div[@class=\'industriescontainer\']/form/button[@class=\'fullwidth\']'});
    I.waitForNavigation();
    let itens = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr']"});
    var existingJobs = JSON.parse(require('fs').readFileSync('./my_file.txt', 'utf8')).jobs;
    var newJobs = [];
    var newJobsQty = 0;
    const pageQty = 10;
    try {
        for (let page = 1; page <= pageQty; page++){
            console.log("Itens: "+ itens.length);
            for (let i=1 ; i <= itens.length; i++){
                let arbeit = new Object;
                arbeit["jobName"] = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
                jobUrl = await I.grabAttributeFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"}, "href");
                arbeit["jobPublicationDate"] = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td date']"});
                arbeit["jobEmployer"] = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td'][1]"});
                arbeit["jobLocation"] = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td'][2]"});
                arbeit["jobStartDate"] = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
                arbeit["jobId"] = JSON.parse('{"' + decodeURI(jobUrl).replace(/^.*\?/g, '').replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                arbeit["jobId"] = Number(arbeit["jobId"]["tx_vcjobs_detail[job]"]);
                console.log("JobId: " + arbeit["jobId"] + " JobName: " + arbeit["jobName"]);
                //Pular caso ja tenha sido baixado
                if (existingJobs.find(x => x.jobId == arbeit["jobId"])){
                    console.log("Job already parsed");
                }
                else{
                    I.click({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
                    I.waitForNavigation();
                    let job_details = '';
                    job_details = await I.grabTextFrom({xpath: "//div[@class='table vcjobs detail']/div[@class='tr']"});
                    for (let jd_i=1 ; jd_i <= job_details.length; jd_i++){
                        title = await I.grabTextFrom({xpath: "//div[@class='table vcjobs detail']/div[@class='tr'][" + jd_i + "]/div[@class='th']"});
                        value = await I.grabTextFrom({xpath: "//div[@class='table vcjobs detail']/div[@class='tr']["+ jd_i  + "]/div[@class='td']"});
                        arbeit[title.replace(/(\\n|\s)*$/, '').replace(/^(\\n|\s)*/, '')] = value.replace(/(\\n|\s)*$/, '').replace(/^(\\n|\s)*/, '');
                    }
                    let job_details_txt = '';
                    let faq = await I.grabTextFrom({xpath: "//div[@class='faq']"});
                    for (let faq_i=1 ; faq_i <= faq.length; faq_i++){
                        job_details_txt = await I.grabTextFromOrBlank({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr']"});
                        // if (){
                            jd_size = typeof job_details_txt === "object" ? job_details_txt.length : 1;
                        // }
                        for (let jd_i=1 ; jd_i <= jd_size; jd_i++){
                            title = await I.grabTextFrom({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr'][" + jd_i + "]/div[@class='th']"});
                            value = await I.grabTextFrom({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr'][" + jd_i + "]/div[@class='td']"});
                            arbeit[title.replace(/(\\n|\s)*$/, '').replace(/^(\\n|\s)*/, '')] = value.replace(/^(\\n|\s)*/, '').replace(/(\\n|\s)*$/, '');
                        }
                    }
                    I.goBack();
                    // I.waitForNavigation();
                    I.waitForElement({ xpath: "//div[@class='jobcontrols'][1]/div[@class='jobprevnext']/a"});
                    newJobs.push(arbeit);
                    newJobsQty++;
                    // if (newJobsQty > 2){
                    //     break;
                    // }
                }

            }
            I.click({xpath: "//div[@class='jobcontrols'][1]/div[@class='jobprevnext']/a[contains(., 'next')]"});
            I.waitForNavigation();
        }
    } catch (error) {
        console.log("Error on finding jobs");
    }
    let output = new Object;
    newJobs.push(...existingJobs);
    output.jobs = newJobs;
    let file = fs.createWriteStream("my_file.txt");
    file.write(JSON.stringify(output, null, 2));
    file.end();
    console.log("You have " + newJobsQty + "new jobs!");
});