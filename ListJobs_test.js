require('./src/Arbeit.class');
const fs = require('fs');

Feature('ListJobs');

Scenario('List Jobs', async (I) => {
    let jobName, jobPublicationDate, jobEmployer, jobLocation, jobStartDate;
    I.amOnPage('/');
    I.click({xpath : '//span[contains(., \'IT systems analysis, user support, IT sales\')]'});
    I.retry(5, 2).click({xpath: "//label[contains(., 'Software development, programming')]"});
    I.click({xpath: '//div[@class=\'industriescontainer\']/form/button[@class=\'fullwidth\']'});
    I.waitForNavigation();
    let itens = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr']"});
    let file = fs.createWriteStream("my_file.txt");
    file.write('{ "jobs": [');
    const qtdPaginas = 10;
    for (let page = 1; page <= qtdPaginas; page++){
        console.log("Itens: "+ itens.length);
        for (let i=1 ; i <= itens.length; i++){
            jobName =  await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
            jobPublicationDate = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td date']"});
            jobEmployer = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td'][1]"});
            jobLocation = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td'][2]"});
            // jobStartDate = await I.grabTextFrom({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
            console.log(jobName);
            file.write('{');
            file.write('"jobName" : "' + jobName.trim() + '",');
            file.write('"jobPublicationDate" : "' + jobPublicationDate.trim() + '",');
            file.write('"jobEmployer" : "' + jobEmployer.trim() + '",');
            file.write('"jobLocation" : "' + jobLocation.replace(/\r?\n|\r|\t/g,"").trim() + '",');
            // file.write('"jobStartDate" : "' + jobStartDate.trim() + '",');
            I.click({xpath: "//div[@class='table vcjobs list']/div[@class='tr'][" + i + "]/div[@class='td jobtitle']/a"});
            I.waitForNavigation();
            let arbeit = {};
            let job_details = await I.grabTextFromOrBlank({xpath: "//div[@class='table vcjobs detail']/div[@class='tr']"});
            for (let jd_i=1 ; jd_i <= job_details.length; jd_i++){
                title = await I.grabTextFrom({xpath: "//div[@class='table vcjobs detail']/div[@class='tr'][" + jd_i + "]/div[@class='th']"});
                value = await I.grabTextFrom({xpath: "//div[@class='table vcjobs detail']/div[@class='tr']["+ jd_i  + "]/div[@class='td']"});
                arbeit[title.replace(/\s/g, '')] = value;
            }
            let job_details_txt = '';
            let faq = await I.grabTextFromOrBlank({xpath: "//div[@class='faq']"});
            for (let faq_i=1 ; faq_i <= faq.length; faq_i++){
                job_details_txt = await I.grabTextFrom({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr']"});
                I.say('Type' + typeof job_details_txt);
                if (typeof job_details_txt === "object"){
                    jd_size = job_details_txt.length;
                }
                if (typeof job_details_txt === "string"){
                    jd_size = 1;
                }
                for (let jd_i=1 ; jd_i <= jd_size; jd_i++){
                    title = await I.grabTextFrom({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr'][" + jd_i + "]/div[@class='th']"});
                    value = await I.grabTextFrom({xpath: "//div[@class='faq'][" + faq_i + "]/div[@class='table vcjobs detail _txt']/div[@class='tr'][" + jd_i + "]/div[@class='td']"});
                    arbeit[title.replace(/\s/g, '')] = value;
                }
            }
            // arbeit.referenznummer = await I.grabTextFromOrBlank({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"});
            // arbeit.jobtitel =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Jobtitel']/following-sibling::td"}); 
            // arbeit.arbeitgeber =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Arbeitgeber']/following-sibling::td"}); 
            // arbeit.unternehmensgrosse =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Unternehmensgröße']/following-sibling::td"}); 
            // arbeit.stellenbeschreibung =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Stellenbeschreibung']/following-sibling::td"}); 
            // arbeit.artDesJobangebots =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Art des Jobangebots']/following-sibling::td"}); 
            // arbeit.fuhrungsverantwortung =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Führungsverantwortung']/following-sibling::td"}); 
            // arbeit.arbeitsorte =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Arbeitsorte']/following-sibling::td"}); 
            // arbeit.beginnDerTatigkeit =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Beginn der Tätigkeit']/following-sibling::td"}); 
            // arbeit.anzahlOffenerStellen =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Anzahl offener Stellen']/following-sibling::td"}); 
            // arbeit.arbeitszeit =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Arbeitszeit']/following-sibling::td"});
            // arbeit.tarifvertrag =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Tarifvertrag']/following-sibling::td"});
            // arbeit.weitereAngabenZumTarifvertrag =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Weitere Angaben zum Tarifvertrag']/following-sibling::td"}); 
            // arbeit.mobil =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Mobil']/following-sibling::td"}); 
            // arbeit.befristungUnbefristet =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Befristung']/following-sibling::td"}); 
            // arbeit.erlernterBeruf =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Erlernter Beruf']/following-sibling::td"}); 
            // arbeit.ruckfragenUndBewerbungenAn =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Rückfragen und Bewerbungen an']/following-sibling::td"}); 
            // arbeit.ansprechpartner =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Ansprechpartner']/following-sibling::td"}); 
            // arbeit.email =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'E-Mail']/following-sibling::td"}); 
            // arbeit.telefon =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Telefon']/following-sibling::td"}); 
            // arbeit.gewunschteBewerbungsarten =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Gewünschte Bewerbungsarten']/following-sibling::td"}); 
            // arbeit.angabenZurBewerbung =  await I.grabTextFromOrBlank({xpath: "//th[text() = 'Angaben zur Bewerbung']/following-sibling::td"}); 
            I.goBack();
            I.waitForElement({ xpath: "//div[@class='jobcontrols'][1]/div[@class='jobprevnext']/a"});
            I.wait(1);
            file.write('"arbeit" : ' + JSON.stringify(arbeit));
            if (i == itens.length && page == qtdPaginas){
                file.write('}');
            }
            else{
                file.write('},');
            }
        }
        // I.click({xpath: "//div[contains(@class, 'jobmarket-list-pager') and contains(@class ,'jobmarket-list-pager-bottom')]/ul/li[4]/a/i"});
        I.click({xpath: "//div[@class='jobcontrols'][1]/div[@class='jobprevnext']/a[contains(., 'next')]"});
        I.waitForNavigation();
    }
    file.write(']}');
    file.end();
    // pause();
});