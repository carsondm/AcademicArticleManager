package Parse;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.HttpClients;

import java.io.*;


public class GrobidParser {

    /*curl -v --form input=@./thefile.pdf localhost:8070/api/processHeaderDocument*/
    public String grobidParse(String pdfPath) {
        HttpClient httpclient = HttpClients.createDefault();
        HttpPost httppost = new HttpPost("http://localhost:8070/api/processHeaderDocument");

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
