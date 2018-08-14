require('./src/Arbeit.class');
const fs = require('fs');

Feature('ListJobs');

Scenario('List Jobs', async (I) => {
    let jobName, jobPublicationDate, jobEmployer, jobLocation, jobStartDate;
    I.amOnPage('/');
    I.click({xpath : '//div[contains(text(), \'IT, data processing, computing\')]'});
    I.retry(5, 2).click({xpath: "//label[@for='job-6-2']"});
    I.click('List jobs');
    I.waitForNavigation();
    let itens = await I.grabTextFrom({xpath: "//table/tbody/tr"});
    let file = fs.createWriteStream("my_file.txt");
    file.write('{ "jobs": [');
    const qtdPaginas = 1;
    for (let page = 1; page <= qtdPaginas; page++){
        // for (let i=1 ; i <= itens.length; i++){
        for (let i=1 ; i <= 2; i++){
            jobName =  await I.grabTextFrom({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr["+ i + "]/td[1]/a/div/div"});
            jobPublicationDate = await I.grabTextFrom({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr[" + i + "]/td[2]"});
            jobEmployer = await I.grabTextFrom({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr[" + i + "]/td[3]/a"});
            jobLocation = await I.grabTextFrom({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr[" + i + "]/td[4]"});
            jobStartDate = await I.grabTextFrom({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr[" + i + "]/td[5]"});
            console.log(jobName);
            file.write('{');
            file.write('"jobName" : "' + jobName.trim() + '",');
            file.write('"jobPublicationDate" : "' + jobPublicationDate.trim() + '",');
            file.write('"jobEmployer" : "' + jobEmployer.trim() + '",');
            file.write('"jobLocation" : "' + jobLocation.replace(/\r?\n|\r|\t/g,"").trim() + '",');
            file.write('"jobStartDate" : "' + jobStartDate.trim() + '"');
            I.click({xpath: "//div[contains(@class,'col-md-9')]/div/div/div/div/div/div/table/tbody/tr["+ i + "]/td[1]/a/div/div"});
            I.waitForNavigation();
            let arbeit = {};
            arbeit.referenznummer = await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"});
            arbeit.jobtitel =  await I.grabTextFrom({xpath: "//th[text() = 'Jobtitel']/following-sibling::td"}); 
            arbeit.arbeitgeber =  await I.grabTextFrom({xpath: "//th[text() = 'Arbeitgeber']/following-sibling::td"}); 
            arbeit.unternehmensgrosse =  await I.grabTextFrom({xpath: "//th[text() = 'Unternehmensgröße']/following-sibling::td"}); 
            arbeit.stellenbeschreibung =  await I.grabTextFrom({xpath: "//th[text() = 'Stellenbeschreibung']/following-sibling::td"}); 
            arbeit.artDesJobangebots =  await I.grabTextFrom({xpath: "//th[text() = 'Art des Jobangebots']/following-sibling::td"}); 
            arbeit.fuhrungsverantwortung =  await I.grabTextFrom({xpath: "//th[text() = 'Führungsverantwortung']/following-sibling::td"}); 
            arbeit.arbeitsorte =  await I.grabTextFrom({xpath: "//th[text() = 'Arbeitsorte']/following-sibling::td"}); 
            // arbeit.beginnDerTatigkeit =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.anzahlOffenerStellen =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.arbeitszeit =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.tarifvertrag =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.weitereAngabenZumTarifvertrag =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.befristungUnbefristet =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.erlernterBeruf =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.ruckfragenUndBewerbungenAn =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.ansprechpartner =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.email =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.telefon =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.mobil =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.gewunschteBewerbungsarten =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            // arbeit.angabenZurBewerbung =  await I.grabTextFrom({xpath: "//th[text() = 'Referenznummer']/following-sibling::td"}); 
            I.goBack();
            I.waitForElement({ xpath: "//div[contains(@class , 'jobmarket-list-pager')]"});
            file.write('"arbeit" : ' + JSON.stringify(arbeit));
            if (i == itens.length && page == qtdPaginas){
                file.write('}');
            }
            else{
                file.write('},');
            }
        }
        I.click({xpath: "//div[contains(@class, 'jobmarket-list-pager') and contains(@class ,'jobmarket-list-pager-bottom')]/ul/li[4]/a/i"});
        I.waitForNavigation();
    }
    file.write(']}');
    file.end();
    // pause();
});