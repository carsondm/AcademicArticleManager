/*
*
* Needs Grobid to be running in a server hosted online or in the same machine
* Grobid parses important information in the pdf
* Returns result as an xml string
*
* Programmer: Mark Kenneth Alano
* Date: 11/17/2017
*
* */

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.HttpClients;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

public class GrobidParser {
    /*curl -v --form input=@./thefile.pdf localhost:8070/api/processHeaderDocument
    * "http://localhost:8070/api/processHeaderDocument"
    * http://fupa.tech/api/processHeaderDocument
    * Test http://cloud.science-miner.com/grobid/processHeaderDocument
    * http://cloud.science-miner.com/grobid/processHeaderDocument
    * */
    // Documentation http://cloud.science-miner.com/grobid/
    public String grobidParse(String pdfPath) {
        //Generate an http POST request
        HttpClient httpclient = HttpClients.createDefault();
        HttpPost httppost = new HttpPost("http://cloud.science-miner.com/grobid/processHeaderDocument");

        MultipartEntityBuilder entityBuilder = MultipartEntityBuilder.create();
        entityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);

        FileBody fileBody = new FileBody(new File(pdfPath));
        entityBuilder.addPart("input", fileBody);;
        HttpEntity entity = entityBuilder.build();
        httppost.setEntity(entity);
        try {
            HttpResponse response = httpclient.execute(httppost);
            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent(),"UTF-8"));
            String sResponse;
            StringBuilder s = new StringBuilder();

            while ((sResponse = reader.readLine()) != null) {
                s = s.append(sResponse);
            }

            return new XmlFormatter().format(s.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

}
